import Image from "next/image";
import { getExhibitions } from "@/lib/actions/exhibitions";
import { getExhibitionYear } from "@bandumanamperi/types";
import { getExhibitionImageUrl } from "@/lib/utils/supabase-storage";
import { SpreadGrid, SpreadPanel, SpreadRow, leftPage, rightPageBleed } from "@/components/sheet/spread";
import { PanelLink } from "@/components/sheet/panel-link";
import { body, caption, display } from "@/components/sheet/type";
import { ExhibitionSpread } from "@/components/exhibitions/exhibition-spread";

export default async function ExhibitionsPage() {
    const exhibitions = await getExhibitions();
    const cover = exhibitions.map((ex) => getExhibitionImageUrl(ex.coverImage)).find(Boolean);

    return (
        <SpreadRow>
            <SpreadPanel id="panel-exhibitions" label="Exhibitions" section="Exhibitions" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h1 className={display}>Exhibitions</h1>
                        <p className={`mt-6 max-w-[30rem] ${body}`}>
                            Across solo presentations and group projects, Manamperi&apos;s exhibitions
                            have occupied galleries, alternative spaces, and public sites from Colombo
                            to Copenhagen. Each context reshapes the work: the same gesture means
                            differently in different rooms and different histories.
                        </p>

                        {exhibitions.length > 0 && (
                            <ol className="mt-10 border-t border-border lg:mt-auto">
                                {exhibitions.map((ex, i) => (
                                    <li key={ex.id ?? `${ex.name}-${i}`} className="border-b border-border">
                                        <PanelLink
                                            panelId={`exhibition-${i + 1}`}
                                            className="flex items-baseline gap-3 py-2.5 text-[0.8125rem] text-foreground/70 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
                                        >
                                            <span className="w-9 shrink-0 tabular-nums text-muted-foreground">{getExhibitionYear(ex) || ""}</span>
                                            <span className="truncate">{ex.name}</span>
                                        </PanelLink>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>

                    <figure className={rightPageBleed}>
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1">
                            <Image
                                src={cover ?? "/Numbed.jpg"}
                                alt=""
                                fill
                                priority
                                className="object-cover"
                                sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                            />
                        </div>
                        <figcaption className={`mt-2 ${caption}`}>{exhibitions[0]?.name ?? "Numbed, installation view"}</figcaption>
                    </figure>
                </SpreadGrid>
            </SpreadPanel>

            {exhibitions.map((ex, i) => (
                <SpreadPanel
                    key={ex.id ?? `${ex.name}-${i}`}
                    id={`exhibition-${i + 1}`}
                    label={ex.name}
                    section={`Exhibitions, ${i + 1} of ${exhibitions.length}`}
                    index={i + 2}
                >
                    <ExhibitionSpread exhibition={ex} priority={i === 0} />
                </SpreadPanel>
            ))}
        </SpreadRow>
    );
}
