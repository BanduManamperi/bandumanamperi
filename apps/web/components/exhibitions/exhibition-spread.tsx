import Image from "next/image";
import Link from "next/link";
import type { Exhibition } from "@/lib/actions/exhibitions";
import {
    formatExhibitionSchedule,
    getExhibitionScheduleLabel,
    getExhibitionScheduleStatus,
    getExhibitionYear,
    type ExhibitionScheduleStatus,
} from "@bandumanamperi/types";
import { generateExhibitionSlug, getExhibitionImageUrl } from "@/lib/utils/supabase-storage";
import { PLACEHOLDERS } from "@/lib/utils/image-placeholders";
import { SpreadGrid, belowStandfirst, footStandfirst, leftPage, rightPageBleed } from "@/components/sheet/spread";
import { Facts, TextLink, body, caption, title } from "@/components/sheet/type";

export const EXHIBITION_TYPE_LABEL: Record<Exhibition["type"], string> = {
    solo: "Solo exhibition",
    group: "Group exhibition",
    online: "Online exhibition",
};

export function statusDotClass(status: ExhibitionScheduleStatus): string {
    switch (status) {
        case "ongoing":
            return "bg-emerald-600";
        case "upcoming":
            return "bg-amber-600";
        default:
            return "bg-muted-foreground/50";
    }
}

// The few lines a spread has room for, in whole sentences from the first
// paragraph, so the text ends on a full stop rather than mid-phrase. Press
// texts are long and arrive with paragraph breaks flattened to double spaces.
const STANDFIRST_CHARS = 240;

export function exhibitionStandfirst(about: string): string {
    const paragraph = about.split(/\n+|\s{2,}/).map((p) => p.trim()).find(Boolean) ?? "";
    // Split after a full stop that ends a sentence, not an initial ("S. H. Sarath").
    const sentences = paragraph.split(/(?<=(?<!\b[A-Z])[.!?][’'"]?)\s+(?=[‘'"A-Z])/);
    let out = sentences[0] ?? "";
    for (const sentence of sentences.slice(1)) {
        if (out.length + 1 + sentence.length > STANDFIRST_CHARS) break;
        out += ` ${sentence}`;
    }
    return out;
}

export function exhibitionHref(ex: Exhibition) {
    return `/exhibitions/${generateExhibitionSlug(ex.name, getExhibitionYear(ex))}`;
}

/** The id of an exhibition's spread on /exhibitions, so its record can link back to it. */
export function exhibitionPanelId(ex: Exhibition) {
    return `exhibition-${generateExhibitionSlug(ex.name, getExhibitionYear(ex))}`;
}

/** An exhibition's cover as the right page of a spread, linked to its record. */
export function ExhibitionCover({ exhibition, priority = false }: { exhibition: Exhibition; priority?: boolean }) {
    const image = getExhibitionImageUrl(exhibition.coverImage) || PLACEHOLDERS.exhibition.url;
    return (
        <figure className={rightPageBleed}>
            <Link
                href={exhibitionHref(exhibition)}
                tabIndex={-1}
                aria-hidden
                className="relative block aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1"
            >
                <Image
                    src={image}
                    alt=""
                    fill
                    priority={priority}
                    className="object-cover"
                    sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                />
            </Link>
            <figcaption className={`mt-2 ${caption}`}>
                {exhibition.name}
                {exhibition.venue ? `, ${exhibition.venue}` : ""}
            </figcaption>
        </figure>
    );
}

// One exhibition laid out as a portfolio spread: status and title at the head
// of the left page, a few lines and the facts at its foot, the cover image
// across the right.
export function ExhibitionSpread({
    exhibition,
    headingLevel = "h2",
    priority = false,
}: {
    exhibition: Exhibition;
    headingLevel?: "h1" | "h2";
    priority?: boolean;
}) {
    const status = getExhibitionScheduleStatus(exhibition);
    const href = exhibitionHref(exhibition);
    const Heading = headingLevel;
    const standfirst = exhibitionStandfirst(exhibition.about ?? "");

    return (
        <SpreadGrid>
            <div className={leftPage}>
                <p className="flex items-center gap-2 text-[0.75rem] text-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`} aria-hidden />
                    {getExhibitionScheduleLabel(status)}
                </p>

                <Heading className={`mt-4 ${title}`}>{exhibition.name}</Heading>

                {standfirst && <p className={`${footStandfirst} max-w-[30rem] ${body}`}>{standfirst}</p>}

                <Facts
                    className={`${standfirst ? belowStandfirst : footStandfirst} max-w-[30rem]`}
                    labelWidth="4.5rem"
                    items={[
                        { label: "Dates", value: formatExhibitionSchedule(exhibition) },
                        { label: "Venue", value: exhibition.venue },
                        { label: "Type", value: EXHIBITION_TYPE_LABEL[exhibition.type] },
                        { label: "Curator", value: exhibition.curator },
                    ]}
                />

                <TextLink href={href} className="mt-6 self-start text-[0.8125rem]">
                    View exhibition
                </TextLink>
            </div>

            <ExhibitionCover exhibition={exhibition} priority={priority} />
        </SpreadGrid>
    );
}
