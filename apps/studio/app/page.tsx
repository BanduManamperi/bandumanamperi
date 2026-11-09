import Image from "next/image";
import { StudioFrame } from "@/components/studio-frame";

// The landing page is a single framed view of the house: two pictures side by
// side, between the frame's two rows of links.

// Placeholders until the studio is photographed for this page: one view of a
// work on the wall, one of the rooms. Give each a `src` to replace it. The site
// is black and white, so the pictures are shown in grayscale.
const VIEWS: { src?: string; alt: string; tone: string }[] = [
    { alt: "A work hanging in the studio", tone: "bg-[#d4d4d4]" },
    { alt: "A room of the house", tone: "bg-[#8a8a8a]" },
];

export default function Home() {
    return (
        <StudioFrame className="grid grid-cols-2">
            <h1 className="sr-only">Bandu Manamperi Home &amp; Studio</h1>
            {VIEWS.map((view) => (
                <div key={view.alt} className={`relative overflow-hidden ${view.tone}`}>
                    {view.src ? (
                        <Image src={view.src} alt={view.alt} fill priority className="object-cover grayscale" sizes="50vw" />
                    ) : (
                        <p className="absolute inset-x-0 bottom-3 text-center text-[0.6875rem] uppercase tracking-[0.08em] text-foreground/60">
                            Placeholder: {view.alt.toLowerCase()}
                        </p>
                    )}
                </div>
            ))}
        </StudioFrame>
    );
}
