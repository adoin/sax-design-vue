<script lang="ts" setup>
import { h, onBeforeUnmount, reactive } from 'vue'
import { SInput, formRenderer } from 'sax-design-vue'
import type { FormItemConfig } from 'sax-design-vue'

formRenderer.add('UppercaseInput', {
  renderItem: (options, params) =>
    h(SInput, {
      ...options.props,
      modelValue: params.value,
      'onUpdate:modelValue': (value: string | number) =>
        params.setValue(String(value).toUpperCase()),
    }),
})

onBeforeUnmount(() => formRenderer.delete('UppercaseInput'))

const model = reactive({ projectCode: '' })
const items: FormItemConfig[] = [
  {
    field: 'projectCode',
    title: '项目编码',
    description: '自定义渲染器会自动转换为大写。',
    itemRender: {
      name: 'UppercaseInput',
      props: { placeholder: '例如 sax-ui' },
    },
  },
]
</script>

<template>
  <s-form :model="model" :items="items" />
</template>
