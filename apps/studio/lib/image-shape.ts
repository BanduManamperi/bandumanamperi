import { cache } from "react";

// The shape of a work's photograph, read from the head of the image file
// itself: most works have no recorded dimensions, and the page lays a
// landscape work out differently from a portrait one.

export type Shape = "landscape" | "portrait";

/** The photograph's shape, and its width over its height when it could be read. */
export type Proportion = { shape: Shape; ratio: number | null };

const UNREAD: Proportion = { shape: "landscape", ratio: null };

/** Wider than this is laid out as a landscape; squarer works hang like portraits. */
const LANDSCAPE_RATIO = 1.2;

/** Enough of the file to pass the EXIF block (and its thumbnail) to the frame header. */
const HEAD_BYTES = 256 * 1024;

type Size = { width: number; height: number };

function jpegOrientation(view: DataView, start: number, end: number): number | null {
    // APP1: "Exif\0\0", then a TIFF header whose first directory may hold tag 0x0112.
    // Other APP1 blocks (XMP, from editing software) carry no orientation here.
    if (view.getUint32(start) !== 0x45786966) return null;
    const tiff = start + 6;
    if (tiff + 8 > end) return 1;
    const little = view.getUint16(tiff) === 0x4949;
    const dir = tiff + view.getUint32(tiff + 4, little);
    if (dir + 2 > end) return 1;
    const entries = view.getUint16(dir, little);
    for (let i = 0; i < entries; i++) {
        const entry = dir + 2 + i * 12;
        if (entry + 12 > end) break;
        if (view.getUint16(entry, little) === 0x0112) return view.getUint16(entry + 8, little);
    }
    return 1;
}

function jpegSize(view: DataView): Size | null {
    let orientation = 1;
    let i = 2;
    while (i + 9 < view.byteLength) {
        if (view.getUint8(i) !== 0xff) return null;
        const marker = view.getUint8(i + 1);
        if (marker === 0xff) {
            i += 1;
            continue;
        }
        const length = view.getUint16(i + 2);
        if (marker === 0xe1) {
            orientation = jpegOrientation(view, i + 4, Math.min(i + 2 + length, view.byteLength)) ?? orientation;
        }
        // Start-of-frame markers, apart from DHT (C4), JPG (C8) and DAC (CC).
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
            const height = view.getUint16(i + 5);
            const width = view.getUint16(i + 7);
            // Orientations 5 to 8 are turned a quarter, and browsers show them turned.
            return orientation >= 5 ? { width: height, height: width } : { width, height };
        }
        i += 2 + length;
    }
    return null;
}

function webpSize(view: DataView): Size | null {
    const chunk = view.getUint32(12);
    if (chunk === 0x56503858 /* VP8X */) {
        const w = 1 + (view.getUint8(24) | (view.getUint8(25) << 8) | (view.getUint8(26) << 16));
        const h = 1 + (view.getUint8(27) | (view.getUint8(28) << 8) | (view.getUint8(29) << 16));
        return { width: w, height: h };
    }
    if (chunk === 0x56503820 /* VP8 */) {
        return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    }
    if (chunk === 0x5650384c /* VP8L */) {
        const bits = view.getUint32(21, true);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    return null;
}

function sizeOf(bytes: ArrayBuffer): Size | null {
    const view = new DataView(bytes);
    if (view.byteLength < 30) return null;
    if (view.getUint16(0) === 0xffd8) return jpegSize(view);
    if (view.getUint32(0) === 0x89504e47) return { width: view.getUint32(16), height: view.getUint32(20) };
    if (view.getUint32(0) === 0x52494646 && view.getUint32(8) === 0x57454250) return webpSize(view);
    return null;
}

/** Landscape or portrait, from the photograph; landscape when it cannot be read. */
export const getProportion = cache(async (src: string | undefined): Promise<Proportion> => {
    if (!src) return UNREAD;
    try {
        // Uploaded files are never replaced in place, so the answer keeps.
        const response = await fetch(src, { headers: { Range: `bytes=0-${HEAD_BYTES - 1}` }, cache: "force-cache" });
        if (!response.ok) return UNREAD;
        const size = sizeOf(await response.arrayBuffer());
        if (!size || !size.width || !size.height) return UNREAD;
        const ratio = size.width / size.height;
        return { shape: ratio >= LANDSCAPE_RATIO ? "landscape" : "portrait", ratio };
    } catch {
        return UNREAD;
    }
});
