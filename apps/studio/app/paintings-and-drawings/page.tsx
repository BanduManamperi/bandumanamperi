import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LedgerPage } from "@/components/ledger-page";
import { LedgerRow } from "@/components/ledger-row";
import { display, body } from "@/lib/type";
import { getShelf } from "@/lib/inventory";

export const metadata: Metadata = {
    title: "Paintings and Drawings",
    description: "Paintings, mixed media, and works on paper by Bandu Manamperi: available works and a record of what has sold.",
};

export default async function PaintingsAndDrawingsPage() {
    const [available, sold] = await Promise.all([getShelf("available"), getShelf("sold")]);

    return (
        <>
            <SiteHeader section="paintings" />
            <LedgerPage>
                <h1 className={display}>Paintings and Drawings</h1>

                <p className={`mt-6 max-w-[32rem] ${body}`}>
                    A practice that moves across media to confront identity, conflict,
                    and the complexities of human nature. Each work is shown here as
                    it stands, priced where a price is set, and some with price on
                    request. The studio replies to enquiries by email; there is no
                    payment on this site.
                </p>

                <div className="mt-12">
                    <LedgerRow
                        number="001"
                        href="/works"
                        title="Available"
                        description={available.length > 0 ? `${available.length} work${available.length === 1 ? "" : "s"} currently offered` : "Nothing is listed for sale right now"}
                    />
                    <LedgerRow
                        number="002"
                        href="/sold"
                        title="Sold"
                        description={sold.length > 0 ? `${sold.length} work${sold.length === 1 ? "" : "s"} recorded as sold` : "No works are recorded as sold"}
                    />
                </div>
            </LedgerPage>
            <Footer />
        </>
    );
}
