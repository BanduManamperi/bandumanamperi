import Image from "next/image";
import { getPublishedPerformances, type PerformanceItem } from "@/lib/services/performanceService";
import { withoutDashes } from "@/lib/text";
import { SpreadGrid, SpreadPanel, SpreadRow, belowStandfirst, footStandfirst, leftPage, rightPage } from "@/components/sheet/spread";
import { Facts, body, caption, display } from "@/components/sheet/type";

// Entries per page column; two columns make a spread.
const PER_COLUMN = 8;

const TYPE_LABEL: Record<string, string> = {
    solo: "Solo",
    group: "Group",
    online: "Online",
    collaboration: "Collaboration",
};

type Entry = {
    id: string;
    year: number | null;
    date: string;
    title: string;
    place: string;
    type: string;
};

function toEntry(p: PerformanceItem): Entry {
    return {
        id: p.id,
        // Read the year straight from "YYYY-MM-DD": new Date() would parse it as UTC
        // midnight and roll 1 January back a year in timezones behind UTC.
        year: p.date ? Number(p.date.slice(0, 4)) : null,
        date: p.date ?? "",
        title: withoutDashes(p.title),
        place: [p.venue, p.location].filter(Boolean).map((s) => withoutDashes(s!)).join(", "),
        type: TYPE_LABEL[p.type] ?? "",
    };
}

function chunk<T>(items: T[], size: number): T[][] {
    const out: T[][] = [];
    for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
    return out;
}

function yearSpan(entries: Entry[]): string {
    const years = entries.map((e) => e.year).filter((y): y is number => y !== null);
    if (!years.length) return "";
    const [hi, lo] = [Math.max(...years), Math.min(...years)];
    return hi === lo ? `${hi}` : `${hi} to ${lo}`;
}

// A page of the chronology: the year sits in the margin the first time it appears.
function Column({ entries }: { entries: Entry[] }) {
    return (
        <ol className="min-w-0">
            {entries.map((e, i) => {
                const showYear = i === 0 || entries[i - 1].year !== e.year;
                return (
                    <li key={e.id} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-border py-2.5 first:border-t-0">
                        <span className="text-[0.8125rem] tabular-nums text-muted-foreground">{showYear ? e.year ?? "n.d." : ""}</span>
                        <span className="min-w-0">
                            <span className="block text-[0.9375rem] font-light leading-snug text-foreground">{e.title}</span>
                            <span className={`mt-0.5 block ${caption}`}>
                                {[e.place, e.type].filter(Boolean).join(". ")}
                            </span>
                        </span>
                    </li>
                );
            })}
        </ol>
    );
}

export default async function PerformancesPage() {
    // A chronology runs newest first by date; undated entries go last.
    const entries = (await getPublishedPerformances())
        .map(toEntry)
        .sort((a, b) => (b.date || "0").localeCompare(a.date || "0"));
    const spreads = chunk(entries, PER_COLUMN * 2);
    const counts = entries.reduce<Record<string, number>>((acc, e) => {
        if (e.type) acc[e.type] = (acc[e.type] ?? 0) + 1;
        return acc;
    }, {});
    const span = yearSpan(entries).split(" to ").reverse().join(" to ");

    return (
        <SpreadRow>
            <SpreadPanel id="panel-performances" label="Performance" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h1 className={display}>Performance</h1>
                        <p className={`${footStandfirst} max-w-[30rem] ${body}`}>
                            The body as site, duration as medium, presence as material. Each action
                            unfolds in real time and asks for a witness. These are not documents of
                            events. They are the events themselves.
                        </p>
                        <Facts
                            className={`${belowStandfirst} max-w-[30rem]`}
                            items={[
                                { label: "Record", value: `${entries.length} performances and exhibitions` },
                                { label: "Years", value: span || null },
                                {
                                    label: "Of which",
                                    value: Object.entries(counts)
                                        .sort((a, b) => b[1] - a[1])
                                        .map(([t, n]) => `${n} ${t.toLowerCase()}`)
                                        .join(", "),
                                },
                            ]}
                        />
                    </div>

                    <figure className={rightPage}>
                        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1">
                            <Image
                                src="/Bandaged_Body_1.jpg"
                                alt="Bandu Manamperi in performance, wrapped in white bandages"
                                fill
                                priority
                                className="object-cover"
                                sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                            />
                        </div>
                        <figcaption className={`mt-2 ${caption}`}>Bandaged Body, performance</figcaption>
                    </figure>
                </SpreadGrid>
            </SpreadPanel>

            {spreads.map((group, i) => {
                const [left, right] = [group.slice(0, PER_COLUMN), group.slice(PER_COLUMN)];
                return (
                    <SpreadPanel
                        key={i}
                        id={`chronology-${i + 1}`}
                        label={`Chronology ${yearSpan(group)}`}
                        index={i + 2}
                    >
                        <div className="grid h-full grid-cols-1 gap-y-6 py-6 lg:grid-cols-2 lg:gap-x-[clamp(2rem,5vw,6rem)] lg:py-8">
                            <Column entries={left} />
                            {right.length > 0 && <Column entries={right} />}
                        </div>
                    </SpreadPanel>
                );
            })}
        </SpreadRow>
    );
}
