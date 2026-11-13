import type { SVGProps } from "react";

// The BM monogram: Noto Sans Light (300) capitals, set with no space so the
// B's bowls rest on the M's first stem. Outlined from the font so it renders
// identically everywhere. Size it with height; the width follows.
export const MONOGRAM_PATH =
    "M197.5 0Q330 0 392.8 41.2Q455.5 82.5 455.5 174.5Q455.5 215.5 439.8 249.2Q424 283 393 305.5Q362 328 317 336V339.5Q369 347.5 404.8 368.8Q440.5 390 458.5 425.2Q476.5 460.5 476.5 511Q476.5 580 445 625.2Q413.5 670.5 357 692.2Q300.5 714 225.5 714H0V0ZM211 315Q310 315 352.8 281Q395.5 247 395.5 180Q395.5 111 348.5 81Q301.5 51 198 51H58V315ZM58 365V663.5H221Q319.5 663.5 367.2 623.8Q415 584 415 508Q415 458 393 426.5Q371 395 326 380Q281 365 212 365ZM786.5 714 530 61.5H527Q528.5 79.5 529.2 101.8Q530 124 530.5 148.5Q531 173 531 199.5V714H476.5V0H564L810 625.5H813.5L1062 0H1148V714H1090.5V193.5Q1090.5 171 1091 148Q1091.5 125 1092.8 103Q1094 81 1094.5 62.5H1091.5L833.5 714Z";

export const MONOGRAM_VIEWBOX = "0 0 1148 714";

type MonogramProps = Omit<SVGProps<SVGSVGElement>, "viewBox" | "children"> & {
    /** Accessible name; omit when the monogram sits next to visible text. */
    title?: string;
};

export function Monogram({ title, className, ...rest }: MonogramProps) {
    return (
        <svg
            viewBox={MONOGRAM_VIEWBOX}
            fill="currentColor"
            className={className}
            role={title ? "img" : undefined}
            aria-hidden={title ? undefined : true}
            {...rest}
        >
            {title && <title>{title}</title>}
            <path d={MONOGRAM_PATH} />
        </svg>
    );
}
