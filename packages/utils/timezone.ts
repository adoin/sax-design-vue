import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import timezonePlugin from 'dayjs/plugin/timezone.js'
import utc from 'dayjs/plugin/utc.js'

import type { Dayjs } from 'dayjs'

dayjs.extend(advancedFormat)
dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(timezonePlugin)

export type TimeZone = string

const OFFSET_SUFFIX_RE = /(?:z|[+-]\d{2}:?\d{2})$/i
const WALL_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS'

export const isValidTimeZone = (timeZone?: string | null): boolean => {
  const value = timeZone?.trim()
  if (!value) return false

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: value }).format(0)
    return true
  } catch {
    return false
  }
}

export const normalizeTimeZone = (timeZone?: string | null) => {
  const value = timeZone?.trim()
  return value && isValidTimeZone(value) ? value : undefined
}

export const getTimeZoneNow = (timeZone?: string | null): Dayjs => {
  const resolved = normalizeTimeZone(timeZone)
  return resolved ? dayjs().tz(resolved) : dayjs()
}

const parseEpochValue = (value: string | number, format?: string) => {
  if (format === 'timestamp' || format === 'x') {
    const milliseconds = Number(value)
    return Number.isFinite(milliseconds) ? dayjs(milliseconds) : null
  }
  if (format === 'X') {
    const seconds = Number(value)
    return Number.isFinite(seconds) ? dayjs(seconds * 1000) : null
  }
  return null
}

/**
 * Parses absolute values into the requested zone and wall-clock strings in
 * that zone. With no zone it preserves the components' historical behavior.
 */
export const parseDateTime = (
  value: Date | string | number | null | undefined,
  format?: string,
  timeZone?: string | null,
): Dayjs | null => {
  if (value === null || value === undefined || value === '') return null

  const resolved = normalizeTimeZone(timeZone)
  const epochValue =
    typeof value === 'number' || typeof value === 'string'
      ? parseEpochValue(value, format)
      : null

  if (epochValue) return resolved ? epochValue.tz(resolved) : epochValue

  if (value instanceof Date || typeof value === 'number') {
    const parsed = dayjs(value)
    return resolved ? parsed.tz(resolved) : parsed
  }

  if (!resolved) {
    if (format) {
      const parsed = dayjs(value, format, true)
      return parsed.isValid() ? parsed : dayjs(value)
    }
    return dayjs(value)
  }

  if (!format && OFFSET_SUFFIX_RE.test(value)) {
    const parsed = dayjs(value)
    return parsed.isValid() ? parsed.tz(resolved) : parsed
  }

  const parsed = format
    ? dayjs.tz(value, format, resolved)
    : dayjs.tz(value, resolved)
  return parsed.isValid() ? parsed : dayjs(value).tz(resolved)
}

/** Reinterprets a Dayjs value's visible fields as wall time in `timeZone`. */
export const toTimeZoneWallTime = (
  value: Dayjs,
  timeZone?: string | null,
): Dayjs => {
  const resolved = normalizeTimeZone(timeZone)
  if (!resolved) return value
  return dayjs.tz(value.format(WALL_TIME_FORMAT), WALL_TIME_FORMAT, resolved)
}

export const formatDateTimeValue = (
  value: Dayjs | null,
  valueFormat?: string,
  timeZone?: string | null,
): Date | string | number | null => {
  if (!value?.isValid()) return null

  const zonedValue = toTimeZoneWallTime(value, timeZone)
  if (valueFormat === 'timestamp') return zonedValue.valueOf()
  if (valueFormat) return zonedValue.format(valueFormat)
  return zonedValue.toDate()
}
