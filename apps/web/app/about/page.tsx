import { Metadata } from "next";
import Image from "next/image";
import { CVSection } from "@/components/about/CVSection";
import { getCVData } from "@/lib/data/cv";
import { SpreadGrid, SpreadPanel, SpreadRow, leftPage, rightPageBleed } from "@/components/sheet/spread";
import { DocumentSheet } from "@/components/sheet/document-sheet";
import { body, caption, display, heading } from "@/components/sheet/type";

export const metadata: Metadata = {
    title: "About",
    description: "About Bandu Manamperi: biography, artistic practice, and curriculum vitae",
};

const practice = [
    {
        title: "Performance",
        body: "Manamperi's performance works engage directly with audiences, creating intimate and often challenging encounters that address vulnerability, identity, and social critique.",
    },
    {
        title: "Drawing and installation",
        body: "Through drawing and installation he explores where personal narrative meets collective memory, using spare means to carry complex emotional landscapes.",
    },
    {
        title: "Mixed media",
        body: "His range of materials reflects a commitment to experiment, joining traditional techniques with contemporary approaches.",
    },
];

export default async function About() {
    const cvData = await getCVData();

    return (
        <SpreadRow>
            <SpreadPanel id="panel-practice" label="Practice" section="About" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h1 className={display}>Practice</h1>
                        <div className="mt-8 max-w-[30rem] space-y-6 lg:mt-auto">
                            {practice.map((p) => (
                                <section key={p.title}>
                                    <h2 className={heading}>{p.title}</h2>
                                    <p className={`mt-2 ${body}`}>{p.body}</p>
                                </section>
                            ))}
                        </div>
                    </div>
                    <figure className={rightPageBleed}>
                        <div className="relative aspect-[3/2] w-full overflow-hidden bg-[var(--sheet-rule)] lg:aspect-auto lg:flex-1 grayscale">
                            <Image
                                src="/Numbed.jpg"
                                alt="Four life-size figures suspended in a white gallery"
                                fill
                                priority
                                className="object-cover"
                                sizes="(min-width: 1280px) 64vw, (min-width: 1024px) 56vw, 100vw"
                            />
                        </div>
                        <figcaption className={`mt-2 ${caption}`}>Numbed, installation</figcaption>
                    </figure>
                </SpreadGrid>
            </SpreadPanel>

            <DocumentSheet id="panel-cv" section="About, curriculum vitae" handoff>
                <div className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
                    <h2 className={`mb-12 ${display}`}>Curriculum vitae</h2>
                    <CVSection cvData={cvData} />
                </div>
            </DocumentSheet>
        </SpreadRow>
    );
}
