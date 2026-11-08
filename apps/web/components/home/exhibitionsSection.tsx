import Link from "next/link";
import type { Exhibition } from "@/lib/actions/exhibitions";
import {
    formatExhibitionSchedule,
    getExhibitionScheduleStatus,
    getExhibitionYear,
    getHomepageEventLabel,
} from "@bandumanamperi/types";
import { Spread, SpreadGrid, belowStandfirst, footStandfirst, leftPage } from "@/components/sheet/spread";
import { TextLink, body, caption, display, heading } from "@/components/sheet/type";
import {
    ExhibitionCover,
    exhibitionHref,
    exhibitionStandfirst,
    statusDotClass,
} from "@/components/exhibitions/exhibition-spread";

// How many of the other shows the list has room for before "All exhibitions".
const LIST_LIMIT = 5;

// The home page's exhibitions spread: the latest show as a promo at the foot of
// the left page with its cover across the right, the rest listed beneath it.
// `exhibitions` arrives sorted for display, so the first is the latest.
export function ExhibitionsSection({ exhibitions, index }: { exhibitions: Exhibition[]; index: number }) {
    const [latest, ...others] = exhibitions;
    if (!latest) return null;

    const rest = others.slice(0, LIST_LIMIT);
    const status = getExhibitionScheduleStatus(latest);
    const href = exhibitionHref(latest);
    const standfirst = exhibitionStandfirst(latest.about ?? "");

    return (
        <Spread index={index}>
            <SpreadGrid>
                <div className={leftPage}>
                    <h2 className={display}>Exhibitions</h2>

                    <div className={`${footStandfirst} max-w-[30rem]`}>
                        <p className="flex items-center gap-2 text-[0.75rem] text-foreground">
                            <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`} aria-hidden />
                            {getHomepageEventLabel(status)}
                        </p>
                        <h3 className={`mt-3 ${heading}`}>
                            <Link href={href} className="hover:underline hover:decoration-foreground/40 hover:underline-offset-4">
                                {latest.name}
                            </Link>
                        </h3>
                        <p className={`mt-1 ${caption}`}>
                            {formatExhibitionSchedule(latest)}
                            {latest.venue ? `, ${latest.venue}` : ""}
                        </p>
                        {standfirst && <p className={`mt-4 ${body}`}>{standfirst}</p>}
                        <TextLink href={href} className="mt-4 inline-block text-[0.8125rem]">
                            View exhibition
                        </TextLink>
                    </div>

                    <div className={`${belowStandfirst} max-w-[30rem]`}>
                        <div className="flex items-baseline justify-between border-b border-border pb-2 text-[0.75rem]">
                            <span className="text-muted-foreground">{rest.length > 0 ? "More exhibitions" : "Exhibitions"}</span>
                            <TextLink href="/exhibitions">All exhibitions</TextLink>
                        </div>
                        {rest.length > 0 && (
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
                        )}
                    </div>
                </div>

                <ExhibitionCover exhibition={latest} />
            </SpreadGrid>
        </Spread>
    );
}
