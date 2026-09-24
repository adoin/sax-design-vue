<script lang="ts" setup>
import { computed, onBeforeUnmount, useAttrs, useId, useTemplateRef } from 'vue'
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
const cardRef = useTemplateRef<HTMLElement>('cardRef')
const liquidGlassFilterId = `s-card-liquid-glass-${useId().replace(
  /[^a-zA-Z0-9_-]/g,
  '',
)}`
const liquidGlassFilterId2 = `s-card-liquid-glass-2-${useId().replace(
  /[^a-zA-Z0-9_-]/g,
  '',
)}`
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

  if (props.texture === 'liquid-glass') {
    styles['--sax-card-liquid-filter'] = `url(#${liquidGlassFilterId})`
  } else if (props.texture === 'liquid-glass-2') {
    styles['--sax-card-liquid-filter'] = `url(#${liquidGlassFilterId2})`
  }

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

    <svg
      v-if="texture === 'liquid-glass'"
      :class="ns.e('texture-filter')"
      width="0"
      height="0"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <filter
          :id="liquidGlassFilterId"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="4" result="blurred-noise" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred-noise"
            scale="48"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>

    <svg
      v-else-if="texture === 'liquid-glass-2'"
      :class="ns.e('texture-filter')"
      width="0"
      height="0"
      focusable="false"
      aria-hidden="true"
    >
      <defs>
        <filter
          :id="liquidGlassFilterId2"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
          color-interpolation-filters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />
          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>
          <feGaussianBlur in="turbulence" stdDeviation="3" result="soft-map" />
          <feSpecularLighting
            in="soft-map"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lighting-color="white"
            result="specular-light"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>
          <feComposite
            in="specular-light"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="lit-image"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="soft-map"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>
