import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
    description: "Insights, stories, and reflections from Bandu Manamperi on contemporary art, creative process, exhibitions, and artistic practice.",
    openGraph: {
        title: "Blog | Bandu Manamperi",
        description: "Insights, stories, and reflections from Bandu Manamperi on contemporary art, creative process, exhibitions, and artistic practice.",
        type: "website",
    },
};

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

