"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Exhibition } from "@/lib/actions/exhibitions";
import { getExhibitionImageUrl, generateExhibitionSlug } from "@/lib/utils/supabase-storage";
import {
    getExhibitionScheduleStatus,
    getExhibitionYear,
} from "@bandumanamperi/types";
import { VerticalScrollPanel } from "@/components/vertical-scroll-panel";
import { ExhibitionDetail, type ExhibitionDetailData, type ExhibitionStatus } from "@/components/exhibitions/exhibition-detail";

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
        about: aboutParagraphs,
        artist: {
            name: "Bandu Manamperi",
            blurb: ARTIST_BLURB,
            backgroundHref: "/#panel-background",
        },
        timezone: "Asia/Colombo",
    };
}

export default function ExhibitionDetailPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [exhibition, setExhibition] = useState<Exhibition | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetch("/api/exhibitions");
                if (res.ok) {
                    const all: Exhibition[] = await res.json();
                    const found = all.find(ex =>
                        generateExhibitionSlug(ex.name, getExhibitionYear(ex)) === slug
                    );
                    setExhibition(found ?? null);
                }
            } catch (err) {
                console.error("Error loading exhibition:", err);
            }
            setLoading(false);
        };
        load();
    }, [slug]);

    if (loading) {
        return (
            <VerticalScrollPanel label="Exhibition">
                <div className="min-h-full flex items-center justify-center">
                    <p className="font-heading text-sm text-muted-foreground tracking-widest uppercase">
                        Loading…
                    </p>
                </div>
            </VerticalScrollPanel>
        );
    }

    if (!exhibition) {
        return (
            <VerticalScrollPanel label="Exhibition">
                <div className="min-h-full flex flex-col items-start justify-center px-10 md:px-20 lg:px-32 xl:px-44">
                    <p className="font-heading text-muted-foreground mb-6">Exhibition not found.</p>
                    <Link
                        href="/exhibitions"
                        className="group inline-flex items-center gap-2 text-sm text-foreground border-b border-foreground/40 pb-0.5 hover:border-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All exhibitions
                    </Link>
                </div>
            </VerticalScrollPanel>
        );
    }

    return (
        <VerticalScrollPanel label="Exhibition">
            <ExhibitionDetail exhibition={mapExhibition(exhibition)} />
        </VerticalScrollPanel>
    );
}
