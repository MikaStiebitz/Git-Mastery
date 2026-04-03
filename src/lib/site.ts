const defaultSiteUrl = "https://gitmastery.me";

export function getSiteUrl() {
    return process.env.SITE_URL?.replace(/\/$/, "") ?? defaultSiteUrl;
}

export function getPageUrl(pathname = "") {
    const siteUrl = getSiteUrl();
    const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
    return `${siteUrl}${normalizedPath}`;
}
