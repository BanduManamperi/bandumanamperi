"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Spread, belowStandfirst, footStandfirst, rightPageBleed } from "@/components/sheet/spread";
import { textLink } from "@/components/sheet/type";

// A short standfirst drawn from the biography on /about. Kept to two short
// paragraphs so the facts below stay on the page without scrolling.
const about = [
    "Bandu Manamperi's work transcends traditional boundaries to explore identity, conflict, and the complexities of human nature. His approach incorporates performances, drawings, and installations, challenging viewers to confront their perceptions.",
    "Drawing on his own experiences and cultural heritage, his pieces reflect the societal and personal impacts of political turmoil, serving both as a mirror to societal issues and as a bridge between diverse audiences.",
];

// Facts set like the project data on a portfolio page.
// TODO(human): curate these 3-4 facts; this is the first thing a curator scans.
const facts = [
    { label: "Based in", value: "Bandaragama, Sri Lanka" },
    { label: "Collective", value: "Theertha International Artists' Collective, founding member and Vice Chairman" },
    { label: "Education", value: "MA Archaeology, PGIAR. BFA Sculpture, University of Kelaniya" },
];

const HeroSection = () => {
    const reduce = useReducedMotion();

    return (
        <Spread index={1}>
            <div className="h-full">
                <div className="grid min-h-full grid-cols-1 gap-y-8 py-6 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)] lg:py-8">

                    {/* Left page: name, bio, facts */}
                    <motion.div
                        className="flex min-w-0 flex-col lg:col-span-5 lg:h-full lg:overflow-y-auto xl:col-span-4"
                        initial={reduce ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1
                            className="font-display text-[clamp(3rem,4.8vw,6rem)] font-light leading-[0.95] tracking-[-0.02em] text-foreground"
                        >
                            Bandu
                            <br />
                            Manamperi
                        </h1>

                        <div className={`${footStandfirst} max-w-[34rem] space-y-4 text-[0.9375rem] leading-[1.6] text-foreground/80`}>
                            {about.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>

                        <nav className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2 text-[0.8125rem]">
                            <Link href="/about" className={textLink}>
                                Read the full biography
                            </Link>
                            <Link href="/background" className={textLink}>
                                Read the full CV
                            </Link>
                        </nav>

                        <dl className={`${belowStandfirst} grid max-w-[34rem] grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 text-[0.75rem] leading-[1.5]`}>
                            {facts.map((f) => (
                                <React.Fragment key={f.label}>
                                    <dt className="text-muted-foreground">{f.label}</dt>
                                    <dd className="text-foreground">{f.value}</dd>
                                </React.Fragment>
                            ))}
                        </dl>
                    </motion.div>

                    {/* Right page: the artist at work */}
                    <figure className={rightPageBleed}>
                        <motion.div
                            className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1 grayscale"
                            initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
                            animate={{ clipPath: "inset(0 0% 0 0)" }}
                            transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1] }}
                        >
                            <Image
                                src="/IMG_8614.JPG"
                                alt="Bandu Manamperi drawing on tissue paper laid over a large work in his studio"
                                fill
                                priority
                                className="object-cover object-[30%_40%]"
                                sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                            />
                        </motion.div>
                        <figcaption className="mt-2 text-[0.6875rem] text-muted-foreground">
                            In the studio, drawing on tissue over a work in progress
                        </figcaption>
                    </figure>

                </div>
            </div>
        </Spread>
    );
};

export default HeroSection;
