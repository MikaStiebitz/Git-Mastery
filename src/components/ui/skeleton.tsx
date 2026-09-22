import { cn } from "~/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn("bg-gm-deep animate-pulse rounded-xl motion-reduce:animate-none", className)} {...props} />
    );
}

export { Skeleton };
