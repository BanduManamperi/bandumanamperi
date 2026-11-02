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

// The artist's biography, as supplied by the studio. Set as a reading page.
const biography = [
    "Bandu Manamperi is an artist whose work transcends traditional boundaries to explore themes of identity, conflict, and the complexities of human nature, making a significant mark on the global art scene. His multifaceted approach to art, which incorporates performances, drawings, and installations, challenges viewers to confront their perceptions and engage in a deeper dialogue with the subject matter.",
    "Drawing from his own experiences and cultural heritage, Manamperi's pieces offer a poignant reflection on the societal and personal impacts of political turmoil. His work serves as both a mirror reflecting societal issues and a bridge connecting diverse audiences through the universal language of creativity and emotion.",
    "As a founding member and Vice Chairman of Theertha International Artists' Collective in Sri Lanka, he has been pivotal in promoting contemporary art and fostering a community for artists to collaborate and express themselves freely. The collective has become an important platform for artistic expression and cultural dialogue in the region.",
    "As an acclaimed figure in contemporary art, Bandu Manamperi continues to inspire and provoke thought, cementing his place as a visionary artist whose work resonates across cultures and generations. His commitment to exploring challenging themes while maintaining artistic integrity has earned him recognition both locally and internationally.",
];

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
            <DocumentSheet id="panel-biography" section="About, biography" handoff>
                <div className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
                    <h1 className={display}>Biography</h1>
                    <div className="mt-10 max-w-[38rem] space-y-6">
                        {biography.map((paragraph, i) => (
                            <p key={i} className={body}>
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </DocumentSheet>

            <SpreadPanel id="panel-practice" label="Practice" section="About" index={1}>
                <SpreadGrid>
                    <div className={leftPage}>
                        <h2 className={display}>Practice</h2>
                        <div className="mt-8 max-w-[30rem] space-y-6 lg:mt-auto">
                            {practice.map((p) => (
                                <section key={p.title}>
                                    <h3 className={heading}>{p.title}</h3>
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
