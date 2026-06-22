'use client';

import { useState, useEffect } from 'react';
import { CVData, CVEntry } from '@/lib/data/cv';
import { cn } from '@/lib/utils';

const NAV_SECTIONS = [
    { id: 'education',   label: 'Education' },
    { id: 'exhibitions', label: 'Exhibitions' },
    { id: 'work',        label: 'Work Experience' },
    { id: 'workshops',   label: 'Workshops & Residencies' },
    { id: 'lectures',    label: 'Invited Lectures' },
];

const PREVIEW_COUNT = 7;

// ── Entry row ─────────────────────────────────────────────────────────────────

function EntryRow({ entry, italic = false }: { entry: CVEntry; italic?: boolean }) {
    return (
        <div className="flex gap-6 py-3.5 border-b border-border/40 last:border-0">
            <span className="text-muted-foreground font-light w-24 shrink-0 text-sm tabular-nums leading-relaxed">
                {entry.year}
            </span>
            <div className="min-w-0">
                <p className={cn('text-foreground font-light text-sm leading-relaxed', italic && 'italic')}>
                    {entry.title}
                </p>
                {entry.subtitle && (
                    <p className="text-muted-foreground text-xs font-light mt-0.5 leading-relaxed">
                        {entry.subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Entry list with show-more ─────────────────────────────────────────────────

function EntryList({ entries, italic = false }: { entries: CVEntry[]; italic?: boolean }) {
    const [expanded, setExpanded] = useState(false);
    const visible = expanded ? entries : entries.slice(0, PREVIEW_COUNT);
    const hasMore = entries.length > PREVIEW_COUNT;

    return (
        <div>
            <div>
                {visible.map((entry, i) => (
                    <EntryRow key={i} entry={entry} italic={italic} />
                ))}
            </div>
            {hasMore && (
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="mt-4 text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                    {expanded ? 'Show less' : `Show all ${entries.length} entries`}
                </button>
            )}
        </div>
    );
}

// ── Section block ─────────────────────────────────────────────────────────────

function SectionBlock({
    id,
    title,
    children,
}: {
    id: string;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div id={id} className="scroll-mt-36">
            <h3 className="font-heading text-2xl font-bold tracking-tight text-foreground mb-8 pb-4 border-b border-border">
                {title}
            </h3>
            {children}
        </div>
    );
}

// ── Sub-section label ─────────────────────────────────────────────────────────

function SubLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-xs tracking-widest uppercase text-muted-foreground mb-3">
            {children}
        </p>
    );
}

// ── Main component ────────────────────────────────────────────────────────────

// Walk up the DOM to find the nearest vertically-scrollable ancestor.
function getScrollParent(node: HTMLElement | null): HTMLElement | null {
    let el = node?.parentElement ?? null;
    while (el) {
        const overflowY = getComputedStyle(el).overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}

export function CVSection({ cvData }: { cvData: CVData }) {
    const [activeSection, setActiveSection] = useState('education');

    useEffect(() => {
        const first = document.getElementById(NAV_SECTIONS[0].id);
        if (!first) return;

        const scroller = getScrollParent(first);
        const target: HTMLElement | Window = scroller ?? window;

        const updateActive = () => {
            const viewTop = scroller ? scroller.getBoundingClientRect().top : 0;
            const viewHeight = scroller ? scroller.clientHeight : window.innerHeight;
            const threshold = viewHeight * 0.2;

            // When scrolled to the bottom, the last nav section is the active one
            // (its heading can't always reach the activation band).
            const atBottom = scroller
                ? Math.ceil(scroller.scrollTop + scroller.clientHeight) >= scroller.scrollHeight - 2
                : window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

            if (atBottom) {
                setActiveSection(NAV_SECTIONS[NAV_SECTIONS.length - 1].id);
                return;
            }

            let current = NAV_SECTIONS[0].id;
            for (const { id } of NAV_SECTIONS) {
                const el = document.getElementById(id);
                if (!el) continue;
                const top = el.getBoundingClientRect().top - viewTop;
                if (top <= threshold) current = id;
            }
            setActiveSection(current);
        };

        target.addEventListener('scroll', updateActive, { passive: true });
        updateActive();

        return () => target.removeEventListener('scroll', updateActive);
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Mobile sticky nav */}
            <div className="lg:hidden sticky top-20 z-10 bg-background/95 backdrop-blur-sm border-b border-border mb-10 -mx-6 px-6">
                <div className="flex gap-6 overflow-x-auto py-3 scrollbar-none">
                    {NAV_SECTIONS.map(({ id, label }) => (
                        <button
                            key={id}
                            onClick={() => scrollTo(id)}
                            className={cn(
                                'text-xs tracking-wide whitespace-nowrap pb-1 border-b-2 transition-colors',
                                activeSection === id
                                    ? 'border-foreground text-foreground'
                                    : 'border-transparent text-muted-foreground'
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop layout: sidebar + content */}
            <div className="flex gap-16">
                {/* Sticky sidebar */}
                <aside className="hidden lg:block w-40 shrink-0">
                    <nav className="sticky top-36 space-y-0.5">
                        {NAV_SECTIONS.map(({ id, label }) => {
                            const isActive = activeSection === id;
                            return (
                                <button
                                    key={id}
                                    onClick={() => scrollTo(id)}
                                    className={cn(
                                        'group w-full text-left text-sm py-2 flex items-center gap-2.5 transition-colors',
                                        isActive
                                            ? 'text-foreground'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    <span
                                        className={cn(
                                            'block h-px transition-all duration-300',
                                            isActive
                                                ? 'w-4 bg-foreground'
                                                : 'w-0 group-hover:w-2 bg-muted-foreground'
                                        )}
                                    />
                                    <span className={cn(isActive && 'font-medium')}>{label}</span>
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-20">
                    {/* Education */}
                    <SectionBlock id="education" title="Education">
                        <EntryList entries={cvData.education} />
                    </SectionBlock>

                    {/* Exhibitions */}
                    <SectionBlock id="exhibitions" title="Exhibitions">
                        <div className="space-y-10">
                            <div>
                                <SubLabel>Solo</SubLabel>
                                <EntryList entries={cvData.soloExhibitions} italic />
                            </div>
                            <div>
                                <SubLabel>Selected Group & Performance</SubLabel>
                                <EntryList entries={cvData.groupExhibitions} italic />
                            </div>
                        </div>
                    </SectionBlock>

                    {/* Work Experience */}
                    <SectionBlock id="work" title="Work Experience">
                        <div className="space-y-10">
                            <div>
                                <SubLabel>Current</SubLabel>
                                <EntryList entries={cvData.workExperienceCurrent} />
                            </div>
                            <div>
                                <SubLabel>Past</SubLabel>
                                <EntryList entries={cvData.workExperiencePast} />
                            </div>
                        </div>
                    </SectionBlock>

                    {/* Workshops & Residencies */}
                    <SectionBlock id="workshops" title="Workshops & Residencies">
                        <EntryList entries={cvData.workshopsResidencies} />
                    </SectionBlock>

                    {/* Invited Lectures */}
                    <SectionBlock id="lectures" title="Invited Lectures">
                        <EntryList entries={cvData.invitedLectures} />
                    </SectionBlock>

                    {/* Awards */}
                    {cvData.awards.length > 0 && (
                        <SectionBlock id="awards" title="Awards & Grants">
                            <EntryList entries={cvData.awards} />
                        </SectionBlock>
                    )}

                    {/* Public Collections */}
                    {cvData.publicCollections.length > 0 && (
                        <SectionBlock id="collections" title="Public Collections">
                            <ul className="space-y-3">
                                {cvData.publicCollections.map((c, i) => (
                                    <li
                                        key={i}
                                        className="text-muted-foreground font-light text-sm pl-4 border-l-2 border-primary/30"
                                    >
                                        {c.name}
                                    </li>
                                ))}
                            </ul>
                        </SectionBlock>
                    )}
                </div>
            </div>
        </>
    );
}
