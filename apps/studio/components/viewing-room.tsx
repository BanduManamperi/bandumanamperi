import Link from "next/link";
import type { Offer } from "@/lib/inventory";
import type { Proportion } from "@/lib/image-shape";
import { offerLine } from "@/lib/price";
import { ArrowKeys } from "@/components/arrow-keys";
import { ReadMore } from "@/components/read-more";
import { StudioFrame } from "@/components/studio-frame";
import { WorkPicture } from "@/components/work-picture";

// A work on one screen, inside the studio frame: the picture as large as the
// sheet allows, and beside it on the left a column of words read like a wall
// label, low and quiet, its last line level with the bottom edge of the work.
// On a phone the picture comes first and the words follow.

const rule = "border-foreground/15";
/** The catalogue number and the way around: small, spaced, monospaced capitals, as in the catalogue. */
const caps = "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/65";
/** The equal step between the label's groups. */
const step = "mt-[clamp(1.5rem,3.5vh,2.5rem)]";

/** Letters and numbers only, lower case, so "The “Fish”" reads as "the fish". */
function fold(text: string): string {
    return text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}]+/gu, " ").trim();
}

/*
 * The label is set in five distinct levels, so the eye lands on them in order
 * rather than all at once:
 *
 *   1. the title, large and dark: what the work is called
 *   2. the tombstone: year, medium and size, as on a museum label
 *   3. the description, behind a link that opens it to read at length
 *   4. the enquiry: the one thing to act on, with its price
 *   5. the catalogue number and the way around, small, spaced capitals, last
 *
 * Proximity carries the grouping: the tombstone sits tight under the title,
 * and each group after it is separated by the same larger step.
 */
function Label({ work, previous, next }: { work: Offer; previous?: Offer; next?: Offer }) {
    const offer = offerLine(work);
    // The series is left off when the title already says it.
    const series = work.series && !` ${fold(work.title)} `.includes(` ${fold(work.series)} `) ? work.series : null;
    const materials = work.materials && work.materials !== work.medium ? work.materials : null;
    const tombstone = [work.medium, materials, work.dimensions].filter(Boolean);
    // A taller hit area than the small capitals show, without moving them.
    const navLink = "-my-2 py-2 transition-colors hover:text-foreground";

    return (
        <div className="flex w-full flex-col">
            <p className={`${caps} tabular-nums`}>
                Cat. {work.label}
                {series && <span className="ml-3">{series}</span>}
            </p>

            <h1 className="mt-3 font-serif text-[clamp(1.5rem,1.9vw,2rem)] leading-[1.08] tracking-[-0.01em] text-foreground">{work.title}</h1>
            {work.year && <p className="mt-1 font-serif text-[0.875rem] text-foreground/65">{work.year}</p>}
            {tombstone.length > 0 && (
                <p className="mt-4 text-[0.875rem] leading-relaxed text-foreground/85">
                    {tombstone.map((fact) => (
                        <span key={fact} className="block">
                            {fact}
                        </span>
                    ))}
                </p>
            )}

            {work.description && (
                <ReadMore title={work.title} year={work.year} text={work.description} className={`${step} self-start text-[0.8125rem] text-foreground/75`} />
            )}

            {work.availability === "available" && (
                <div className={`${step} flex items-baseline gap-5`}>
                    {offer && <span className="text-[0.875rem] tabular-nums text-foreground">{offer.text}</span>}
                    <Link
                        href={`${work.href}/enquire`}
                        className="text-[0.875rem] font-medium text-foreground underline decoration-foreground/40 underline-offset-[5px] transition-colors hover:decoration-foreground"
                    >
                        Enquire about this work →
                    </Link>
                </div>
            )}

            <nav aria-label="Catalogue" className={`${step} flex items-baseline gap-5 border-t ${rule} pt-3 ${caps}`}>
                {/* At either end of the catalogue the missing link keeps its place, so the other never moves. */}
                {previous ? (
                    <Link href={previous.href} className={navLink} aria-label={`Previous: ${previous.title}`} aria-keyshortcuts="ArrowLeft">
                        ← Previous
                    </Link>
                ) : (
                    <span aria-hidden="true" className="invisible">
                        ← Previous
                    </span>
                )}
                {next ? (
                    <Link href={next.href} className={navLink} aria-label={`Next: ${next.title}`} aria-keyshortcuts="ArrowRight">
                        Next →
                    </Link>
                ) : (
                    <span aria-hidden="true" className="invisible">
                        Next →
                    </span>
                )}
                <Link href="/paintings-and-drawings" className={`${navLink} ml-auto`}>
                    Catalogue
                </Link>
            </nav>
        </div>
    );
}

export function ViewingRoom({ work, catalogue, proportion }: { work: Offer; catalogue: Offer[]; proportion: Proportion }) {
    const at = catalogue.findIndex((entry) => entry.id === work.id);
    const previous = catalogue[at - 1];
    const next = catalogue[at + 1];
    const ratio = proportion.ratio ?? (proportion.shape === "landscape" ? 3 / 2 : 4 / 5);

    // On a wide screen the picture is as large as the stage allows: the full
    // width beside the label, or the full height less the view switcher,
    // whichever runs out first. The picture and the label stand on one line,
    // and the two are centred on the stage together.
    const stage = {
        "--label": "clamp(18rem, 26vw, 24rem)",
        "--gap": "clamp(2rem, 4vw, 4rem)",
        "--views": work.images.length > 1 ? "1.75rem" : "0rem",
        "--fit": `min(100cqw - var(--label) - var(--gap), (100cqh - var(--views)) * ${ratio})`,
    } as React.CSSProperties;

    return (
        <StudioFrame current="/paintings-and-drawings" className="overflow-y-auto">
            <ArrowKeys previous={previous?.href} next={next?.href} />
            <section style={stage} className="py-[clamp(1.25rem,2.5vh,2rem)] lg:h-full">
                {/* Centred only while it fits: a label taller than a short screen runs on downward and the page scrolls. */}
                <div className="lg:flex lg:h-full lg:flex-col lg:justify-center-safe lg:[container-type:size]">
                    <div className="flex flex-col gap-10 lg:flex-row-reverse lg:items-end lg:gap-(--gap)">
                        <div className="lg:flex lg:min-w-0 lg:flex-1 lg:justify-center">
                            <div className="w-full lg:w-(--fit)">
                                <WorkPicture key={work.id} images={work.images} title={work.title} ratio={ratio} sizes="(min-width: 64rem) 65vw, 100vw" />
                            </div>
                        </div>
                        {/* Lifted by the switcher's height, so its last line meets the picture, not the switcher. */}
                        <aside className="flex lg:mb-(--views) lg:w-(--label) lg:shrink-0">
                            <Label work={work} previous={previous} next={next} />
                        </aside>
                    </div>
                </div>
            </section>
        </StudioFrame>
    );
}
