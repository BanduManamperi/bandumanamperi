import { Metadata } from "next";
import { CVSection } from "@/components/about/CVSection";
import { getCVData } from "@/lib/data/cv";
import { DocumentSheet } from "@/components/sheet/document-sheet";
import { display } from "@/components/sheet/type";

export const metadata: Metadata = {
    title: "Background",
    description:
        "Full background of Bandu Manamperi: education, exhibitions, work experience, workshops, residencies, and invited lectures.",
};

export default async function BackgroundPage() {
    const cvData = await getCVData();
    return (
        <DocumentSheet>
            <div className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
                <h1 className={`mb-12 ${display}`}>Curriculum vitae</h1>
                <CVSection cvData={cvData} />
            </div>
        </DocumentSheet>
    );
}
