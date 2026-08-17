<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <input
      :class="ns.e('inner')"
      :type="visible ? 'text' : 'password'"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :autocomplete="autocomplete"
      @change="emit('change', ($event.target as HTMLInputElement).value)"
      @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      "
    />
    <button
      v-if="clearable && modelValue"
      :class="ns.e('action')"
      type="button"
      :aria-label="t('vs.passwordInput.clear')"
      @click="clear"
    >
      <SIcon name="cb:close" />
    </button>
    <button
      v-if="showPassword"
      :class="ns.e('action')"
      type="button"
      :aria-label="
        t(visible ? 'vs.passwordInput.hide' : 'vs.passwordInput.show')
      "
      @click="visible = !visible"
    >
      <SIcon :name="visible ? 'cb:view-off' : 'cb:view'" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { passwordInputEmits, passwordInputProps } from './password-input'

defineOptions({ name: 'SPasswordInput' })

defineProps(passwordInputProps)
const emit = defineEmits(passwordInputEmits)
const ns = useNamespace('password-input')
const { t } = useLocale()
const visible = ref(false)
const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}
</script>
