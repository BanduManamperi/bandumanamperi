"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

const navItems = [
    { label: "About", href: "/about" },
    { label: "Work", href: "/work" },
    { label: "Contact", href: "/contact" },
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

export function Navbar() {
    const pathname = usePathname()

    // Check if user is on a work-related page
    const isWorkPage = pathname === "/work" ||
        pathname === "/artworks" ||
        pathname === "/exhibitions" ||
        pathname === "/performances" ||
        pathname === "/art-framing-and-restoration"

    // Use work navigation items when on work pages, otherwise use main nav items
    const currentNavItems = isWorkPage ? workNavItems : navItems

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between px-6 sm:px-8 lg:px-12">
                {/* Logo/Brand */}
                <Link
                    href="/"
                    className="group flex flex-col leading-none transition-all duration-300"
                >
                    <span className="text-lg sm:text-xl font-light tracking-wide group-hover:tracking-wider transition-all duration-300">
                        Bandu Manamperi
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground font-light tracking-widest uppercase mt-0.5 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                        Artist
                    </span>
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6 sm:gap-8 lg:gap-10">
                    <div className="hidden md:flex items-center gap-6 lg:gap-8">
                        {currentNavItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`relative text-sm lg:text-base font-light tracking-wide transition-colors duration-300 group ${isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                                        }`}
                                >
                                    {item.label}
                                    <span className={`absolute -bottom-1 left-0 h-px bg-foreground transition-all duration-300 ${isActive ? "w-full" : "w-0 group-hover:w-full"
                                        }`} />
                                </Link>
                            )
                        })}
                    </div>

                    {/* Theme Toggle */}
                    <div className="ml-2">
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </nav>
    )
}

