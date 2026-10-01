import {
    Award,
    Crown,
    EyeOff,
    Flag,
    Footprints,
    Gamepad2,
    GraduationCap,
    Layers,
    Medal,
    Rocket,
    Sparkles,
    Sprout,
    Star,
    Target,
    Trophy,
    Zap,
    type LucideIcon,
} from "lucide-react";
import type { AchievementId } from "~/lib/achievements";

/** One icon per achievement, shared by the achievements section and the leaderboard. */
export const ACHIEVEMENT_ICONS: Record<AchievementId, LucideIcon> = {
    "first-step": Footprints,
    "getting-going": Rocket,
    halfway: Flag,
    completionist: Trophy,
    "stage-clear": Layers,
    "beginner-course": Sprout,
    "advanced-course": Zap,
    "pro-course": GraduationCap,
    flawless: Star,
    perfectionist: Target,
    "flawless-stage": Sparkles,
    "star-collector": Award,
    "arcade-regular": Gamepad2,
    maintainer: Medal,
    "git-legend": Crown,
    "git-gud": EyeOff,
};

/** The ids in display order. Kept in step with the Worker by `achievements-parity.test.ts`. */
export const ACHIEVEMENT_ORDER = Object.keys(ACHIEVEMENT_ICONS) as AchievementId[];
