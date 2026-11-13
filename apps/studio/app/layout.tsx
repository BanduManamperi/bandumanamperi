import type { Metadata, Viewport } from "next";
import { Noto_Sans, Noto_Sans_Sinhala, Noto_Serif_Sinhala, Fraunces, Anton, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

export const revalidate = 60;

export const viewport: Viewport = {
    viewportFit: "cover",
};

const notoSans = Noto_Sans({
    variable: "--font-noto-sans",
    subsets: ["latin"],
});

// Titles and notes are often part Sinhala, which none of the faces above
// carry. These step in for those letters only, so every reader sees the same
// Sinhala instead of whatever their system has. They load only on a page that
// uses them.
const sansSinhala = Noto_Sans_Sinhala({
    variable: "--font-sans-sinhala",
    subsets: ["sinhala"],
    preload: false,
});

const serifSinhala = Noto_Serif_Sinhala({
    variable: "--font-serif-sinhala",
    subsets: ["sinhala"],
    preload: false,
});

// The one serif moment: the wordmark, and the ampersand in the big
// headlines. Everywhere else is set in Anton or Noto Sans.
const fraunces = Fraunces({
    variable: "--font-fraunces",
    style: ["normal", "italic"],
    subsets: ["latin"],
});

// The page headlines: tall, condensed, heavy - the loudest thing on the
// page, used once per page and nowhere else.
const anton = Anton({
    variable: "--font-anton",
    weight: "400",
    subsets: ["latin"],
});

// The catalogue's labels: titles and numbers set like a collection sheet.
const plexMono = IBM_Plex_Mono({
    variable: "--font-plex-mono",
    weight: ["400", "500"],
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
    title: {
        default: "Bandu Manamperi Home & Studio",
        template: "%s | Bandu Manamperi Home & Studio",
    },
    description: "Bandu Manamperi Home & Studio, Bandaragama, Sri Lanka: paintings and drawings, and framing and restoration, under one roof.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${notoSans.variable} ${fraunces.variable} ${anton.variable} ${plexMono.variable} ${sansSinhala.variable} ${serifSinhala.variable} flex min-h-dvh flex-col font-sans antialiased lg:h-dvh lg:overflow-hidden`}>
                {children}
            </body>
        </html>
    );
}
