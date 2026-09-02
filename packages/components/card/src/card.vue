<script lang="ts" setup>
import { computed, useAttrs } from 'vue'
import { useColor, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { getVsColor } from '@vuesax-alpha/utils'
import { cardEmits, cardProps } from './card'
import type { CardType, LegacyCardType } from './card'
import type { CSSProperties } from 'vue'

defineOptions({
  name: 'SCard',
  inheritAttrs: false,
})

const props = defineProps(cardProps)
const emit = defineEmits(cardEmits)

defineSlots<{
  default(): any
  header(): any
  extra(): any
  media(): any
  img(): any
  title(): any
  subtitle(): any
  text(): any
  footer(): any
  actions(): any
  buttons(): any
  interactions(): any
}>()

const ns = useNamespace('card')
const attrs = useAttrs()
const color = useColor('primary')
const resolvedShape = useShape()

const legacyTypeMap: Record<`${LegacyCardType}`, CardType> = {
  '1': 'classic',
  '2': 'overlay',
  '3': 'split',
  '4': 'frosted',
  '5': 'reveal',
}
const originalCardTypes: CardType[] = [
  'classic',
  'overlay',
  'split',
  'frosted',
  'reveal',
]

const resolvedType = computed<CardType>(() => {
  const type = `${props.type}` as `${LegacyCardType}` | CardType
  return legacyTypeMap[type as `${LegacyCardType}`] || (type as CardType)
})
const usesPreset = computed(
  () => !props.variant && !props.orientation && !props.hoverEffect,
)
const usesOriginalPresetLayout = computed(
  () => usesPreset.value && originalCardTypes.includes(resolvedType.value),
)
const resolvedVariant = computed(() => props.variant || 'elevated')
const resolvedOrientation = computed(() => {
  if (props.orientation) return props.orientation
  return resolvedType.value === 'split' ? 'horizontal' : 'vertical'
})
const resolvedHoverEffect = computed(() => props.hoverEffect || 'none')
const isInteractive = computed(() => props.interactive || props.selectable)

const cardContentKls = computed(() => [
  ns.b('content'),
  usesPreset.value ? `type-${resolvedType.value}` : '',
  !usesPreset.value && ns.is(resolvedOrientation.value),
])

const cardKls = computed(() => [
  ns.b(),
  !usesPreset.value && ns.m(resolvedVariant.value),
  !usesPreset.value && ns.is(`hover-${resolvedHoverEffect.value}`),
  usesOriginalPresetLayout.value
    ? ns.is('square', resolvedShape.value === 'square')
    : ns.is(resolvedShape.value),
  ns.is('interactive', isInteractive.value),
  ns.is('selectable', props.selectable),
  ns.is('selected', props.selectable && props.selected),
  ns.is('loading', props.loading),
])

const cardStyles = computed<CSSProperties | undefined>(() => {
  if (usesOriginalPresetLayout.value && !props.color) return undefined
  return ns.cssVar({ color: getVsColor(color.value) })
})
const cardRole = computed(() => {
  const explicitRole = attrs.role as string | undefined
  return explicitRole || (isInteractive.value ? 'button' : undefined)
})
const cardTabindex = computed(() => {
  if (attrs.tabindex != null) return attrs.tabindex as string | number
  return isInteractive.value && !props.loading ? 0 : undefined
})

const handleClickCapture = (event: MouseEvent) => {
  if (!props.loading) return
  event.preventDefault()
  event.stopImmediatePropagation()
}

const handleCardClick = (event: MouseEvent) => {
  if (!props.selectable || props.loading) return
  const nextSelected = !props.selected
  emit('update:selected', nextSelected)
  emit('select', nextSelected, event)
}

const handleCardKeydown = (event: KeyboardEvent) => {
  if (!isInteractive.value || props.loading) return
  if (event.target !== event.currentTarget) return
  if (event.key !== 'Enter' && event.key !== ' ') return

  event.preventDefault()
  ;(event.currentTarget as HTMLElement).click()
}
</script>

<template>
  <div :class="cardContentKls">
    <component
      :is="usesOriginalPresetLayout ? 'div' : 'article'"
      :class="[
        cardKls,
        !usesOriginalPresetLayout &&
          ns.is('has-media', !!($slots.media || $slots.img)),
      ]"
      :style="cardStyles"
      :role="cardRole"
      :tabindex="cardTabindex"
      :aria-pressed="selectable ? selected : undefined"
      :aria-busy="loading || undefined"
      :aria-disabled="loading || undefined"
      v-bind="$attrs"
      @click.capture="handleClickCapture"
      @click="handleCardClick"
      @keydown="handleCardKeydown"
    >
      <template v-if="usesOriginalPresetLayout">
        <div v-if="$slots.img" :class="ns.e('img')">
          <slot name="img" />
          <div v-if="$slots.interactions" :class="ns.e('interactions')">
            <slot name="interactions" />
          </div>
        </div>

        <div
          v-if="$slots.title || title || $slots.text || text"
          :class="ns.e('text')"
        >
          <div v-if="$slots.title || title" :class="ns.e('title')">
            <slot name="title">
              <h3 :class="ns.e('title-text')">{{ title }}</h3>
            </slot>
          </div>

          <slot name="text">
            <p v-if="text" :class="ns.e('description')">{{ text }}</p>
          </slot>
        </div>

        <div v-if="$slots.buttons" :class="ns.e('button')">
          <slot name="buttons" />
        </div>
      </template>

      <template v-else>
        <header v-if="$slots.header || $slots.extra" :class="ns.e('header')">
          <div v-if="$slots.header" :class="ns.e('header-content')">
            <slot name="header" />
          </div>
          <div v-if="$slots.extra" :class="ns.e('extra')">
            <slot name="extra" />
          </div>
        </header>

        <div v-if="$slots.media || $slots.img" :class="ns.e('img')">
          <slot name="media">
            <slot name="img" />
          </slot>
          <div v-if="$slots.interactions" :class="ns.e('interactions')">
            <slot name="interactions" />
          </div>
        </div>

        <div
          v-if="
            $slots.title ||
            title ||
            $slots.subtitle ||
            subtitle ||
            $slots.text ||
            text
          "
          :class="ns.e('text')"
        >
          <div v-if="$slots.title || title" :class="ns.e('title')">
            <slot name="title">
              <h3 :class="ns.e('title-text')">{{ title }}</h3>
            </slot>
          </div>

          <div v-if="$slots.subtitle || subtitle" :class="ns.e('subtitle')">
            <slot name="subtitle">{{ subtitle }}</slot>
          </div>

          <slot name="text">
            <p v-if="text" :class="ns.e('description')">{{ text }}</p>
          </slot>
        </div>

        <div v-if="$slots.default" :class="ns.e('body')">
          <slot />
        </div>

        <footer
          v-if="$slots.footer || $slots.actions || $slots.buttons"
          :class="ns.e('footer')"
        >
          <slot name="footer">
            <div :class="ns.e('button')">
              <slot name="actions">
                <slot name="buttons" />
              </slot>
            </div>
          </slot>
        </footer>
      </template>

      <div v-if="loading" :class="ns.e('loading')" aria-hidden="true">
        <span :class="[ns.e('skeleton'), ns.em('skeleton', 'media')]" />
        <span :class="[ns.e('skeleton'), ns.em('skeleton', 'title')]" />
        <span :class="[ns.e('skeleton'), ns.em('skeleton', 'line')]" />
        <span :class="[ns.e('skeleton'), ns.em('skeleton', 'line-short')]" />
      </div>
    </component>
  </div>
</template>
