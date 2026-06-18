import Link from "next/link";
import { ArrowRight } from "lucide-react";

const rows = [
    { label: "Education", value: "MA Archaeology · BFA Sculpture · Conservation" },
    { label: "Exhibitions", value: "Solo & group · Sri Lanka to Europe · 1998–2016" },
    { label: "Work experience", value: "Founding Member, Theertha Collective" },
    { label: "Workshops & residencies", value: "OPEN 6 Goa · Yogyakarta · Plymouth, UK" },
    { label: "Invited lectures", value: "PGIAR Colombo · Beyond Pressure, Myanmar" },
];

export function BackgroundSection() {
    return (
        <section className="h-full flex items-center bg-background">
            <div className="w-full max-w-[1100px] mx-auto px-10 md:px-20 lg:px-28 py-12">

                {/* ── Eyebrow ── */}
                <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-6">
                    A Life in Art
                </p>

                {/* ── Title ── */}
                <h2 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-none tracking-tight text-foreground">
                    Background
                </h2>

                {/* ── Subtitle ── */}
                <p className="mt-5 max-w-md text-lg text-muted-foreground font-light leading-snug">
                    Twenty-five years across fine art, archaeology, and conservation.
                </p>

                {/* ── Summary rows ── */}
                <div className="mt-10 border-t border-border">
                    {rows.map((r) => (
                        <div
                            key={r.label}
                            className="flex items-baseline justify-between gap-6 py-4 border-b border-border"
                        >
                            <span className="font-heading text-lg lg:text-xl text-foreground shrink-0">
                                {r.label}
                            </span>
                            <span className="text-sm text-muted-foreground text-right">
                                {r.value}
                            </span>
                        </div>
                    ))}
                </div>

                {/* ── CTA ── */}
                <div className="mt-10 flex justify-end">
                    <Link
                        href="/background"
                        className="group inline-flex items-center gap-2 text-sm tracking-wide text-foreground border-b border-foreground/40 pb-1 hover:border-foreground transition-colors"
                    >
                        View full background
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                </div>

            </div>
        </section>
    );
}
