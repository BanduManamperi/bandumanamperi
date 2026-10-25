// CMS text is normalised on read. Numeric ranges become "to"; other dashes become commas.
export function withoutDashes(value: string): string {
    return value
        .replace(/(\d)\s*[–—-]\s*(\d)/g, "$1 to $2")
        .replace(/(\d{4})\s*[–—-]\s*/g, "$1 to ")
        .replace(/\s*[—–]\s*/g, ", ")
        .replace(/\s+-\s+/g, ", ");
}
