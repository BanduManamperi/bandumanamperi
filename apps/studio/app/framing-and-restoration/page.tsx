import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { LedgerPage } from "@/components/ledger-page";
import { LedgerRow } from "@/components/ledger-row";
import { ContactForm } from "@/components/contact-form";
import { display, heading, body, Facts } from "@/lib/type";

export const metadata: Metadata = {
    title: "Framing and Restoration",
    description: "Custom framing, conservation, and restoration for paintings, works on paper, and sculpture, by Bandu Manamperi.",
};

export default function FramingAndRestorationPage() {
    return (
        <>
            <SiteHeader section="framing" />
            <LedgerPage>
                <h1 className={display}>Framing and Restoration</h1>

                <p className={`mt-6 max-w-[32rem] ${body}`}>
                    Manamperi is trained in the conservation of murals and
                    paintings, and in stone conservation through UNESCO. The
                    studio takes on restoration, conservation, and custom
                    framing for paintings, works on paper, and sculpture.
                </p>

                <div className="mt-10">
                    <LedgerRow
                        number="001"
                        href="#enquire"
                        title="Custom framing"
                        description="Framing for paintings, works on paper, and photographs, built to suit the piece rather than off a standard size."
                    />
                    <LedgerRow
                        number="002"
                        href="#enquire"
                        title="Conservation and restoration"
                        description="Cleaning, stabilisation, and restoration of paintings, works on paper, and sculpture, including damage from age, handling, and the Sri Lankan climate."
                    />
                </div>

                <Facts
                    className="mt-10 max-w-[32rem]"
                    items={[
                        { label: "Services", value: "Restoration, conservation, custom framing" },
                        { label: "Works", value: "Paintings, works on paper, sculpture, frames" },
                        { label: "Studio", value: "Bandaragama, Sri Lanka" },
                    ]}
                />

                <div id="enquire" className="mt-12 max-w-[32rem] border-t border-border pt-8">
                    <h2 className={heading}>Enquire</h2>
                    <p className={`mt-2 ${body}`}>
                        The studio replies by email. There is no payment on this
                        site.
                    </p>
                    <div className="mt-6">
                        <ContactForm />
                    </div>
                </div>
            </LedgerPage>
            <Footer />
        </>
    );
}
