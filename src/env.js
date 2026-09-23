import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    /**
     * Specify your server-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars.
     */
    server: {
        NODE_ENV: z.string().optional(),
    },

    /**
     * Specify your client-side environment variables schema here. This way you can ensure the app
     * isn't built with invalid env vars. To expose them to the client, prefix them with
     * `NEXT_PUBLIC_`.
     */
    client: {
        NEXT_PUBLIC_DEBUG_MODE: z.boolean().optional(),
        NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: z.string().optional(),
        /**
         * Base URL of the optional account Worker, e.g. https://gitmastery-accounts.<sub>.workers.dev
         *
         * Public by nature — it is an API endpoint the browser calls, so it ends up in the static
         * bundle either way. Leave it unset and the account feature is simply absent: no sign-in
         * button, no network calls, and the game behaves exactly as it did before accounts existed.
         *
         * Nothing secret may ever gain a NEXT_PUBLIC_ prefix. Under `output: "export"` there is no
         * server at runtime, so every one of these is inlined into files served to the public.
         */
        NEXT_PUBLIC_ACCOUNT_API_URL: z.string().url().optional(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        NEXT_PUBLIC_DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === "true",
        NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN: process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN,
        NEXT_PUBLIC_ACCOUNT_API_URL: process.env.NEXT_PUBLIC_ACCOUNT_API_URL,
    },
    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
    /**
     * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
     * `SOME_VAR=''` will throw an error.
     */
    emptyStringAsUndefined: true,
});
