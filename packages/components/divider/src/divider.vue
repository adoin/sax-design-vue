<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { getCssColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { dividerProps } from './divider'
import { readableDividerLabelColor } from './divider-color'

defineOptions({ name: 'SDivider' })

const props = defineProps(dividerProps)
const slots = useSlots()
const ns = useNamespace('divider')

const isVertical = computed(() => props.direction === 'vertical')
const hasContent = computed(() => Boolean(props.icon || slots.default))
const hasBackground = computed(() =>
  Boolean(props.background && props.background !== 'transparent'),
)
const resolveColor = (value: string) =>
  getCssColor(normalizeVsColor(value)) || value

const automaticLabelColor = computed(() => {
  if (props.labelColor) return resolveColor(props.labelColor)

  if (hasBackground.value) {
    const background = normalizeVsColor(props.background)
    if (['primary', 'dark', 'black'].includes(background))
      return 'var(--sax-css-white)'
    if (['danger', 'error', 'white'].includes(background))
      return 'var(--sax-css-black)'
    if (['success', 'warn', 'light', 'info'].includes(background))
      return 'var(--sax-css-dark)'
    return readableDividerLabelColor(props.background)
  }

  if (props.variant === 'solid') {
    const color = normalizeVsColor(props.color)
    const literalColor = readableDividerLabelColor(props.color)
    if (literalColor) return literalColor
    return ['success', 'warn', 'light', 'info'].includes(color)
      ? 'var(--sax-css-dark)'
      : 'var(--sax-css-white)'
  }

  return undefined
})

const rootClass = computed(() => [
  ns.b(),
  ns.m(props.direction),
  ns.m(props.variant),
  ns.m(props.position),
  ns.is('colored', props.color !== 'default'),
  ns.is('custom-background', hasBackground.value),
  ns.is(
    'solid-danger',
    props.variant === 'solid' &&
      !hasBackground.value &&
      ['danger', 'error'].includes(normalizeVsColor(props.color)),
  ),
])

const rootStyle = computed(() => {
  const style: Record<string, string> = {
    '--s-divider-gap': props.gap,
    '--s-divider-line-width': props.borderHeight,
    '--s-divider-line-style': props.borderStyle,
  }

  if (props.color !== 'default') {
    style['--s-divider-accent'] = resolveColor(props.color)
  }
  if (hasBackground.value) {
    style['--s-divider-background'] = resolveColor(props.background)
  }
  if (automaticLabelColor.value) {
    style['--s-divider-label-color'] = automaticLabelColor.value
  }

  return style
})
</script>

<template>
  <div
    :class="rootClass"
    :style="rootStyle"
    role="separator"
    :aria-orientation="props.direction"
  >
    <span
      v-if="isVertical"
      :class="[ns.e('border'), ns.is('vertical')]"
      aria-hidden="true"
    />
    <template v-else>
      <span
        v-if="!hasContent || props.position !== 'left'"
        :class="[ns.e('border'), ns.is('before')]"
        aria-hidden="true"
      />
      <span v-if="hasContent" :class="ns.e('text')">
        <SIcon
          v-if="props.icon"
          :name="props.icon"
          :class="ns.e('icon')"
          aria-hidden="true"
        />
        <slot v-else />
      </span>
      <span
        v-if="hasContent && props.position !== 'right'"
        :class="[ns.e('border'), ns.is('after')]"
        aria-hidden="true"
      />
    </template>
  </div>
</template>
