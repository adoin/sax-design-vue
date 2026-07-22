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
      aria-label="Clear password"
      @click="clear"
    >
      <SIcon icon="close" icon-pack="material-icons" />
    </button>
    <button
      v-if="showPassword"
      :class="ns.e('action')"
      type="button"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      @click="visible = !visible"
    >
      <SIcon
        :icon="visible ? 'visibility_off' : 'visibility'"
        icon-pack="material-icons"
      />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { passwordInputEmits, passwordInputProps } from './password-input'

defineOptions({ name: 'SPasswordInput' })

defineProps(passwordInputProps)
const emit = defineEmits(passwordInputEmits)
const ns = useNamespace('password-input')
const visible = ref(false)
const clear = () => {
  emit('update:modelValue', '')
  emit('change', '')
  emit('clear')
}
</script>
