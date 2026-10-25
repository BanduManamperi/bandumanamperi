import { Metadata } from "next";
import { WorkSection } from "@/components/home/workSection";

export const metadata: Metadata = {
    title: "Work",
    description: "The work of Bandu Manamperi: artworks, performance, and framing and restoration.",
};

export default function WorkPage() {
    return (
        <div id="panel-work" data-panel data-panel-label="Work" className="h-full w-screen flex-shrink-0 overflow-hidden">
            <WorkSection index={1} headingLevel="h1" />
        </div>
    );
}
