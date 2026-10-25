"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Spread, rightPageBleed } from "@/components/sheet/spread";

// Facts set like the project data on a portfolio page.
// TODO(human): curate these 3-4 facts; this is the first thing a curator scans.
const facts = [
    { label: "Based in", value: "Colombo, Sri Lanka" },
    { label: "Collective", value: "Theertha International Artists' Collective, founding member and Vice Chairman" },
    { label: "Education", value: "MA Archaeology, PGIAR. BFA Sculpture, University of Kelaniya" },
];

const HeroSection = () => {
    const reduce = useReducedMotion();

    return (
        <Spread section="About" index={1}>
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

                        <p className="mt-6 max-w-[34rem] text-[0.9375rem] leading-[1.6] text-foreground/80 xl:mt-8">
                            A Sri Lankan artist whose practice moves between performance,
                            sculpture, drawing, photography, video, and installation. His work
                            deals with identity, memory, conflict, and cultural change, drawing
                            on Sri Lanka&apos;s history and archaeology. It has been shown across
                            South Asia, Europe, Australia, and beyond.
                        </p>

                        <dl className="mt-8 grid max-w-[34rem] grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 text-[0.75rem] leading-[1.5] lg:mt-auto lg:pt-6">
                            {facts.map((f) => (
                                <React.Fragment key={f.label}>
                                    <dt className="text-muted-foreground">{f.label}</dt>
                                    <dd className="text-foreground">{f.value}</dd>
                                </React.Fragment>
                            ))}
                        </dl>

                        <Link
                            href="/background"
                            className="mt-6 self-start text-[0.8125rem] text-foreground underline decoration-foreground/30 underline-offset-4 transition-colors hover:decoration-foreground focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                        >
                            Read the full CV
                        </Link>
                    </motion.div>

                    {/* Right page: the artist at work */}
                    <figure className={rightPageBleed}>
                        <motion.div
                            className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1"
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
