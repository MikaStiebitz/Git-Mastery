import type { MetadataRoute } from "next";
import { getPageUrl } from "~/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/", "/private/"],
        },
        sitemap: getPageUrl("/sitemap.xml"),
    };
}
