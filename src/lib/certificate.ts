import { difficulties } from "~/config/difficulties";
import { getDifficultyProgress } from "~/lib/courseProgress";
import { getPageUrl } from "~/lib/site";
import type { DifficultyLevel } from "~/types";

/**
 * Completion certificates: one per course (difficulty), earned when every level of it is cleared.
 *
 * These are honest completion certificates issued by GitMastery itself. They are not an accredited
 * qualification and never claim to come from any other organisation — the issuer that goes onto the
 * image and into LinkedIn's "Add to profile" form is always GitMastery.
 */

export const CERTIFICATE_ISSUER = "GitMastery";
export const CERTIFICATE_SIGNATORY = "Mika Stiebitz";
export const CERTIFICATE_SIGNATORY_ROLE = "Founder, GitMastery";

export const CERTIFICATE_SIZE = { width: 2000, height: 1414 } as const; // A4 landscape — the shape people expect of a certificate

const COURSE_TITLES: Record<DifficultyLevel, string> = {
    beginner: "Git Fundamentals",
    advanced: "Advanced Git Workflows",
    pro: "Git Mastery — Pro",
};

export interface Certificate {
    difficultyId: DifficultyLevel;
    /** e.g. "Git Fundamentals" */
    title: string;
    /** Difficulty label, e.g. "Beginner" */
    level: string;
    levelsTotal: number;
    stagesTotal: number;
    earned: boolean;
    levelsDone: number;
}

/** Every course with whether it is finished. Order matches the learning path. */
export function getCertificates(completedLevels: Record<string, number[]>): Certificate[] {
    return difficulties.map(difficulty => {
        const progress = getDifficultyProgress(difficulty.id as DifficultyLevel, completedLevels);
        return {
            difficultyId: difficulty.id as DifficultyLevel,
            title: COURSE_TITLES[difficulty.id as DifficultyLevel],
            level: difficulty.name,
            levelsTotal: progress.levelsTotal,
            stagesTotal: progress.stagesTotal,
            levelsDone: progress.levelsDone,
            earned: progress.levelsTotal > 0 && progress.levelsDone === progress.levelsTotal,
        };
    });
}

/** Short, stable, human-readable id: the same name + course + date always gives the same one. */
export function getCertificateId(name: string, difficultyId: DifficultyLevel, issuedAt: Date): string {
    const input = `${name.trim().toLowerCase()}|${difficultyId}|${formatIsoDate(issuedAt)}`;
    let hash = 0x811c9dc5; // FNV-1a
    for (let i = 0; i < input.length; i++) {
        hash ^= input.charCodeAt(i);
        hash = Math.imul(hash, 0x01000193) >>> 0;
    }
    const code = hash.toString(36).toUpperCase().padStart(7, "0").slice(-7);
    return `GM-${difficultyId.slice(0, 3).toUpperCase()}-${code}`;
}

export function formatIsoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function formatDisplayDate(date: Date): string {
    return date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function getCertificateFilename(name: string, certificate: Certificate): string {
    const slug = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    return `gitmastery-${certificate.difficultyId}-certificate${slug ? `-${slug}` : ""}.png`;
}

/** LinkedIn's "Add to profile → Licenses & certifications" form, prefilled. */
export function getLinkedInAddToProfileUrl(certificate: Certificate, certId: string, issuedAt: Date): string {
    const params = new URLSearchParams({
        startTask: "CERTIFICATION_NAME",
        name: `GitMastery ${certificate.title}`,
        organizationName: CERTIFICATE_ISSUER,
        issueYear: String(issuedAt.getFullYear()),
        issueMonth: String(issuedAt.getMonth() + 1),
        certUrl: getPageUrl("/"),
        certId,
    });
    return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

/** LinkedIn share dialog. LinkedIn does not accept prefilled text here, so the caption is copied instead. */
export function getLinkedInShareUrl(): string {
    const params = new URLSearchParams({ url: getPageUrl("/") });
    return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

export function getShareCaption(certificate: Certificate): string {
    return [
        `I just completed the GitMastery ${certificate.title} course — ${certificate.levelsTotal} levels of real Git commands across ${certificate.stagesTotal} stages. 🎮`,
        "",
        "Learn Git by playing it, free in your browser:",
        getPageUrl("/"),
        "",
        "#git #github #softwaredevelopment #learning #devtools",
    ].join("\n");
}

const COLORS = {
    paper: "#FFFFFF",
    band: "#F2F0F8",
    indigo: "#241E55",
    ink: "#15131F",
    sub: "#5E5A6E",
    faint: "#8C889A",
    line: "#E3E1EA",
} as const;

const SERIF = '"GM Certificate Serif", Georgia, serif';
const SANS = '"GM Certificate Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
const SCRIPT = '"GM Certificate Signature", "Snell Roundhand", "Segoe Script", cursive';

/**
 * The certificate's own fonts, served from /public so every device renders the same image instead of
 * whatever serif or script font the system happens to have.
 */
const FONT_FILES: [family: string, weight: string, file: string][] = [
    ["GM Certificate Serif", "400", "instrument-serif-latin-400-normal.woff2"],
    ["GM Certificate Sans", "400", "inter-latin-400-normal.woff2"],
    ["GM Certificate Sans", "600", "inter-latin-600-normal.woff2"],
    ["GM Certificate Sans", "700", "inter-latin-700-normal.woff2"],
    ["GM Certificate Signature", "400", "mrs-saint-delafield-latin-400-normal.woff2"],
];

let fontsReady: Promise<void> | null = null;

/** Loads the certificate fonts once. A font that fails to load falls back to the next family in the stack. */
export function loadCertificateFonts(): Promise<void> {
    fontsReady ??= Promise.allSettled(
        FONT_FILES.map(async ([family, weight, file]) => {
            const face = new FontFace(family, `url(/fonts/certificate/${file})`, { weight });
            document.fonts.add(await face.load());
        }),
    ).then(() => undefined);
    return fontsReady;
}

interface RenderOptions {
    name: string;
    certificate: Certificate;
    certId: string;
    issuedAt: Date;
}

/** Shrinks the font until the text fits, so long names never overflow. */
function fitText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    startSize: number,
    font: string,
    weight = 400,
) {
    let size = startSize;
    do {
        ctx.font = `${weight} ${size}px ${font}`;
        size -= 2;
    } while (ctx.measureText(text).width > maxWidth && size > 28);
}

/** Draws the certificate onto a canvas and returns it. Browser only. */
export async function renderCertificate(options: RenderOptions): Promise<HTMLCanvasElement> {
    const { certificate, certId, issuedAt } = options;
    const name = options.name.trim();
    if (!name) throw new Error("A name is required to issue a certificate");
    await loadCertificateFonts();

    const { width: W, height: H } = CERTIFICATE_SIZE;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser");

    ctx.fillStyle = COLORS.paper;
    ctx.fillRect(0, 0, W, H);

    // Right-hand band with the ribbon and seal
    const bandWidth = 560;
    const bx = W - bandWidth;
    const cx = bx + bandWidth / 2;
    ctx.fillStyle = COLORS.band;
    ctx.fillRect(bx, 0, bandWidth, H);
    ctx.fillStyle = COLORS.indigo;
    ctx.beginPath();
    ctx.moveTo(cx - 130, 0);
    ctx.lineTo(cx + 130, 0);
    ctx.lineTo(cx + 130, 760);
    ctx.lineTo(cx, 700);
    ctx.lineTo(cx - 130, 760);
    ctx.closePath();
    ctx.fill();
    drawSeal(ctx, cx, 520, 190);
    ctx.fillStyle = COLORS.indigo;
    ctx.font = `600 30px ${SANS}`;
    drawSpaced(ctx, "COURSE", cx, 900, 10);
    drawSpaced(ctx, "CERTIFICATE", cx, 950, 10);

    // Content
    const L = 150;
    const maxWidth = bx - L - 120;
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    ctx.fillStyle = COLORS.sub;
    ctx.font = `400 34px ${SANS}`;
    ctx.fillText(formatDisplayDate(issuedAt), L, 250);

    ctx.fillStyle = COLORS.ink;
    fitText(ctx, name, maxWidth, 132, SERIF);
    ctx.fillText(name, L, 420);

    ctx.fillStyle = COLORS.sub;
    ctx.font = `400 36px ${SANS}`;
    ctx.fillText("has successfully completed", L, 520);

    ctx.fillStyle = COLORS.ink;
    fitText(ctx, certificate.title, maxWidth, 84, SANS, 700);
    ctx.fillText(certificate.title, L, 635);

    ctx.fillStyle = COLORS.sub;
    ctx.font = `400 32px ${SANS}`;
    ctx.fillText(
        `an interactive ${certificate.level.toLowerCase()} course of ${certificate.levelsTotal} hands-on levels across ${certificate.stagesTotal} stages,`,
        L,
        720,
    );
    ctx.fillText("completed by typing real Git commands in a simulated repository.", L, 768);

    // Signature
    ctx.fillStyle = COLORS.ink;
    ctx.font = `400 110px ${SCRIPT}`;
    ctx.fillText(CERTIFICATE_SIGNATORY, L + 10, 1090);
    ctx.strokeStyle = COLORS.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(L, 1116);
    ctx.lineTo(L + 560, 1116);
    ctx.stroke();
    ctx.fillStyle = COLORS.ink;
    ctx.font = `600 30px ${SANS}`;
    ctx.fillText(CERTIFICATE_SIGNATORY, L, 1162);
    ctx.fillStyle = COLORS.sub;
    ctx.font = `400 26px ${SANS}`;
    ctx.fillText(CERTIFICATE_SIGNATORY_ROLE, L, 1200);

    ctx.fillStyle = COLORS.faint;
    ctx.font = `400 24px ${SANS}`;
    ctx.fillText(`Certificate ID ${certId}  ·  gitmastery.me`, L, H - 90);

    return canvas;
}

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
    const chars = [...text];
    const widths = chars.map(c => ctx.measureText(c).width + spacing);
    let x = cx - (widths.reduce((a, b) => a + b, 0) - spacing) / 2;
    ctx.save();
    ctx.textAlign = "left";
    chars.forEach((c, i) => {
        ctx.fillText(c, x, y);
        x += widths[i]!;
    });
    ctx.restore();
}

/** The GitMastery branch mark from public/logo.svg, drawn in a 24-unit box scaled to `size`. */
function drawMark(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size / 24, size / 24);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(6, 3);
    ctx.lineTo(6, 15);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(18, 6, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(6, 18, 3, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(9, 9, 9, 0, Math.PI / 2);
    ctx.stroke();
    ctx.restore();
}

function drawSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number) {
    ctx.fillStyle = COLORS.indigo;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 12, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, r - 58, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = `600 ${Math.round(r * 0.17)}px ${SANS}`;
    ctx.textAlign = "center";
    const chars = [..."GITMASTERY  ·  CERTIFIED  ·  "];
    chars.forEach((ch, i) => {
        const angle = (i / chars.length) * Math.PI * 2 - Math.PI / 2;
        ctx.save();
        ctx.translate(cx + (r - 35) * Math.cos(angle), cy + (r - 35) * Math.sin(angle));
        ctx.rotate(angle + Math.PI / 2);
        ctx.fillText(ch, 0, 6);
        ctx.restore();
    });
    drawMark(ctx, cx - r * 0.3, cy - r * 0.3, r * 0.6, "#FFFFFF");
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error("Could not create image"))), "image/png");
    });
}
