"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Copy, Download, Linkedin, Lock, Printer, Share2 } from "lucide-react";
import { useGameContext } from "~/contexts/GameContext";
import {
    canvasToBlob,
    getCertificateFilename,
    getCertificateId,
    getCertificates,
    getLinkedInAddToProfileUrl,
    getLinkedInShareUrl,
    getShareCaption,
    renderCertificate,
    type Certificate,
} from "~/lib/certificate";
import type { DifficultyLevel } from "~/types";

export const NAME_KEY = "gitmastery-certificate-name";
export const ISSUED_KEY = "gitmastery-certificate-issued";
export const LOCKED_NAME_KEY = "gitmastery-certificate-locked-name";

export function readStored(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

export function writeStored(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Private mode / blocked storage: the certificate still works, it just is not remembered.
    }
}

/**
 * Session-level fallback so the lock still holds when localStorage is blocked or unavailable.
 *
 * Note: the name lock is a client-side UI guard only. Anyone can clear site data or edit localStorage to
 * change it, so it is not a security boundary; enforcing it for real would need a server-side or signed
 * issuance record tied to an account.
 */
let sessionLockedName: string | null = null;

/** Test helper: forget the in-memory lock. */
export function resetSessionLockedName() {
    sessionLockedName = null;
}

export function getLockedName(): string | null {
    const locked = readStored(LOCKED_NAME_KEY);
    if (locked && locked.trim().length > 0) return locked.trim();
    if (sessionLockedName) return sessionLockedName;

    try {
        const stored = JSON.parse(readStored(ISSUED_KEY) ?? "{}") as Record<string, string>;
        if (Object.keys(stored).length > 0) {
            const existingName = readStored(NAME_KEY)?.trim();
            if (existingName) {
                sessionLockedName = existingName;
                writeStored(LOCKED_NAME_KEY, existingName);
                return existingName;
            }
        }
    } catch {
        // Corrupted JSON
    }
    return null;
}

/**
 * Locks the certificate name on first issuance and returns the name that is actually locked.
 * Callers must use the returned value (not a name captured earlier) for the certificate ID and render,
 * so a stale snapshot or a lock set by another tab can never produce a differently-named certificate.
 */
export function lockCertificateName(nameToLock: string): string {
    const clean = nameToLock.trim();
    const existing = getLockedName();
    if (existing) return existing;
    if (!clean) return "";
    sessionLockedName = clean;
    writeStored(LOCKED_NAME_KEY, clean);
    // Re-read so that if another tab wrote between our check and write, we adopt whichever value persisted.
    const persisted = readStored(LOCKED_NAME_KEY)?.trim();
    const effective = persisted && persisted.length > 0 ? persisted : clean;
    sessionLockedName = effective;
    writeStored(NAME_KEY, effective);
    return effective;
}

/** Prints the certificate image on A4 landscape via a hidden iframe, so no popup blocker gets involved. */
function printCertificateBlob(blob: Blob, title: string) {
    const url = URL.createObjectURL(blob);
    const frame = document.createElement("iframe");
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:fixed;right:0;bottom:0;width:0;height:0;border:0;";
    const cleanup = () => {
        URL.revokeObjectURL(url);
        frame.remove();
    };
    frame.onload = () => {
        const win = frame.contentWindow;
        const img = win?.document.querySelector("img");
        const run = () => {
            if (!win) return cleanup();
            win.addEventListener("afterprint", cleanup);
            win.focus();
            win.print();
            // Fallback in case afterprint never fires.
            setTimeout(cleanup, 120_000);
        };
        if (img && !img.complete) img.onload = run;
        else run();
    };
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><title>${title.replace(/[<&]/g, "")}</title>
<style>@page{size:A4 landscape;margin:0}html,body{margin:0;height:100%}img{display:block;width:100%;height:100%;object-fit:contain}</style>
</head><body><img src="${url}" alt=""></body></html>`;
    document.body.appendChild(frame);
}

/** The date a course certificate was first issued, remembered so re-downloading never changes it. */
function getIssuedAt(difficultyId: DifficultyLevel): Date {
    let stored: Record<string, string> = {};
    try {
        stored = JSON.parse(readStored(ISSUED_KEY) ?? "{}") as Record<string, string>;
    } catch {
        stored = {};
    }
    const existing = stored[difficultyId] ? new Date(stored[difficultyId]) : null;
    if (existing && !Number.isNaN(existing.getTime())) return existing;

    const now = new Date();
    stored[difficultyId] = now.toISOString();
    writeStored(ISSUED_KEY, JSON.stringify(stored));
    return now;
}

function CertificateCard({
    certificate,
    name,
    onIssued,
}: {
    certificate: Certificate;
    name: string;
    onIssued?: () => void;
}) {
    const [notice, setNotice] = useState<string | null>(null);
    const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function";
    const finalName = (getLockedName() ?? name).trim();
    const ready = certificate.earned && finalName.length > 0;

    const build = async () => {
        if (!ready) return null;
        const issuedName = lockCertificateName(finalName);
        if (!issuedName) return null;
        onIssued?.();
        const issuedAt = getIssuedAt(certificate.difficultyId);
        const certId = getCertificateId(issuedName, certificate.difficultyId, issuedAt);
        const blob = await canvasToBlob(await renderCertificate({ name: issuedName, certificate, certId, issuedAt }));
        return { blob, certId, issuedAt, issuedName };
    };

    const download = async () => {
        if (!ready) return;
        const result = await build();
        if (!result) return;
        const { blob, issuedName } = result;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = getCertificateFilename(issuedName, certificate);
        link.click();
        URL.revokeObjectURL(url);
    };

    const print = async () => {
        if (!ready) return;
        const result = await build();
        if (!result) return;
        printCertificateBlob(result.blob, `${certificate.title} – ${result.issuedName}`);
    };

    const share = async () => {
        if (!ready) return;
        const result = await build();
        if (!result) return;
        const { blob, issuedName } = result;
        const file = new File([blob], getCertificateFilename(issuedName, certificate), { type: "image/png" });
        if (navigator.canShare?.({ files: [file] })) {
            try {
                await navigator.share({ files: [file], text: getShareCaption(certificate) });
            } catch {
                // Sheet dismissed by the player.
            }
        } else {
            await download();
        }
    };

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(getShareCaption(certificate));
            setNotice("Caption copied — paste it into your post.");
        } catch {
            setNotice("Could not copy. Select the text manually from the LinkedIn dialog.");
        }
    };

    const openLinkedIn = (kind: "profile" | "share") => {
        if (!ready) return;
        const issuedName = lockCertificateName(finalName);
        if (!issuedName) return;
        onIssued?.();
        const issuedAt = getIssuedAt(certificate.difficultyId);
        const certId = getCertificateId(issuedName, certificate.difficultyId, issuedAt);
        const url =
            kind === "profile" ? getLinkedInAddToProfileUrl(certificate, certId, issuedAt) : getLinkedInShareUrl();
        if (kind === "share") void copyCaption();
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <li
            className={`flex flex-col gap-4 rounded-[1.2rem] border-2 p-6 ${
                certificate.earned ? "border-gm-lime-edge bg-gm-night" : "border-gm-line bg-gm-void opacity-80"
            }`}>
            <div className="flex items-center gap-3">
                {certificate.earned ? (
                    <Award className="text-gm-gold h-8 w-8 shrink-0" aria-hidden="true" />
                ) : (
                    <Lock className="text-gm-ink-dim h-8 w-8 shrink-0" aria-hidden="true" />
                )}
                <div>
                    <h3 className="font-display text-gm-ink text-lg leading-tight">{certificate.title}</h3>
                    <p className="text-gm-ink-dim text-sm">
                        {certificate.level} · {certificate.levelsDone}/{certificate.levelsTotal} levels
                    </p>
                </div>
            </div>

            {certificate.earned ? (
                <div className="flex flex-col gap-2">
                    <button
                        type="button"
                        disabled={!ready}
                        onClick={() => void download()}
                        className="btn-arcade btn-arcade-lime btn-arcade-sm">
                        <Download className="h-4 w-4" aria-hidden="true" /> Download PNG
                    </button>
                    <button
                        type="button"
                        disabled={!ready}
                        onClick={() => void print()}
                        className="btn-arcade btn-arcade-gold btn-arcade-sm">
                        <Printer className="h-4 w-4" aria-hidden="true" /> Print certificate
                    </button>
                    <button
                        type="button"
                        disabled={!ready}
                        onClick={() => openLinkedIn("profile")}
                        className="btn-arcade btn-arcade-cyan btn-arcade-sm">
                        <Linkedin className="h-4 w-4" aria-hidden="true" /> Add to LinkedIn profile
                    </button>
                    <button
                        type="button"
                        disabled={!ready}
                        onClick={() => openLinkedIn("share")}
                        className="btn-arcade btn-arcade-night btn-arcade-sm">
                        <Linkedin className="h-4 w-4" aria-hidden="true" /> Share post on LinkedIn
                    </button>
                    {canShareFiles && (
                        <button
                            type="button"
                            disabled={!ready}
                            onClick={() => void share()}
                            className="btn-arcade btn-arcade-grape btn-arcade-sm">
                            <Share2 className="h-4 w-4" aria-hidden="true" /> Share to Instagram &amp; more
                        </button>
                    )}
                    <button
                        type="button"
                        disabled={!ready}
                        onClick={() => void copyCaption()}
                        className="btn-arcade btn-arcade-night btn-arcade-sm">
                        <Copy className="h-4 w-4" aria-hidden="true" /> Copy caption
                    </button>
                    {!name.trim() && (
                        <p className="text-gm-ink-dim text-xs">
                            Enter your full name above first — it is printed on the certificate.
                        </p>
                    )}
                    {notice && (
                        <p role="status" className="text-gm-ink-soft text-xs">
                            {notice}
                        </p>
                    )}
                </div>
            ) : (
                <p className="text-gm-ink-dim text-sm">
                    Finish all {certificate.levelsTotal} levels to earn this certificate.
                </p>
            )}
        </li>
    );
}

/** One certificate per finished course, downloadable as an image and ready to post. */
export function CertificatesSection() {
    const { progressManager } = useGameContext();
    const [name, setName] = useState("");
    const [lockedName, setLockedName] = useState<string | null>(null);
    const [completed, setCompleted] = useState(progressManager.getProgress().completedLevels);

    useEffect(() => {
        const locked = getLockedName();
        setLockedName(locked);
        setName(locked ?? readStored(NAME_KEY) ?? "");
        setCompleted(progressManager.getProgress().completedLevels);
    }, [progressManager]);

    const isLocked = Boolean(lockedName);
    const handleIssued = () => {
        const locked = getLockedName();
        if (locked) {
            setLockedName(locked);
            setName(locked);
        }
    };

    const certificates = useMemo(() => getCertificates(completed), [completed]);
    if (!certificates.some(c => c.earned)) return null;

    return (
        <section className="container mx-auto px-4 pb-20" aria-labelledby="certificates-heading">
            <div className="mx-auto max-w-5xl">
                <h2 id="certificates-heading" className="font-display text-gm-ink text-2xl sm:text-3xl">
                    Your certificates
                </h2>
                <p className="text-gm-ink-soft mt-2 max-w-prose">
                    Issued by GitMastery for every course you finish. Download the image to post on LinkedIn or
                    Instagram, or add it to your LinkedIn profile.
                </p>

                <label className="mt-6 block max-w-sm">
                    <span className="text-gm-ink-soft text-sm font-semibold">Your full name (required)</span>
                    <input
                        type="text"
                        required
                        disabled={isLocked}
                        value={name}
                        maxLength={60}
                        onChange={event => {
                            if (isLocked) return;
                            setName(event.target.value);
                            writeStored(NAME_KEY, event.target.value);
                        }}
                        placeholder="Your full name"
                        className={`border-gm-line bg-gm-void text-gm-ink mt-1 w-full rounded-lg border-2 px-3 py-2 ${
                            isLocked ? "cursor-not-allowed opacity-60" : ""
                        }`}
                    />
                    {isLocked && (
                        <p className="text-gm-ink-dim mt-1.5 text-xs">
                            🔒 Name is locked because a certificate has already been issued.
                        </p>
                    )}
                </label>

                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {certificates.map(certificate => (
                        <CertificateCard
                            key={certificate.difficultyId}
                            certificate={certificate}
                            name={name}
                            onIssued={handleIssued}
                        />
                    ))}
                </ul>
                <p className="text-gm-ink-dim mt-4 text-xs">
                    Completion certificates issued by GitMastery, signed by Mika Stiebitz. Not an accredited
                    qualification.
                </p>
            </div>
        </section>
    );
}
