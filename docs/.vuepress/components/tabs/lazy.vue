<script lang="ts" setup>
import { defineComponent, h, onMounted, ref } from 'vue'

const active = ref(1)
const mountedPanels = ref<number[]>([])
const tabs = Array.from({ length: 8 }, (_, index) => index + 1)

const LazyPanel = defineComponent({
  name: 'LazyPanel',
  props: {
    number: { type: Number, required: true },
  },
  emits: ['mounted'],
  setup(props, { emit }) {
    onMounted(() => emit('mounted', props.number))
    return () =>
      h(
        'div',
        { class: 'lazy-panel' },
        `Panel ${props.number} mounted on its first activation.`,
      )
  },
})

const recordMount = (number: number) => {
  if (!mountedPanels.value.includes(number))
    mountedPanels.value = [...mountedPanels.value, number].sort((a, b) => a - b)
}
</script>

<template>
  <div class="lazy-example">
    <s-alert type="flat">
      <template #title>
        Mounted {{ mountedPanels.length }} of {{ tabs.length }} panels
      </template>
      Visited panels: {{ mountedPanels.join(', ') || 'none' }}. Switch tabs to
      mount their content for the first time.
    </s-alert>

    <s-tabs v-model="active" lazy>
      <s-tab
        v-for="tabNumber in tabs"
        :key="tabNumber"
        :name="tabNumber"
        :label="`Tab ${tabNumber}`"
      >
        <lazy-panel :number="tabNumber" @mounted="recordMount" />
      </s-tab>
    </s-tabs>
  </div>
</template>

<style scoped>
.lazy-example {
  display: grid;
  gap: 16px;
}

:deep(.lazy-panel) {
  min-height: 88px;
  display: grid;
  place-items: center;
  color: var(--sax-text-color-secondary, #667085);
}
</style>
