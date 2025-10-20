// src/commands/git/GudCommand.ts
import type { Command, CommandArgs, CommandContext } from "../base/Command";

export class GudCommand implements Command {
    name = "git gud";
    description = "???";
    usage = "git gud";
    examples = ["git gud"];
    includeInTabCompletion = false; // Keep it secret!
    supportsFileCompletion = false;

    execute(_args: CommandArgs, context: CommandContext): string[] {
        const { progressManager } = context;

        const isFirstTime = !progressManager.hasActivatedGitGud();

        if (isFirstTime) {
            // First time activation - give bonus and show special message
            progressManager.activateGitGud();

            return [
                "",
                "╔═══════════════════════════════════════════════════════════╗",
                "║                                                           ║",
                "║          🎮  G I T   G U D   A C H I E V E D  🎮          ║",
                "║                                                           ║",
                "║  ═══════════════════════════════════════════════════════  ║",
                "║                                                           ║",
                "║     You discovered the legendary Easter Egg command!      ║",
                "║                                                           ║",
                "║              ⚡ +50 BONUS POINTS UNLOCKED! ⚡              ║",
                "║                                                           ║",
                "║  ═══════════════════════════════════════════════════════  ║",
                "║                                                           ║",
                "║   In the world of gaming, 'git gud' means 'get good'...  ║",
                "║   But you? You're already a Git legend! 😎               ║",
                "║                                                           ║",
                "║   Fun fact: This is the only Git command that doesn't    ║",
                "║   actually exist... but maybe it should! 💪               ║",
                "║                                                           ║",
                "║  ═══════════════════════════════════════════════════════  ║",
                "║                                                           ║",
                "║          May your commits be clean and your              ║",
                "║          merges conflict-free! 🚀                         ║",
                "║                                                           ║",
                "╚═══════════════════════════════════════════════════════════╝",
                "",
            ];
        } else {
            // Already activated - show different messages
            const messages = [
                [
                    "",
                    "🎮 You're already gud! 🎮",
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                    "The bonus has already been claimed.",
                    "But hey, you can type this as many times as you want!",
                    "It's your secret victory dance. 💃",
                    "",
                ],
                [
                    "",
                    "🏆 Still gud, still going! 🏆",
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                    "You already got the +50 points,",
                    "but we appreciate the enthusiasm! 😄",
                    "",
                ],
                [
                    "",
                    "✨ Git Gud Mode: ACTIVE ✨",
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                    "Reminder: You're crushing it!",
                    "Keep learning, keep growing! 🚀",
                    "",
                ],
                [
                    "",
                    "🎯 Pro Tip 🎯",
                    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
                    "When stuck on a level:",
                    "1. Read the task carefully",
                    "2. Try 'git help'",
                    "3. Remember: git gud 😉",
                    "",
                ],
            ];

            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            return randomMessage!;
        }
    }
}
