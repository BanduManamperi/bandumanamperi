import { Fragment } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { StudioFrame } from "@/components/studio-frame";

export const metadata: Metadata = {
    title: "About",
    description:
        "The home and working studio of Sri Lankan contemporary artist Bandu Manamperi in Bandaragama, Sri Lanka, bringing together his artistic practice and his work in framing, conservation and restoration.",
};

// Set like a collection sheet, as in the catalogue: small monospaced capitals, widely spaced.
const label = "font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-foreground/75";
const body = "text-[0.9375rem] leading-relaxed text-foreground/80";
/** Paragraphs of an entry, set to a comfortable measure. */
const prose = `max-w-[38rem] space-y-4 ${body}`;
const link =
    "inline-block text-[0.875rem] font-medium text-foreground underline decoration-foreground/40 underline-offset-[5px] transition-colors hover:decoration-foreground";

/** Facts set like a wall label: the name in small capitals, the value beside it. */
function Facts({ items }: { items: [string, string][] }) {
    return (
        <dl className="grid grid-cols-[9.5rem_minmax(0,1fr)] items-baseline gap-x-4 gap-y-2.5">
            {items.map(([name, value]) => (
                <Fragment key={name}>
                    <dt className={label}>{name}</dt>
                    <dd className="text-[0.8125rem] leading-relaxed text-foreground/85">{value}</dd>
                </Fragment>
            ))}
        </dl>
    );
}

/**
 * One numbered entry: the number and its name on the left, as in the
 * catalogue, and the entry beside them. On a phone the entry runs the full
 * width beneath the two, so the longer ones are not squeezed into a column.
 */
function Entry({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
    return (
        <li className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 border-t border-foreground/15 py-[clamp(1.75rem,3.5vw,2.75rem)] lg:grid-cols-[3.5rem_15rem_minmax(0,1fr)] lg:gap-x-8">
            <span className={`${label} tabular-nums`}>{number}</span>
            <h2 className={`${label} text-foreground`}>{title}</h2>
            <div className="col-span-2 mt-5 lg:col-span-1 lg:col-start-3 lg:row-start-1 lg:mt-0">{children}</div>
        </li>
    );
}

// About the home and studio: a sheet ruled like the catalogue's, opening on
// one serif sentence, with the artistic practice, the framing and
// conservation work, the house, and the artist as numbered entries beneath it.
export default function About() {
    return (
        <StudioFrame current="/about" className="overflow-y-auto">
            <div className="py-[clamp(2rem,5vw,4rem)]">
                <header className="flex items-end justify-between gap-6 border-b border-foreground/60 pb-6">
                    <h1 className="font-mono text-[clamp(1.5rem,2.6vw,2.25rem)] font-normal uppercase leading-[1.1] tracking-[0.14em] text-foreground">About</h1>
                    <p className={`${label} shrink-0 text-right text-[0.625rem] leading-relaxed`}>
                        Bandaragama
                        <br />
                        Sri Lanka
                    </p>
                </header>

                <section aria-label="The home and studio" className="py-[clamp(2.5rem,6vw,5rem)] lg:pl-[calc(3.5rem+2rem)]">
                    <p className="max-w-[48rem] font-serif text-[clamp(1.5rem,2.5vw,2.25rem)] leading-[1.18] tracking-[-0.01em] text-foreground">
                        Bandu Manamperi Home &amp; Studio is the home and working studio of Sri Lankan contemporary artist Bandu Manamperi, located in
                        Bandaragama, Sri Lanka.
                    </p>
                    <div className={`mt-6 ${prose}`}>
                        <p>
                            The studio brings together his artistic practice and his work in framing, conservation and restoration. It is a place where new
                            works are created and existing works are carefully preserved.
                        </p>
                        <p>
                            Housed in a distinctive brick building designed by architect Nandana Karunasena, the studio reflects a close relationship between
                            art, craftsmanship, architecture and the surrounding environment.
                        </p>
                    </div>
                </section>

                <ol>
                    <Entry number="001" title="Artistic practice">
                        <div className={prose}>
                            <p>
                                Bandu Manamperi&rsquo;s artistic practice spans painting, drawing, performance and installation. His work explores questions of
                                identity, conflict and human experience, and has been exhibited in Sri Lanka and internationally.
                            </p>
                            <p>
                                The studio provides a space for the development of his paintings and drawings, alongside the experimentation and material
                                exploration that inform his wider practice.
                            </p>
                        </div>
                    </Entry>

                    <Entry number="002" title="Framing, conservation and restoration">
                        <div className={prose}>
                            <p>
                                Alongside his artistic practice, Manamperi has developed specialist experience in the framing, conservation and restoration of
                                artworks.
                            </p>
                            <p>
                                With training in mural and painting conservation, as well as stone conservation through UNESCO, he works with artists, collectors
                                and institutions on the preservation and presentation of artworks.
                            </p>
                            <p>
                                The studio undertakes custom framing, conservation and restoration for paintings, works on paper and sculpture, combining practical
                                craftsmanship with an understanding of artistic materials.
                            </p>
                        </div>
                    </Entry>

                    <Entry number="003" title="The home and its architecture">
                        <figure className="max-w-[44rem]">
                            <div className="relative aspect-[1179/710] w-full overflow-hidden bg-border">
                                <Image
                                    src="/house-exterior.jpg"
                                    alt="The brick house in Bandaragama, surrounded by palm trees and dense garden"
                                    fill
                                    className="object-cover grayscale"
                                    sizes="(min-width: 64rem) 44rem, 100vw"
                                />
                            </div>
                        </figure>

                        <div className={`mt-8 ${prose}`}>
                            <p>
                                The studio is housed within a residence designed by Sri Lankan architect Nandana Karunasena and completed in 2005.
                            </p>
                            <p>
                                Built on a modest six perch plot in Bandaragama, the house was conceived in response to a limited construction budget and the
                                challenges of Sri Lanka&rsquo;s tropical climate.
                            </p>
                            <p>
                                Much of the building was constructed using reclaimed materials, including bricks, timber, roof tiles, doors and windows salvaged
                                from a Dutch period house near Hikkaduwa. These materials were given new purpose through an architectural approach that values
                                resourcefulness and simplicity.
                            </p>
                            <p>
                                The house also makes use of natural ventilation and passive cooling. Open living spaces encourage airflow, while the surrounding
                                vegetation and a pond help cool the air entering the building.
                            </p>
                            <p>Rather than separating the house from its surroundings, the design allows the architecture and environment to work together.</p>
                            <p>
                                Today, the house continues to serve as both a residence and a working studio, bringing everyday life, artistic production and
                                craftsmanship into a shared space.
                            </p>
                        </div>

                        {/* The smaller photograph hangs with the house's details beside it, low, like a work and its label. */}
                        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-8">
                            <figure className="w-[12rem] shrink-0">
                                <div className="relative aspect-[592/711] w-full overflow-hidden bg-border">
                                    <Image
                                        src="/house-pond.jpg"
                                        alt="A brick column and reflecting pond beneath the house's open verandah"
                                        fill
                                        className="object-cover grayscale"
                                        sizes="12rem"
                                    />
                                </div>
                            </figure>
                            <section aria-labelledby="architectural-details" className="min-w-0 max-w-[28rem]">
                                <h3 id="architectural-details" className={`${label} text-foreground`}>
                                    Architectural details
                                </h3>
                                <div className="mt-4">
                                    <Facts
                                        items={[
                                            ["Architect", "Nandana Karunasena"],
                                            ["Architectural firm", "Nandana Karunasena Associates"],
                                            ["Location", "Bandaragama, Sri Lanka"],
                                            ["Completed", "September 2005"],
                                            ["Site area", "6 perches"],
                                            ["Floor area", "1,200 sq. ft."],
                                            ["Published in", "The Architect"],
                                            ["Article", "Prasadini Nanayakkara"],
                                            ["Photography", "Menaka Aravinda"],
                                        ]}
                                    />
                                </div>
                            </section>
                        </div>
                    </Entry>

                    <Entry number="004" title="About the artist">
                        <div className={prose}>
                            <p>
                                Bandu Manamperi is a Sri Lankan contemporary artist and a founding member and Vice Chairman of the Theertha International
                                Artists&rsquo; Collective.
                            </p>
                            <p>
                                His artistic career encompasses painting, drawing, performance and installation, with exhibitions and projects across South Asia,
                                Europe and Australia.
                            </p>
                            <p>His complete biography, exhibition history and curriculum vitae are available on his artist website.</p>
                        </div>
                        <a href="https://bandumanamperi.com/about" className={`mt-6 ${link}`}>
                            Read the biography and CV <span aria-hidden="true">→</span>
                        </a>
                    </Entry>
                </ol>

                {/* The dark rule closes the last entry, as the one under the title opens the first. */}
                <hr className="border-foreground/60" />
            </div>
        </StudioFrame>
    );
}
