import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "FAQ - Git Mastery | Interactive Git Learning Platform",
    description:
        "Frequently asked questions about Git Mastery, the interactive Git learning platform. Get answers about Git commands, troubleshooting, and learning resources.",
    openGraph: {
        title: "FAQ - Git Mastery",
        description: "Frequently asked questions about Git Mastery and Git learning",
        url: "https://www.gitmastery.me/faq",
        siteName: "Git Mastery",
        images: [
            {
                url: "/home-screen.png",
                width: 1200,
                height: 630,
                alt: "Git Mastery FAQ",
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "FAQ - Git Mastery",
        description: "Frequently asked questions about Git Mastery and Git learning",
        images: ["/home-screen.png"],
    },
    alternates: {
        canonical: "/faq",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return children;
}
