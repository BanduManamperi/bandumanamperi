import Link from "next/link";
import type { Offer } from "@/lib/inventory";
import type { Proportion } from "@/lib/image-shape";
import { offerLine } from "@/lib/price";
import { ArrowKeys } from "@/components/arrow-keys";
import { ReadMore } from "@/components/read-more";
import { StudioFrame } from "@/components/studio-frame";
import { WorkPicture } from "@/components/work-picture";

// A work on one screen, inside the studio frame, set down the middle of it:
// a line of small capitals naming where it sits, the picture as large as the
// screen allows, then a ruled row of words read like a wall label (the title,
// what it is made of and its size, and what to do next), and the way on
// through the catalogue beneath. On a phone the label's row folds onto two.

/** Small, spaced, monospaced capitals, as in the catalogue. */
const mono = "font-mono text-[0.625rem] uppercase tracking-[0.12em] text-foreground/65";

/** Letters and numbers only, lower case, so "The “Fish”" reads as "the fish". */
function fold(text: string): string {
    return text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim();
}

export function ViewingRoom({ work, catalogue, proportion }: { work: Offer; catalogue: Offer[]; proportion: Proportion }) {
    const at = catalogue.findIndex((entry) => entry.id === work.id);
    const previous = catalogue[at - 1];
    const next = catalogue[at + 1];
    const ratio = proportion.ratio ?? (proportion.shape === "landscape" ? 3 / 2 : 4 / 5);
    const offer = offerLine(work);
    const available = work.availability === "available";

    // The series is left off when the title already says it, and the line
    // above the picture names the selection instead.
    const series = work.series && !` ${fold(work.title)} `.includes(` ${fold(work.series)} `) ? work.series : null;
    const materials = work.materials && work.materials !== work.medium ? work.materials : null;
    const tombstone = [work.medium, materials, work.dimensions].filter(Boolean);

    // The picture is as tall as 61% of the screen, up to 615px, but never so
    // tall that the label and the way on are pushed below the fold: the rest of
    // the column, and the view switcher when there is one, keep their room.
    const views = work.images.length > 1 ? "1.75rem" : "0rem";
    const height = `max(14rem, min(61dvh, 38.4375rem, 100dvh - 22rem - ${views}))`;
    const picture = { width: `min(100%, ${ratio} * ${height})` };

    const navLink = "transition-colors hover:text-foreground hover:underline underline-offset-4";

    return (
        <StudioFrame current="/paintings-and-drawings" className="overflow-y-auto">
            <ArrowKeys previous={previous?.href} next={next?.href} />
            {/* Centred only while it fits: on a short screen it runs on downward and the page scrolls. */}
            <div className="flex min-h-full flex-col justify-center-safe pb-5 pt-[1.625rem]">
                <div className="mx-auto w-full max-w-[58.125rem]">
                    <p className={`mb-[1.125rem] flex justify-between gap-6 ${mono} tracking-[0.13em]`}>
                        <span className="tabular-nums">Works / {work.label}</span>
                        <span className="flex gap-x-[1.25em] text-right">
                            <span>{series ?? "Selected works"}</span>
                            {work.year && <span className="tabular-nums">{work.year}</span>}
                        </span>
                    </p>

                    <div style={picture} className="mx-auto">
                        <WorkPicture key={work.id} images={work.images} title={work.title} ratio={ratio} sizes="(min-width: 64rem) 58rem, 100vw" />
                    </div>

                    <section
                        aria-label="About the work"
                        className="mt-[1.1875rem] grid grid-cols-2 gap-[1.125rem] border-t border-border pt-[1.1875rem] md:grid-cols-[1.45fr_1fr_0.85fr] md:gap-7"
                    >
                        <div className="col-span-2 md:col-span-1">
                            <p className={`${mono} tabular-nums`}>Cat. {work.label}</p>
                            <h1 className="mb-0.5 mt-[0.4375rem] font-serif text-[1.5625rem] leading-[1.12] tracking-[-0.025em] text-foreground md:text-[1.6875rem]">
                                {work.title}
                            </h1>
                            {work.year && <span className="text-[0.75rem] tabular-nums text-foreground/75">{work.year}</span>}
                        </div>

                        {/* Kept even when empty, so the actions stay in their own column. */}
                        <p className="self-start text-[0.75rem] leading-[1.7] text-foreground/75 md:self-center">
                            {tombstone.map((fact) => (
                                <span key={fact} className="block">
                                    {fact}
                                </span>
                            ))}
                        </p>

                        <div className="flex flex-col items-start gap-[0.8125rem] self-start md:gap-[0.9375rem] md:self-center">
                            {work.description && <ReadMore title={work.title} year={work.year} text={work.description} className="text-[0.75rem] text-foreground/75" />}
                            {available && offer && <span className="text-[0.75rem] tabular-nums text-foreground">{offer.text}</span>}
                            {available && (
                                <Link
                                    href={`${work.href}/enquire`}
                                    className="text-[0.75rem] font-semibold text-foreground underline decoration-foreground/60 underline-offset-4 transition-colors hover:decoration-foreground"
                                >
                                    Enquire about this work <span aria-hidden="true">→</span>
                                </Link>
                            )}
                        </div>
                    </section>

                    <nav
                        aria-label="Catalogue"
                        className="mt-[1.375rem] flex items-center justify-between gap-x-[2.875rem] pb-[1.125rem] font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-foreground/75 md:justify-start md:pb-0"
                    >
                        {previous && (
                            <Link href={previous.href} className={navLink} aria-label={`Previous: ${previous.title}`} aria-keyshortcuts="ArrowLeft">
                                ← Previous
                            </Link>
                        )}
                        {next && (
                            <Link href={next.href} className={navLink} aria-label={`Next: ${next.title}`} aria-keyshortcuts="ArrowRight">
                                Next →
                            </Link>
                        )}
                        <Link href="/paintings-and-drawings" className={navLink}>
                            Catalogue
                        </Link>
                    </nav>
                </div>
            </div>
        </StudioFrame>
    );
}
