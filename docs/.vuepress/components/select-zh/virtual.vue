<template>
  <div class="select-virtual-comparison">
    <div
      v-for="(demo, index) in demos"
      :key="demo.count"
      class="select-virtual-demo"
    >
      <strong>{{ demo.label }}</strong>
      <s-select
        v-model="values[index]"
        filterable
        virtual
        :virtual-config="{
          threshold: 100,
          estimateSize: 40,
          overscan: 8,
          dynamic: true,
        }"
        :options="demo.options"
        :option-props="{ value: 'id', label: 'text' }"
        :placeholder="demo.placeholder"
        :popup-config="{ width: 280, height: 260 }"
        :render-item="renderItem"
        highlight-search
      />
      <small>已选择： {{ values[index] || '—' }}</small>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'
import type { SelectRenderItem } from 'sax-design-vue'

const values = ref(['', ''])
const options = Array.from({ length: 10000 }, (_, index) => ({
  id: `city-${index + 1}`,
  text: `城市 ${String(index + 1).padStart(5, '0')}`,
  description:
    index % 7 === 0
      ? '较长的详细说明会自动换行，虚拟列表按实际内容测量这一行的高度。'
      : '',
  disabled: index % 97 === 0,
}))
const demos = [
  {
    count: 10000,
    label: '10,000 条选项',
    placeholder: '搜索 10,000 个城市',
    options,
  },
  {
    count: 400,
    label: '400 条选项',
    placeholder: '搜索 400 个城市',
    options: options.slice(0, 400),
  },
]
const renderItem: SelectRenderItem = (option, { label, highlight }) =>
  h('span', { class: 'select-virtual-option' }, [
    h('strong', highlight(label)),
    option.description
      ? h('small', highlight(String(option.description)))
      : null,
    Number(String(option.id).split('-')[1]) % 13 === 0
      ? h('small', '第三行附加信息。')
      : null,
  ])
</script>

<style>
.select-virtual-comparison {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.select-virtual-demo {
  display: grid;
  gap: 10px;
  max-width: 280px;
}
.select-virtual-demo small {
  color: #637083;
}
.select-virtual-option {
  display: grid;
  min-width: 0;
  line-height: 1.35;
}
.select-virtual-option small {
  white-space: normal;
}
</style>
