import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { MONOGRAM_PATH, MONOGRAM_VIEWBOX } from "@/components/brand/monogram";

export const alt = "Bandu Manamperi, contemporary artist, in his studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The link preview is drawn as one spread, like the home page: the monogram
// and name on the left page, the studio photograph on the right.
export default async function OpenGraphImage() {
    const assets = join(process.cwd(), "assets");
    const [light, regular, photo] = await Promise.all([
        readFile(join(assets, "fonts/NotoSans-Light-latin.ttf")),
        readFile(join(assets, "fonts/NotoSans-Regular-latin.ttf")),
        readFile(join(assets, "og-studio.jpg")),
    ]);
    const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    background: "#e9e9e9",
                    color: "#1c1c1c",
                    fontFamily: "Noto Sans",
                    padding: 48,
                    gap: 48,
                }}
            >
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 400 }}>
                    <svg viewBox={MONOGRAM_VIEWBOX} width={180} height={112} fill="#1c1c1c">
                        <path d={MONOGRAM_PATH} />
                    </svg>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ fontSize: 64, fontWeight: 300, lineHeight: 1, letterSpacing: -1 }}>Bandu</div>
                        <div style={{ fontSize: 64, fontWeight: 300, lineHeight: 1, letterSpacing: -1 }}>Manamperi</div>
                        <div style={{ marginTop: 24, fontSize: 22, fontWeight: 400, color: "#6b6b6b" }}>
                            Contemporary artist, Sri Lanka
                        </div>
                    </div>
                </div>
                <img src={photoSrc} alt="" width={656} height={534} style={{ objectFit: "cover", objectPosition: "30% 40%" }} />
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: "Noto Sans", data: light, weight: 300, style: "normal" },
                { name: "Noto Sans", data: regular, weight: 400, style: "normal" },
            ],
        }
    );
}
