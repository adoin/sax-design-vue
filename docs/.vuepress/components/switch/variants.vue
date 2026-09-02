<script setup lang="ts">
import { reactive } from 'vue'

const variants = [
  { value: 'classic', label: 'Classic' },
  { value: 'soft', label: 'Soft' },
  {
    value: 'text',
    label: 'Text',
    activeText: 'Workspace enabled',
    inactiveText: 'Workspace disabled',
  },
] as const

const values = reactive({
  classic: true,
  soft: true,
  text: true,
})
</script>

<template>
  <div class="switch-variants">
    <div v-for="item in variants" :key="item.value">
      <s-text>{{ item.label }}</s-text>
      <s-switch
        v-model="values[item.value]"
        :variant="item.value"
        :active-text="'activeText' in item ? item.activeText : undefined"
        :inactive-text="'inactiveText' in item ? item.inactiveText : undefined"
        :aria-label="`${item.label} switch`"
      />
    </div>
  </div>
</template>

<style scoped>
.switch-variants {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 28px;
}

.switch-variants > div {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
</style>
