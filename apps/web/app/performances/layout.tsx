import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Performances",
    description: "Explore performance art works by Bandu Manamperi. Ephemeral explorations of identity, body, and transformation through live intervention.",
    openGraph: {
        title: "Performances | Bandu Manamperi",
        description: "Explore performance art works by Bandu Manamperi. Ephemeral explorations of identity, body, and transformation through live intervention.",
        type: "website",
    },
};

export default function PerformancesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
