"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "~/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
    <AccordionPrimitive.Item
        ref={ref}
        className={cn("border-gm-line border-b-2 last:border-b-0", className)}
        {...props}
    />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
        <AccordionPrimitive.Trigger
            ref={ref}
            className={cn(
                "text-gm-ink hover:text-gm-lime focus-visible:outline-gm-cyan [&[data-state=open]]:text-gm-lime flex flex-1 cursor-pointer items-center justify-between gap-4 py-4 text-start text-base font-semibold transition-colors duration-150 focus-visible:outline-3 focus-visible:outline-offset-2 [&[data-state=open]>svg]:rotate-180",
                className,
            )}
            {...props}>
            {children}
            <ChevronDown
                className="text-gm-ink-dim h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none"
                aria-hidden="true"
            />
        </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
    React.ElementRef<typeof AccordionPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
        ref={ref}
        className="text-gm-ink-soft data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-base leading-relaxed"
        {...props}>
        <div className={cn("pt-0 pb-5", className)}>{children}</div>
    </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
