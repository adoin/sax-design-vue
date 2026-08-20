<template>
  <SPopper
    v-model:visible="open"
    trigger="click"
    placement="bottom-start"
    teleported
    :disabled="disabled"
    :show-arrow="false"
    :offset="8"
    :popper-class="ns.e('panel')"
  >
    <div :class="[ns.b(), ns.is('disabled', disabled)]">
      <button
        :class="ns.e('trigger')"
        type="button"
        :disabled="disabled"
        aria-haspopup="dialog"
        :aria-expanded="open"
      >
        <span :class="ns.e('swatch')">
          <span :style="{ background: cssColor }" />
        </span>
        <span :class="ns.e('value')">{{ valueText }}</span>
        <SIcon name="cb:chevron-down" />
      </button>
    </div>

    <template #content>
      <div role="dialog" :aria-label="t('vs.colorpicker.defaultLabel')">
        <ColorPickerPanel
          :color="selectedColor"
          :format="displayFormat"
          :show-alpha="showAlpha"
          :predefine="predefine"
          @update:color="updateColor"
          @update:format="updateFormat"
        />
      </div>
    </template>
  </SPopper>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SPopper } from '@vuesax-alpha/components/popper'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import ColorPickerPanel from './color-picker-panel.vue'
import { colorPickerEmits, colorPickerProps } from './color-picker'
import { formatColor, parseColor, toCssColor } from './color-utils'
import type { ColorFormat, RgbColor } from './color-utils'

defineOptions({ name: 'SColorPicker' })

const fallbackColor: RgbColor = {
  red: 86,
  green: 103,
  blue: 244,
  alpha: 1,
}

const props = defineProps(colorPickerProps)
const emit = defineEmits(colorPickerEmits)
const ns = useNamespace('color-picker')
const { t } = useLocale()
const open = ref(false)
const selectedColor = ref<RgbColor>(
  parseColor(props.modelValue) || { ...fallbackColor },
)
const displayFormat = ref<ColorFormat>(props.format)
const cssColor = computed(() => toCssColor(selectedColor.value))
const valueText = computed(() =>
  formatColor(selectedColor.value, displayFormat.value, props.showAlpha),
)

watch(
  () => props.modelValue,
  (value) => {
    const parsed = parseColor(value)
    if (parsed) selectedColor.value = parsed
  },
)

watch(
  () => props.format,
  (value) => (displayFormat.value = value),
)

const commitColor = () => {
  const value = valueText.value
  emit('update:modelValue', value)
  emit('change', value)
}

const updateColor = (color: RgbColor) => {
  selectedColor.value = color
  commitColor()
}

const updateFormat = (format: ColorFormat) => {
  displayFormat.value = format
  commitColor()
}
</script>
