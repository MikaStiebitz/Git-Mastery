import { describe, it, expect } from "vitest";
import { blobId, fileDiff, mergeFile, unifiedHunks } from "~/models/git/diff";
import { sha1 } from "~/models/git/sha1";

describe("git object primitives", () => {
    it("hashes like Git", () => {
        expect(sha1("abc")).toBe("a9993e364706816aba3e25717850c26c9cd0d89d");
        // The empty blob every Git user has seen in `index 0000000..e69de29`.
        expect(blobId("")).toBe("e69de29bb2d1d6434b8b29ae775ad8c2e48c5391");
    });

    it("renders unified hunks with three lines of context", () => {
        const before = "1\n2\n3\n4\n5\n6\n7\n8\n9\n";
        const after = "1\n2\n3\n4\nfive\n6\n7\n8\n9\n";
        expect(unifiedHunks(before, after)).toEqual([
            "@@ -2,7 +2,7 @@",
            " 2",
            " 3",
            " 4",
            "-5",
            "+five",
            " 6",
            " 7",
            " 8",
        ]);
    });

    it("describes a new file", () => {
        expect(fileDiff("a.txt", undefined, "hi\n")).toEqual([
            "diff --git a/a.txt b/a.txt",
            "new file mode 100644",
            `index 0000000..${blobId("hi\n").substring(0, 7)}`,
            "--- /dev/null",
            "+++ b/a.txt",
            "@@ -0,0 +1 @@",
            "+hi",
        ]);
    });

    it("merges changes to different lines and marks changes to the same line", () => {
        const base = "a\nb\nc\n";
        expect(mergeFile(base, "A\nb\nc\n", "a\nb\nC\n", { ours: "HEAD", theirs: "x" })).toEqual({
            content: "A\nb\nC\n",
            conflicts: 0,
        });
        expect(mergeFile(base, "a\nB1\nc\n", "a\nB2\nc\n", { ours: "HEAD", theirs: "feature" })).toEqual({
            content: "a\n<<<<<<< HEAD\nB1\n=======\nB2\n>>>>>>> feature\nc\n",
            conflicts: 1,
        });
    });
});
