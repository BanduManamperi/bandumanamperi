import { Metadata } from "next";
import Image from "next/image";
import { SpreadGrid, SpreadPanel, SpreadRow, belowStandfirst, footStandfirst, leftPage, rightPage } from "@/components/sheet/spread";
import { Facts, body, caption, display, textLink } from "@/components/sheet/type";
import { studioUrl } from "@/lib/studio";

export const metadata: Metadata = {
    title: "Art Framing & Restoration",
    description: "Professional art framing, restoration and conservation services by Bandu Manamperi.",
};

export default function ArtRestorationPage() {
    return (
        <SpreadRow>
            <SpreadPanel id="panel-framing" label="Framing and restoration" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h1 className={display}>Framing and restoration</h1>
                        <p className={`${footStandfirst} max-w-[30rem] ${body}`}>
                            Restoration, conservation, and custom framing for paintings, works on
                            paper, and sculpture. Manamperi is trained in the conservation of murals
                            and paintings, and in stone conservation through UNESCO. Enquiries about
                            individual works are handled by the studio.
                        </p>
                        <Facts
                            className={`${belowStandfirst} max-w-[30rem]`}
                            labelWidth="6.5rem"
                            items={[
                                { label: "Services", value: "Restoration, conservation, custom framing" },
                                { label: "Works", value: "Paintings, works on paper, sculpture, frames" },
                                { label: "Studio", value: "Bandaragama, Sri Lanka" },
                            ]}
                        />
                        <a
                            href={studioUrl("/framing-and-restoration")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`mt-6 self-start text-[0.8125rem] ${textLink}`}
                        >
                            Enquire through the studio
                        </a>
                    </div>
                    <figure className={rightPage}>
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1">
                            <Image
                                src="/IMG_8614.JPG"
                                alt="Bandu Manamperi working over tissue paper in his studio"
                                fill
                                priority
                                className="object-cover object-[30%_40%]"
                                sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                            />
                        </div>
                        <figcaption className={`mt-2 ${caption}`}>In the studio</figcaption>
                    </figure>
                </SpreadGrid>
            </SpreadPanel>
        </SpreadRow>
    );
}
