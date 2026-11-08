// The studio: Manamperi's home studio in Bandaragama, and its own site, which
// handles works for sale and framing and restoration enquiries.

/** The studio site. NEXT_PUBLIC_STUDIO_URL points it at a local build in development. */
export const STUDIO_URL = (process.env.NEXT_PUBLIC_STUDIO_URL || "https://studio.bandumanamperi.com").replace(/\/$/, "");

/** The studio site's address as shown to readers, without the scheme. */
export const STUDIO_HOST = new URL(STUDIO_URL).host;

/** A page on the studio site, e.g. studioUrl("/framing-and-restoration"). */
export function studioUrl(path = "/") {
    return `${STUDIO_URL}${path}`;
}

// The studio's Google business listing, and the coordinates of its pin there.
// Google finds the listing by name; Apple Maps has no listing, so it gets a
// named pin at the same spot.
const STUDIO_PLACE = "Bandu Manamperi's Home & Studio";
const STUDIO_COORDS = "6.7201115,79.9979091";

export const STUDIO_MAPS = {
    google: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STUDIO_PLACE)}`,
    apple: `https://maps.apple.com/?ll=${STUDIO_COORDS}&z=16&q=${encodeURIComponent(STUDIO_PLACE)}`,
};
