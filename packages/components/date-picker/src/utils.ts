import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat.js'
import isoWeek from 'dayjs/plugin/isoWeek.js'
import weekOfYear from 'dayjs/plugin/weekOfYear.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'

dayjs.extend(customParseFormat)
dayjs.extend(isoWeek)
dayjs.extend(weekOfYear)
dayjs.extend(advancedFormat)

export type DatePickerType =
  | 'date'
  | 'datetime'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'year'
  | 'week'

export type DatePickerValue =
  | Date
  | string
  | number
  | [Date, Date]
  | [string, string]
  | null
  | undefined

export type DateShortcut = {
  text: string
  value: Date | (() => Date) | [Date, Date] | (() => [Date, Date])
}

export const isRangeType = (type: DatePickerType) => type.includes('range')

export const hasTime = (type: DatePickerType) =>
  type === 'datetime' || type === 'datetimerange'

export const getDefaultFormat = (type: DatePickerType) => {
  switch (type) {
    case 'datetime':
    case 'datetimerange':
      return 'YYYY-MM-DD HH:mm:ss'
    case 'month':
      return 'YYYY-MM'
    case 'year':
      return 'YYYY'
    case 'week':
      return 'gggg-[W]ww'
    default:
      return 'YYYY-MM-DD'
  }
}

export const parseToDayjs = (
  value: Date | string | number | null | undefined,
  format?: string
) => {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) return dayjs(value)
  if (typeof value === 'number') return dayjs(value)
  if (format) {
    const parsed = dayjs(value, format, true)
    return parsed.isValid() ? parsed : dayjs(value)
  }
  return dayjs(value)
}

export const formatValue = (
  date: dayjs.Dayjs | null,
  format: string,
  valueFormat?: string
) => {
  if (!date || !date.isValid()) return null
  if (valueFormat) return date.format(valueFormat)
  return date.toDate()
}

export const formatDisplay = (
  date: dayjs.Dayjs | null,
  displayFormat: string
) => {
  if (!date || !date.isValid()) return ''
  return date.format(displayFormat)
}

export const getCalendarCells = (year: number, month: number) => {
  const first = dayjs().year(year).month(month).startOf('month')
  const last = first.endOf('month')
  const startOffset = first.day()
  const cells: Array<{
    type: 'prev' | 'current' | 'next'
    date: dayjs.Dayjs
  }> = []

  for (let i = startOffset - 1; i >= 0; i--) {
    cells.push({ type: 'prev', date: first.subtract(i + 1, 'day') })
  }

  let current = first
  while (current.isBefore(last) || current.isSame(last, 'day')) {
    cells.push({ type: 'current', date: current })
    current = current.add(1, 'day')
  }

  while (cells.length < 42) {
    const lastCell = cells[cells.length - 1]!.date
    cells.push({ type: 'next', date: lastCell.add(1, 'day') })
  }

  return cells
}

export const getMonthTable = (year: number) => {
  const months: dayjs.Dayjs[] = []
  for (let i = 0; i < 12; i++) {
    months.push(dayjs().year(year).month(i).startOf('month'))
  }
  return months
}

export const getYearTable = (centerYear: number) => {
  const start = centerYear - (centerYear % 10)
  const years: dayjs.Dayjs[] = []
  for (let i = 0; i < 10; i++) {
    years.push(
      dayjs()
        .year(start + i)
        .startOf('year')
    )
  }
  return years
}

export const isSameDay = (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) =>
  !!a && !!b && a.isSame(b, 'day')

export const isSameMonth = (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) =>
  !!a && !!b && a.isSame(b, 'month')

export const isSameYear = (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) =>
  !!a && !!b && a.isSame(b, 'year')

export const isSameWeek = (a: dayjs.Dayjs | null, b: dayjs.Dayjs | null) =>
  !!a && !!b && a.isSame(b, 'week')

export const isDateInRange = (
  date: dayjs.Dayjs,
  start: dayjs.Dayjs | null,
  end: dayjs.Dayjs | null
) => {
  if (!start || !end) return false
  const min = start.isBefore(end) ? start : end
  const max = start.isBefore(end) ? end : start
  return (
    (date.isAfter(min, 'day') || date.isSame(min, 'day')) &&
    (date.isBefore(max, 'day') || date.isSame(max, 'day'))
  )
}

export const range = (start: number, end: number, step = 1) => {
  const result: number[] = []
  for (let i = start; i <= end; i += step) result.push(i)
  return result
}
