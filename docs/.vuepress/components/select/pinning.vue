<template>
  <div class="select-pinning-demo">
    <s-select
      v-model="value"
      block
      pin-key="documentation"
      :options="options"
      :placeholder="t('vs.select.placeholder')"
      :popup-config="{ full: true }"
      @pin-change="lastAction = $event"
    />
    <small>
      {{
        lastAction
          ? `${lastAction.value} ${t(
              lastAction.pinned ? 'vs.select.pinned' : 'vs.select.unpinned',
            )}`
          : t('vs.select.pinHint')
      }}
    </small>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'

const { t } = useLocale()
const value = ref('')
const lastAction = ref<{ value: string; pinned: boolean }>()
const options = [
  { value: 'design', label: 'Design system' },
  {
    value: 'frontend',
    label: 'Frontend platform with a deliberately long option name',
  },
  { value: 'quality', label: 'Quality engineering' },
  { value: 'docs', label: 'Documentation' },
]
</script>

<style scoped>
.select-pinning-demo {
  display: grid;
  gap: 10px;
  width: 260px;
}
.select-pinning-demo small {
  color: #637083;
}
</style>
