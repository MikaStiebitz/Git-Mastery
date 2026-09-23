/**
 * Password hashing and session tokens, using only the Web Crypto API.
 *
 * No npm dependency: bcrypt and argon2 need native bindings a V8 isolate cannot load, and
 * `node:crypto.argon2` is on the list of things Workers does not implement. That leaves PBKDF2,
 * which the platform accelerates natively.
 */

/**
 * PBKDF2 iterations.
 *
 * Two hard facts shape this number, and they pull in opposite directions.
 *
 * The ceiling: workerd caps PBKDF2 at 100,000 iterations (`DEFAULT_MAX_PBKDF2_ITERATIONS` in
 * `src/workerd/io/limit-enforcer.h`) and throws `DOMNotSupportedError` above it. The cap is
 * undocumented, and — this is the trap — `wrangler dev`, Miniflare and vitest do NOT enforce it;
 * the open-source enforcer returns "no limit". An OWASP-recommended 600,000 therefore passes
 * every local test and fails on the first real registration. `node:crypto.pbkdf2` calls the same
 * check, so it is not a way around it.
 *
 * The floor: the Workers Free plan allows 10ms of CPU per request. 100,000 iterations measures
 * 9-10ms on fast local hardware and Cloudflare's edge cores are slower, so running at the cap
 * would sit permanently on the limit and be terminated exactly when logins come in bursts.
 *
 * 50,000 measures ~5ms, which fits with room to spare. The security that a lower iteration count
 * gives up is bought back — and then some — by the pepper below: it is what makes a stolen
 * database uncrackable regardless of the iteration count, because the attacker also needs a
 * secret that only Cloudflare holds.
 */
export const PBKDF2_ITERATIONS = 50_000;

/** The ceiling this must never cross, asserted in a test so nobody "improves" it into an outage. */
export const PBKDF2_MAX_ITERATIONS = 100_000;

const SALT_BYTES = 16;
const HASH_BYTES = 32;
const SESSION_TOKEN_BYTES = 32;

export const PASSWORD_MIN_LENGTH = 8;
/**
 * Passwords are bounded before any hashing happens. PBKDF2's cost is independent of input
 * length, but the HMAC pepper step is not, so an 8MB "password" would be free CPU for an
 * attacker.
 */
export const PASSWORD_MAX_LENGTH = 256;

const encoder = new TextEncoder();

/** base64url without padding. `$` is the PHC field separator, so it must not appear here. */
function toBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array | null {
    try {
        const binary = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        return bytes;
    } catch {
        return null;
    }
}

/**
 * HMAC the password with a server-held secret before stretching it.
 *
 * This is the highest-value line in the file. The realistic threat to a hobby backend is not a
 * GPU farm attacking one password — it is the whole `users` table leaking. Without a pepper, a
 * leaked table is an offline cracking problem bounded only by the iteration count. With one, it
 * is not crackable at all: the attacker needs `PASSWORD_PEPPER`, which lives only in Cloudflare's
 * secret store and exists nowhere in this repository.
 *
 * Losing this secret makes every existing password unverifiable. It is not recoverable and it is
 * not derivable. Keep a copy somewhere safe.
 */
async function pepper(password: string, secret: string): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
        "sign",
    ]);
    // NFKC so the same typed password matches regardless of how the OS composed its accents.
    const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(password.normalize("NFKC")));
    return new Uint8Array(signature);
}

async function derive(peppered: Uint8Array, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey("raw", peppered as BufferSource, "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
        { name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations },
        key,
        HASH_BYTES * 8,
    );
    return new Uint8Array(bits);
}

/**
 * Hash a password into a PHC-style string: `$pbkdf2-sha256$i=50000$<salt>$<hash>`.
 *
 * The algorithm and its parameters travel with the hash, so raising the iteration count later —
 * or moving to scrypt on a paid plan — upgrades each account transparently on its next
 * successful login, with no database migration and nobody locked out.
 */
export async function hashPassword(password: string, secret: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
    const hash = await derive(await pepper(password, secret), salt, PBKDF2_ITERATIONS);
    return `$pbkdf2-sha256$i=${PBKDF2_ITERATIONS}$${toBase64Url(salt)}$${toBase64Url(hash)}`;
}

export interface VerifyResult {
    valid: boolean;
    /** True when the stored hash used weaker parameters than the current ones. */
    needsRehash: boolean;
}

/**
 * Verify a password against a stored PHC string.
 *
 * Never throws: a malformed or truncated stored hash returns `valid: false` rather than a 500,
 * and `crypto.subtle.timingSafeEqual` is only reached with two buffers of identical length,
 * because it throws a `TypeError` on a length mismatch instead of returning false.
 */
export async function verifyPassword(password: string, stored: string, secret: string): Promise<VerifyResult> {
    const invalid: VerifyResult = { valid: false, needsRehash: false };
    if (password.length > PASSWORD_MAX_LENGTH) return invalid;

    // ["", "pbkdf2-sha256", "i=50000", salt, hash]
    const parts = stored.split("$");
    if (parts.length !== 5 || parts[1] !== "pbkdf2-sha256") return invalid;

    const iterations = Number.parseInt((parts[2] ?? "").replace(/^i=/, ""), 10);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > PBKDF2_MAX_ITERATIONS) return invalid;

    const salt = fromBase64Url(parts[3] ?? "");
    const expected = fromBase64Url(parts[4] ?? "");
    if (!salt || !expected || salt.length !== SALT_BYTES || expected.length !== HASH_BYTES) return invalid;

    const actual = await derive(await pepper(password, secret), salt, iterations);

    let valid: boolean;
    try {
        valid = crypto.subtle.timingSafeEqual(actual as BufferSource, expected as BufferSource);
    } catch {
        return invalid;
    }

    return { valid, needsRehash: valid && iterations < PBKDF2_ITERATIONS };
}

/**
 * A stored hash for a password nobody has.
 *
 * Verified against when a username does not exist, so a login spends the same CPU either way.
 * Without it, response latency answers "does this account exist?" for anyone with a stopwatch:
 * a missing user would answer in about a millisecond and a real one in five.
 */
export const DUMMY_HASH = `$pbkdf2-sha256$i=${PBKDF2_ITERATIONS}$${toBase64Url(
    new Uint8Array(SALT_BYTES),
)}$${toBase64Url(new Uint8Array(HASH_BYTES))}`;

/**
 * A fresh session token and the digest to store for it.
 *
 * The raw token goes to the client exactly once and is never persisted; the database holds only
 * its SHA-256, so a leaked dump cannot be used to sign in. One SHA-256 is the right amount of
 * work — the token is already 256 bits of CSPRNG output, and stretching it would add milliseconds
 * of CPU to every authenticated request for no gain.
 */
export async function createSessionToken(): Promise<{ token: string; tokenHash: string }> {
    const token = toBase64Url(crypto.getRandomValues(new Uint8Array(SESSION_TOKEN_BYTES)));
    return { token, tokenHash: await hashSessionToken(token) };
}

export async function hashSessionToken(token: string): Promise<string> {
    const digest = await crypto.subtle.digest("SHA-256", encoder.encode(token));
    return toBase64Url(new Uint8Array(digest));
}
