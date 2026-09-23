"use client";

import { forwardRef, useState, type ComponentProps } from "react";
import { Check, Copy, Eye, EyeOff } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useLanguage } from "~/contexts/LanguageContext";
import { cn } from "~/lib/utils";

/**
 * A password field with an optional reveal toggle and a copy button, so what was typed (or what a
 * password manager filled in) can be checked and reused without retyping it blind.
 */
export const PasswordInput = forwardRef<HTMLInputElement, Omit<ComponentProps<"input">, "type">>(
    ({ className, value, ...props }, ref) => {
        const { t } = useLanguage();
        const [visible, setVisible] = useState(false);
        const [copied, setCopied] = useState(false);

        const text = typeof value === "string" ? value : "";

        const copy = async () => {
            if (!text) return;
            try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
            } catch {
                // Clipboard access can be denied (permissions, insecure context). Nothing to
                // recover from client-side, so the button just stays a no-op.
            }
        };

        return (
            <div className="relative">
                <Input
                    ref={ref}
                    type={visible ? "text" : "password"}
                    value={value}
                    className={cn("pr-20", className)}
                    {...props}
                />
                <div className="absolute inset-y-0 right-1 flex items-center gap-0.5">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setVisible(shown => !shown)}
                        aria-label={t(visible ? "account.hidePassword" : "account.showPassword")}>
                        {visible ? (
                            <EyeOff className="h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Eye className="h-4 w-4" aria-hidden="true" />
                        )}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        disabled={!text}
                        onClick={() => void copy()}
                        aria-label={t(copied ? "account.passwordCopied" : "account.copyPassword")}>
                        {copied ? (
                            <Check className="text-gm-lime h-4 w-4" aria-hidden="true" />
                        ) : (
                            <Copy className="h-4 w-4" aria-hidden="true" />
                        )}
                    </Button>
                </div>
            </div>
        );
    },
);
PasswordInput.displayName = "PasswordInput";
