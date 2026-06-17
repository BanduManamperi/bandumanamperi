import { ScrollablePanel } from "@/components/scrollable-panel"

export default function WorkLayout({ children }: { children: React.ReactNode }) {
    return <ScrollablePanel>{children}</ScrollablePanel>
}
