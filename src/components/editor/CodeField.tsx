"use client";

import Editor from "react-simple-code-editor";
import { Highlight, type PrismTheme, type Language } from "prism-react-renderer";

/**
 * Syntax highlighting in the design system's own colours.
 *
 * prism-react-renderer ships themes built for other products, and dropping one in would put a
 * second, unrelated palette inside a panel that is otherwise strictly on-system. These tokens map
 * onto the Git legend the rest of the app already uses, so a string in the editor is the same green
 * as a success line in the terminal: grape for keywords, cyan for names and types, lime for values,
 * gold for numbers, coral for anything that reads as a warning.
 */
const arcadeTheme: PrismTheme = {
    plain: { color: "var(--color-gm-ink)", backgroundColor: "transparent" },
    styles: [
        { types: ["comment", "prolog", "cdata"], style: { color: "var(--color-gm-ink-dim)", fontStyle: "italic" } },
        { types: ["punctuation"], style: { color: "var(--color-gm-ink-dim)" } },
        {
            types: ["keyword", "operator", "boolean", "important", "atrule"],
            style: { color: "var(--color-gm-grape-hi)" },
        },
        { types: ["function", "class-name", "tag", "selector"], style: { color: "var(--color-gm-cyan)" } },
        { types: ["string", "char", "attr-value", "inserted"], style: { color: "var(--color-gm-lime)" } },
        { types: ["number", "constant", "symbol"], style: { color: "var(--color-gm-gold)" } },
        { types: ["variable", "attr-name", "property"], style: { color: "var(--color-gm-ink-soft)" } },
        { types: ["deleted", "regex"], style: { color: "var(--color-gm-coral)" } },
    ],
};

/**
 * Prism's language id for a file, or null when the file is not code.
 *
 * Returning null matters: highlighting prose as if it were code is worse than leaving it alone,
 * because it puts meaning on words that have none.
 */
export function languageForFile(fileName: string): Language | null {
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";

    const byExtension: Record<string, Language> = {
        js: "javascript",
        jsx: "jsx",
        mjs: "javascript",
        cjs: "javascript",
        ts: "typescript",
        tsx: "tsx",
        json: "json",
        css: "css",
        scss: "scss",
        html: "markup",
        xml: "markup",
        svg: "markup",
        md: "markdown",
        markdown: "markdown",
        yml: "yaml",
        yaml: "yaml",
        sh: "bash",
        bash: "bash",
        zsh: "bash",
        py: "python",
        rb: "ruby",
        go: "go",
        rs: "rust",
        java: "java",
        php: "php",
        sql: "sql",
        toml: "toml",
        diff: "diff",
        patch: "diff",
    };

    // .gitignore, .gitattributes and friends read best as plain configuration.
    if (fileName.startsWith(".git")) return "bash";

    return byExtension[extension] ?? null;
}

interface CodeFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    fileName: string;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    autoFocus?: boolean;
}

/**
 * An editable code field: a transparent textarea sitting exactly on top of a highlighted copy of
 * the same text. It is the standard trick, and the reason it is worth the trouble here is that the
 * alternative — a read-only viewer plus a separate plain editor — makes people edit blind.
 */
export function CodeField({ value, onValueChange, fileName, onKeyDown, autoFocus }: CodeFieldProps) {
    const language = languageForFile(fileName);

    const highlight = (code: string) => {
        if (!language) return code;

        return (
            <Highlight theme={arcadeTheme} code={code} language={language}>
                {({ tokens, getLineProps, getTokenProps }) => (
                    <>
                        {tokens.map((line, i) => (
                            // The prop getters are called without `key` and the key is passed
                            // explicitly: React treats a spread-in `key` as a missing key.
                            <span key={i} {...getLineProps({ line })}>
                                {line.map((token, k) => (
                                    <span key={k} {...getTokenProps({ token })} />
                                ))}
                                {"\n"}
                            </span>
                        ))}
                    </>
                )}
            </Highlight>
        );
    };

    return (
        <div className="gm-inset gm-scroll focus-within:outline-gm-cyan min-h-0 flex-1 overflow-auto focus-within:outline-3 focus-within:-outline-offset-1">
            <Editor
                value={value}
                onValueChange={onValueChange}
                highlight={highlight}
                onKeyDown={onKeyDown}
                autoFocus={autoFocus}
                padding={14}
                textareaClassName="focus:outline-none"
                className="[font-family:var(--font-code)] text-xs leading-[1.65] sm:text-[13px]"
                style={{ minHeight: "100%", caretColor: "var(--color-gm-lime)" }}
                spellCheck={false}
            />
        </div>
    );
}
