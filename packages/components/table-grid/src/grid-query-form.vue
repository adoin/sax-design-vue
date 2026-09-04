<script setup lang="ts">
import { computed, ref } from 'vue'
import { pick } from 'lodash-unified'
import { SForm, formProps } from '@vuesax-alpha/components/form'
import { SButton } from '@vuesax-alpha/components/button'
import { useLocale } from '@vuesax-alpha/hooks'
import type { FormInstance, FormModel } from '@vuesax-alpha/components/form'
import type { TableGridQueryConfig } from './table-grid'

const props = defineProps<{
  config: TableGridQueryConfig
  model: FormModel
  busy: boolean
}>()
const emit = defineEmits<{ query: []; reset: [] }>()
const { t } = useLocale()
const form = ref<FormInstance>()
const options = computed(() => pick(props.config, Object.keys(formProps)))
const onSubmit = (event: Event) => {
  event.preventDefault()
  event.stopImmediatePropagation()
  emit('query')
}
defineExpose({ getForm: () => form.value })
</script>

<template>
  <div class="s-table-grid__query" @submit.capture="onSubmit">
    <SForm
      ref="form"
      v-bind="options"
      :model="model"
      :disabled="busy || config.disabled"
    >
      <template
        v-for="name in Object.keys($slots).filter(
          (name) => name !== 'default' && name !== 'actions',
        )"
        #[name]="params"
        ><slot :name="name" v-bind="params || {}"
      /></template>
      <template #default>
        <slot />
        <div
          v-if="config.showActions !== false"
          class="s-table-grid__query-actions"
        >
          <slot name="actions">
            <SButton
              :debounce="false"
              :disabled="busy || config.disabled"
              @click.prevent="emit('query')"
              >{{ config.submitText ?? t('vs.tableGrid.query') }}</SButton
            >
            <SButton
              :debounce="false"
              flat
              :disabled="busy || config.disabled"
              @click.prevent="emit('reset')"
              >{{ config.resetText ?? t('vs.tableGrid.reset') }}</SButton
            >
          </slot>
        </div>
      </template>
    </SForm>
  </div>
</template>
