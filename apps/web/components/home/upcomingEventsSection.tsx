import Link from "next/link";
import type { Exhibition } from "@/lib/actions/exhibitions";
import { getExhibitionYear } from "@bandumanamperi/types";
import { Spread } from "@/components/sheet/spread";
import { ExhibitionSpread, exhibitionHref } from "@/components/exhibitions/exhibition-spread";

interface UpcomingEventsSectionProps {
    exhibitions: Exhibition[];
}

export function UpcomingEventsSection({ exhibitions }: UpcomingEventsSectionProps) {
    if (exhibitions.length === 0) return null;

    const [featured, ...others] = exhibitions;
    const rest = others.slice(0, 3);

    return (
        <Spread section="Exhibitions" index={3}>
            <ExhibitionSpread exhibition={featured}>
                {rest.length > 0 && (
                    <div className="mt-10 lg:mt-auto lg:pt-8">
                        <div className="flex items-baseline justify-between border-b border-border pb-2 text-[0.75rem]">
                            <span className="text-muted-foreground">Also</span>
                            <Link
                                href="/exhibitions"
                                className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                            >
                                All exhibitions
                            </Link>
                        </div>
                        <ul>
                            {rest.map((ex, i) => (
                                <li key={ex.id ?? `${ex.name}-${i}`} className="border-b border-border">
                                    <Link
                                        href={exhibitionHref(ex)}
                                        className="flex items-baseline gap-3 py-2.5 text-[0.8125rem] text-foreground/70 transition-colors hover:text-foreground"
                                    >
                                        <span className="w-9 shrink-0 tabular-nums text-muted-foreground">{getExhibitionYear(ex) || ""}</span>
                                        <span className="truncate">{ex.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </ExhibitionSpread>
        </Spread>
    );
}
