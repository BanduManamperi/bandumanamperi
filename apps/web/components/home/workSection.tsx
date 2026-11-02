"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Spread, rightPageBleed } from "@/components/sheet/spread";

const categories = [
    {
        title: "Paintings and Drawings",
        description: "Paintings, mixed media, and works on paper",
        // The studio viewing room. Not live yet; the subdomain is wired ahead of release.
        link: "https://studio.bandumanamperi.com/paintings-and-drawings",
        external: true,
        image: "/JBP06256.jpg",
        alt: "A large ink work on paper by Bandu Manamperi",
    },
    {
        title: "Performances",
        description: "Live art performances and interventions",
        link: "/performances",
        image: "/Bandaged_Body_1.jpg",
        alt: "Bandu Manamperi performing Bandaged Body",
    },
];

export function WorkSection({ index = 2, headingLevel = "h2" }: { index?: number; headingLevel?: "h1" | "h2" }) {
    const Heading = headingLevel;
    const [active, setActive] = useState(0);
    const current = categories[active];

    return (
        <Spread section="Work" index={index}>
            <div className="h-full">
                <div className="grid min-h-full grid-cols-1 gap-y-8 py-6 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)] lg:py-8">

                    {/* Left page: contents */}
                    <div className="flex min-w-0 flex-col lg:col-span-5 lg:h-full xl:col-span-4">
                        <Heading
                            className="font-display text-[clamp(3rem,4.8vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-foreground"
                        >
                            Work
                        </Heading>
                        <p className="mt-6 max-w-[30rem] text-[0.9375rem] leading-[1.6] text-foreground/80">
                            A practice that moves across media to confront identity, conflict,
                            and the complexities of human nature. Working through performance,
                            drawing, and installation, Manamperi asks viewers to confront their
                            own perceptions and enter a deeper dialogue with the subject matter.
                        </p>

                        <ul className="mt-8 border-t border-border lg:mt-auto">
                            {categories.map((cat, i) => {
                                const linkProps = {
                                    onMouseEnter: () => setActive(i),
                                    onFocus: () => setActive(i),
                                    "aria-current": active === i ? ("true" as const) : undefined,
                                    className:
                                        "group block py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                                };
                                const label = (
                                    <>
                                        <span
                                            className={`block text-[1.375rem] font-light leading-tight transition-colors ${active === i ? "text-foreground" : "text-foreground/45"}`}
                                        >
                                            {cat.title}
                                        </span>
                                        <span className="mt-1 block text-[0.75rem] text-muted-foreground">
                                            {cat.description}
                                        </span>
                                    </>
                                );
                                return (
                                    <li key={cat.link} className="border-b border-border">
                                        {cat.external ? (
                                            <a href={cat.link} target="_blank" rel="noopener noreferrer" {...linkProps}>
                                                {label}
                                            </a>
                                        ) : (
                                            <Link href={cat.link} {...linkProps}>
                                                {label}
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    {/* Right page: the selected discipline */}
                    <figure className={rightPageBleed}>
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1">
                            {categories.map((cat, i) => (
                                <Image
                                    key={cat.image}
                                    src={cat.image}
                                    alt={i === active ? cat.alt : ""}
                                    aria-hidden={i !== active}
                                    fill
                                    className={`object-cover transition-opacity duration-500 ${i === active ? "opacity-100" : "opacity-0"}`}
                                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                />
                            ))}
                        </div>
                        <figcaption className="mt-2 text-[0.6875rem] text-muted-foreground">
                            {current.title}
                        </figcaption>
                    </figure>

                </div>
            </div>
        </Spread>
    );
}
