<template>
  <component
    :is="tag"
    :class="classes"
    :style="style"
    :title="title || tooltipText"
    :aria-label="typingEnabled ? sourceText : undefined"
    :aria-busy="isTyping || undefined"
  >
    <template v-if="typingEnabled">
      <span aria-hidden="true">{{ displayedContent }}</span>
      <span v-if="isTyping" :class="ns.e('typing-caret')" aria-hidden="true" />
    </template>
    <slot v-else>{{ content }}</slot>
  </component>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { textProps } from './text'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'SText' })

const props = defineProps(textProps)
const ns = useNamespace('text')
const displayedContent = shallowRef('')
const isTyping = shallowRef(false)
let typingTimer: ReturnType<typeof setTimeout> | undefined
let isMounted = false
let typingRun = 0

const sourceText = computed(() => `${props.content ?? ''}`)
const clampLines = computed(() =>
  typeof props.lineClamp === 'number' ? props.lineClamp : 0,
)
const typingDelay = computed(() =>
  props.typing === true
    ? 40
    : typeof props.typing === 'number'
      ? props.typing
      : 0,
)
const typingEnabled = computed(
  () => typingDelay.value > 0 && sourceText.value.length > 0,
)

const classes = computed(() => [
  ns.b(),
  props.status || props.type ? ns.m(props.status || props.type) : undefined,
  ns.is('ellipsis', clampLines.value === 1),
  ns.is('clamp', clampLines.value > 1),
  ns.is('typing', typingEnabled.value),
])
const style = computed<CSSProperties>(() =>
  clampLines.value > 1 ? { WebkitLineClamp: clampLines.value } : {},
)
const tooltipText = computed(() =>
  clampLines.value > 0 ? sourceText.value : undefined,
)

const clearTypingTimer = () => {
  if (typingTimer !== undefined) {
    clearTimeout(typingTimer)
    typingTimer = undefined
  }
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const startTyping = async () => {
  const currentRun = ++typingRun
  clearTypingTimer()

  if (!typingEnabled.value || prefersReducedMotion()) {
    displayedContent.value = sourceText.value
    isTyping.value = false
    return
  }

  displayedContent.value = ''
  isTyping.value = true
  await nextTick()

  if (currentRun !== typingRun) return

  const characters = Array.from(sourceText.value)
  let index = 0
  const typeNextCharacter = () => {
    displayedContent.value += characters[index]
    index += 1

    if (index < characters.length) {
      typingTimer = setTimeout(typeNextCharacter, typingDelay.value)
    } else {
      typingTimer = undefined
      isTyping.value = false
    }
  }

  typingTimer = setTimeout(typeNextCharacter, typingDelay.value)
}

watch([sourceText, () => props.typing], () => {
  if (isMounted) startTyping()
})

onMounted(() => {
  isMounted = true
  startTyping()
})

onBeforeUnmount(() => {
  isMounted = false
  typingRun += 1
  clearTypingTimer()
})
</script>
