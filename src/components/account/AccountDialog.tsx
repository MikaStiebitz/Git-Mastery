"use client";

import { createContext, useContext, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, Check, CloudOff, Loader2, LogOut, RefreshCw, Trash2, UserRound } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useAuth } from "~/contexts/AuthContext";
import { useLanguage } from "~/contexts/LanguageContext";
import { MergeDialog } from "~/components/account/MergeDialog";

/**
 * Signing in, registering, and managing an account.
 *
 * The framing throughout is that this is optional. The game does not gate anything behind it, so
 * the dialog opens by saying what an account is for rather than asking to be let in, and the
 * "carry on without one" path is always one visible click away.
 */

/** Turn an API error code into something a person can act on. */
function useErrorMessage() {
    const { t } = useLanguage();
    return (code: string, reason?: string): string => {
        if (code === "invalid_username" && reason) {
            const key = `account.error.username.${reason}`;
            const translated = t(key);
            if (translated !== key) return translated;
        }
        const key = `account.error.${code}`;
        const translated = t(key);
        return translated === key ? t("account.error.unknown") : translated;
    };
}

function StatusLine() {
    const { status, pendingCount } = useAuth();
    const { t } = useLanguage();

    const shown = {
        syncing: { icon: Loader2, className: "text-gm-cyan animate-spin", label: t("account.status.syncing") },
        synced: { icon: Check, className: "text-gm-lime", label: t("account.status.synced") },
        offline: { icon: CloudOff, className: "text-gm-gold", label: t("account.status.offline") },
        paused: { icon: AlertTriangle, className: "text-gm-gold", label: t("account.status.paused") },
        idle: { icon: Check, className: "text-gm-ink-dim", label: t("account.status.idle") },
    }[status];

    const Icon = shown.icon;

    return (
        <p className="text-gm-ink-dim flex items-center gap-2 text-sm">
            <Icon className={`h-4 w-4 shrink-0 ${shown.className}`} aria-hidden="true" />
            <span>{shown.label}</span>
            {pendingCount > 0 && (
                <span className="text-gm-ink-dim">
                    · {t("account.status.pending").replace("{count}", String(pendingCount))}
                </span>
            )}
        </p>
    );
}

function SignInForm({ mode, onDone }: { mode: "signIn" | "register"; onDone: () => void }) {
    const { t } = useLanguage();
    const { signIn, register } = useAuth();
    const describe = useErrorMessage();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        setBusy(true);
        setError(null);

        const result = mode === "register" ? await register(username, password) : await signIn(username, password);

        setBusy(false);
        if (result.ok) onDone();
        else setError(describe(result.code, result.reason));
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor={`${mode}-username`}>{t("account.username")}</Label>
                <Input
                    id={`${mode}-username`}
                    value={username}
                    onChange={event => setUsername(event.target.value)}
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    maxLength={20}
                    required
                />
                {mode === "register" && <p className="text-gm-ink-dim text-xs">{t("account.usernameHint")}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor={`${mode}-password`}>{t("account.password")}</Label>
                <Input
                    id={`${mode}-password`}
                    type="password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    autoComplete={mode === "register" ? "new-password" : "current-password"}
                    minLength={8}
                    required
                />
                {mode === "register" && <p className="text-gm-ink-dim text-xs">{t("account.passwordHint")}</p>}
            </div>

            {mode === "register" && (
                /* Said plainly and up front, because there is no email and therefore no way back. */
                <p className="gm-inset text-gm-gold p-3 text-xs leading-relaxed">{t("account.noRecoveryWarning")}</p>
            )}

            {error && (
                <p role="alert" className="text-gm-coral text-sm">
                    {error}
                </p>
            )}

            <Button type="submit" disabled={busy} className="w-full">
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {mode === "register" ? t("account.registerAction") : t("account.signInAction")}
            </Button>
        </form>
    );
}

function ManageAccount({ onClose }: { onClose: () => void }) {
    const { t } = useLanguage();
    const auth = useAuth();
    const describe = useErrorMessage();

    const [notice, setNotice] = useState<{ tone: "ok" | "bad"; text: string } | null>(null);
    const [busy, setBusy] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    const [newUsername, setNewUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [deletePassword, setDeletePassword] = useState("");

    const run = async (
        action: () => Promise<{ ok: true } | { ok: false; code: string; reason?: string }>,
        successKey: string,
    ) => {
        setBusy(true);
        setNotice(null);
        const result = await action();
        setBusy(false);
        if (result.ok) setNotice({ tone: "ok", text: t(successKey) });
        else setNotice({ tone: "bad", text: describe(result.code, result.reason) });
        return result.ok;
    };

    return (
        <div className="space-y-6">
            <div className="gm-inset space-y-2 p-4">
                <p className="text-gm-ink flex items-center gap-2 font-semibold">
                    <UserRound className="text-gm-grape-hi h-4 w-4" aria-hidden="true" />
                    {auth.username}
                </p>
                <StatusLine />
                <div className="flex flex-wrap gap-2 pt-1">
                    <Button size="sm" variant="outline" onClick={() => void auth.syncNow()} disabled={busy}>
                        <RefreshCw className="h-4 w-4" aria-hidden="true" />
                        {t("account.syncNow")}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={async () => {
                            await auth.signOut();
                            onClose();
                        }}>
                        <LogOut className="h-4 w-4" aria-hidden="true" />
                        {t("account.signOut")}
                    </Button>
                </div>
                {/* Signing out is not a reset, and people assume it might be. */}
                <p className="text-gm-ink-dim text-xs">{t("account.signOutHint")}</p>
            </div>

            {notice && (
                <p role="status" className={notice.tone === "ok" ? "text-gm-lime text-sm" : "text-gm-coral text-sm"}>
                    {notice.text}
                </p>
            )}

            <form
                className="space-y-3"
                onSubmit={async event => {
                    event.preventDefault();
                    const ok = await run(() => auth.changeUsername(newUsername), "account.usernameChanged");
                    if (ok) setNewUsername("");
                }}>
                <Label htmlFor="new-username">{t("account.changeUsername")}</Label>
                <div className="flex gap-2">
                    <Input
                        id="new-username"
                        value={newUsername}
                        onChange={event => setNewUsername(event.target.value)}
                        placeholder={auth.username ?? ""}
                        autoCapitalize="none"
                        spellCheck={false}
                        maxLength={20}
                        required
                    />
                    <Button type="submit" variant="outline" disabled={busy}>
                        {t("account.save")}
                    </Button>
                </div>
            </form>

            <form
                className="space-y-3"
                onSubmit={async event => {
                    event.preventDefault();
                    const ok = await run(
                        () => auth.changePassword(currentPassword, newPassword),
                        "account.passwordChanged",
                    );
                    if (ok) {
                        setCurrentPassword("");
                        setNewPassword("");
                    }
                }}>
                <Label htmlFor="current-password">{t("account.changePassword")}</Label>
                <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={event => setCurrentPassword(event.target.value)}
                    placeholder={t("account.currentPassword")}
                    autoComplete="current-password"
                    required
                />
                <div className="flex gap-2">
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={event => setNewPassword(event.target.value)}
                        placeholder={t("account.newPassword")}
                        autoComplete="new-password"
                        minLength={8}
                        required
                    />
                    <Button type="submit" variant="outline" disabled={busy}>
                        {t("account.save")}
                    </Button>
                </div>
                <p className="text-gm-ink-dim text-xs">{t("account.passwordChangeHint")}</p>
            </form>

            <div className="border-gm-line space-y-3 border-t pt-5">
                <Label className="text-gm-coral">{t("account.dangerZone")}</Label>

                <div className="flex flex-wrap gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={busy}
                        onClick={() => void run(() => auth.resetCloudProgress(), "account.cloudReset")}>
                        {t("account.resetCloud")}
                    </Button>
                </div>
                <p className="text-gm-ink-dim text-xs">{t("account.resetCloudHint")}</p>

                {confirmingDelete ? (
                    <form
                        className="gm-inset space-y-3 p-3"
                        onSubmit={async event => {
                            event.preventDefault();
                            const ok = await run(() => auth.deleteAccount(deletePassword), "account.deleted");
                            if (ok) onClose();
                        }}>
                        <p className="text-gm-ink text-sm">{t("account.deleteConfirm")}</p>
                        <Input
                            type="password"
                            value={deletePassword}
                            onChange={event => setDeletePassword(event.target.value)}
                            placeholder={t("account.password")}
                            autoComplete="current-password"
                            required
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="destructive" size="sm" disabled={busy}>
                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                {t("account.deleteForever")}
                            </Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setConfirmingDelete(false)}>
                                {t("account.cancel")}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <Button
                        size="sm"
                        variant="ghost"
                        className="text-gm-coral"
                        onClick={() => setConfirmingDelete(true)}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        {t("account.deleteAccount")}
                    </Button>
                )}
                <p className="text-gm-ink-dim text-xs">{t("account.deleteHint")}</p>
            </div>
        </div>
    );
}

function AccountDialogBody({ onClose }: { onClose: () => void }) {
    const { t } = useLanguage();
    const { signedIn } = useAuth();

    if (signedIn) {
        return (
            <>
                <DialogHeader>
                    <DialogTitle>{t("account.manageTitle")}</DialogTitle>
                    <DialogDescription>{t("account.manageDescription")}</DialogDescription>
                </DialogHeader>
                <ManageAccount onClose={onClose} />
            </>
        );
    }

    return (
        <>
            <DialogHeader>
                <DialogTitle>{t("account.title")}</DialogTitle>
                <DialogDescription>{t("account.description")}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="signIn">
                <TabsList className="w-full">
                    <TabsTrigger value="signIn" className="flex-1">
                        {t("account.tab.signIn")}
                    </TabsTrigger>
                    <TabsTrigger value="register" className="flex-1">
                        {t("account.tab.register")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="signIn" className="pt-4">
                    <SignInForm mode="signIn" onDone={onClose} />
                </TabsContent>
                <TabsContent value="register" className="pt-4">
                    <SignInForm mode="register" onDone={onClose} />
                </TabsContent>
            </Tabs>

            <DialogFooter>
                <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
                    {t("account.continueWithout")}
                </Button>
            </DialogFooter>
        </>
    );
}

interface AccountContextValue {
    openAccount: () => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

/** Opens the account dialog from anywhere in the layout. */
export function useAccountDialog(): AccountContextValue {
    const context = useContext(AccountContext);
    if (!context) throw new Error("useAccountDialog must be used inside <AccountProvider>");
    return context;
}

/**
 * Mounts one account dialog for the whole app, next to the merge dialog it can raise.
 *
 * When this build has no account API configured the provider still exists — so nothing has to
 * guard against a missing context — but it renders no dialog and `openAccount` does nothing.
 */
export function AccountProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const { enabled } = useAuth();

    return (
        <AccountContext.Provider value={{ openAccount: () => enabled && setIsOpen(true) }}>
            {children}
            {enabled && (
                <>
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogContent className="sm:max-w-md">
                            <AccountDialogBody onClose={() => setIsOpen(false)} />
                        </DialogContent>
                    </Dialog>
                    <MergeDialog />
                </>
            )}
        </AccountContext.Provider>
    );
}
