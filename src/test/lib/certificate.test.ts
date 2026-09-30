import { describe, expect, it } from "vitest";
import { allStages } from "~/levels";
import { difficulties } from "~/config/difficulties";
import { getCertificateId, getCertificates, getLinkedInAddToProfileUrl } from "~/lib/certificate";

const finishStages = (stageKeys: string[]) =>
    Object.fromEntries(
        stageKeys.map(key => [key, Object.keys(allStages[key as keyof typeof allStages].levels).map(Number)]),
    );

describe("certificates", () => {
    it("earns nothing without progress", () => {
        expect(getCertificates({}).some(c => c.earned)).toBe(false);
    });

    it("earns a course only when every stage of it is finished", () => {
        const beginner = difficulties.find(d => d.id === "beginner")!;
        const partial = finishStages(beginner.stages.slice(0, -1));
        expect(getCertificates(partial).find(c => c.difficultyId === "beginner")!.earned).toBe(false);

        const full = finishStages(beginner.stages);
        const certs = getCertificates(full);
        expect(certs.find(c => c.difficultyId === "beginner")!.earned).toBe(true);
        expect(certs.find(c => c.difficultyId === "pro")!.earned).toBe(false);
    });

    it("gives a stable id per name, course and date", () => {
        const date = new Date("2026-09-29T10:00:00Z");
        expect(getCertificateId("Mika", "pro", date)).toBe(getCertificateId(" mika ", "pro", date));
        expect(getCertificateId("Mika", "pro", date)).not.toBe(getCertificateId("Mika", "beginner", date));
    });

    it("issues under GitMastery on LinkedIn", () => {
        const cert = getCertificates({})[0]!;
        const url = new URL(getLinkedInAddToProfileUrl(cert, "GM-BEG-ABC1234", new Date("2026-09-29T10:00:00Z")));
        expect(url.searchParams.get("organizationName")).toBe("GitMastery");
        expect(url.searchParams.get("certId")).toBe("GM-BEG-ABC1234");
        expect(url.searchParams.get("issueMonth")).toBe("9");
    });
});
