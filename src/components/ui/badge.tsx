import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

/**
 * Status pills. Variants follow the Git legend: lime = done, cyan = branch/info,
 * coral = danger, gold = rewards, grape = neutral brand.
 */
const badgeVariants = cva("gm-chip", {
    variants: {
        variant: {
            default: "bg-gm-lime text-gm-void",
            secondary: "bg-gm-grape text-gm-ink",
            destructive: "bg-gm-coral text-gm-void",
            info: "bg-gm-cyan text-gm-void",
            reward: "bg-gm-gold text-gm-void",
            outline: "border-gm-line bg-gm-void text-gm-ink-soft",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
