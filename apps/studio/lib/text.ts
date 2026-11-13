// CMS text is normalised on read. Numeric ranges become "to"; other dashes become commas.
export function withoutDashes(value: string): string {
    return value
        .replace(/(\d)\s*[–—-]\s*(\d)/g, "$1 to $2")
        .replace(/(\d{4})\s*[–—-]\s*/g, "$1 to ")
        .replace(/\s*[—–]\s*/g, ", ")
        .replace(/\s+-\s+/g, ", ");
}

// Straight quotes become curly ones, and three dots an ellipsis, as a typesetter would set them.
// A quote at the start, or after a space, bracket or dash, opens; any other closes.
export function typeset(value: string): string {
    return value
        .replace(/\.\.\./g, "\u2026")
        .replace(/(^|[\s([{\u2013\u2014-])"/g, "$1\u201C")
        .replace(/"/g, "\u201D")
        .replace(/(^|[\s([{\u2013\u2014-])'/g, "$1\u2018")
        .replace(/'/g, "\u2019");
}

export function escapeHtml(text: string): string {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}
