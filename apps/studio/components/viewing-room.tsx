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
            <SiteHeader shelf={work.availability} />
            <div className="room">
                <WorkPicture key={work.id} images={work.images} title={work.title} />

                <aside className="room-label flex flex-col px-5 py-6 sm:px-6 sm:py-8">
                    <p className="text-[0.8125rem] text-mute">Bandu Manamperi</p>
                    <h1 className="mt-2 text-[1.75rem] font-light leading-tight tracking-[-0.02em]">{heading}</h1>
                    <p className="mt-2 text-[0.8125rem] tabular-nums text-mute">
                        {work.sourceRef ? `${work.label}, ref. ${work.sourceRef}` : work.label}
                    </p>

                    {facts.length > 0 && (
                        <ul className="mt-6 space-y-1 text-[0.9375rem] leading-snug">
                            {facts.map((fact) => (
                                <li key={fact}>{fact}</li>
                            ))}
                        </ul>
                    )}

                    {work.description && (
                        <p className="mt-6 text-[0.9375rem] leading-relaxed text-ink/80">{work.description}</p>
                    )}

                    <div className="mt-8 lg:mt-auto lg:pt-10">
                        {line && (
                            <p className={line.figure ? "text-[1.75rem] font-light tabular-nums tracking-[-0.02em]" : "text-[1.125rem]"}>
                                {line.text}
                            </p>
                        )}
                        {work.availability === "available" && (
                            <Link
                                href={`${work.href}/enquire`}
                                className="mt-5 inline-block underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
                            >
                                Enquire
                            </Link>
                        )}
                    </div>
                </aside>

                <WorkIndex works={shelf} currentId={work.id} />
            </div>
        </>
    );
}
