// Rendered on the content pages (Home, About, the section landings) - not
// on the viewing room, which stays edge-to-edge for looking at the work.
export function Footer() {
    return (
        <footer className="shrink-0 border-t border-border bg-background px-[clamp(1.25rem,3.2vw,3.5rem)] py-6 text-[0.75rem] text-muted-foreground">
            <div className="mx-auto flex max-w-[72rem] flex-wrap items-center justify-between gap-4">
                <p>Bandu Manamperi Home &amp; Studio, Bandaragama, Sri Lanka</p>
                <div className="flex flex-wrap items-center gap-4">
                    <a href="mailto:bandumanamperi@yahoo.com" className="hover:text-foreground">
                        bandumanamperi@yahoo.com
                    </a>
                    <a href="tel:+94773672789" className="hover:text-foreground">
                        +94 77 367 2789
                    </a>
                    <a href="https://bandumanamperi.com" className="hover:text-foreground">
                        bandumanamperi.com
                    </a>
                </div>
            </div>
        </footer>
    );
}
