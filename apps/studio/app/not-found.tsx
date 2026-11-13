import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
    return (
        <>
            <SiteHeader />
            <main className="flex-1 overflow-y-auto px-5 py-16 sm:px-8">
                <h1 className="text-[1.75rem] font-light">This work is not in the studio.</h1>
                <Link href="/" className="mt-6 inline-block underline underline-offset-4">
                    Available works
                </Link>
            </main>
        </>
    );
}
