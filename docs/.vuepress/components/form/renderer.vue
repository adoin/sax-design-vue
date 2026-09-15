<script lang="ts" setup>
import { reactive } from 'vue'
import type { FormItemConfig } from 'sax-design-vue'

const model = reactive({ projectCode: '' })
const items: FormItemConfig[] = [
  {
    field: 'projectCode',
    title: '项目编码',
    description: '自定义渲染器会自动转换为大写。',
    itemRender: {
      name: '$uppercaseInput',
      props: { placeholder: '例如 sax-ui' },
    },
  },
]
</script>

<template>
  <s-form :model="model" :items="items" />
</template>
