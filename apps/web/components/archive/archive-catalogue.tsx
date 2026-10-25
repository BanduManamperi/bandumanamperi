"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CatalogueEntry } from "@/lib/data/artworks";
import { Facts, body, caption, display } from "@/components/sheet/type";

type View = "ledger" | "sheet";
type Order = "asc" | "desc";

function Toggle<T extends string>({
    label,
    value,
    options,
    onChange,
}: {
    label: string;
    value: T;
    options: { value: T; label: string }[];
    onChange: (v: T) => void;
}) {
    return (
        <div role="group" aria-label={label} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="text-muted-foreground">{label}</span>
            {options.map((o) => (
                <button
                    key={o.value}
                    type="button"
                    aria-pressed={value === o.value}
                    onClick={() => onChange(o.value)}
                    className={`underline-offset-4 transition-colors focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 ${
                        value === o.value
                            ? "text-foreground underline decoration-foreground"
                            : "text-foreground/50 hover:text-foreground"
                    }`}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

function Thumb({ entry, size }: { entry: CatalogueEntry; size: string }) {
    return (
        <span className="relative block aspect-square overflow-hidden bg-[var(--sheet-rule)]">
            {entry.images[0] && <Image src={entry.images[0]} alt="" fill className="object-cover" sizes={size} />}
        </span>
    );
}

export function ArchiveCatalogue({ entries, latestCount }: { entries: CatalogueEntry[]; latestCount: number }) {
    const [view, setView] = useState<View>("ledger");
    const [order, setOrder] = useState<Order>("asc");
    const [series, setSeries] = useState<string>("all");

    const seriesCounts = useMemo(() => {
        const counts = new Map<string, number>();
        entries.forEach((e) => e.series && counts.set(e.series, (counts.get(e.series) ?? 0) + 1));
        return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
    }, [entries]);

    const years = entries.map((e) => Number(e.year)).filter((y) => Number.isFinite(y) && y > 0);
    const undated = entries.filter((e) => !e.year).length;
    const [first, last] = [Math.min(...years), Math.max(...years)];
    const span = first === last ? `${first}` : `${first} to ${last}`;
    const dateRange = years.length ? `${span}${undated ? `, and ${undated} undated` : ""}` : "Undated";

    // Only show ledger columns that have something in them
    const hasMedium = entries.some((e) => e.medium);
    const hasSeries = entries.some((e) => e.series);

    const shown = entries
        .filter((e) => series === "all" || e.series === series)
        .sort((a, b) => (order === "asc" ? a.number - b.number : b.number - a.number));

    return (
        <div className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
            {/* Finding aid */}
            <div className="grid grid-cols-1 gap-y-8 lg:grid-cols-12 lg:gap-x-[clamp(1.5rem,3vw,3.5rem)]">
                <div className="lg:col-span-5">
                    <h1 className={display}>Archive</h1>
                    <p className={`mt-6 max-w-[30rem] ${body}`}>
                        Works by Bandu Manamperi that sit behind the current selection of{" "}
                        {latestCount} artworks. Each is listed under the catalogue number it was
                        given when it entered the collection.
                    </p>
                </div>
                <Facts
                    className="self-end lg:col-span-6 lg:col-start-7"
                    labelWidth="6.5rem"
                    items={[
                        { label: "Holdings", value: `${entries.length} works` },
                        { label: "Dates", value: dateRange },
                        { label: "Series", value: seriesCounts.map(([s, n]) => `${s} (${n})`).join(", ") || null },
                        { label: "Arrangement", value: "By catalogue number, in order of entry" },
                        {
                            label: "Conventions",
                            value: "Titles and dates are given where known. Undated works are marked n.d.; untitled works keep the reference of their original image file.",
                        },
                    ]}
                />
            </div>

            {/* Controls */}
            <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-10 gap-y-3 border-y border-border py-3 text-[0.8125rem]">
                <div className="flex flex-wrap items-baseline gap-x-10 gap-y-3">
                    {seriesCounts.length > 0 && (
                        <Toggle
                            label="Series"
                            value={series}
                            onChange={setSeries}
                            options={[{ value: "all", label: "All" }, ...seriesCounts.map(([s]) => ({ value: s, label: s }))]}
                        />
                    )}
                    <Toggle
                        label="Order"
                        value={order}
                        onChange={setOrder}
                        options={[
                            { value: "asc", label: "Earliest entry" },
                            { value: "desc", label: "Latest entry" },
                        ]}
                    />
                </div>
                <Toggle
                    label="View"
                    value={view}
                    onChange={setView}
                    options={[
                        { value: "ledger", label: "Ledger" },
                        { value: "sheet", label: "Contact sheet" },
                    ]}
                />
            </div>

            {view === "ledger" ? (
                <table className="mt-2 w-full border-collapse text-left text-[0.8125rem]">
                    <caption className="sr-only">Archive ledger, {shown.length} works</caption>
                    <thead className={caption}>
                        <tr className="border-b border-border">
                            <th scope="col" className="w-14 py-2 font-normal">No.</th>
                            <th scope="col" className="w-16 py-2 font-normal"><span className="sr-only">Image</span></th>
                            <th scope="col" className="py-2 font-normal">Title</th>
                            <th scope="col" className="w-20 py-2 font-normal">Date</th>
                            {hasMedium && <th scope="col" className="hidden py-2 font-normal md:table-cell">Medium</th>}
                            {hasSeries && <th scope="col" className="hidden py-2 font-normal lg:table-cell">Series</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {shown.map((e) => (
                            <tr key={e.id} className="group relative border-b border-border align-top transition-colors hover:bg-foreground/[0.03]">
                                <td className="py-3 tabular-nums text-muted-foreground">{e.label}</td>
                                <td className="py-3 pr-4">
                                    <span className="block w-11">
                                        <Thumb entry={e} size="44px" />
                                    </span>
                                </td>
                                <td className="py-3 pr-4">
                                    {/* The title link stretches over the whole row */}
                                    <Link
                                        href={e.href}
                                        className="text-foreground after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-foreground/50"
                                    >
                                        {e.title}
                                    </Link>
                                    {e.sourceRef && <span className={`block ${caption}`}>Ref. {e.sourceRef}</span>}
                                </td>
                                <td className="py-3 tabular-nums text-foreground/80">{e.date}</td>
                                {hasMedium && <td className="hidden py-3 pr-4 text-foreground/80 md:table-cell">{e.medium ?? ""}</td>}
                                {hasSeries && <td className="hidden py-3 text-foreground/80 lg:table-cell">{e.series ?? ""}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <ol className="mt-6 grid grid-cols-3 gap-x-3 gap-y-5 sm:grid-cols-5 lg:grid-cols-8">
                    {shown.map((e) => (
                        <li key={e.id}>
                            <Link
                                href={e.href}
                                className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                            >
                                <span className="block border border-border p-1 transition-colors group-hover:border-foreground/40">
                                    <Thumb entry={e} size="(min-width: 1024px) 10vw, 30vw" />
                                </span>
                                <span className={`mt-1.5 flex justify-between gap-2 ${caption}`}>
                                    <span className="tabular-nums">{e.label}</span>
                                    <span>{e.date}</span>
                                </span>
                                <span className="sr-only">{e.title}</span>
                            </Link>
                        </li>
                    ))}
                </ol>
            )}

            <p className={`mt-8 ${caption}`}>
                {shown.length} {shown.length === 1 ? "record" : "records"}
                {series !== "all" ? ` in ${series}` : ""}. For the most recent works, see{" "}
                <Link href="/artworks" className="underline underline-offset-4 hover:text-foreground">
                    Artworks
                </Link>
                .
            </p>
        </div>
    );
}
