import * as React from "react";

import { cn } from "~/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "gm-field h-11 file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
Input.displayName = "Input";

export { Input };
