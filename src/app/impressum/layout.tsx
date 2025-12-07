import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Impressum - Git Mastery | Legal Information",
    description: "Legal information and imprint for Git Mastery, the interactive Git learning platform.",
    robots: {
        index: false,
        follow: false,
    },
    alternates: {
        canonical: "/impressum",
    },
};

export default function ImpressumLayout({ children }: { children: React.ReactNode }) {
    return children;
}
