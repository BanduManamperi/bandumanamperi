import React from "react";
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
import { SpreadGrid, leftPage, rightPageBleed } from "@/components/sheet/spread";
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

export function exhibitionHref(ex: Exhibition) {
    return `/exhibitions/${generateExhibitionSlug(ex.name, getExhibitionYear(ex))}`;
}

// One exhibition laid out as a portfolio spread: status, title, a few lines
// and the facts on the left page, the cover image across the right.
// `children` lands at the foot of the left page (e.g. a list of other shows).
export function ExhibitionSpread({
    exhibition,
    headingLevel = "h2",
    priority = false,
    children,
}: {
    exhibition: Exhibition;
    headingLevel?: "h1" | "h2";
    priority?: boolean;
    children?: React.ReactNode;
}) {
    const status = getExhibitionScheduleStatus(exhibition);
    const image = getExhibitionImageUrl(exhibition.coverImage) || PLACEHOLDERS.exhibition.url;
    const href = exhibitionHref(exhibition);
    const Heading = headingLevel;

    return (
        <SpreadGrid>
            <div className={leftPage}>
                <p className="flex items-center gap-2 text-[0.75rem] text-foreground">
                    <span className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`} aria-hidden />
                    {getExhibitionScheduleLabel(status)}
                </p>

                <Heading className={`mt-4 ${title}`}>{exhibition.name}</Heading>

                {exhibition.about && <p className={`mt-5 line-clamp-4 max-w-[30rem] ${body}`}>{exhibition.about}</p>}

                <Facts
                    className="mt-6 max-w-[30rem]"
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

                {children}
            </div>

            <figure className={rightPageBleed}>
                <Link
                    href={href}
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
        </SpreadGrid>
    );
}
