"use client";

import React from "react";
import { goToPanel } from "@/components/horizontal-scroll-store";

// Jumps to another spread on the same route with the pager's own animation.
// A real anchor underneath, so it still works without JavaScript.
export function PanelLink({
    panelId,
    className,
    children,
    ...rest
}: { panelId: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
    return (
        <a
            href={`#${panelId}`}
            className={className}
            onClick={(e) => {
                e.preventDefault();
                goToPanel(panelId);
            }}
            {...rest}
        >
            {children}
        </a>
    );
}
