"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

// Fires one analytics event when a server-rendered page mounts.
export function TrackEvent({ event, properties }: { event: string; properties: Record<string, unknown> }) {
    const key = JSON.stringify(properties);
    useEffect(() => {
        posthog.capture(event, JSON.parse(key));
    }, [event, key]);
    return null;
}
