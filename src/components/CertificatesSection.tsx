"use client";

import { useEffect, useMemo, useState } from "react";
import { Award, Copy, Download, Linkedin, Lock, Share2 } from "lucide-react";
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

const NAME_KEY = "gitmastery-certificate-name";
const ISSUED_KEY = "gitmastery-certificate-issued";

function readStored(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStored(key: string, value: string) {
    try {
        localStorage.setItem(key, value);
    } catch {
        // Private mode / blocked storage: the certificate still works, it just is not remembered.
    }
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

function CertificateCard({ certificate, name }: { certificate: Certificate; name: string }) {
    const [notice, setNotice] = useState<string | null>(null);
    const canShareFiles = typeof navigator !== "undefined" && typeof navigator.canShare === "function";
    const ready = certificate.earned && name.trim().length > 0;

    const build = async () => {
        const issuedAt = getIssuedAt(certificate.difficultyId);
        const certId = getCertificateId(name, certificate.difficultyId, issuedAt);
        const blob = await canvasToBlob(renderCertificate({ name, certificate, certId, issuedAt }));
        return { blob, certId, issuedAt };
    };

    const download = async () => {
        const { blob } = await build();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = getCertificateFilename(name, certificate);
        link.click();
        URL.revokeObjectURL(url);
    };

    const share = async () => {
        const { blob } = await build();
        const file = new File([blob], getCertificateFilename(name, certificate), { type: "image/png" });
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
        const issuedAt = getIssuedAt(certificate.difficultyId);
        const certId = getCertificateId(name, certificate.difficultyId, issuedAt);
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
    const [completed, setCompleted] = useState(progressManager.getProgress().completedLevels);

    useEffect(() => {
        setName(readStored(NAME_KEY) ?? "");
        setCompleted(progressManager.getProgress().completedLevels);
    }, [progressManager]);

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
                        value={name}
                        maxLength={60}
                        onChange={event => {
                            setName(event.target.value);
                            writeStored(NAME_KEY, event.target.value);
                        }}
                        placeholder="Your full name"
                        className="border-gm-line bg-gm-void text-gm-ink mt-1 w-full rounded-lg border-2 px-3 py-2"
                    />
                </label>

                <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {certificates.map(certificate => (
                        <CertificateCard key={certificate.difficultyId} certificate={certificate} name={name} />
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
