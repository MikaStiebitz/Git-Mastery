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

export const CERTIFICATE_SIZE = { width: 1080, height: 1350 } as const; // 4:5 — fits LinkedIn and Instagram feeds

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
    return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
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

const PALETTE = {
    void: "#0C091F",
    night: "#150F33",
    line: "#3A2F6B",
    grape: "#9455EF",
    lime: "#B7F652",
    cyan: "#44DDFB",
    gold: "#FDC94B",
    ink: "#F5F4FD",
    inkSoft: "#C9C4EC",
    inkDim: "#9A93C7",
} as const;

const SANS = 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

interface RenderOptions {
    name: string;
    certificate: Certificate;
    certId: string;
    issuedAt: Date;
}

/** Shrinks the font until the text fits, so long names never overflow the card. */
function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, font: string) {
    let size = startSize;
    do {
        ctx.font = `800 ${size}px ${font}`;
        size -= 2;
    } while (ctx.measureText(text).width > maxWidth && size > 28);
}

/** Draws the certificate onto a canvas and returns it. Browser only. */
export function renderCertificate(options: RenderOptions): HTMLCanvasElement {
    const { name, certificate, certId, issuedAt } = options;
    const { width: W, height: H } = CERTIFICATE_SIZE;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas is not supported in this browser");

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, PALETTE.void);
    bg.addColorStop(1, PALETTE.night);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Dot matrix texture
    ctx.fillStyle = "rgba(148, 85, 239, 0.16)";
    for (let y = 30; y < H; y += 30) {
        for (let x = 30; x < W; x += 30) {
            ctx.beginPath();
            ctx.arc(x, y, 1.6, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Frame
    ctx.lineWidth = 6;
    ctx.strokeStyle = PALETTE.lime;
    ctx.strokeRect(48, 48, W - 96, H - 96);
    ctx.lineWidth = 2;
    ctx.strokeStyle = PALETTE.line;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    // Wordmark
    ctx.fillStyle = PALETTE.lime;
    ctx.font = `700 40px ${MONO}`;
    ctx.fillText("$ git mastery", W / 2, 165);

    // Heading
    ctx.fillStyle = PALETTE.inkDim;
    ctx.font = `700 26px ${SANS}`;
    drawSpaced(ctx, "CERTIFICATE OF COMPLETION", W / 2, 270, 7);

    ctx.fillStyle = PALETTE.inkSoft;
    ctx.font = `400 32px ${SANS}`;
    ctx.fillText("This certifies that", W / 2, 375);

    // Name
    const displayName = name.trim() || "Your Name";
    ctx.fillStyle = PALETTE.ink;
    fitText(ctx, displayName, W - 240, 96, SANS);
    ctx.fillText(displayName, W / 2, 490);

    // Underline accent
    ctx.fillStyle = PALETTE.lime;
    ctx.fillRect(W / 2 - 90, 520, 180, 6);

    ctx.fillStyle = PALETTE.inkSoft;
    ctx.font = `400 32px ${SANS}`;
    ctx.fillText("has successfully completed the course", W / 2, 600);

    // Course title
    ctx.fillStyle = PALETTE.gold;
    fitText(ctx, certificate.title, W - 200, 78, SANS);
    ctx.fillText(certificate.title, W / 2, 700);

    ctx.fillStyle = PALETTE.inkSoft;
    ctx.font = `400 30px ${SANS}`;
    ctx.fillText(
        `${certificate.level} difficulty · ${certificate.stagesTotal} stages · ${certificate.levelsTotal} levels`,
        W / 2,
        760,
    );

    // Git graph decoration: a branch that forks and merges back
    drawGraph(ctx, W / 2, 870);

    // Seal
    drawSeal(ctx, W / 2, 1035);

    // Footer: date / id
    ctx.textAlign = "left";
    ctx.fillStyle = PALETTE.inkDim;
    ctx.font = `600 20px ${SANS}`;
    ctx.fillText("ISSUED", 130, 1165);
    ctx.fillText("CERTIFICATE ID", W - 130 - 300, 1165);
    ctx.fillStyle = PALETTE.ink;
    ctx.font = `600 28px ${SANS}`;
    ctx.fillText(formatDisplayDate(issuedAt), 130, 1202);
    ctx.font = `600 28px ${MONO}`;
    ctx.fillText(certId, W - 130 - 300, 1202);

    ctx.textAlign = "center";
    ctx.fillStyle = PALETTE.cyan;
    ctx.font = `700 30px ${SANS}`;
    ctx.fillText("gitmastery.me", W / 2, 1262);

    return canvas;
}

function drawSpaced(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, spacing: number) {
    const chars = [...text];
    const widths = chars.map(c => ctx.measureText(c).width + spacing);
    let x = cx - (widths.reduce((a, b) => a + b, 0) - spacing) / 2;
    const align = ctx.textAlign;
    ctx.textAlign = "left";
    chars.forEach((c, i) => {
        ctx.fillText(c, x, y);
        x += widths[i]!;
    });
    ctx.textAlign = align;
}

function drawGraph(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const left = cx - 260;
    const right = cx + 260;
    const up = cy - 34;
    ctx.lineWidth = 6;
    ctx.lineCap = "round";

    ctx.strokeStyle = PALETTE.lime;
    ctx.beginPath();
    ctx.moveTo(left, cy);
    ctx.lineTo(right, cy);
    ctx.stroke();

    ctx.strokeStyle = PALETTE.grape;
    ctx.beginPath();
    ctx.moveTo(cx - 130, cy);
    ctx.bezierCurveTo(cx - 100, up, cx - 90, up, cx - 60, up);
    ctx.lineTo(cx + 60, up);
    ctx.bezierCurveTo(cx + 90, up, cx + 100, up, cx + 130, cy);
    ctx.stroke();

    const nodes: [number, number, string][] = [
        [left, cy, PALETTE.lime],
        [cx - 130, cy, PALETTE.lime],
        [cx - 40, up, PALETTE.grape],
        [cx + 40, up, PALETTE.grape],
        [cx + 130, cy, PALETTE.lime],
        [right, cy, PALETTE.gold],
    ];
    for (const [x, y, color] of nodes) {
        ctx.fillStyle = PALETTE.void;
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = 6;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

function drawSeal(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
    const points = 24;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? 76 : 66;
        const angle = (Math.PI * i) / points - Math.PI / 2;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fillStyle = PALETTE.gold;
    ctx.fill();

    ctx.lineWidth = 4;
    ctx.strokeStyle = PALETTE.void;
    ctx.beginPath();
    ctx.arc(cx, cy, 52, 0, Math.PI * 2);
    ctx.stroke();

    // Checkmark
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(cx - 24, cy + 2);
    ctx.lineTo(cx - 6, cy + 20);
    ctx.lineTo(cx + 26, cy - 18);
    ctx.stroke();
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => (blob ? resolve(blob) : reject(new Error("Could not create image"))), "image/png");
    });
}
