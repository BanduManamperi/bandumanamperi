import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ViewingRoom } from "@/components/viewing-room";
import { getProportion } from "@/lib/image-shape";
import { getRoom } from "@/lib/inventory";
import { offerLine } from "@/lib/price";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const room = await getRoom(slug);
    if (!room) return { title: "Work not found" };

    const { work } = room;
    const line = offerLine(work);
    const summary = [work.year, work.medium, line?.text].filter(Boolean).join(", ");
    const title = work.year ? `${work.title}, ${work.year}` : work.title;

    return {
        title,
        description: work.description || `${title} by Bandu Manamperi.${summary ? ` ${summary}.` : ""}`,
        openGraph: {
            title: `${title} | Bandu Manamperi`,
            description: work.description || `${title} from the studio of Bandu Manamperi.`,
            images: work.images[0] ? [work.images[0]] : undefined,
        },
    };
}

export default async function WorkPage({ params }: PageProps) {
    const { slug } = await params;
    const room = await getRoom(slug);
    if (!room) notFound();
    const proportion = await getProportion(room.work.images[0]);
    return <ViewingRoom work={room.work} catalogue={room.catalogue} proportion={proportion} />;
}
