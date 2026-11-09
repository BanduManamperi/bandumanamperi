import type { Metadata } from "next";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LedgerPage } from "@/components/ledger-page";
import { display, heading, body, caption, Facts, TextLink } from "@/lib/type";

export const metadata: Metadata = {
    title: "About",
    description: "Bandu Manamperi Home & Studio, Bandaragama, Sri Lanka: paintings and drawings, and framing and restoration, under one roof.",
};

export default function About() {
    return (
        <>
            <SiteHeader section="about" />
            <LedgerPage wide>
                <h1 className={display}>About</h1>

                <p className={`mt-8 max-w-[42rem] ${body}`}>
                    Bandu Manamperi Home &amp; Studio is where the artist lives and
                    works, in Bandaragama. It houses two practices: the paintings and
                    drawings that make up his own body of work, and a long-running
                    practice of framing, conservation, and restoration carried out for
                    museums, collectors, and other artists.
                </p>

                <div className="mt-12">
                    <div className="h-2 bg-foreground" />

                    <section className="grid gap-4 pt-10 lg:grid-cols-[14rem_1fr] lg:gap-12">
                        <h2 className={heading}>Paintings and drawings</h2>
                        <p className={`max-w-[34rem] ${body}`}>
                            A practice that moves across media to confront identity,
                            conflict, and the complexities of human nature, alongside
                            performance and installation work shown across South Asia,
                            Europe, and Australia.
                        </p>
                    </section>

                    <div className="my-10 h-2 bg-foreground" />

                    <section className="grid gap-4 pt-10 lg:grid-cols-[14rem_1fr] lg:gap-12">
                        <h2 className={heading}>Framing and restoration</h2>
                        <p className={`max-w-[34rem] ${body}`}>
                            Manamperi is trained in the conservation of murals and
                            paintings, and in stone conservation through UNESCO. The
                            studio takes on restoration, conservation, and custom
                            framing for paintings, works on paper, and sculpture.
                        </p>
                    </section>

                    <div className="my-10 h-2 bg-foreground" />

                    <section className="grid gap-6 pt-10 lg:grid-cols-[14rem_1fr] lg:gap-12">
                        <h2 className={heading}>The house</h2>

                        <div>
                            <figure>
                                <div className="relative aspect-[1179/710] w-full max-w-[34rem] overflow-hidden bg-border">
                                    <Image
                                        src="/house-exterior.jpg"
                                        alt="The brick house in Bandaragama, surrounded by palm trees and dense garden"
                                        fill
                                        className="object-cover grayscale"
                                        sizes="(min-width: 64rem) 34rem, 100vw"
                                    />
                                </div>
                            </figure>

                            <p className={`mt-6 max-w-[34rem] ${body}`}>
                                The studio sits inside a small brick house in
                                Bandaragama, built in 2004&ndash;05 by architect
                                Nandana Karunasena on a modest six-perch plot. Much
                                of its material was reclaimed rather than new:
                                brick, roof tile, timber, doors, and a spiral
                                staircase salvaged from a late Dutch-period house
                                demolished for road widening near Hikkaduwa.
                            </p>
                            <p className={`mt-4 max-w-[34rem] ${body}`}>
                                Its walls are built lower than the colonial-derived
                                standard, scaled instead to a Sri Lankan body,
                                cutting both material and the volume that needs
                                cooling. A near wall-less plan opens the house to
                                cross-ventilation, and clearings in the dense
                                garden funnel wind across a pond before it reaches
                                the living spaces, the water&rsquo;s evaporation
                                taking the heat out of the air. Karunasena has
                                described the result as a house &ldquo;derived from
                                and intertwined with the environment.&rdquo;
                            </p>

                            <figure className="mt-6 max-w-[14rem]">
                                <div className="relative aspect-[592/711] w-full overflow-hidden bg-border">
                                    <Image
                                        src="/house-pond.jpg"
                                        alt="A brick column and reflecting pond beneath the house's open verandah"
                                        fill
                                        className="object-cover grayscale"
                                        sizes="14rem"
                                    />
                                </div>
                            </figure>

                            <Facts
                                className="mt-6"
                                labelWidth="5.5rem"
                                items={[
                                    { label: "Architect", value: "Nandana Karunasena, Nandana Karunasena Associates" },
                                    { label: "Completed", value: "2005" },
                                    { label: "Site", value: "6 perches, Bandaragama" },
                                ]}
                            />
                            <p className={`mt-4 max-w-[34rem] ${caption}`}>
                                Photographs and architectural detail as featured in
                                The Architect magazine, writing by Prasadini
                                Nanayakkara, photography by Menaka Aravinda. Used
                                with permission.
                            </p>
                        </div>
                    </section>
                </div>

                <Facts
                    className="mt-12 max-w-[42rem]"
                    items={[
                        { label: "Studio", value: "Bandaragama, Sri Lanka" },
                        { label: "Collective", value: "Theertha International Artists' Collective, founding member and Vice Chairman" },
                    ]}
                />

                <TextLink href="https://bandumanamperi.com/about" className="mt-8 inline-block">
                    Read the full biography and CV
                </TextLink>
            </LedgerPage>
            <Footer />
        </>
    );
}
