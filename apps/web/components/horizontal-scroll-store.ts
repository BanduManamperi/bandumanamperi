// Tiny client-side store so the bottom nav can reflect (and drive) the panel
// that HorizontalScroll is currently showing, without prop-drilling across the
// layout (Navbar is a sibling of HorizontalScroll, not a child).

type Listener = () => void

let activePanelId: string | null = null
let goToFn: (id: string) => void = () => {}
const listeners = new Set<Listener>()

export function subscribe(listener: Listener): () => void {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

export function getActivePanelId(): string | null {
    return activePanelId
}

// Stable server snapshot for useSyncExternalStore (no active panel during SSR).
export function getServerActivePanelId(): null {
    return null
}

export function setActivePanelId(id: string | null): void {
    if (id !== activePanelId) {
        activePanelId = id
        listeners.forEach((l) => l())
    }
}

export function registerGoToPanel(fn: (id: string) => void): void {
    goToFn = fn
}

export function goToPanel(id: string): void {
    goToFn(id)
}
