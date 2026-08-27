<script lang="ts" setup>
import { computed, shallowRef, toRef, useTemplateRef } from 'vue'
import { SButton } from '@vuesax-alpha/components/button'
import { SColorPicker } from '@vuesax-alpha/components/color-picker'
import { SDialog } from '@vuesax-alpha/components/dialog'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SInputNumber } from '@vuesax-alpha/components/input-number'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import IconPickerPanel from './icon-picker-panel.vue'
import {
  ICON_PICKER_DEFAULT_SIZE,
  ICON_PICKER_MAX_SIZE,
  ICON_PICKER_MIN_SIZE,
  createIconPickerSelection,
  iconPickerEmits,
  iconPickerProps,
  normalizeIconList,
} from './icon-picker'

defineOptions({ name: 'SIconPickerDialog' })

const props = defineProps(iconPickerProps)
const emit = defineEmits(iconPickerEmits)
const ns = useNamespace('icon-picker')
const { t } = useLocale(toRef(props, 'locale'))
const panelRef =
  useTemplateRef<InstanceType<typeof IconPickerPanel>>('panelRef')
const availableIcons = computed(() => normalizeIconList(props.iconList))
const visible = shallowRef(true)
const selectedIcon = shallowRef(
  availableIcons.value.includes(props.initialIcon) ? props.initialIcon : '',
)
const selectedColor = shallowRef(props.color)
const selectedSize = shallowRef(props.size ?? ICON_PICKER_DEFAULT_SIZE)
const selection = computed(() =>
  selectedIcon.value
    ? createIconPickerSelection({
        name: selectedIcon.value,
        color: selectedColor.value,
        size: selectedSize.value,
        label: props.label,
      })
    : undefined,
)
const previewSize = computed(() => Math.min(selectedSize.value, 96))
const confirmLabel = computed(
  () =>
    props.confirmText ||
    t(
      props.output === 'code'
        ? 'vs.iconPicker.confirm'
        : 'vs.iconPicker.insert',
    ),
)

const close = () => (visible.value = false)
const cancel = () => {
  emit('cancel')
  close()
}
const confirm = (icon = selectedIcon.value) => {
  selectedIcon.value = icon
  const selection = createIconPickerSelection({
    name: icon,
    color: selectedColor.value,
    size: selectedSize.value,
    label: props.label,
  })
  if (!selection) return
  emit('confirm', selection)
  close()
}
</script>

<template>
  <SDialog
    v-model="visible"
    :width="800"
    :mask-closable="maskClosable"
    :show-close="false"
    not-padding
    not-center
    lock-scroll
    overlay-blur
    @opened="panelRef?.focusSearch()"
    @closed="emit('closed')"
  >
    <template #header>
      <header :class="ns.e('header')">
        <div>
          <h2>{{ title || t('vs.iconPicker.title') }}</h2>
          <p>{{ t('vs.iconPicker.description') }}</p>
        </div>
        <button
          :class="ns.e('close')"
          type="button"
          :aria-label="t('vs.iconPicker.cancel')"
          @click="cancel"
        >
          <SIcon name="cb:close" />
        </button>
      </header>
    </template>

    <div :class="ns.e('body')">
      <IconPickerPanel
        ref="panelRef"
        v-model="selectedIcon"
        :icon-list="availableIcons"
        :color="selectedColor"
        :locale="locale"
        :show-name="showName"
        @confirm="confirm"
      />

      <aside
        :class="[
          ns.e('settings'),
          ns.is('size-selectable', size === undefined),
        ]"
      >
        <div :class="ns.e('preview')" aria-live="polite">
          <SIcon
            v-if="selectedIcon"
            :name="selectedIcon"
            :color="selectedColor"
            :size="previewSize"
          />
          <SIcon v-else name="cb:image" size="38" />
        </div>
        <div :class="ns.e('selection')">
          <strong>{{ selectedIcon || t('vs.iconPicker.noSelection') }}</strong>
          <span>{{ selectedSize }} × {{ selectedSize }}</span>
        </div>
        <div v-if="size === undefined" :class="ns.e('size-field')">
          <SInputNumber
            v-model="selectedSize"
            color="text"
            :label="t('vs.iconPicker.size')"
            :min="ICON_PICKER_MIN_SIZE"
            :max="ICON_PICKER_MAX_SIZE"
            :step="1"
            :precision="0"
            :value-on-clear="ICON_PICKER_DEFAULT_SIZE"
          />
          <span>{{ t('vs.iconPicker.sizeHint') }}</span>
        </div>
        <label :class="ns.e('color-field')">
          <span>{{ t('vs.iconPicker.color') }}</span>
          <SColorPicker
            v-model="selectedColor"
            :show-alpha="showAlpha"
            :predefine="predefine"
          />
        </label>
      </aside>
    </div>

    <footer :class="ns.e('footer')">
      <SButton type="flat" @click="cancel">
        {{ cancelText || t('vs.iconPicker.cancel') }}
      </SButton>
      <SButton :disabled="!selection" @click="confirm()">
        <SIcon name="cb:add" />
        {{ confirmLabel }}
      </SButton>
    </footer>
  </SDialog>
</template>
