<template>
  <div
    v-if="visible"
    :class="tagKls"
    :style="[tagStyle, shapeShadowStyle]"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
  >
    <svg
      v-if="usesShapeShadow"
      :class="ns.e('shadow-filter')"
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <filter
          :id="shapeShadowFilterId"
          x="-60%"
          y="-80%"
          width="220%"
          height="260%"
          color-interpolation-filters="sRGB"
        >
          <feMorphology
            in="SourceAlpha"
            operator="dilate"
            radius="0.35"
            result="expanded-alpha"
          />
          <feGaussianBlur
            in="expanded-alpha"
            stdDeviation="0.8"
            result="ambient-blur"
          />
          <feOffset in="ambient-blur" dy="1" result="ambient-offset" />
          <feFlood
            flood-color="hsl(var(--sax-primary))"
            flood-opacity="0.18"
            result="ambient-color"
          />
          <feComposite
            in="ambient-color"
            in2="ambient-offset"
            operator="in"
            result="ambient-shadow"
          />
          <feGaussianBlur
            in="expanded-alpha"
            stdDeviation="2.4"
            result="depth-blur"
          />
          <feOffset in="depth-blur" dy="3" result="depth-offset" />
          <feFlood
            flood-color="hsl(var(--sax-primary))"
            flood-opacity="0.2"
            result="depth-color"
          />
          <feComposite
            in="depth-color"
            in2="depth-offset"
            operator="in"
            result="depth-shadow"
          />
          <feMerge>
            <feMergeNode in="depth-shadow" />
            <feMergeNode in="ambient-shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
    <span
      v-if="usesShapeShadow"
      :class="ns.e('shape-surface')"
      aria-hidden="true"
    />

    <span :class="ns.e('text')">
      <input
        v-if="editable"
        ref="editor"
        :class="ns.e('editor')"
        :value="draftText"
        :size="editorSize"
        :placeholder="editPlaceholder"
        :aria-label="editPlaceholder || text || 'Edit tag'"
        type="text"
        @click.stop
        @focus="handleEditorFocus"
        @input="handleEditorInput"
        @blur="confirmEdit"
        @keydown.enter.prevent="confirmEdit"
        @keydown.esc.prevent="cancelEdit"
      />
      <template v-else>
        <SIcon v-if="icon" :name="icon" :class="ns.e('icon')" />
        <slot>{{ text }}</slot>
      </template>
    </span>

    <button
      v-if="isClosable"
      :class="ns.e('close')"
      type="button"
      :disabled="disabled"
      :aria-label="t('vs.common.close')"
      @click.stop="handleClose"
    >
      <SIcon :name="closeIcon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  shallowRef,
  useId,
  useTemplateRef,
  watch,
} from 'vue'
import {
  useColor,
  useLocale,
  useNamespace,
  useShape,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import { getVsColor, isVsColor, normalizeVsColor } from '@vuesax-alpha/utils'
import { tagEmits, tagProps } from './tag'
import type { Color } from '@vuesax-alpha/constants'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'STag' })

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const ns = useNamespace('tag')
const shape = useShape<'rounded' | 'square' | 'pill'>()
const { t } = useLocale()
const semanticColor = computed(
  () => props.color || props.status || props.type || undefined,
)
const color = useColor(
  computed(() => (semanticColor.value as Color) || undefined),
)
const vsBaseClasses = useVuesaxBaseComponent(color)
const themeColor = computed(() =>
  normalizeVsColor(semanticColor.value || color.value || ''),
)
const isClosable = computed(
  () => props.closable !== false && props.closable !== '',
)
const draftText = shallowRef(props.text || '')
const editStartText = shallowRef(props.text || '')
const isFinishingEdit = shallowRef(false)
const editorRef = useTemplateRef<HTMLInputElement>('editor')
const editorSize = computed(() =>
  Math.min(
    24,
    Math.max(1, draftText.value.length || props.editPlaceholder.length),
  ),
)
const visible = computed(() => props.item || props.modelValue)
const resolvedVariant = computed(() => {
  if (props.variant !== 'default') return props.variant
  if (props.border) return 'outline'
  return props.tagStyle
})
const resolvedShape = computed(() => (props.round ? 'pill' : shape.value))
const usesShapeShadow = computed(() =>
  ['mark', 'arrow', 'flag'].includes(resolvedVariant.value),
)
const shapeShadowFilterId = `s-tag-shape-shadow-${useId()}`
const shapeShadowStyle = computed((): CSSProperties =>
  usesShapeShadow.value ? { filter: `url("#${shapeShadowFilterId}")` } : {},
)

const tagKls = computed(() => [
  ns.b(),
  vsBaseClasses,
  ns.is('closable', isClosable.value),
  ns.is('editable', props.editable),
  ns.is('disabled', props.disabled),
  ns.is('transparent', props.transparent),
  ns.is(`style-${resolvedVariant.value}`, resolvedVariant.value !== 'default'),
  ns.is(resolvedShape.value),
  ns.m(props.size),
  semanticColor.value && ns.is('colored', true),
  semanticColor.value && isVsColor(themeColor.value) && ns.m(themeColor.value),
])

const tagStyle = computed((): CSSProperties => {
  const colorValue = semanticColor.value || color.value
  if (!colorValue || isVsColor(themeColor.value)) return {}

  const resolved = getVsColor(colorValue)
  if (!resolved) return {}

  if (props.transparent) {
    const surface = resolved.startsWith('var(')
      ? `color-mix(in srgb, ${resolved} 15%, transparent)`
      : `rgba(${resolved}, 0.15)`
    const foreground = resolved.startsWith('var(')
      ? resolved
      : `rgb(${resolved})`
    return {
      '--sax-tag-surface': surface,
      '--sax-tag-accent': foreground,
      '--sax-tag-text': foreground,
    }
  }

  const foreground = resolved.startsWith('var(') ? resolved : `rgb(${resolved})`
  return {
    '--sax-tag-surface': foreground,
    '--sax-tag-accent': foreground,
    '--sax-tag-text': 'hsl(0deg 0% 100% / 0.94)',
  }
})

const handleClose = (event: MouseEvent) => {
  if (props.disabled) return
  if (props.item) emit('s-remove', false)
  else emit('update:modelValue', false)
  emit('close', event)
}

const handleEditorInput = (event: Event) => {
  isFinishingEdit.value = false
  draftText.value = (event.target as HTMLInputElement).value
  emit('update:text', draftText.value)
}

const handleEditorFocus = () => {
  editStartText.value = props.text || ''
  isFinishingEdit.value = false
}

const confirmEdit = () => {
  if (isFinishingEdit.value) return
  const value = draftText.value.trim()
  if (!value) {
    cancelEdit()
    return
  }

  isFinishingEdit.value = true
  draftText.value = value
  editStartText.value = value
  emit('update:text', value)
  emit('edit-confirm', value)
}

const cancelEdit = () => {
  if (isFinishingEdit.value) return
  isFinishingEdit.value = true
  draftText.value = editStartText.value
  emit('update:text', draftText.value)
  emit('edit-cancel')
}

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) emit('click', event)
}

watch(
  () => props.text,
  (value) => {
    draftText.value = value || ''
  },
)

onMounted(() => {
  if (!props.editable || !props.editAutofocus) return
  nextTick(() => {
    editorRef.value?.focus()
  })
})
</script>
