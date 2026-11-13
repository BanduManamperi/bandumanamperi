import React from 'react'
import HeroSection from './heroSection'
import ContactSection from './contactSection'
import { ExhibitionsSection } from './exhibitionsSection'
import { WorkSection } from './workSection'
import { getExhibitions } from '@/lib/actions/exhibitions'
import { getNowShowing } from '@/lib/data/now-showing'

const Home = async () => {
    // Sorted for display: on view, then upcoming, then past from the newest.
    const exhibitions = await getExhibitions()
    const nowShowing = getNowShowing(exhibitions)

    const panel = "w-screen flex-shrink-0 h-full overflow-hidden"

    return (
        <div className="flex flex-row h-full w-max flex-shrink-0">

            <div id="panel-hero" data-panel data-panel-label="About" className={panel}>
                <HeroSection />
            </div>

            <div id="panel-work" data-panel data-panel-label="Work" className={panel}>
                <WorkSection />
            </div>

            {exhibitions.length > 0 && (
                <div id="panel-exhibitions" data-panel data-panel-label="Exhibitions" className={panel}>
                    <ExhibitionsSection exhibitions={exhibitions} index={3} />
                </div>
            )}

            <div id="panel-contact" data-panel data-panel-label="Contact" className={panel}>
                <ContactSection index={exhibitions.length > 0 ? 4 : 3} nowShowing={nowShowing} />
            </div>

        </div>
    )
}

export default Home
