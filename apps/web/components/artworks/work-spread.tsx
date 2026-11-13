import Image from "next/image";
import Link from "next/link";
import { displayDescription, relationLabel, type CatalogueEntry } from "@/lib/data/artworks";
import { SpreadGrid, SpreadPanel, leftPage, rightPage } from "@/components/sheet/spread";
import { Facts, TextLink, body, caption, textLink, title } from "@/components/sheet/type";

/** "Wings of Certainty, no. 2", linked to the series page when there is one. */
export function SeriesValue({ entry }: { entry: CatalogueEntry }) {
    if (entry.seriesInfo) {
        const label = `${entry.seriesInfo.name}${entry.seriesInfo.number ? `, no. ${entry.seriesInfo.number}` : ""}`;
        return (
            <Link href={`/series/${entry.seriesInfo.slug}`} className={textLink}>
                {label}
            </Link>
        );
    }
    return entry.series ? <>{entry.series}</> : null;
}

/** The facts every work shows, in the same order everywhere. */
export function workFacts(entry: CatalogueEntry) {
    return [
        { label: "Date", value: entry.date },
        { label: "Medium", value: entry.medium },
        { label: "Dimensions", value: entry.dimensions },
        { label: entry.relation?.type === "version" ? "Version" : "Edition", value: entry.relation ? relationLabel(entry) : null },
        { label: "Series", value: entry.series ? <SeriesValue entry={entry} /> : null },
    ];
}

/**
 * One work as a spread: catalogue data on the left page, the work itself on the
 * right, uncropped and resting on its caption against the right margin.
 */
export function WorkSpreadPanel({
    entry,
    panelId,
    index,
    priority = false,
}: {
    entry: CatalogueEntry;
    panelId: string;
    index: number;
    priority?: boolean;
}) {
    const description = displayDescription(entry);
    return (
        <SpreadPanel id={panelId} label={`Cat. ${entry.label}`} index={index}>
            <SpreadGrid>
                <div className={leftPage}>
                    <p className={`${caption} tabular-nums`}>Cat. no. {entry.label}</p>
                    <h2 className={`mt-3 ${title}`}>{entry.title}</h2>
                    {entry.sourceRef && <p className={`mt-2 ${caption}`}>Ref. {entry.sourceRef}</p>}

                    {description && <p className={`mt-6 line-clamp-6 max-w-[30rem] ${body}`}>{description}</p>}

                    <Facts className="mt-8 max-w-[30rem] lg:mt-auto" items={workFacts(entry)} />
                    <TextLink href={entry.href} className="mt-6 self-start text-[0.8125rem]">
                        View the full record
                    </TextLink>
                </div>

                <figure className={rightPage}>
                    <Link href={entry.href} tabIndex={-1} aria-hidden className="relative block aspect-[4/3] w-full lg:aspect-auto lg:flex-1">
                        {entry.images[0] && (
                            <Image
                                src={entry.images[0]}
                                alt=""
                                fill
                                className="object-contain object-right-bottom"
                                sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                priority={priority}
                            />
                        )}
                    </Link>
                    <figcaption className={`mt-2 text-right ${caption}`}>
                        {entry.title}, {entry.date}
                        {entry.medium ? `, ${entry.medium}` : ""}
                    </figcaption>
                </figure>
            </SpreadGrid>
        </SpreadPanel>
    );
}
