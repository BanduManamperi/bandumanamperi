import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Journal",
    description: "Insights, stories, and reflections from Bandu Manamperi on contemporary art, creative process, exhibitions, and artistic practice.",
    openGraph: {
        title: "Journal | Bandu Manamperi",
        description: "Insights, stories, and reflections from Bandu Manamperi on contemporary art, creative process, exhibitions, and artistic practice.",
        type: "website",
    },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
