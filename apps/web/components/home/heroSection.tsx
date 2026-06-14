"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const HeroSection = () => {
    return (
        <section className="relative min-h-dvh flex items-center justify-center overflow-hidden">
            {/* Full Section Image */}
            <motion.div
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
            >
                <Image
                    src="/IMG_8614.JPG"
                    alt="Bandu manamperi"
                    fill
                    className="object-cover brightness-[0.35] grayscale"
                    style={{ objectPosition: "center 30%" }}
                    priority
                    sizes="100vw"
                />

                {/* Subtle gradient overlay for better text readability */}
                <div
                    className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/20"
                    aria-hidden="true"
                />
            </motion.div>

            {/* Text Content - Centered */}
            <div className="relative z-20 w-full px-6 sm:px-8 lg:px-12">
                <div className="max-w-5xl mx-auto text-center">
                    <div className="space-y-6 sm:space-y-8">
                        {/* Name */}
                        <motion.h1
                            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light tracking-wide text-white"
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            Bandu Manamperi
                        </motion.h1>

                        {/* Divider */}
                        <motion.div
                            className="flex items-center justify-center"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={{ opacity: 1, scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                        >
                            <div className="h-px w-24 bg-white/30 origin-center" />
                        </motion.div>

                        {/* Description */}
                        <motion.p
                            className="text-lg sm:text-xl md:text-2xl text-white/70 max-w-3xl mx-auto font-light leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                        >
                            Contemporary Sri Lankan Artist
                        </motion.p>

                        <motion.p
                            className="text-sm sm:text-base md:text-lg text-white/50 max-w-2xl mx-auto font-light leading-relaxed"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.8, ease: "easeOut" }}
                        >
                            Performance · Installation · Drawing
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
