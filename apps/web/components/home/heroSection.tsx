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
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-6 xl:gap-6 lg:items-center">

                    {/* ── Left: identity + bio ── */}
                    <div className="min-w-0">
                        <motion.h1
                            variants={item}
                            className="text-[clamp(2.75rem,5.5vw,5rem)] font-black leading-[0.88] tracking-[-0.03em] uppercase text-foreground"
                            style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
                        >
                            Bandu
                            <br />
                            Manamperi
                        </motion.h1>

                        <motion.div
                            variants={item}
                            className="mt-7 h-px w-10 bg-foreground/15"
                            aria-hidden
                        />

                        <motion.div
                            variants={item}
                            className="mt-6 space-y-4 text-[0.9375rem] text-muted-foreground font-light leading-[1.8] max-w-[42rem]"
                        >
                            <p>
                                <strong className="font-semibold text-foreground">Bandu Manamperi</strong> is a Sri Lankan
                                contemporary artist whose multidisciplinary practice spans
                                performance, sculpture, drawing, photography, video, and
                                installation. His work explores identity, memory, conflict, and
                                cultural transformation, often drawing from Sri Lanka&apos;s
                                history, archaeology, and lived social experience.
                            </p>
                            <p>
                                A founding member and Vice Chairman of{" "}
                                <strong className="font-semibold text-foreground">
                                    Theertha International Artists&apos; Collective
                                </strong>, Manamperi has played an important role in shaping
                                contemporary art practice in Sri Lanka and connecting it with
                                wider international conversations. His work has been presented
                                across South Asia, Europe, Australia, and beyond.
                            </p>
                        </motion.div>

                    </div>

                    {/* ── Right: portrait (contained, vertically centred) ── */}
                    <motion.div
                        variants={item}
                        className="hidden lg:flex lg:items-center lg:justify-center"
                    >
                        <div className="relative w-[300px] xl:w-[360px] aspect-[3/4] overflow-hidden">
                            <Image
                                src="/IMG_8614.JPG"
                                alt="Bandu Manamperi"
                                fill
                                className="object-cover grayscale"
                                priority
                                sizes="360px"
                            />
                        </div>
                    </motion.div>

                </div>
            </motion.div>
        </section>
    );
};

export default HeroSection;
