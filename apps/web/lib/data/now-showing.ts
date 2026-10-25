import { getExhibitionScheduleStatus } from "@bandumanamperi/types";
import type { Exhibition } from "@/lib/actions/exhibitions";

/** The exhibition open right now, if any, as the contact page shows it. */
export function getNowShowing(exhibitions: Exhibition[]) {
    // Only a show that is open today counts; event lists can fall back to past shows.
    const current = exhibitions.find((e) => e.endDate && getExhibitionScheduleStatus(e) === "ongoing");
    return current?.endDate ? { name: current.name, endDate: current.endDate } : undefined;
}
