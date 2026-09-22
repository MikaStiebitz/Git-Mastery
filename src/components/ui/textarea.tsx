import * as React from "react";

import { cn } from "~/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
    ({ className, ...props }, ref) => {
        return <textarea className={cn("gm-field gm-scroll min-h-[80px] resize-y", className)} ref={ref} {...props} />;
    },
);
Textarea.displayName = "Textarea";

export { Textarea };
