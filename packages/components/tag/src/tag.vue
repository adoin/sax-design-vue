<template>
  <div
    v-if="visible"
    ref="tagRef"
    :class="tagKls"
    :style="[tagStyle, shapeShadowStyle]"
    :aria-disabled="disabled || undefined"
    @click="handleClick"
  >
    <span
      v-if="usesShapeShadow"
      :class="ns.e('shape-surface')"
      aria-hidden="true"
    />

    <span :class="ns.e('text')">
      <input
        v-if="editable"
        ref="editor"
        autocomplete="off"
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
  useTemplateRef,
  watch,
} from 'vue'
import {
  useColor,
  useLocale,
  useNamespace,
  useShape,
  useSize,
  useSvgFilter,
  useVuesaxBaseComponent,
} from '@vuesax-alpha/hooks'
import { SIcon } from '@vuesax-alpha/components/icon'
import {
  getCssColor,
  isVsColor,
  normalizeVsColor,
  tagShapeShadowFilter,
} from '@vuesax-alpha/utils'
import { tagEmits, tagProps } from './tag'
import type { Color } from '@vuesax-alpha/constants'
import type { CSSProperties } from 'vue'

defineOptions({ name: 'STag' })

const props = defineProps(tagProps)
const emit = defineEmits(tagEmits)

const ns = useNamespace('tag')
const shape = useShape<'rounded' | 'square' | 'pill'>()
const size = useSize()
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
const tagRef = useTemplateRef<HTMLElement>('tagRef')
const shapeShadowFilter = useSvgFilter(
  () =>
    visible.value && usesShapeShadow.value ? tagShapeShadowFilter : undefined,
  { document: () => tagRef.value?.ownerDocument, cache: true },
)
const shapeShadowStyle = computed((): CSSProperties =>
  usesShapeShadow.value
    ? {
        filter:
          shapeShadowFilter.url.value ??
          'drop-shadow(0 1px 0.8px color-mix(in srgb, var(--sax-css-primary) 18%, transparent)) drop-shadow(0 3px 2.4px color-mix(in srgb, var(--sax-css-primary) 20%, transparent))',
      }
    : {},
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
  ns.m(size.value),
  semanticColor.value && ns.is('colored', true),
  semanticColor.value && isVsColor(themeColor.value) && ns.m(themeColor.value),
])

const tagStyle = computed((): CSSProperties => {
  const colorValue = semanticColor.value || color.value
  if (!colorValue || isVsColor(themeColor.value)) return {}

  const resolved = getCssColor(colorValue)
  if (!resolved) return {}

  if (props.transparent) {
    return {
      '--sax-tag-surface': `color-mix(in srgb, ${resolved} 15%, transparent)`,
      '--sax-tag-accent': resolved,
      '--sax-tag-text': resolved,
    }
  }

  return {
    '--sax-tag-surface': resolved,
    '--sax-tag-accent': resolved,
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
