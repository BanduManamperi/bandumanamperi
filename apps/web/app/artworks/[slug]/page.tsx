import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCatalogueEntry, type CatalogueEntry } from "@/lib/data/artworks";
import { SpreadGrid, SpreadPanel, SpreadRow, leftPage, rightPage } from "@/components/sheet/spread";
import { Facts, TextLink, body, caption, title } from "@/components/sheet/type";
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
        description: entry.description || `${entry.title} by Bandu Manamperi. ${summary}.`,
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

                        {entry.description && <p className={`mt-6 max-w-[30rem] ${body}`}>{entry.description}</p>}

                        <Facts
                            className="mt-8 max-w-[30rem] lg:mt-auto"
                            items={[
                                { label: "Date", value: entry.date },
                                { label: "Medium", value: entry.medium },
                                { label: "Dimensions", value: entry.dimensions },
                                { label: "Series", value: entry.series },
                                { label: "Plates", value: plates > 1 ? `${plates}, turn the page for the rest` : null },
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
                                    className="object-contain object-left-bottom"
                                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                />
                            )}
                        </div>
                        <figcaption className={`mt-2 ${caption}`}>
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
                                    className="object-contain object-left-bottom"
                                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                                />
                            </div>
                            <figcaption className={`mt-2 ${caption}`}>
                                Plate {i + 2} of {plates}. {entry.title}, {entry.date}
                            </figcaption>
                        </figure>
                    </SpreadGrid>
                </SpreadPanel>
            ))}
        </SpreadRow>
    );
}
