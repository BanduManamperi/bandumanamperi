import type { Metadata } from "next";
import { StudioFrame } from "@/components/studio-frame";
import { mailStudio } from "@/lib/studio";

export const metadata: Metadata = {
    title: "Framing and Restoration",
    description: "Custom framing, conservation, and restoration for paintings, works on paper, and sculpture, from Bandu Manamperi Home & Studio. Coming soon.",
};

// Set like a collection sheet, as in the catalogue: small monospaced capitals, widely spaced.
const label = "font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-foreground/75";

const SERVICES = [
    {
        number: "001",
        title: "Custom framing",
        description: "Paintings, works on paper, and photographs, framed to suit the piece rather than off a standard size.",
    },
    {
        number: "002",
        title: "Conservation and restoration",
        description: "Paintings, works on paper, and sculpture, cleaned, stabilised, and restored after age, handling, and the Sri Lankan climate.",
    },
];

// Framing and restoration, before it opens here: a sheet ruled like the
// catalogue's, with the notice set low on the left like a wall label and
// the two services it will cover listed beside it.
export default function FramingAndRestorationPage() {
    return (
        <StudioFrame current="/framing-and-restoration" className="overflow-y-auto">
            <div className="flex min-h-full flex-col py-[clamp(2rem,5vw,4rem)]">
                <header className="flex items-end justify-between gap-6 border-b border-foreground/60 pb-6">
                    <h1 className="font-mono text-[clamp(1.5rem,2.6vw,2.25rem)] font-normal uppercase leading-[1.1] tracking-[0.14em] text-foreground">
                        Framing and Restoration
                    </h1>
                    <p className={`${label} shrink-0 text-right text-[0.625rem] leading-relaxed`}>
                        Bandaragama
                        <br />
                        Sri Lanka
                    </p>
                </header>

                <div className="grid flex-1 content-end gap-x-[clamp(2rem,4vw,4rem)] gap-y-14 pt-[clamp(3rem,8vh,6rem)] lg:grid-cols-2 lg:items-end">
                    <section aria-labelledby="notice">
                        <h2 id="notice" className="font-serif text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.02] tracking-[-0.015em] text-foreground">
                            Coming soon
                        </h2>
                        <p className="mt-5 max-w-[30rem] text-[0.9375rem] leading-relaxed text-foreground/80">
                            This page is being prepared. Until it opens, framing and restoration enquiries go to the studio by email.
                        </p>
                        <a
                            href={mailStudio("Framing and restoration")}
                            className="mt-8 inline-block text-[0.875rem] font-medium text-foreground underline decoration-foreground/40 underline-offset-[5px] transition-colors hover:decoration-foreground"
                        >
                            Write to the studio →
                        </a>
                    </section>

                    <ol aria-label="Services" className="border-b border-foreground/15 lg:max-w-[34rem] lg:justify-self-end">
                        {SERVICES.map((service) => (
                            <li key={service.number} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-foreground/15 py-5">
                                <span className={`${label} tabular-nums`}>{service.number}</span>
                                <div>
                                    <h3 className={`${label} text-foreground`}>{service.title}</h3>
                                    <p className="mt-2 text-[0.8125rem] leading-relaxed text-foreground/75">{service.description}</p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                <hr className="mt-[clamp(3rem,6vw,5rem)] border-foreground/60" />
            </div>
        </StudioFrame>
    );
}
