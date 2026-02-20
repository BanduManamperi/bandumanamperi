import type { Metadata } from "next";
import { Lora, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navBar/navbar";
import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/footer/footer";
import Provider from "@/components/provider";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
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
          className={`${lora.variable} ${playfairDisplay.variable} font-serif antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="pt-14 sm:pt-16">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </Provider>
    </html>
  );
}
