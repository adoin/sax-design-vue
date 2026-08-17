<template>
  <div class="select-popup-config-demo">
    <div class="select-popup-config-demo__fields">
      <div class="select-popup-config-demo__field">
        <s-select
          v-model="fullValue"
          block
          :options="options"
          placeholder="full + maxHeight"
          :popup-config="{
            full: true,
            maxHeight: 160,
          }"
        />
      </div>

      <div class="select-popup-config-demo__field">
        <s-select
          v-model="customValue"
          block
          strategy="fixed"
          :options="options"
          placeholder="width + offset + style"
          :popup-config="customPopupConfig"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue'
import type { SelectPopupConfig } from '@vuesax-alpha/components/select'

const fullValue = shallowRef('')
const customValue = shallowRef('')

const options = [
  { value: 'design', label: 'Design system' },
  { value: 'frontend', label: 'Frontend platform' },
  { value: 'quality', label: 'Quality engineering' },
  { value: 'docs', label: 'Documentation' },
  { value: 'mobile', label: 'Mobile application' },
  { value: 'data', label: 'Data platform' },
  { value: 'security', label: 'Security center' },
  { value: 'operations', label: 'Operations console' },
]

const customPopupConfig: SelectPopupConfig = {
  appendTo: 'body',
  width: 280,
  minWidth: 220,
  maxWidth: 'calc(100vw - 32px)',
  maxHeight: 160,
  offset: 8,
  placement: 'bottom-start',
  className: 'select-popup-config-panel',
  style: {
    borderRadius: 'var(--sax-radius-lg)',
    padding: '8px',
  },
}
</script>

<style scoped>
.select-popup-config-demo {
  position: relative;
  width: min(100%, 560px);
}

.select-popup-config-demo__fields {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
}

.select-popup-config-demo__field {
  width: min(100%, 240px);
}
</style>
