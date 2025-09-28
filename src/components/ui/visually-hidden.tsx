"use client";

import * as React from "react";
import { cn } from "~/lib/utils";

interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
}

export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
    ({ children, className, ...props }, ref) => {
        return (
            <span
                ref={ref}
                className={cn(
                    "absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0",
                    "clip-[rect(0,0,0,0)]",
                    className,
                )}
                {...props}>
                {children}
            </span>
        );
    },
);

VisuallyHidden.displayName = "VisuallyHidden";
