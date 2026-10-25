import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";

export const revalidate = 60;

export const viewport: Viewport = {
    viewportFit: "cover",
};

const notoSans = Noto_Sans({
    variable: "--font-noto-sans",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3002"),
    title: {
        default: "Studio | Bandu Manamperi",
        template: "%s | Studio",
    },
    description: "Works from the studio of Bandu Manamperi. Some are priced, some are not. Enquiries are answered by the studio. Nothing is purchased on this site.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${notoSans.variable} flex min-h-dvh flex-col font-sans antialiased lg:h-dvh lg:overflow-hidden`}>
                {children}
            </body>
        </html>
    );
}
