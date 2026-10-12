import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
import { segmentEditorText } from '../segment-text'

export const useTextReveal = (
  props: { text: string; interval: number; paused: boolean; animate: boolean },
  onFinish: () => void,
) => {
  const visibleCount = shallowRef(0)
  const reduced = shallowRef(false)
  const units = computed(() => segmentEditorText(props.text, 'grapheme'))
  const text = computed(() => units.value.slice(0, visibleCount.value).join(''))
  const busy = computed(() => visibleCount.value < units.value.length)
  let timer: ReturnType<typeof setTimeout> | undefined
  let mounted = false
  let query: MediaQueryList | undefined
  let finishedText: string | undefined
  const stop = () => {
    clearTimeout(timer)
    timer = undefined
  }
  const finish = () => {
    stop()
    visibleCount.value = units.value.length
    if (finishedText !== props.text) {
      finishedText = props.text
      onFinish()
    }
  }
  const schedule = () => {
    stop()
    if (!mounted || props.paused) return
    if (!props.animate || reduced.value || props.interval <= 0) {
      finish()
      return
    }
    if (!busy.value) {
      finish()
      return
    }
    // Bound the longest reveal to 200 ticks and keep one timer per instance.
    timer = setTimeout(
      () => {
        visibleCount.value = Math.min(
          units.value.length,
          visibleCount.value + Math.max(1, Math.ceil(units.value.length / 200)),
        )
        schedule()
      },
      Math.max(4, props.interval),
    )
  }
  watch(
    () => props.text,
    (value, previous) => {
      if (!previous || !value.startsWith(previous)) visibleCount.value = 0
      finishedText = undefined
      schedule()
    },
    { flush: 'sync' },
  )
  watch(
    () => [props.paused, props.animate, props.interval, reduced.value],
    schedule,
  )
  const motionChange = () => {
    reduced.value = query?.matches ?? false
  }
  onMounted(() => {
    mounted = true
    query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    motionChange()
    query?.addEventListener('change', motionChange)
    schedule()
  })
  onBeforeUnmount(() => {
    mounted = false
    stop()
    query?.removeEventListener('change', motionChange)
  })
  const replay = () => {
    visibleCount.value = 0
    finishedText = undefined
    schedule()
  }
  return { text, busy, replay, finish }
}
