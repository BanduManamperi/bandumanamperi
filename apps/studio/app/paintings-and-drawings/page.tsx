import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StudioFrame } from "@/components/studio-frame";
import { getInventory } from "@/lib/inventory";

export const metadata: Metadata = {
    title: "Paintings and Drawings",
    description: "The catalogue of paintings, mixed media, and works on paper by Bandu Manamperi.",
};

// Set like a collection sheet: small monospaced capitals, widely spaced.
const label = "font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-foreground/75";

// The catalogue: every work as a plate with its title and catalogue number,
// between two rules, inside the studio frame.
export default async function PaintingsAndDrawingsPage() {
    const works = await getInventory();

    return (
        <StudioFrame current="/paintings-and-drawings" className="overflow-y-auto">
            <div className="py-[clamp(2rem,5vw,4rem)]">
                <header className="flex items-end justify-between gap-6 border-b border-foreground/60 pb-6">
                    <h1 className="font-mono text-[clamp(1.5rem,2.6vw,2.25rem)] font-normal uppercase leading-none tracking-[0.14em] text-foreground">
                        Catalogue
                    </h1>
                    <p className={`${label} text-right text-[0.625rem] leading-relaxed`}>
                        Paintings and drawings
                        <br />
                        {works.length} {works.length === 1 ? "work" : "works"}
                    </p>
                </header>

                {works.length > 0 ? (
                    <ul className="grid grid-cols-2 gap-x-[clamp(1.25rem,3vw,3rem)] gap-y-[clamp(2.5rem,5vw,4rem)] pt-[clamp(2.5rem,5vw,4rem)] sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                        {works.map((work, i) => (
                            <li key={work.id}>
                                <Link href={work.href} className="group block focus-visible:outline-none">
                                    <div className="relative aspect-[4/5] overflow-hidden bg-border ring-foreground/50 ring-offset-4 ring-offset-background group-focus-visible:ring-2">
                                        {work.images[0] && (
                                            <Image
                                                src={work.images[0]}
                                                alt=""
                                                fill
                                                // The first row, up to six across, is on screen at once.
                                                loading={i < 6 ? "eager" : "lazy"}
                                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                                sizes="(min-width: 1536px) 15vw, (min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                                            />
                                        )}
                                    </div>
                                    <p className={`mt-4 line-clamp-1 ${label} group-hover:text-foreground`}>{work.title}</p>
                                    <p className={`mt-2 ${label} tabular-nums`}>Cat. {work.label}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className={`pt-12 ${label}`}>No works are catalogued yet.</p>
                )}

                <hr className="mt-[clamp(3rem,6vw,5rem)] border-foreground/60" />
            </div>
        </StudioFrame>
    );
}
