import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface TerminalSkeletonProps {
    className?: string;
}

/**
 * Placeholder for the dynamically imported Terminal. Paddings, border widths and control
 * sizes mirror Terminal/index.tsx exactly, so swapping in the real terminal shifts nothing.
 */
export function TerminalSkeleton({ className = "" }: TerminalSkeletonProps) {
    return (
        <div
            className={cn(
                "gm-panel flex w-full min-w-0 flex-col overflow-hidden shadow-[0_6px_0_var(--color-gm-line)]",
                className,
                // Last, so the placeholder keeps the same shape as the real terminal.
                "rounded-[1.4rem]",
            )}
            aria-hidden="true">
            {/* Terminal header */}
            <div className="border-gm-line bg-gm-deep flex items-center justify-between gap-2 border-b-2 px-2 py-1.5 sm:px-3">
                <div className="flex min-w-0 items-center gap-2">
                    <div className="flex shrink-0 gap-1.5">
                        <span className="bg-gm-coral h-3 w-3 rounded-full"></span>
                        <span className="bg-gm-gold h-3 w-3 rounded-full"></span>
                        <span className="bg-gm-lime h-3 w-3 rounded-full"></span>
                    </div>
                    <Skeleton className="bg-gm-line/50 h-3 w-32 rounded-full" />
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                    <Skeleton className="bg-gm-line/50 h-11 w-11 rounded-[0.85rem]" />
                    <Skeleton className="bg-gm-line/50 h-11 w-11 rounded-[0.85rem]" />
                    <Skeleton className="bg-gm-line/50 h-11 w-11 rounded-[0.85rem]" />
                </div>
            </div>

            {/* Terminal output area */}
            <div className="min-h-0 flex-1 space-y-2 overflow-hidden px-3 py-3 sm:px-4">
                <Skeleton className="h-3 w-full rounded-full" />
                <Skeleton className="h-3 w-3/4 rounded-full" />
                <Skeleton className="h-3 w-5/6 rounded-full" />
                <Skeleton className="h-3 w-2/3 rounded-full" />
                <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>

            {/* Terminal input area */}
            <div className="border-gm-line border-t-2 px-2 py-2 sm:px-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="hidden h-5 w-40 flex-shrink-0 rounded-full sm:block" />
                    <Skeleton className="h-11 min-w-0 flex-1 rounded-[0.85rem]" />
                    <Skeleton className="h-11 w-11 flex-shrink-0 rounded-[0.85rem]" />
                </div>
            </div>
        </div>
    );
}
