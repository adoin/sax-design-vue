<script setup lang="ts">
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import SIcon, { IconClose } from '@vuesax-alpha/components/icon'
defineProps<{ clear: boolean }>()
const emit = defineEmits<{ clear: [] }>()
const ns = useNamespace('date-picker')
const { t } = useLocale()
</script>

<template>
  <span :class="ns.e('action')">
    <button
      v-if="clear"
      type="button"
      :aria-label="t('vs.datepicker.clear')"
      @mousedown.prevent
      @click.stop="emit('clear')"
    >
      <IconClose />
    </button>
    <SIcon v-else name="cb:calendar" aria-hidden="true" />
  </span>
</template>
