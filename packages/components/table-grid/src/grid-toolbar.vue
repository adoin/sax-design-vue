<script setup lang="ts">
import { SButton } from '@vuesax-alpha/components/button'
import { useLocale } from '@vuesax-alpha/hooks'
import type { TableGridToolbarConfig } from './table-grid'
defineProps<{ config: TableGridToolbarConfig; busy: boolean }>()
const emit = defineEmits<{
  refresh: []
  action: [code: string, event: MouseEvent]
}>()
const { t } = useLocale()
</script>

<template>
  <div class="s-table-grid__toolbar">
    <div v-if="config.title || $slots.title" class="s-table-grid__title">
      <slot name="title">{{ config.title }}</slot>
    </div>
    <div class="s-table-grid__tools">
      <slot>
        <template v-for="button in config.buttons" :key="button.code">
          <SButton
            v-if="button.visible !== false"
            v-bind="button.props"
            :disabled="busy || button.disabled || button.props?.disabled"
            :loading="button.loading || button.props?.loading"
            @click.capture.prevent
            @click="emit('action', button.code, $event)"
            >{{ button.text }}</SButton
          >
        </template>
        <SButton
          v-if="config.refresh !== false"
          flat
          :disabled="busy"
          @click.capture.prevent
          @click="emit('refresh')"
          >{{ config.refreshText ?? t('vs.tableGrid.refresh') }}</SButton
        >
      </slot>
    </div>
  </div>
</template>
