import type { Metadata, Viewport } from "next";
import { Noto_Sans, Fraunces, Anton, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

export const revalidate = 60;

export const viewport: Viewport = {
    viewportFit: "cover",
};

const notoSans = Noto_Sans({
    variable: "--font-noto-sans",
    subsets: ["latin"],
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
            <body className={`${notoSans.variable} ${fraunces.variable} ${anton.variable} ${plexMono.variable} flex min-h-dvh flex-col font-sans antialiased lg:h-dvh lg:overflow-hidden`}>
                {children}
            </body>
        </html>
    );
}
