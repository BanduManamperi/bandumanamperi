import Link from "next/link";
import type { Offer } from "@/lib/inventory";
import { offerLine } from "@/lib/price";
import { WorkIndex } from "@/components/work-index";
import { WorkPicture } from "@/components/work-picture";
import { SiteHeader } from "@/components/site-header";

export function ViewingRoom({ work, shelf }: { work: Offer; shelf: Offer[] }) {
    const line = offerLine(work);
    const facts = [
        work.medium,
        work.materials && work.materials !== work.medium ? work.materials : null,
        work.dimensions,
        work.series,
    ].filter((fact): fact is string => Boolean(fact));
    const heading = work.year ? `${work.title}, ${work.year}` : work.title;

    return (
        <>
            <SiteHeader section="paintings" shelf={work.availability} />
            <div className="room">
                {/* The picture fills the stage; the label floats over its bottom
                    corner on a wide screen, like a card mounted beside a painting
                    on a gallery wall, rather than taking its own column. */}
                <div className="room-stage">
                    <WorkPicture key={work.id} images={work.images} title={work.title} />

                    <aside className="flex flex-col gap-1 border-t border-room-line bg-room-paper px-5 py-5 sm:px-6 sm:py-6 lg:absolute lg:bottom-6 lg:left-6 lg:max-h-[65%] lg:w-[22rem] lg:overflow-y-auto lg:rounded-sm lg:border lg:border-room-line lg:bg-room-paper/95 lg:px-6 lg:py-6 lg:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)] lg:backdrop-blur-sm">
                        <p className="text-[0.75rem] text-room-mute">Bandu Manamperi</p>
                        <h1 className="text-[1.375rem] font-bold leading-tight tracking-[-0.01em]">{heading}</h1>
                        <p className="text-[0.75rem] tabular-nums text-room-mute">
                            {work.sourceRef ? `${work.label}, ref. ${work.sourceRef}` : work.label}
                        </p>

                        {facts.length > 0 && <p className="mt-3 text-[0.8125rem] leading-snug">{facts.join(", ")}</p>}

                        {work.description && (
                            <p className="mt-3 text-[0.8125rem] leading-relaxed text-room-ink/80">{work.description}</p>
                        )}

                        <div className="mt-4 flex items-baseline gap-4">
                            {line && (
                                <span className={line.figure ? "text-[1.125rem] font-bold tabular-nums tracking-[-0.01em]" : "text-[0.9375rem]"}>
                                    {line.text}
                                </span>
                            )}
                            {work.availability === "available" && (
                                <Link
                                    href={`${work.href}/enquire`}
                                    className="underline decoration-room-ink/30 underline-offset-4 hover:decoration-room-ink"
                                >
                                    Enquire
                                </Link>
                            )}
                        </div>
                    </aside>
                </div>

                <WorkIndex works={shelf} currentId={work.id} />
            </div>
        </>
    );
}
