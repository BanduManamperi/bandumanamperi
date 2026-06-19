import React from 'react'
import HeroSection from './heroSection'
import ContactSection from './contactSection'
import IntroAnimation from './introAnimation'
import { UpcomingEventsSection } from './upcomingEventsSection'
import { WorkSection } from './workSection'
import { BackgroundSection } from './backgroundSection'
import { getUpcomingExhibitions, getExhibitions } from '@/lib/actions/exhibitions'

const Home = async () => {
    // Prefer ongoing/upcoming events; fall back to recent past events so the
    // section always has something to show.
    let events = await getUpcomingExhibitions()
    if (events.length === 0) {
        events = (await getExhibitions()).slice(0, 6)
    }

    const panel = "w-screen flex-shrink-0 h-full overflow-hidden"

    return (
        <>
            <IntroAnimation />

            <div className="flex flex-row h-full w-max flex-shrink-0">

                <div id="panel-hero" data-panel data-panel-label="About" className={panel}>
                    <HeroSection />
                </div>

                <div id="panel-work" data-panel data-panel-label="Work" className={panel}>
                    <WorkSection />
                </div>

                {events.length > 0 && (
                    <div id="panel-upcoming" data-panel data-panel-label="Events" className={panel}>
                        <UpcomingEventsSection exhibitions={events} />
                    </div>
                )}

                <div id="panel-background" data-panel data-panel-label="Background" className={panel}>
                    <BackgroundSection />
                </div>

                <div id="panel-contact" data-panel data-panel-label="Contact" className={panel}>
                    <ContactSection nowShowing={
                        events[0]?.endDate
                            ? { name: events[0].name, endDate: events[0].endDate }
                            : undefined
                    } />
                </div>

            </div>
        </>
    )
}

export default Home
