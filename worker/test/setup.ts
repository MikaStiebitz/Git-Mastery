/**
 * `crypto.subtle.timingSafeEqual` is a Cloudflare extension, not part of Web Crypto, so it does
 * not exist under Node. This stands in for it so the hashing code can be tested at all.
 *
 * It is not timing-safe, which is fine and irrelevant here: these tests assert that the right
 * answer comes back, and nothing about the comparison's duration. The real implementation's
 * behaviour that *does* matter to the code — that it throws on a length mismatch instead of
 * returning false — is reproduced faithfully, because that is the part the production code guards
 * against.
 */
// `globalThis.crypto` is not declared by @cloudflare/workers-types (in a Worker, `crypto` is a
// bare global that shadows this name), but it exists under Node, which is where these tests run.
const nodeCrypto = (globalThis as unknown as { crypto: Crypto }).crypto;

const subtle = nodeCrypto.subtle as SubtleCrypto & {
    timingSafeEqual?: (a: ArrayBufferView, b: ArrayBufferView) => boolean;
};

subtle.timingSafeEqual ??= (a: ArrayBufferView, b: ArrayBufferView): boolean => {
    if (a.byteLength !== b.byteLength) {
        throw new TypeError("Input buffers must have the same byte length.");
    }
    const left = new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
    const right = new Uint8Array(b.buffer, b.byteOffset, b.byteLength);
    return left.every((byte, index) => byte === right[index]);
};
