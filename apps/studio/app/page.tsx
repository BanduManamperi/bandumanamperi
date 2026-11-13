import Image from "next/image";
import Link from "next/link";
import { StudioFrame } from "@/components/studio-frame";
import { mailStudio } from "@/lib/studio";

// The landing page. On a wide screen it is a single framed view of the house:
// two pictures side by side, between the frame's two rows of links. On a
// phone it is a page of its own: the studio's name, one picture of the place
// carrying a line about it, the two sides of the studio as a short numbered
// list to go on to, and the way to visit at the foot.

// Placeholders until the studio is photographed for this page. Give each a
// `src` to replace it. The site is black and white, so the pictures are shown
// in grayscale.

/** The wide screen's two views: one of a work on the wall, one of the rooms. */
const VIEWS: { src?: string; alt: string; tone: string }[] = [
    { alt: "A work hanging in the studio", tone: "bg-[#d4d4d4]" },
    { alt: "A room of the house", tone: "bg-[#8a8a8a]" },
];

/** The phone's one picture, under the line about the place. */
const HERO: { src?: string; alt: string } = { alt: "The studio at Bandu Manamperi Home & Studio" };

const SECTIONS = [
    { number: "01", href: "/paintings-and-drawings", title: ["Paintings", "& drawings"] },
    { number: "02", href: "/framing-and-restoration", title: ["Framing", "& restoration"] },
];

/** The phone page's small capitals. */
const caps = "text-[0.8125rem] uppercase leading-snug tracking-[0.06em]";

function ArrowUpRight() {
    return (
        <svg aria-hidden="true" viewBox="0 0 10 10" className="size-2.5 shrink-0">
            <path d="M2 8 8 2M3 2h5v5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    );
}

/*
 * Each layout is hidden at the other's width. The pictures of the hidden one
 * are given a 1px size there, so the browser fetches only a token copy of
 * them instead of a full one.
 */

function PhoneHome() {
    return (
        <div className="flex min-h-dvh flex-col bg-background text-foreground md:hidden">
            <header className="px-5 py-3 text-center">
                <h1 className="text-[0.875rem] uppercase leading-[1.6] tracking-[0.06em]">
                    <span className="block">Bandu Manamperi</span>
                    <span className="block text-foreground/70">Home &amp; Studio</span>
                </h1>
            </header>

            {/* The picture takes what the screen has left after the name, the list and the foot (about 29rem), up to 26rem, so the page fits one screen on most phones. */}
            <section aria-label="The studio" className="relative h-[clamp(16rem,calc(100svh-29rem),26rem)] shrink-0 overflow-hidden bg-[#8a8a8a] text-white">
                {HERO.src && (
                    <Image src={HERO.src} alt={HERO.alt} fill loading="eager" fetchPriority="high" className="object-cover grayscale" sizes="(min-width: 48rem) 1px, 100vw" />
                )}
                {/* A light shade at the top and a deeper one at the foot keep the words readable over any photograph. */}
                <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/15 via-transparent to-black/45" />
                <p className={`absolute right-5 top-6 ${caps} text-white/90`}>Bandaragama, Sri Lanka</p>
                <div className="absolute inset-x-5 bottom-7">
                    <p className={`${caps} text-white/90`}>A place for art</p>
                    <p className="mt-1.5 max-w-[18rem] text-[1.4375rem] leading-[1.5] text-white">Art, craft &amp; the spaces between.</p>
                </div>
            </section>

            <nav aria-labelledby="explore" className="px-5 pt-6">
                <h2 id="explore" className={`${caps} text-foreground/65`}>
                    Explore the studio
                </h2>
                <ul className="mt-5 border-t border-foreground/25">
                    {SECTIONS.map((section) => (
                        <li key={section.href} className="border-b border-foreground/25">
                            <Link
                                href={section.href}
                                aria-label={section.title.join(" ")}
                                className="group grid grid-cols-[2.125rem_minmax(0,1fr)_auto] items-center py-[1.6875rem] pr-1.5"
                            >
                                <span className="text-[0.8125rem] tabular-nums text-foreground/65">{section.number}</span>
                                <span className="text-[1.25rem] leading-[1.75] decoration-foreground/40 underline-offset-[6px] group-hover:underline">
                                    {section.title[0]}
                                    <br />
                                    {section.title[1]}
                                </span>
                                <ArrowUpRight />
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <footer className={`mt-auto flex items-center justify-between gap-4 px-5 pb-4 pt-12 ${caps} text-foreground/80`}>
                <Link href="/about" className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-foreground">
                    About
                </Link>
                <a href={mailStudio("Studio visit")} className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-foreground">
                    Visits by appointment
                </a>
            </footer>
        </div>
    );
}

function WideHome() {
    return (
        <div className="hidden md:block">
            <StudioFrame className="grid grid-cols-2">
                <h1 className="sr-only">Bandu Manamperi Home &amp; Studio</h1>
                {VIEWS.map((view) => (
                    <div key={view.alt} className={`relative overflow-hidden ${view.tone}`}>
                        {view.src ? (
                            <Image src={view.src} alt={view.alt} fill preload className="object-cover grayscale" sizes="(min-width: 48rem) 50vw, 1px" />
                        ) : (
                            <p className="absolute inset-x-0 bottom-3 text-center text-[0.6875rem] uppercase tracking-[0.08em] text-foreground/60">
                                Placeholder: {view.alt.toLowerCase()}
                            </p>
                        )}
                    </div>
                ))}
            </StudioFrame>
        </div>
    );
}

export default function Home() {
    return (
        <>
            <PhoneHome />
            <WideHome />
        </>
    );
}
