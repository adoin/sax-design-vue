import { computed } from 'vue'
import { useGlobalConfig } from '../use-global-config'

export const useWeekConfig = (
  localStart: () => number | undefined = () => undefined,
) => {
  const globalStart = useGlobalConfig('firstDayOfWeek')
  const firstWeek = useGlobalConfig('firstWeekContainsDate')
  const firstDayOfWeek = computed(() => {
    const value = localStart() ?? globalStart.value ?? 1
    return Number.isInteger(value) && value >= 0 && value <= 6 ? value : 1
  })
  const firstWeekContainsDate = computed(() => {
    const value = firstWeek.value ?? 4
    return Number.isInteger(value) && value >= 1 && value <= 7 ? value : 4
  })
  return { firstDayOfWeek, firstWeekContainsDate }
}
