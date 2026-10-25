"use client";

import { SiteHeader } from "@/components/site-header";

export default function StudioError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <>
            <SiteHeader />
            <main className="flex-1 overflow-y-auto px-5 py-16 sm:px-8">
                <h1 className="text-[1.75rem] font-light">The studio could not be loaded.</h1>
                <button type="button" onClick={reset} className="mt-6 underline underline-offset-4">
                    Try again
                </button>
            </main>
        </>
    );
}
