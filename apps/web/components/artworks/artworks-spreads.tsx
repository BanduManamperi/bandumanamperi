import Image from "next/image";
import Link from "next/link";
import type { CatalogueEntry } from "@/lib/data/artworks";
import { SpreadGrid, SpreadPanel, SpreadRow, belowStandfirst, footStandfirst, leftPage, rightPage, rightPageAfterText } from "@/components/sheet/spread";
import { PanelLink } from "@/components/sheet/panel-link";
import { WorkSpreadPanel } from "@/components/artworks/work-spread";
import { Facts, TextLink, body, caption, display } from "@/components/sheet/type";

type Props = {
    latest: CatalogueEntry[];
    archive: CatalogueEntry[];
    /** The work that opens the page, and the photograph to show it with. */
    intro?: { entry: CatalogueEntry; image: string | undefined };
};

const workPanelId = (e: CatalogueEntry) => `work-${e.label}`;

// One work stands for the set. A latest work opens onto its spread; one from
// the archive, onto its record.
function IntroFigure({ entry, image }: { entry: CatalogueEntry; image: string | undefined }) {
    const label = `${entry.title}, cat. ${entry.label}`;
    const linkClass =
        "relative block aspect-[4/3] w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 lg:aspect-auto lg:flex-1";
    const picture = image && (
        <Image
            src={image}
            alt=""
            fill
            priority
            className="object-contain object-left-bottom"
            sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
        />
    );

    return (
        <figure className={rightPage}>
            {entry.shelf === "latest" ? (
                <PanelLink panelId={workPanelId(entry)} aria-label={label} className={linkClass}>
                    {picture}
                </PanelLink>
            ) : (
                <Link href={entry.href} aria-label={label} className={linkClass}>
                    {picture}
                </Link>
            )}
            <figcaption className={`mt-2 ${caption}`}>
                {/* "n.d." already ends the sentence; don't add a second period */}
                Cat. {entry.label}, {entry.title}, {entry.date}
                {entry.date.endsWith(".") ? "" : "."}
                {entry.shelf === "archive" ? " From the archive." : ""}
            </figcaption>
        </figure>
    );
}

export function ArtworksSpreads({ latest, archive, intro }: Props) {
    const series = [...new Set(latest.map((e) => e.series).filter(Boolean))] as string[];

    return (
        <SpreadRow>
            {/* Intro */}
            <SpreadPanel id="panel-artworks" label="Artworks" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h1 className={display}>Artworks</h1>
                        <p className={`${footStandfirst} max-w-[30rem] ${body}`}>
                            These works do not simply depict, they excavate. Across painting,
                            drawing, sculpture, and photography, Manamperi returns again and again
                            to the sites where history leaves its marks on the body.
                        </p>
                        <Facts
                            className={`${belowStandfirst} max-w-[30rem]`}
                            items={[
                                { label: "Shown here", value: `The ${latest.length} most recently catalogued works` },
                                { label: "Series", value: series.join(", ") || null },
                                {
                                    label: "Archive",
                                    value: archive.length > 0 ? <TextLink href="/archive">{archive.length} earlier works</TextLink> : null,
                                },
                            ]}
                        />
                    </div>

                    {intro && <IntroFigure entry={intro.entry} image={intro.image} />}
                </SpreadGrid>
            </SpreadPanel>

            {/* One spread per work */}
            {latest.map((e, i) => (
                <WorkSpreadPanel
                    key={e.id}
                    entry={e}
                    panelId={workPanelId(e)}
                    index={i + 2}
                    priority={i < 2}
                />
            ))}

            {/* Into the archive */}
            {archive.length > 0 && (
                <SpreadPanel id="panel-artworks-archive" label="Archive" index={latest.length + 2}>
                    <SpreadGrid>
                        <div className={leftPage}>
                            <h2 className={display}>Archive</h2>
                            <p className={`${footStandfirst} max-w-[30rem] ${body}`}>
                                Earlier works are kept in the archive, catalogued in the order they
                                were entered, with dates and titles recorded where they are known.
                            </p>
                            <TextLink href="/archive" className={`${belowStandfirst} self-start text-[0.8125rem]`}>
                                Open the archive, {archive.length} works
                            </TextLink>
                        </div>

                        <div className={rightPageAfterText}>
                            <Link
                                href="/archive"
                                tabIndex={-1}
                                aria-hidden
                                className="grid grid-cols-6 gap-1.5 opacity-70 transition-opacity hover:opacity-100 sm:grid-cols-8 lg:h-full lg:content-center"
                            >
                                {archive.slice(0, 32).map((e) => (
                                    <span key={e.id} className="relative block aspect-square overflow-hidden bg-[var(--sheet-rule)]">
                                        {e.images[0] && (
                                            <Image src={e.images[0]} alt="" fill className="object-cover grayscale" sizes="8vw" />
                                        )}
                                    </span>
                                ))}
                            </Link>
                        </div>
                    </SpreadGrid>
                </SpreadPanel>
            )}
        </SpreadRow>
    );
}
