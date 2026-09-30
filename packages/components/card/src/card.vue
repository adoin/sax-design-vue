<script lang="ts" setup>
import { computed, onBeforeUnmount, useAttrs, useTemplateRef } from 'vue'
import {
  useColor,
  useNamespace,
  useShape,
  useSvgFilter,
} from '@vuesax-alpha/hooks'
import {
  cardLiquidGlassFilter,
  cardLiquidGlassSpecularFilter,
  getVsColor,
} from '@vuesax-alpha/utils'
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
const cardRef = useTemplateRef<HTMLElement>('cardRef')
const liquidGlassFilter = useSvgFilter(
  () =>
    props.texture === 'liquid-glass'
      ? cardLiquidGlassFilter
      : props.texture === 'liquid-glass-2'
        ? cardLiquidGlassSpecularFilter
        : undefined,
  { document: () => cardRef.value?.ownerDocument, cache: true },
)
let pointerEffectFrame: number | undefined
let pointerEffectX = 0
let pointerEffectY = 0
let pointerEffectAngle = 0

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
const usesOriginalPresetLayout = computed(() =>
  originalCardTypes.includes(resolvedType.value),
)
const isInteractive = computed(() => props.interactive || props.selectable)
const usesDefaultLayout = computed(() => resolvedType.value === 'default')

const cardContentKls = computed(() => [
  ns.b('content'),
  `type-${resolvedType.value}`,
  props.orientation && ns.is(props.orientation),
])

const cardKls = computed(() => [
  ns.b(),
  props.hoverEffect && ns.is(`hover-${props.hoverEffect}`),
  usesOriginalPresetLayout.value
    ? ns.is('square', resolvedShape.value === 'square')
    : ns.is(resolvedShape.value),
  ns.is('interactive', isInteractive.value),
  ns.is('selectable', props.selectable),
  ns.is('selected', props.selectable && props.selected),
  ns.is('loading', props.loading),
  props.texture !== 'default' && ns.is(`texture-${props.texture}`),
  props.effect !== 'default' && ns.is(`effect-${props.effect}`),
])

const cardStyles = computed<CSSProperties | undefined>(() => {
  const needsColor =
    !usesOriginalPresetLayout.value ||
    !!props.color ||
    props.texture !== 'default' ||
    props.effect !== 'default'
  const styles: CSSProperties = needsColor
    ? ns.cssVar({ color: getVsColor(color.value) })
    : {}

  if (liquidGlassFilter.url.value)
    styles['--sax-card-liquid-filter'] = liquidGlassFilter.url.value

  return Object.keys(styles).length ? styles : undefined
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

const applyPointerEffectPosition = () => {
  pointerEffectFrame = undefined
  cardRef.value?.style.setProperty(
    '--sax-card-spotlight-x',
    `${pointerEffectX}px`,
  )
  cardRef.value?.style.setProperty(
    '--sax-card-spotlight-y',
    `${pointerEffectY}px`,
  )
  cardRef.value?.style.setProperty(
    '--sax-card-glow-angle',
    `${pointerEffectAngle}deg`,
  )
}

const schedulePointerEffectPosition = () => {
  if (pointerEffectFrame !== undefined) return
  pointerEffectFrame = window.requestAnimationFrame(applyPointerEffectPosition)
}

const handlePointerMove = (event: PointerEvent) => {
  if (props.effect !== 'spotlight' && props.effect !== 'gradient-glow') return
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  pointerEffectX = event.clientX - rect.left
  pointerEffectY = event.clientY - rect.top
  pointerEffectAngle =
    ((Math.atan2(
      pointerEffectY - rect.height / 2,
      pointerEffectX - rect.width / 2,
    ) *
      180) /
      Math.PI +
      450) %
    360
  schedulePointerEffectPosition()
}

const handlePointerLeave = (event: PointerEvent) => {
  if (props.effect !== 'spotlight' && props.effect !== 'gradient-glow') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  pointerEffectX = rect.width / 2
  pointerEffectY = rect.height / 2
  pointerEffectAngle = 0
  schedulePointerEffectPosition()
}

onBeforeUnmount(() => {
  if (pointerEffectFrame !== undefined) {
    window.cancelAnimationFrame(pointerEffectFrame)
  }
})
</script>

<template>
  <div :class="cardContentKls">
    <component
      :is="usesOriginalPresetLayout ? 'div' : 'article'"
      ref="cardRef"
      :class="[
        cardKls,
        (!usesOriginalPresetLayout || orientation === 'horizontal') &&
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
      @pointermove.passive="handlePointerMove"
      @pointerleave="handlePointerLeave"
    >
      <span
        v-if="texture !== 'default'"
        :class="[ns.e('texture'), ns.em('texture', texture)]"
        aria-hidden="true"
      />
      <span
        v-if="effect !== 'default'"
        :class="[ns.e('effect'), ns.em('effect', effect)]"
        aria-hidden="true"
      />

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

      <template v-else-if="usesDefaultLayout">
        <header
          v-if="$slots.header || $slots.title || title || $slots.extra"
          :class="ns.e('header')"
        >
          <div :class="ns.e('header-content')">
            <slot name="header">
              <div v-if="$slots.title || title" :class="ns.e('title')">
                <slot name="title">
                  <h3 :class="ns.e('title-text')">{{ title }}</h3>
                </slot>
              </div>
            </slot>
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
            $slots.subtitle || subtitle || $slots.text || text || $slots.default
          "
          :class="ns.e('body')"
        >
          <div v-if="$slots.subtitle || subtitle" :class="ns.e('subtitle')">
            <slot name="subtitle">{{ subtitle }}</slot>
          </div>
          <slot name="text">
            <p v-if="text" :class="ns.e('description')">{{ text }}</p>
          </slot>
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
