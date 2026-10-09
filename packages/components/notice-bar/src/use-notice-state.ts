import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  shallowRef,
  watch,
} from 'vue'
import type { Ref } from 'vue'
import type {
  NoticeBarEmitFn,
  NoticeBarItem,
  NoticeBarProps,
} from './notice-bar'

export const useNoticeState = (
  props: NoticeBarProps,
  emit: NoticeBarEmitFn,
  paused: Readonly<Ref<boolean>>,
  readingTime: Readonly<Ref<number>>,
) => {
  const localVisible = shallowRef(true)
  const localIndex = shallowRef(0)
  const suspended = shallowRef(false)
  const notices = computed<NoticeBarItem[]>(() =>
    props.items.length
      ? props.items.map((item) =>
          typeof item === 'string' ? { content: item } : item,
        )
      : [{ content: props.content ?? '' }],
  )
  const visible = computed(() => props.modelValue ?? localVisible.value)
  const normalize = (value: number) =>
    Math.max(
      0,
      Math.min(
        notices.value.length - 1,
        Number.isFinite(value) ? Math.trunc(value) : 0,
      ),
    )
  const index = computed(() => normalize(props.activeIndex ?? localIndex.value))
  const item = computed(() => notices.value[index.value])
  const goTo = (value: number) => {
    const next = normalize(value)
    if (props.activeIndex === undefined) localIndex.value = next
    emit('update:activeIndex', next)
  }
  const step = (amount: number) =>
    goTo(
      props.loop
        ? (index.value + amount + notices.value.length) % notices.value.length
        : index.value + amount,
    )
  const next = () => step(1)
  const prev = () => step(-1)
  const close = () => {
    if (!visible.value) return
    if (props.modelValue === undefined) localVisible.value = false
    emit('update:modelValue', false)
    emit('close')
  }
  const open = () => {
    if (props.modelValue === undefined) localVisible.value = true
    emit('update:modelValue', true)
  }
  let timer: ReturnType<typeof setTimeout> | undefined
  const stopTimer = () => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
  }
  const restart = () => {
    stopTimer()
    if (
      !visible.value ||
      paused.value ||
      suspended.value ||
      !props.autoplay ||
      notices.value.length < 2 ||
      (!props.loop && index.value === notices.value.length - 1)
    )
      return
    timer = setTimeout(
      () => {
        timer = undefined
        next()
      },
      Math.max(500, props.interval || 3000, readingTime.value),
    )
  }
  watch(
    [
      visible,
      paused,
      index,
      () => notices.value.length,
      () => props.autoplay,
      () => props.interval,
      () => props.loop,
      suspended,
      readingTime,
    ],
    restart,
    { immediate: true },
  )
  watch(index, (value) => emit('change', value, item.value))
  watch(
    () => props.items,
    () => {
      const current = props.activeIndex ?? localIndex.value
      const normalized = normalize(current)
      if (current !== normalized) goTo(normalized)
    },
    { deep: true },
  )
  onDeactivated(() => {
    suspended.value = true
  })
  onActivated(() => {
    suspended.value = false
  })
  onBeforeUnmount(stopTimer)
  return {
    notices,
    visible,
    index,
    item,
    close,
    open,
    goTo,
    next,
    prev,
    restart,
  }
}
