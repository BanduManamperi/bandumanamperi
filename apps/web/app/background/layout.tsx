import { ScrollablePanel } from "@/components/scrollable-panel"

export default function BackgroundLayout({ children }: { children: React.ReactNode }) {
    return <ScrollablePanel>{children}</ScrollablePanel>
}
