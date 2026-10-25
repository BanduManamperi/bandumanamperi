import ContactSection from "@/components/home/contactSection";
import { getUpcomingExhibitions } from "@/lib/actions/exhibitions";
import { getNowShowing } from "@/lib/data/now-showing";

export default async function ContactPage() {
    const nowShowing = getNowShowing(await getUpcomingExhibitions());
    return (
        <div id="panel-contact" data-panel data-panel-label="Contact" className="h-full w-screen flex-shrink-0 overflow-hidden">
            <ContactSection index={1} headingLevel="h1" nowShowing={nowShowing} />
        </div>
    );
}
