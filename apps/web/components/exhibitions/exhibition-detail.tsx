"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, CalendarPlus } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Types                                                               */
/* ------------------------------------------------------------------ */

export type ExhibitionStatus = "on-view" | "upcoming" | "past";

export interface ExhibitionDetailData {
    title: string;
    status: ExhibitionStatus;
    type: string;
    dek?: string;
    startDate: string;
    endDate: string;
    reception?: {
        date: string;
        start: string;
        end: string;
    };
    venue: string;
    address: string;
    curatedBy?: string;
    coverImage?: string;
    coverAlt?: string;
    about: string[];
    artist: {
        name: string;
        blurb: string;
        backgroundHref: string;
    };
    timezone?: string;
}

/* ------------------------------------------------------------------ */
/*  Formatting helpers                                                  */
/* ------------------------------------------------------------------ */

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

function parts(iso: string) {
    const [y, m, d] = iso.split("-").map(Number);
    return { y, m: m - 1, d };
}

function formatDateRange(startISO: string, endISO: string) {
    const a = parts(startISO);
    const b = parts(endISO);
    if (a.y !== b.y) {
        return `${a.d} ${MONTHS[a.m]} ${a.y} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
    }
    if (a.m === b.m) {
        return `${a.d} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
    }
    return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

function formatTime(hhmm: string) {
    const [h, min] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(min).padStart(2, "0")} ${period}`;
}

function formatReception(r: NonNullable<ExhibitionDetailData["reception"]>) {
    const { d, m, y } = parts(r.date);
    return `${d} ${MONTHS[m]} ${y}, ${formatTime(r.start)} – ${formatTime(r.end)}`;
}

function buildDirectionsUrl(venue: string, address: string) {
    const q = encodeURIComponent(`${venue}, ${address}`);
    return `https://www.google.com/maps/dir/?api=1&destination=${q}`;
}

function buildCalendarUrl(ex: ExhibitionDetailData) {
    const stamp = (iso: string, time: string) =>
        `${iso.replace(/-/g, "")}T${time.replace(":", "")}00`;

    const dates = ex.reception
        ? `${stamp(ex.reception.date, ex.reception.start)}/${stamp(ex.reception.date, ex.reception.end)}`
        : `${ex.startDate.replace(/-/g, "")}/${ex.endDate.replace(/-/g, "")}`;

    const u = new URLSearchParams({
        action: "TEMPLATE",
        text: ex.title,
        dates,
        location: [ex.venue, ex.address].filter(Boolean).join(", "),
        details: ex.dek ?? "",
        ctz: ex.timezone ?? "Asia/Colombo",
    });
    return `https://calendar.google.com/calendar/render?${u.toString()}`;
}

const STATUS: Record<ExhibitionStatus, { label: string; dot: string }> = {
    "on-view": { label: "Now on view", dot: "bg-emerald-500 dark:bg-emerald-400" },
    upcoming:  { label: "Upcoming",    dot: "bg-amber-500 dark:bg-amber-400" },
    past:      { label: "Past",        dot: "bg-muted-foreground/40" },
};

/* ------------------------------------------------------------------ */
/*  Small presentational pieces                                         */
/* ------------------------------------------------------------------ */

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[110px_1fr] gap-x-4 py-3 border-b border-border last:border-b-0">
            <dt className="text-xs uppercase tracking-[0.08em] text-muted-foreground self-start pt-0.5">
                {label}
            </dt>
            <dd className="text-sm text-foreground">{value}</dd>
        </div>
    );
}

const sectionLabel = "text-xs uppercase tracking-[0.2em] text-muted-foreground";

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

export function ExhibitionDetail({ exhibition }: { exhibition: ExhibitionDetailData }) {
    const status = STATUS[exhibition.status];
    const dateRange = formatDateRange(exhibition.startDate, exhibition.endDate);

    return (
        <article className="min-h-full bg-background pb-24">
            <div className="px-10 md:px-20 lg:px-32 xl:px-44 pt-16">

                {/* Back */}
                <Link
                    href="/exhibitions"
                    className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12"
                >
                    <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                    All exhibitions
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Status + type */}
                    <div className="inline-flex items-center gap-2.5 mb-4">
                        <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                        <span className="font-heading text-xs uppercase tracking-[0.2em] text-foreground">
                            {status.label}
                        </span>
                        <span className="text-muted-foreground/30 mx-0.5">·</span>
                        <span className="font-heading text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            {exhibition.type}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-heading text-[clamp(2.5rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-foreground max-w-4xl">
                        {exhibition.title}
                    </h1>

                    {/* Dek */}
                    {exhibition.dek && (
                        <p className="mt-5 font-heading text-lg font-light leading-relaxed text-muted-foreground max-w-2xl">
                            {exhibition.dek}
                        </p>
                    )}

                    {/* Hero image */}
                    {exhibition.coverImage && (
                        <div className="mt-10 relative w-full aspect-[16/9] overflow-hidden rounded-xl bg-muted">
                            <Image
                                src={exhibition.coverImage}
                                alt={exhibition.coverAlt ?? exhibition.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 80vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Body: reading column + detail rail */}
                    <div className="mt-14 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-16 items-start">

                        {/* Main reading column */}
                        <div>
                            {exhibition.about.length > 0 && (
                                <section>
                                    <p className={`${sectionLabel} mb-5`}>About the exhibition</p>
                                    <div className="space-y-5">
                                        {exhibition.about.map((para, i) => (
                                            <p key={i} className="text-sm leading-[1.75] text-foreground/80">
                                                {para}
                                            </p>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* About the artist */}
                            <section className="mt-12 rounded-xl bg-muted/50 p-6 md:p-7">
                                <p className={`${sectionLabel} mb-3`}>About the artist</p>
                                <p className="text-sm leading-[1.7] text-foreground/80">
                                    {exhibition.artist.blurb}
                                </p>
                                <Link
                                    href={exhibition.artist.backgroundHref}
                                    className="group mt-4 inline-flex items-center gap-2 text-sm tracking-wide text-foreground border-b border-foreground/80 pb-0.5 w-fit hover:border-foreground transition-colors"
                                >
                                    Read full background
                                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                            </section>
                        </div>

                        {/* Detail rail */}
                        <aside className="lg:sticky lg:top-16">
                            <dl className="border-t border-border">
                                <DetailRow label="Dates" value={dateRange} />
                                {exhibition.reception && (
                                    <DetailRow label="Reception" value={formatReception(exhibition.reception)} />
                                )}
                                <DetailRow label="Venue" value={exhibition.venue} />
                                {exhibition.address && (
                                    <DetailRow label="Address" value={exhibition.address} />
                                )}
                                {exhibition.curatedBy && (
                                    <DetailRow label="Curated by" value={exhibition.curatedBy} />
                                )}
                            </dl>

                            <div className="mt-6 flex flex-col gap-3">
                                <a
                                    href={buildDirectionsUrl(exhibition.venue, exhibition.address)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 text-sm text-foreground border border-border rounded-lg px-4 py-2.5 hover:bg-muted transition-colors"
                                >
                                    <MapPin className="w-4 h-4" />
                                    Get directions
                                </a>
                                <a
                                    href={buildCalendarUrl(exhibition)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 text-sm text-foreground border border-border rounded-lg px-4 py-2.5 hover:bg-muted transition-colors"
                                >
                                    <CalendarPlus className="w-4 h-4" />
                                    Add to calendar
                                </a>
                            </div>
                        </aside>
                    </div>

                    {/* Footer nav */}
                    <div className="mt-20 pt-8 border-t border-border flex items-center justify-between">
                        <Link
                            href="/exhibitions"
                            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                            All exhibitions
                        </Link>
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Home
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>

                </motion.div>
            </div>
        </article>
    );
}
