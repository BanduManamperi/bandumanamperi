import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Exhibitions",
    description: "Browse solo and group exhibitions by Bandu Manamperi, showcasing performance art, drawings, and installations at galleries worldwide.",
    openGraph: {
        title: "Exhibitions | Bandu Manamperi",
        description: "Browse solo and group exhibitions by Bandu Manamperi, showcasing performance art, drawings, and installations at galleries worldwide.",
        type: "website",
    },
};

export default function ExhibitionsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}

