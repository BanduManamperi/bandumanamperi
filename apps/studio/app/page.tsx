import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LedgerRow } from "@/components/ledger-row";
import { display } from "@/lib/type";

export default function Home() {
    return (
        <>
            <SiteHeader />
            <main className="min-h-0 flex-1 overflow-y-auto">
                {/* The hero sits on the house's own brick wall, edge to edge, ending where the photo begins.
                    A repeating tile rather than one stretched drawing, so bricks keep their size on any screen. */}
                <div className="relative isolate pb-10 lg:pb-16">
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 -z-10 bg-[url('/brick-tile.svg')] bg-[length:24rem_auto] bg-repeat opacity-[0.12]"
                    />
                    <section className="mx-auto w-full max-w-[90rem] px-[clamp(1.25rem,4vw,3rem)] pt-10 lg:pt-16">
                        <div className="grid gap-10 lg:grid-cols-[1fr_16rem] lg:items-start">
                            <div>
                                <p className="text-[0.8125rem] text-muted-foreground">Bandu Manamperi</p>
                                <h1 className={`mt-1 ${display}`}>
                                    Home <span className="font-serif italic">&amp;</span> Studio
                                </h1>
                            </div>
                            <div className="lg:pt-3">
                                <p className="text-[0.8125rem] font-bold text-foreground">Mission &amp; practice:</p>
                                <p className="mt-2 text-[0.8125rem] leading-[1.6] text-muted-foreground">
                                    A home studio in Bandaragama, working across paintings and
                                    drawings, and framing, conservation, and restoration carried
                                    out for other collections.
                                </p>
                                <a
                                    href="#sections"
                                    className="mt-4 inline-flex items-baseline gap-1.5 text-[0.8125rem] text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                                >
                                    See both practices <span aria-hidden>&rarr;</span>
                                </a>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="relative aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[21/9]">
                    <Image
                        src="/IMG_8614.JPG"
                        alt="Bandu Manamperi working over tissue paper in his studio"
                        fill
                        priority
                        className="object-cover object-[30%_40%] grayscale"
                        sizes="100vw"
                    />
                </div>

                <section id="sections" className="mx-auto w-full max-w-[46rem] px-[clamp(1.25rem,4vw,3rem)] py-12 lg:py-16">
                    <LedgerRow
                        number="001"
                        href="/paintings-and-drawings"
                        title="Paintings and Drawings"
                        description="Available and recently sold works. Enquiries are answered directly by the studio."
                    />
                    <LedgerRow
                        number="002"
                        href="/framing-and-restoration"
                        title="Framing and Restoration"
                        description="Custom framing, conservation, and restoration for paintings, works on paper, and sculpture."
                    />
                </section>
            </main>
            <Footer />
        </>
    );
}
