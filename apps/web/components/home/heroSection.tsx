"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";

const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const HeroSection = () => {
    return (
        <section className="h-full flex items-center bg-background">
            <motion.div
                className="w-full px-10 md:px-20 lg:px-32 xl:px-44"
                variants={container}
                initial="hidden"
                animate="show"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 lg:items-center">

                    {/* ── Left: identity + bio ── */}
                    <div className="min-w-0">
                        <motion.p
                            variants={item}
                            className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6"
                        >
                            About
                        </motion.p>

                        <motion.h1
                            variants={item}
                            className="font-heading text-[clamp(3rem,5vw,5rem)] leading-[1] tracking-[-0.02em] text-foreground"
                        >
                            Bandu
                            <br />
                            Manamperi
                        </motion.h1>

                        <motion.div
                            variants={item}
                            className="mt-6 h-px w-10 bg-foreground/15"
                            aria-hidden
                        />

                        <motion.div
                            variants={item}
                            className="mt-6 space-y-5"
                        >
                            <p className="text-base text-foreground/75 font-light leading-[1.9]">
                                <strong className="font-medium text-foreground">Bandu Manamperi</strong> is a Sri Lankan
                                contemporary artist whose multidisciplinary practice spans
                                performance, sculpture, drawing, photography, video, and
                                installation. His work explores identity, memory, conflict, and
                                cultural transformation, often drawing from Sri Lanka&apos;s
                                history, archaeology, and lived social experience.
                            </p>
                            <p className="text-base text-foreground/75 font-light leading-[1.9]">
                                A founding member and Vice Chairman of{" "}
                                <strong className="font-medium text-foreground">
                                    Theertha International Artists&apos; Collective
                                </strong>, Manamperi has played an important role in shaping
                                contemporary art practice in Sri Lanka and connecting it with
                                wider international conversations. His work has been presented
                                across South Asia, Europe, Australia, and beyond.
                            </p>
                        </motion.div>
                    </div>

                    {/* ── Right: portrait ── */}
                    <motion.div
                        variants={item}
                        className="hidden lg:flex lg:items-center lg:justify-center"
                    >
                        <div className="relative w-full max-w-sm aspect-[3/4] overflow-hidden rounded-sm">
                            <Image
                                src="/IMG_8614.JPG"
                                alt="Bandu Manamperi"
                                fill
                                className="object-cover grayscale"
                                priority
                                sizes="(max-width: 1280px) 40vw, 480px"
                            />
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
