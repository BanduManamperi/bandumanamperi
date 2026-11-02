import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EnquireForm } from "@/components/enquire-form";
import { SiteHeader } from "@/components/site-header";
import { getRoom } from "@/lib/inventory";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const room = await getRoom(slug);
    if (!room) return { title: "Enquire" };
    return { title: `Enquire about ${room.work.title}` };
}

export default async function EnquirePage({ params }: PageProps) {
    const { slug } = await params;
    const room = await getRoom(slug);
    if (!room) notFound();

    const { work } = room;
    const heading = work.year ? `${work.title}, ${work.year}` : work.title;

    return (
        <>
            <SiteHeader section="paintings" shelf={work.availability} />
            <main className="flex-1 overflow-y-auto">
                <div className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
                    <div>
                        <Link href={work.href} className="text-[0.9375rem] text-room-mute underline underline-offset-4 hover:text-room-ink">
                            {heading}
                        </Link>
                        {work.availability === "sold" ? (
                            <h1 className="mt-6 max-w-md text-[1.75rem] font-light leading-tight">This work has been sold.</h1>
                        ) : (
                            <>
                                <h1 className="mt-6 text-[1.75rem] font-light leading-tight">Enquire</h1>
                                <p className="mt-3 max-w-md text-[0.9375rem] leading-relaxed text-room-mute">
                                    The studio replies by email. There is no payment on this site.
                                </p>
                                <div className="mt-8 max-w-md">
                                    <EnquireForm slug={work.slug} title={heading} />
                                </div>
                            </>
                        )}
                    </div>
                    {work.images[0] && (
                        <div className="relative aspect-[4/5] bg-room-well">
                            <Image src={work.images[0]} alt="" fill className="object-contain p-6" sizes="18rem" />
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
