import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSeriesWithWorks } from "@/lib/data/artworks";
import { SpreadGrid, SpreadPanel, SpreadRow, leftPage, rightPageBleed } from "@/components/sheet/spread";
import { Facts, body, caption, display } from "@/components/sheet/type";
import { WorkSpreadPanel } from "@/components/artworks/work-spread";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const result = await getSeriesWithWorks((await params).slug);
    if (!result) return { title: "Series not found" };
    return {
        title: result.series.name,
        description: result.series.description?.slice(0, 160) || `${result.series.name}, a series by Bandu Manamperi.`,
        openGraph: {
            title: `${result.series.name} | Bandu Manamperi`,
            images: result.series.coverImage ? [result.series.coverImage] : undefined,
        },
    };
}

function yearSpan(years: string[]): string | null {
    const numeric = years.map(Number).filter((y) => Number.isFinite(y) && y > 0);
    if (numeric.length === 0) return null;
    const [lo, hi] = [Math.min(...numeric), Math.max(...numeric)];
    return lo === hi ? `${lo}` : `${lo} to ${hi}`;
}

// A series as a run of spreads: its name and description first, then each work.
export default async function SeriesPage({ params }: PageProps) {
    const result = await getSeriesWithWorks((await params).slug);
    if (!result) notFound();

    const { series, works } = result;
    const cover = series.coverImage ?? works[0]?.images[0] ?? null;

    return (
        <SpreadRow>
            <SpreadPanel id="series" label={series.name} section="Series" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h1 className={display}>{series.name}</h1>
                        {series.description && <p className={`mt-6 max-w-[30rem] whitespace-pre-line ${body}`}>{series.description}</p>}
                        <Facts
                            className="mt-8 max-w-[30rem] lg:mt-auto"
                            items={[
                                { label: "Works", value: `${works.length}` },
                                { label: "Dates", value: yearSpan(works.map((w) => w.year ?? "")) },
                            ]}
                        />
                    </div>
                    {cover && (
                        <figure className={rightPageBleed}>
                            <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1">
                                <Image src={cover} alt="" fill priority className="object-cover" sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw" />
                            </div>
                            <figcaption className={`mt-2 ${caption}`}>{series.name}</figcaption>
                        </figure>
                    )}
                </SpreadGrid>
            </SpreadPanel>

            {works.map((entry, i) => (
                <WorkSpreadPanel
                    key={entry.id}
                    entry={entry}
                    panelId={`work-${entry.label}`}
                    section={`${series.name}, ${i + 1} of ${works.length}`}
                    index={i + 2}
                    priority={i === 0}
                />
            ))}
        </SpreadRow>
    );
}
