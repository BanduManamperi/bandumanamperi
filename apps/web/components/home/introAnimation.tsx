"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const IntroAnimation = () => {
    const [showIntro, setShowIntro] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [animationStage, setAnimationStage] = useState<"first" | "second" | "complete">("first");
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const hasSeenIntro = typeof window !== "undefined" ? sessionStorage.getItem("hasSeenIntro") : null;
        const id = requestAnimationFrame(() => {
            setMounted(true);
            if (!hasSeenIntro) setShowIntro(true);
        });
        return () => cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!showIntro) return;
        const firstTimer = setTimeout(() => setAnimationStage("second"), 2000);
        const exitTimer = setTimeout(() => {
            setAnimationStage("complete");
            setIsExiting(true);
        }, 4500);
        const doneTimer = setTimeout(() => {
            sessionStorage.setItem("hasSeenIntro", "true");
            setShowIntro(false);
        }, 5300); // 4500 + 800ms fade out
        return () => {
            clearTimeout(firstTimer);
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
        };
    }, [showIntro]);

    if (!mounted || !showIntro) return null;

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        >
            <div className="relative font-light">
                <AnimatePresence mode="wait">
                    {/* Stage 1: Name */}
                    {animationStage === "first" && (
                        <motion.div
                            key="first"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-center"
                        >
                            <h1 className="font-heading text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-tight font-light text-foreground">
                                Bandu Manamperi
                            </h1>
                        </motion.div>
                    )}

                    {/* Stage 2: Portfolio */}
                    {animationStage === "second" && (
                        <motion.div
                            key="second"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isExiting ? 0 : 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, ease: "easeInOut" }}
                            className="text-center max-w-3xl px-6"
                        >
                            <p className="text-[clamp(1.5rem,4vw,2.5rem)] font-light tracking-tight leading-[1.2] text-muted-foreground">
                                Portfolio
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default IntroAnimation;
