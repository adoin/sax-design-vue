<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({
  classic: 42,
  soft: 58,
  steps: 60,
})
</script>

<template>
  <div class="slider-variants">
    <div>
      <s-text>Classic</s-text>
      <s-slider
        v-model="values.classic"
        variant="classic"
        show-value
        aria-label="Classic slider"
      />
    </div>
    <div>
      <s-text>Soft</s-text>
      <s-slider
        v-model="values.soft"
        variant="soft"
        show-value
        aria-label="Soft slider"
      />
    </div>
    <div>
      <s-text>Steps</s-text>
      <s-slider
        v-model="values.steps"
        variant="steps"
        :step="10"
        show-value
        aria-label="Steps slider"
      />
    </div>
  </div>
</template>

<style scoped>
.slider-variants {
  display: grid;
  gap: 20px;
  width: min(100%, 560px);
}

.slider-variants > div {
  display: grid;
  grid-template-columns: 72px 1fr;
  align-items: center;
  gap: 16px;
}
</style>
