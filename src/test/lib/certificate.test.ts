import { describe, expect, it, vi } from "vitest";
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

    it("locks certificate name upon issuance and prevents renaming exploit", async () => {
        const { getLockedName, lockCertificateName, resetSessionLockedName, LOCKED_NAME_KEY, NAME_KEY, ISSUED_KEY } =
            await import("~/components/CertificatesSection");
        localStorage.clear();
        resetSessionLockedName();

        expect(getLockedName()).toBeNull();

        // First issuance locks the name
        expect(lockCertificateName("Alice Real")).toBe("Alice Real");
        expect(getLockedName()).toBe("Alice Real");
        expect(localStorage.getItem(LOCKED_NAME_KEY)).toBe("Alice Real");

        // Subsequent attempt to rename to Bob should be ignored
        expect(lockCertificateName("Bob Fake")).toBe("Alice Real");
        expect(getLockedName()).toBe("Alice Real");
        expect(localStorage.getItem(LOCKED_NAME_KEY)).toBe("Alice Real");

        // Test migration if certificate was previously issued
        localStorage.clear();
        resetSessionLockedName();
        localStorage.setItem(NAME_KEY, "Charlie Prior");
        localStorage.setItem(ISSUED_KEY, JSON.stringify({ beginner: "2026-01-01T00:00:00.000Z" }));
        expect(getLockedName()).toBe("Charlie Prior");
    });

    it("keeps the lock in memory when localStorage is unavailable", async () => {
        const { getLockedName, lockCertificateName, resetSessionLockedName } = await import(
            "~/components/CertificatesSection"
        );
        localStorage.clear();
        resetSessionLockedName();
        const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
            throw new Error("blocked");
        });
        const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("blocked");
        });
        try {
            expect(lockCertificateName("Alice Real")).toBe("Alice Real");
            expect(lockCertificateName("Bob Fake")).toBe("Alice Real");
            expect(getLockedName()).toBe("Alice Real");
        } finally {
            getItem.mockRestore();
            setItem.mockRestore();
            resetSessionLockedName();
        }
    });
});
