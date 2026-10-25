// Site copy avoids em and en dashes. CMS text is normalised on read so editors
// can type whatever they like: numeric ranges become "to", other dashes commas.
export function withoutDashes(value: string): string {
    return value
        .replace(/(\d)\s*[–—-]\s*(\d)/g, "$1 to $2")
        .replace(/(\d{4})\s*[–—-]\s*/g, "$1 to ")
        .replace(/\s*[—–]\s*/g, ", ")
        .replace(/\s+-\s+/g, ", ");
}
