"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    getActivePanelId,
    getServerActivePanelId,
    goToPanel,
    subscribe,
} from "@/components/horizontal-scroll-store"

const navItems = [
    { label: "About", panelId: "panel-hero" },
    { label: "Work", panelId: "panel-work" },
    { label: "Events", panelId: "panel-upcoming" },
    { label: "Background", panelId: "panel-background" },
    { label: "Contact", panelId: "panel-contact" },
    { label: "Blog", href: "/blog" },
]

const workNavItems = [
    { label: "Home", href: "/" },
    { label: "All Work", href: "/work" },
    { label: "Artworks", href: "/artworks" },
    { label: "Exhibitions", href: "/exhibitions" },
    { label: "Performance", href: "/performances" },
    { label: "Art Restoration", href: "/art-framing-and-restoration" },
]

const artworksNavItems = [
    { label: "Home", href: "/" },
    { label: "Intro", panelId: "panel-artworks" },
    { label: "Collections", panelId: "panel-artworks-collections" },
    { label: "Works", panelId: "panel-artworks-grid" },
]

const performancesNavItems = [
    { label: "Home", href: "/" },
    { label: "Intro", panelId: "panel-performances" },
    { label: "Works", panelId: "panel-performances-works" },
]

const exhibitionsNavItems = [
    { label: "Home", href: "/" },
    { label: "Intro", panelId: "panel-exhibitions" },
    { label: "Exhibitions", panelId: "panel-exhibitions-list" },
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const activePanelId = useSyncExternalStore(
        subscribe,
        getActivePanelId,
        getServerActivePanelId
    )

    const isWorkPage =
        pathname === "/work" ||
        pathname === "/art-framing-and-restoration"

    const isArtworksPage = pathname === "/artworks"
    const isPerformancesPage = pathname === "/performances"
    const isExhibitionsPage = pathname === "/exhibitions"

    const currentNavItems = isArtworksPage
        ? artworksNavItems
        : isPerformancesPage
        ? performancesNavItems
        : isExhibitionsPage
        ? exhibitionsNavItems
        : isWorkPage
        ? workNavItems
        : navItems

    const isPanelPage = pathname === "/" || isArtworksPage || isPerformancesPage || isExhibitionsPage

    const handlePanelClick = (panelId: string) => {
        if (isPanelPage) {
            goToPanel(panelId)
        } else {
            router.push(`/#${panelId}`)
        }
    }

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-end justify-center pb-4">
            <div
                className="flex items-center justify-center px-6 py-2.5 rounded-full shadow-lg shadow-black/[0.08]"
                style={{
                    background: "rgba(250,250,250,0.72)",
                    backdropFilter: "blur(40px) saturate(200%) brightness(1.05)",
                    WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.05)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 2px 24px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
                }}
            >
                <div className="flex items-center gap-4 lg:gap-6">
                    {currentNavItems.map((item) => {
                        if ("panelId" in item && item.panelId) {
                            const isActive =
                                isPanelPage && activePanelId === item.panelId

                            return (
                                <button
                                    key={item.label}
                                    onClick={() => handlePanelClick(item.panelId)}
                                    className={`relative text-[10px] tracking-widest uppercase transition-colors duration-300 group cursor-pointer font-serif ${
                                        isActive
                                            ? "text-foreground font-medium"
                                            : "text-foreground/40 hover:text-foreground"
                                    }`}
                                >
                                    {item.label}
                                    <span className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                                        isActive ? "w-full" : "w-0 group-hover:w-full"
                                    }`} />
                                </button>
                            )
                        }

                        const isActive = pathname === item.href

                        return (
                            <Link
                                key={item.href}
                                href={item.href!}
                                className={`relative text-[10px] tracking-widest uppercase transition-colors duration-300 group font-serif ${
                                    isActive
                                        ? "text-foreground font-medium"
                                        : "text-foreground/40 hover:text-foreground"
                                }`}
                            >
                                {item.label}
                                <span className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${
                                    isActive ? "w-full" : "w-0 group-hover:w-full"
                                }`} />
                            </Link>
                        )
                    })}
                </div>
            </div>
        </nav>
    )
}
