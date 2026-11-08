import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getExhibitions, type Exhibition } from "@/lib/actions/exhibitions";
import { getExhibitionImageUrl, generateExhibitionSlug } from "@/lib/utils/supabase-storage";
import { getExhibitionScheduleStatus, getExhibitionYear } from "@bandumanamperi/types";
import { DocumentSheet } from "@/components/sheet/document-sheet";
import { ExhibitionDetail, type ExhibitionDetailData, type ExhibitionStatus } from "@/components/exhibitions/exhibition-detail";
import { exhibitionPanelId } from "@/components/exhibitions/exhibition-spread";

const ARTIST_BLURB =
    "Bandu Manamperi is a Sri Lankan contemporary artist working across performance, sculpture, drawing, and installation, and a founding member and Vice Chairman of Theertha International Artists' Collective. His work has been shown across South Asia, Europe, and Australia.";

function mapExhibition(ex: Exhibition): ExhibitionDetailData {
    const scheduleStatus = getExhibitionScheduleStatus(ex);
    const status: ExhibitionStatus =
        scheduleStatus === "ongoing" ? "on-view" :
        scheduleStatus === "upcoming" ? "upcoming" : "past";

    const typeLabel =
        ex.type === "solo" ? "Solo Exhibition" :
        ex.type === "group" ? "Group Exhibition" : "Online Exhibition";

    // Venue field may encode "Venue Name · Street Address"
    const venueParts = ex.venue.split(" · ");
    const venue = venueParts[0]?.trim() ?? ex.venue;
    const address = venueParts[1]?.trim() ?? "";

    // Split about text into paragraphs (double-newline or single-newline)
    const aboutParagraphs = ex.about
        ? ex.about.split(/\n\n|\n/).map(p => p.trim()).filter(Boolean)
        : [];

    // Reception from startTime/endTime if they exist
    const reception =
        ex.startTime && ex.endTime
            ? { date: ex.startDate, start: ex.startTime, end: ex.endTime }
            : undefined;

    return {
        title: ex.name,
        backHref: `/exhibitions#${exhibitionPanelId(ex)}`,
        status,
        type: typeLabel,
        startDate: ex.startDate,
        endDate: ex.endDate ?? ex.startDate,
        reception,
        venue,
        address,
        curatedBy: ex.curator || undefined,
        coverImage: getExhibitionImageUrl(ex.coverImage) ?? undefined,
        coverAlt: ex.name,
        images: (ex.exhibitionImages ?? []).map((path) => getExhibitionImageUrl(path)).filter((u): u is string => Boolean(u)),
        about: aboutParagraphs,
        artist: {
            name: "Bandu Manamperi",
            blurb: ARTIST_BLURB,
            backgroundHref: "/background",
        },
        timezone: "Asia/Colombo",
    };
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function findExhibition(slug: string) {
    const all = await getExhibitions();
    return all.find((ex) => generateExhibitionSlug(ex.name, getExhibitionYear(ex)) === slug) ?? null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const exhibition = await findExhibition((await params).slug);
    if (!exhibition) return { title: "Exhibition not found" };
    const cover = getExhibitionImageUrl(exhibition.coverImage);
    return {
        title: exhibition.name,
        description: exhibition.about?.slice(0, 160) || `${exhibition.name}, ${exhibition.venue}.`,
        openGraph: { title: `${exhibition.name} | Bandu Manamperi`, images: cover ? [cover] : undefined },
    };
}

export default async function ExhibitionDetailPage({ params }: PageProps) {
    const exhibition = await findExhibition((await params).slug);
    if (!exhibition) notFound();

    return (
        <DocumentSheet>
            <ExhibitionDetail exhibition={mapExhibition(exhibition)} />
        </DocumentSheet>
    );
}
