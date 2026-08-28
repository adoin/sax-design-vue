<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({
  classic: true,
  soft: true,
  icon: true,
  text: true,
})
</script>

<template>
  <div class="switch-variants">
    <div v-for="variant in Object.keys(values)" :key="variant">
      <s-text>{{ variant }}</s-text>
      <s-switch
        v-model="values[variant as keyof typeof values]"
        :variant="variant"
        :aria-label="`${variant} switch`"
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
  text-transform: capitalize;
}
</style>
