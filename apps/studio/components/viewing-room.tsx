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
// label, low and quiet. On a phone the picture comes first and the words follow.

const rule = "border-foreground/15";
/** The catalogue number and the way around: small, spaced, monospaced capitals, as in the catalogue. */
const caps = "font-mono text-[0.625rem] uppercase tracking-[0.16em] text-foreground/45";
/** The equal step between the label's groups. */
const step = "mt-[clamp(1.5rem,3.5vh,2.5rem)]";

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
    const materials = work.materials && work.materials !== work.medium ? work.materials : null;
    const tombstone = [work.medium, materials, work.dimensions].filter(Boolean);
    const navLink = "transition-colors hover:text-foreground";

    return (
        <div className="flex w-full flex-col">
            <p className={`${caps} tabular-nums`}>
                Cat. {work.label}
                {work.series && <span className="ml-3">{work.series}</span>}
            </p>

            <h1 className="mt-3 font-serif text-[clamp(1.5rem,1.9vw,2rem)] leading-[1.08] tracking-[-0.01em] text-foreground">{work.title}</h1>
            {work.year && <p className="mt-1 font-serif text-[0.875rem] text-foreground/50">{work.year}</p>}
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
    // On a phone the picture's box takes the photograph's own proportions.
    const aspectRatio = proportion.ratio ?? (proportion.shape === "landscape" ? 3 / 2 : 4 / 5);

    return (
        <StudioFrame current="/paintings-and-drawings" className="overflow-y-auto">
            <ArrowKeys previous={previous?.href} next={next?.href} />
            <section className="flex flex-col gap-10 py-[clamp(1.25rem,2.5vh,2rem)] lg:h-full lg:flex-row-reverse lg:gap-[clamp(2rem,4vw,4rem)]">
                <div style={{ aspectRatio }} className="w-full lg:aspect-auto! lg:h-full lg:min-w-0 lg:flex-1">
                    <WorkPicture key={work.id} images={work.images} title={work.title} sizes="(min-width: 64rem) 65vw, 100vw" />
                </div>
                {/* The column scrolls on its own if the label outgrows a short screen. */}
                <aside className="flex lg:h-full lg:w-[clamp(18rem,26vw,24rem)] lg:shrink-0 lg:overflow-y-auto">
                    <div className="flex w-full lg:mt-auto">
                        <Label work={work} previous={previous} next={next} />
                    </div>
                </aside>
            </section>
        </StudioFrame>
    );
}
