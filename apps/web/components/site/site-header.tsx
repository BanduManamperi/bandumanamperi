import { Navbar } from "@/components/navBar/navbar";
import { ExhibitionBanner } from "@/components/site/exhibition-banner";
import { getHighlightedExhibitions } from "@/lib/actions/exhibitions";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
    const exhibitions = await getHighlightedExhibitions();
    const hasBanner = exhibitions.length > 0;

    return (
        <header
            className={cn(
                "sticky top-0 z-50 w-full",
                hasBanner && "site-header-with-banner"
            )}
        >
            <ExhibitionBanner exhibitions={exhibitions} />
            <Navbar />
        </header>
    );
}
