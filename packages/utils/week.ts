/** Calendar-day arithmetic in UTC avoids DST changing the length of a week. */
export const getCalendarWeek = (
  date: Date,
  firstDay = 1,
  firstWeekContainsDate = 4,
) => {
  const day = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  const first = (year: number) => {
    const anchor = Date.UTC(year, 0, firstWeekContainsDate)
    return (
      anchor - ((new Date(anchor).getUTCDay() - firstDay + 7) % 7) * 86400000
    )
  }
  let year = date.getFullYear()
  if (day < first(year)) year--
  else if (day >= first(year + 1)) year++
  return { year, week: Math.floor((day - first(year)) / 604800000) + 1 }
}
