import type { Metadata } from "next";
import { Lora, Playfair_Display, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navBar/navbar";
import { HorizontalScroll } from "@/components/horizontal-scroll";
import { Toaster } from "@/components/ui/sonner";
import Provider from "@/components/provider";

export const revalidate = 60;

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
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
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bandu Manamperi - Contemporary Artist",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bandu Manamperi | Contemporary Artist & Art Restoration",
    description: "Explore the captivating artworks, exhibitions, and art restoration services by Bandu Manamperi.",
    images: ["/twitter-image.jpg"],
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
          className={`${lora.variable} ${playfairDisplay.variable} ${bodoniModa.variable} font-serif antialiased overflow-hidden`}
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
            <Navbar />
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
