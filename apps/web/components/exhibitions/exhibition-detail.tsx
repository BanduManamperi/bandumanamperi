import Image from "next/image";
import Link from "next/link";
import { Facts, body, caption, heading, textLink, title } from "@/components/sheet/type";

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
    /** Installation views and other photographs of the show. */
    images: string[];
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
        return `${a.d} ${MONTHS[a.m]} ${a.y} to ${b.d} ${MONTHS[b.m]} ${b.y}`;
    }
    if (a.m === b.m) {
        return `${a.d} to ${b.d} ${MONTHS[b.m]} ${b.y}`;
    }
    return `${a.d} ${MONTHS[a.m]} to ${b.d} ${MONTHS[b.m]} ${b.y}`;
}

function formatTime(hhmm: string) {
    const [h, min] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(min).padStart(2, "0")} ${period}`;
}

function formatReception(r: NonNullable<ExhibitionDetailData["reception"]>) {
    const { d, m, y } = parts(r.date);
    return `${d} ${MONTHS[m]} ${y}, ${formatTime(r.start)} to ${formatTime(r.end)}`;
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
    "on-view": { label: "Now on view", dot: "bg-emerald-600" },
    upcoming: { label: "Upcoming", dot: "bg-amber-600" },
    past: { label: "Past", dot: "bg-muted-foreground/50" },
};

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */

// Laid out for a document sheet: the record and cover side by side, then the
// reading text, then the installation views.
export function ExhibitionDetail({ exhibition }: { exhibition: ExhibitionDetailData }) {
    const status = STATUS[exhibition.status];
    const showVisitLinks = exhibition.status !== "past";

    return (
        <article className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)]">
                <div className="flex flex-col lg:col-span-5">
                    <p className="flex items-center gap-2 text-[0.75rem] text-foreground">
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} aria-hidden />
                        {status.label}, {exhibition.type.toLowerCase()}
                    </p>
                    <h1 className={`mt-4 ${title}`}>{exhibition.title}</h1>
                    {exhibition.dek && <p className={`mt-5 ${body}`}>{exhibition.dek}</p>}

                    <Facts
                        className="mt-8 lg:mt-auto lg:pt-8"
                        labelWidth="6rem"
                        items={[
                            { label: "Dates", value: formatDateRange(exhibition.startDate, exhibition.endDate) },
                            { label: "Reception", value: exhibition.reception ? formatReception(exhibition.reception) : null },
                            { label: "Venue", value: exhibition.venue },
                            { label: "Address", value: exhibition.address },
                            { label: "Curated by", value: exhibition.curatedBy },
                        ]}
                    />

                    {showVisitLinks && (
                        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem]">
                            <a href={buildDirectionsUrl(exhibition.venue, exhibition.address)} target="_blank" rel="noopener noreferrer" className={textLink}>
                                Get directions
                            </a>
                            <a href={buildCalendarUrl(exhibition)} target="_blank" rel="noopener noreferrer" className={textLink}>
                                Add to calendar
                            </a>
                        </p>
                    )}
                </div>

                {exhibition.coverImage && (
                    <figure className="order-first lg:order-none lg:col-span-7">
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)]">
                            <Image
                                src={exhibition.coverImage}
                                alt={exhibition.coverAlt ?? exhibition.title}
                                fill
                                priority
                                sizes="(min-width: 1024px) 56vw, 100vw"
                                className="object-cover"
                            />
                        </div>
                        <figcaption className={`mt-2 ${caption}`}>{exhibition.title}, {exhibition.venue}</figcaption>
                    </figure>
                )}
            </div>

            <div className="mt-16 grid grid-cols-1 gap-y-12 border-t border-border pt-10 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)]">
                {exhibition.about.length > 0 && (
                    <section className="lg:col-span-7">
                        <h2 className={heading}>About the exhibition</h2>
                        <div className="mt-5 max-w-[38rem] space-y-4">
                            {exhibition.about.map((para, i) => (
                                <p key={i} className={body}>
                                    {para}
                                </p>
                            ))}
                        </div>
                    </section>
                )}

                <section className="lg:col-span-4 lg:col-start-9">
                    <h2 className={heading}>About the artist</h2>
                    <p className={`mt-5 ${body}`}>{exhibition.artist.blurb}</p>
                    <Link href={exhibition.artist.backgroundHref} className={`mt-4 inline-block text-[0.8125rem] ${textLink}`}>
                        Read the full CV
                    </Link>
                </section>
            </div>

            {exhibition.images.length > 0 && (
                <section className="mt-16 border-t border-border pt-10">
                    <h2 className={heading}>Installation views</h2>
                    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
                        {exhibition.images.map((src, i) => (
                            <figure key={src}>
                                <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)]">
                                    <Image src={src} alt={`${exhibition.title}, view ${i + 1}`} fill className="object-cover" sizes="(min-width: 768px) 40vw, 100vw" />
                                </div>
                                <figcaption className={`mt-2 ${caption}`}>
                                    View {i + 1} of {exhibition.images.length}
                                </figcaption>
                            </figure>
                        ))}
                    </div>
                </section>
            )}

            <nav aria-label="Exhibitions" className="mt-16 flex justify-between border-t border-border pt-6 text-[0.8125rem]">
                <Link href="/exhibitions" className={textLink}>
                    All exhibitions
                </Link>
                <Link href="/" className={textLink}>
                    Home
                </Link>
            </nav>
        </article>
    );
}
