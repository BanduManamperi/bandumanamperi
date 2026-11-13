import type { Metadata, Viewport } from "next";
import { Noto_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Toaster } from "@/components/ui/sonner";
import Provider from "@/components/provider";

export const revalidate = 60;

export const viewport: Viewport = {
  viewportFit: "cover",
};

// One family for the whole site; the BM monogram is drawn from its Light (300) cut.
const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: "Bandu Manamperi | Contemporary Artist & Art Restoration",
    template: "%s | Bandu Manamperi"
  },
  description: "Explore the captivating artworks, exhibitions, and art restoration services by Bandu Manamperi. A contemporary Sri Lankan artist specializing in paintings, sculptures, and traditional art framing.",
  keywords: ["Bandu Manamperi", "contemporary art", "Sri Lankan artist", "art restoration", "art framing", "paintings", "sculptures", "exhibitions", "art gallery"],
  authors: [{ name: "Bandu Manamperi" }],
  creator: "Bandu Manamperi",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Bandu Manamperi",
    title: "Bandu Manamperi | Contemporary Artist & Art Restoration",
    description: "Explore the captivating artworks, exhibitions, and art restoration services by Bandu Manamperi. A contemporary Sri Lankan artist specializing in paintings, sculptures, and traditional art framing.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bandu Manamperi | Contemporary Artist & Art Restoration",
    description: "Explore the captivating artworks, exhibitions, and art restoration services by Bandu Manamperi.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Provider>
        <body
          className={`${notoSans.variable} font-sans antialiased overflow-hidden`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <HorizontalScroll>
              {children}
            </HorizontalScroll>
            <Toaster />
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
