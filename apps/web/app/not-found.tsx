import { DocumentSheet } from "@/components/sheet/document-sheet";
import { TextLink, body, display } from "@/components/sheet/type";

export default function NotFound() {
    return (
        <DocumentSheet>
            <div className="mx-auto max-w-[72rem] pt-8 lg:pt-12">
                <h1 className={display}>Page not found</h1>
                <p className={`mt-6 max-w-[30rem] ${body}`}>
                    This page doesn&apos;t exist, or the work has moved. Recent works are under
                    Artworks; everything earlier is catalogued in the archive.
                </p>
                <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.8125rem]">
                    <TextLink href="/">Home</TextLink>
                    <TextLink href="/artworks">Artworks</TextLink>
                    <TextLink href="/archive">Archive</TextLink>
                </p>
            </div>
        </DocumentSheet>
    );
}
