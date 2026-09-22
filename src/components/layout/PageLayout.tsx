import { type ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

interface PageLayoutProps {
    children: ReactNode;
    showLevelInfo?: boolean;
}

export function PageLayout({ children, showLevelInfo = false }: PageLayoutProps) {
    return (
        <div className="bg-gm-void text-gm-ink flex min-h-screen flex-col">
            <Navbar showLevelInfo={showLevelInfo} />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
