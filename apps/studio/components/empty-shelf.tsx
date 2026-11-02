import type { Shelf } from "@/lib/inventory";
import { SiteHeader } from "@/components/site-header";

export function EmptyShelf({ shelf }: { shelf: Shelf }) {
    return (
        <>
            <SiteHeader section="paintings" shelf={shelf} />
            <main className="flex-1 overflow-y-auto px-5 py-16 sm:px-8">
                <h1 className="max-w-md text-[1.75rem] font-light leading-tight">
                    {shelf === "available" ? "Nothing is listed for sale right now." : "No works are recorded as sold."}
                </h1>
            </main>
        </>
    );
}
