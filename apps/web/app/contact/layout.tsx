import { Metadata } from "next";
import { ScrollablePanel } from "@/components/scrollable-panel";

export const metadata: Metadata = {
    title: "Contact",
    description: "Get in touch with Bandu Manamperi for inquiries about artworks, exhibitions, restoration services, or collaborations. Studio based in Colombo, Sri Lanka.",
    openGraph: {
        title: "Contact | Bandu Manamperi",
        description: "Get in touch with Bandu Manamperi for inquiries about artworks, exhibitions, restoration services, or collaborations.",
        type: "website",
    },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <ScrollablePanel>{children}</ScrollablePanel>
}
