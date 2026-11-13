import type { Offer } from "@/lib/inventory";

export function formatPrice(amount: number, currency: string): string {
    const code = currency.trim() || "USD";
    const digits = Number.isInteger(amount) ? 0 : 2;
    try {
        return new Intl.NumberFormat("en", {
            style: "currency",
            currency: code,
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        }).format(amount);
    } catch {
        return `${code} ${amount.toLocaleString("en")}`;
    }
}

/**
 * The commercial line on a wall label. Absent when the work is unpriced, and
 * for sold works: the catalogue carries no sale status, a sold work simply
 * has no enquiry link.
 */
export function offerLine(work: Offer): { text: string; figure: boolean } | null {
    if (work.availability === "sold") return null;
    if (work.priceUponRequest) return { text: "Price on request", figure: false };
    if (work.price == null) return null;
    return { text: formatPrice(work.price, work.currency), figure: true };
}
