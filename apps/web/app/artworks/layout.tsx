import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Artworks',
    description: 'Artworks By Bandu Manamperi - Paintings, Sculptures, and Performances',
}



export default function PortFolioLayout(
    {
        // Layouts must accept a children prop.
        // This will be populated with nested layouts or pages
        children,
    }: {
        children: React.ReactNode
    }) {
    return (
        <div className='mt-24'>
            {children}
        </div>
    )
}