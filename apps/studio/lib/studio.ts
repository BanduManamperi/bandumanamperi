// The studio's own address, for every way of writing to it from the site.
export const STUDIO_EMAIL = "bandumanamperi@yahoo.com";

/** A mail link to the studio with its subject filled in. */
export function mailStudio(subject: string): string {
    return `mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
