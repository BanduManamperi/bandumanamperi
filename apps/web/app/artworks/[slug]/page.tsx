import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { displayDescription, getCatalogueEntry, getRelatedWorks, relationLabel, type CatalogueEntry } from "@/lib/data/artworks";
import { SpreadGrid, SpreadPanel, SpreadRow, leftPage, rightPage } from "@/components/sheet/spread";
import { Facts, TextLink, body, caption, display, title } from "@/components/sheet/type";
import { workFacts } from "@/components/artworks/work-spread";
import { TrackEvent } from "@/components/analytics/track-event";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const record = await getCatalogueEntry(slug);
    if (!record) return { title: "Artwork not found" };

    const { entry } = record;
    const summary = [entry.date, entry.medium].filter(Boolean).join(", ");
    return {
        title: `${entry.title}, cat. ${entry.label}`,
        description: displayDescription(entry) || `${entry.title} by Bandu Manamperi. ${summary}.`,
        openGraph: {
            title: `${entry.title} | Bandu Manamperi`,
            description: entry.description || `${entry.title} by Bandu Manamperi.`,
            images: entry.images[0] ? [entry.images[0]] : undefined,
        },
    };
}

function shelfLink(entry: CatalogueEntry) {
    return entry.shelf === "latest"
        ? { href: `/artworks#work-${entry.label}`, label: "Back to artworks" }
        : { href: "/archive", label: "Back to the archive" };
}

export default async function ArtworkRecordPage({ params }: PageProps) {
    const { slug } = await params;
    const record = await getCatalogueEntry(slug);
    if (!record) notFound();

    const { entry, previous, next, position, shelfSize } = record;
    const shelfName = entry.shelf === "latest" ? "Artworks" : "Archive";
    const back = shelfLink(entry);
    const plates = entry.images.length;
    const description = displayDescription(entry);
    const { family, seriesMates } = await getRelatedWorks(entry);
    const hasRelated = family.length > 0 || seriesMates.length > 0;

    return (
        <SpreadRow>
            <TrackEvent
                event="artwork_viewed"
                properties={{
                    artwork_id: entry.id,
                    artwork_title: entry.title,
                    artwork_slug: slug,
                    artwork_category: entry.category,
                    artwork_series: entry.series,
                    artwork_medium: entry.medium,
                    artwork_year: entry.year,
                }}
            />

            {/* The record */}
            <SpreadPanel id="record" label={`Cat. ${entry.label}`} section={`${shelfName}, cat. ${entry.label}`} index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <p className={`${caption} tabular-nums`}>
                            Cat. no. {entry.label}, {position} of {shelfSize} in {shelfName.toLowerCase()}
                        </p>
                        <h1 className={`mt-3 ${title}`}>{entry.title}</h1>
                        {entry.sourceRef && <p className={`mt-2 ${caption}`}>Ref. {entry.sourceRef}</p>}

                        {description && <p className={`mt-6 max-w-[30rem] ${body}`}>{description}</p>}

                        <Facts
                            className="mt-8 max-w-[30rem] lg:mt-auto"
                            items={[
                                ...workFacts(entry),
                                { label: "Plates", value: plates > 1 ? `${plates}, turn the page for the rest` : null },
                                { label: "Related", value: hasRelated ? "See the last page" : null },
                            ]}
                        />

                        <nav aria-label="Catalogue" className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 text-[0.8125rem]">
                            <TextLink href={back.href}>{back.label}</TextLink>
                            <span className="flex gap-5">
                                {previous && <TextLink href={previous.href}>Previous, {previous.label}</TextLink>}
                                {next && <TextLink href={next.href}>Next, {next.label}</TextLink>}
                            </span>
                        </nav>
                    </div>

                    <figure className={rightPage}>
                        <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:flex-1">
                            {entry.images[0] && (
                                <Image
                                    src={entry.images[0]}
                                    alt={`${entry.title}, ${entry.date}${entry.medium ? `, ${entry.medium}` : ""}`}
                                    fill
                                    priority
                                    className="object-contain object-right-bottom"
                                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                />
                            )}
                        </div>
                        <figcaption className={`mt-2 text-right ${caption}`}>
                            {plates > 1 ? `Plate 1 of ${plates}. ` : ""}
                            {entry.title}, {entry.date}
                        </figcaption>
                    </figure>
                </SpreadGrid>
            </SpreadPanel>

            {/* Further photographs of the same work, one plate per spread */}
            {entry.images.slice(1).map((src, i) => (
                <SpreadPanel
                    key={src}
                    id={`plate-${i + 2}`}
                    label={`Plate ${i + 2}`}
                    section={`${shelfName}, cat. ${entry.label}`}
                    index={i + 2}
                >
                    <SpreadGrid>
                        <div className={leftPage}>
                            <p className={`${caption} tabular-nums`}>
                                Plate {i + 2} of {plates}
                            </p>
                            <p className={`mt-3 ${title}`}>{entry.title}</p>
                        </div>
                        <figure className={rightPage}>
                            <div className="relative aspect-[4/3] w-full lg:aspect-auto lg:flex-1">
                                <Image
                                    src={src}
                                    alt={`${entry.title}, plate ${i + 2}`}
                                    fill
                                    className="object-contain object-right-bottom"
                                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                />
                            </div>
                            <figcaption className={`mt-2 text-right ${caption}`}>
                                Plate {i + 2} of {plates}. {entry.title}, {entry.date}
                            </figcaption>
                        </figure>
                    </SpreadGrid>
                </SpreadPanel>
            ))}
            {/* Works related to this one: its original and editions/versions, then its series */}
            {hasRelated && (
                <SpreadPanel id="related" label="Related works" section={`${shelfName}, cat. ${entry.label}`} index={plates + 1}>
                    <div className="grid h-full grid-cols-1 content-start gap-y-10 py-6 lg:grid-cols-2 lg:gap-x-[clamp(2rem,5vw,6rem)] lg:py-8">
                        {family.length > 0 && (
                            <RelatedList
                                heading={entry.relation ? `Other works from the same original` : `Editions and versions`}
                                works={family}
                                describe={(w) => (w.relation ? relationLabel(w) ?? "" : "Original")}
                            />
                        )}
                        {seriesMates.length > 0 && entry.seriesInfo && (
                            <RelatedList
                                heading={`More from ${entry.seriesInfo.name}`}
                                works={seriesMates}
                                describe={(w) => (w.seriesInfo?.number ? `no. ${w.seriesInfo.number}` : w.date)}
                                more={{ href: `/series/${entry.seriesInfo.slug}`, label: "The whole series" }}
                            />
                        )}
                    </div>
                </SpreadPanel>
            )}
        </SpreadRow>
    );
}

function RelatedList({
    heading,
    works,
    describe,
    more,
}: {
    heading: string;
    works: CatalogueEntry[];
    describe: (work: CatalogueEntry) => string;
    more?: { href: string; label: string };
}) {
    return (
        <section className="min-w-0">
            <h2 className={display.replace("text-[clamp(3rem,4.8vw,6rem)]", "text-[clamp(1.75rem,2.6vw,2.75rem)]")}>{heading}</h2>
            <ul className="mt-6 grid grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
                {works.map((w) => (
                    <li key={w.id}>
                        <Link href={w.href} className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50">
                            <span className="relative block aspect-square overflow-hidden bg-[var(--sheet-rule)]">
                                {w.images[0] && <Image src={w.images[0]} alt="" fill className="object-cover transition-opacity group-hover:opacity-80" sizes="12vw" />}
                            </span>
                            <span className={`mt-1.5 block truncate ${caption}`}>{describe(w)}</span>
                            <span className="sr-only">{w.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            {more && (
                <TextLink href={more.href} className="mt-6 inline-block text-[0.8125rem]">
                    {more.label}
                </TextLink>
            )}
        </section>
    );
}
