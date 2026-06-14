export type ExhibitionScheduleStatus = "upcoming" | "ongoing" | "past"

export interface ExhibitionScheduleFields {
  /** @deprecated Legacy free-text dates. Prefer startDate/endDate. */
  dates?: string | null
  startDate?: string | null
  endDate?: string | null
  startTime?: string | null
  endTime?: string | null
}

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/
const TIME_ONLY = /^\d{2}:\d{2}$/

function parseDateOnly(value: string): Date | null {
  if (!DATE_ONLY.test(value)) {
    return null
  }

  const [year, month, day] = value.split("-").map(Number)
  const date = new Date(year, month - 1, day)
  return Number.isNaN(date.getTime()) ? null : date
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function formatTimeLabel(time: string): string {
  if (!TIME_ONLY.test(time)) {
    return time
  }

  const [hours, minutes] = time.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

function formatDayLabel(date: Date, includeYear = true): string {
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" } : {}),
  })
}

export function getExhibitionStartDate(
  schedule: ExhibitionScheduleFields
): Date | null {
  if (schedule.startDate) {
    return parseDateOnly(schedule.startDate)
  }

  if (schedule.dates) {
    const parsed = Date.parse(schedule.dates)
    if (!Number.isNaN(parsed)) {
      return startOfDay(new Date(parsed))
    }
  }

  return null
}

export function getExhibitionEndDate(
  schedule: ExhibitionScheduleFields
): Date | null {
  if (schedule.endDate) {
    return parseDateOnly(schedule.endDate)
  }

  return getExhibitionStartDate(schedule)
}

export function getExhibitionScheduleStatus(
  schedule: ExhibitionScheduleFields,
  now: Date = new Date()
): ExhibitionScheduleStatus {
  const start = getExhibitionStartDate(schedule)
  const end = getExhibitionEndDate(schedule)

  if (!start) {
    return "past"
  }

  const today = startOfDay(now)
  const startDay = startOfDay(start)
  const endDay = startOfDay(end ?? start)

  if (today < startDay) {
    return "upcoming"
  }

  if (today > endDay) {
    return "past"
  }

  return "ongoing"
}

export function formatExhibitionSchedule(
  schedule: ExhibitionScheduleFields
): string {
  const start = getExhibitionStartDate(schedule)
  const end = getExhibitionEndDate(schedule)

  if (!start) {
    return schedule.dates?.trim() || "Date to be announced"
  }

  const startTime = schedule.startTime ? formatTimeLabel(schedule.startTime) : null
  const endTime = schedule.endTime ? formatTimeLabel(schedule.endTime) : null

  if (end && startOfDay(end).getTime() !== startOfDay(start).getTime()) {
    const sameYear = start.getFullYear() === end.getFullYear()
    const range = sameYear
      ? `${formatDayLabel(start, false)} – ${formatDayLabel(end, true)}`
      : `${formatDayLabel(start, true)} – ${formatDayLabel(end, true)}`

    if (startTime || endTime) {
      if (startTime && endTime) {
        return `${range}, ${startTime} – ${endTime}`
      }
      return `${range}, ${startTime ?? endTime}`
    }

    return range
  }

  let label = formatDayLabel(start, true)

  if (startTime && endTime) {
    label = `${label}, ${startTime} – ${endTime}`
  } else if (startTime) {
    label = `${label}, ${startTime}`
  }

  return label
}

export function getExhibitionYear(schedule: ExhibitionScheduleFields): string {
  const start = getExhibitionStartDate(schedule)
  if (start) {
    return start.getFullYear().toString()
  }

  const match = schedule.dates?.match(/\d{4}/)
  return match?.[0] ?? ""
}

export function getExhibitionSortTimestamp(
  schedule: ExhibitionScheduleFields
): number {
  const start = getExhibitionStartDate(schedule)
  if (start) {
    return start.getTime()
  }

  if (schedule.dates) {
    const parsed = Date.parse(schedule.dates)
    if (!Number.isNaN(parsed)) {
      return parsed
    }
  }

  return 0
}

export function getExhibitionIdentityKey(exhibition: {
  name: string
  venue: string
} & ExhibitionScheduleFields): string {
  if (exhibition.startDate) {
    return `${exhibition.name}|${exhibition.venue}|${exhibition.startDate}|${exhibition.endDate ?? ""}`
  }

  return `${exhibition.name}|${exhibition.venue}|${exhibition.dates ?? ""}`
}

export function exhibitionsMatch(
  a: { name: string; venue: string } & ExhibitionScheduleFields,
  b: { name: string; venue: string } & ExhibitionScheduleFields
): boolean {
  if (getExhibitionIdentityKey(a) === getExhibitionIdentityKey(b)) {
    return true
  }

  return (
    a.name === b.name &&
    a.venue === b.venue &&
    Boolean(a.dates) &&
    a.dates === b.dates
  )
}

export function getExhibitionScheduleLabel(
  status: ExhibitionScheduleStatus
): string {
  switch (status) {
    case "upcoming":
      return "Upcoming"
    case "ongoing":
      return "Now on view"
    case "past":
      return "Past"
  }
}

export function sortExhibitionsForDisplay<
  T extends ExhibitionScheduleFields
>(exhibitions: T[]): T[] {
  const statusRank: Record<ExhibitionScheduleStatus, number> = {
    ongoing: 0,
    upcoming: 1,
    past: 2,
  }

  return [...exhibitions].sort((a, b) => {
    const statusA = getExhibitionScheduleStatus(a)
    const statusB = getExhibitionScheduleStatus(b)
    const rankDiff = statusRank[statusA] - statusRank[statusB]

    if (rankDiff !== 0) {
      return rankDiff
    }

    const timeA = getExhibitionSortTimestamp(a)
    const timeB = getExhibitionSortTimestamp(b)

    if (statusA === "past") {
      return timeB - timeA
    }

    return timeA - timeB
  })
}

/** Ongoing, upcoming, or ended within the last N months (default 6). */
export function isExhibitionInHomepageEventsWindow(
  schedule: ExhibitionScheduleFields,
  now: Date = new Date(),
  lookbackMonths = 6
): boolean {
  const status = getExhibitionScheduleStatus(schedule, now)

  if (status === "upcoming" || status === "ongoing") {
    return true
  }

  const end = getExhibitionEndDate(schedule) ?? getExhibitionStartDate(schedule)
  if (!end) {
    return false
  }

  const cutoff = new Date(
    now.getFullYear(),
    now.getMonth() - lookbackMonths,
    now.getDate()
  )

  return startOfDay(end) >= startOfDay(cutoff)
}

export function sortHomepageEventsExhibitions<
  T extends ExhibitionScheduleFields
>(exhibitions: T[]): T[] {
  return sortExhibitionsForDisplay(exhibitions)
}

export function getHomepageEventLabel(
  status: ExhibitionScheduleStatus
): string {
  if (status === "past") {
    return "Recent"
  }

  return getExhibitionScheduleLabel(status)
}

export function buildExhibitionSchedulePayload(input: {
  startDate: string
  endDate?: string
  startTime?: string
  endTime?: string
}): {
  startDate: string
  endDate: string | null
  startTime: string | null
  endTime: string | null
  dates: string
} {
  const schedule = {
    startDate: input.startDate,
    endDate: input.endDate || null,
    startTime: input.startTime || null,
    endTime: input.endTime || null,
  }

  return {
    startDate: input.startDate,
    endDate: input.endDate || null,
    startTime: input.startTime || null,
    endTime: input.endTime || null,
    dates: formatExhibitionSchedule(schedule),
  }
}
