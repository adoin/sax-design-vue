import { describe, expect, it } from 'vitest'
import {
  formatDateTimeValue,
  isValidTimeZone,
  parseDateTime,
} from '../timezone'

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss'

describe('timezone utilities', () => {
  it('maps the same wall time to different absolute milliseconds', () => {
    const shanghai = parseDateTime(
      '2026-08-05 14:00:22',
      DATE_TIME_FORMAT,
      'Asia/Shanghai',
    )
    const newYork = parseDateTime(
      '2026-08-05 14:00:22',
      DATE_TIME_FORMAT,
      'America/New_York',
    )

    expect(formatDateTimeValue(shanghai, 'timestamp', 'Asia/Shanghai')).toBe(
      Date.UTC(2026, 7, 5, 6, 0, 22),
    )
    expect(formatDateTimeValue(newYork, 'timestamp', 'America/New_York')).toBe(
      Date.UTC(2026, 7, 5, 18, 0, 22),
    )
  })

  it('renders an absolute instant in the requested time zone', () => {
    const instant = Date.UTC(2026, 7, 5, 6, 0, 22)

    expect(
      parseDateTime(instant, undefined, 'Asia/Shanghai')?.format(
        DATE_TIME_FORMAT,
      ),
    ).toBe('2026-08-05 14:00:22')
    expect(
      parseDateTime(instant, undefined, 'America/New_York')?.format(
        DATE_TIME_FORMAT,
      ),
    ).toBe('2026-08-05 02:00:22')
  })

  it('validates IANA time zone identifiers', () => {
    expect(isValidTimeZone('Asia/Shanghai')).toBe(true)
    expect(isValidTimeZone('America/New_York')).toBe(true)
    expect(isValidTimeZone('Mars/Olympus_Mons')).toBe(false)
  })
})
