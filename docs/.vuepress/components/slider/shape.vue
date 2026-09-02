<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({
  rounded: 32,
  square: 68,
  soft: 54,
  steps: 60,
})
</script>

<template>
  <div class="slider-shapes">
    <div>
      <s-text>Rounded</s-text>
      <s-slider
        v-model="values.rounded"
        show-value
        aria-label="Rounded slider"
      />
    </div>
    <div>
      <s-text>Square</s-text>
      <s-slider
        v-model="values.square"
        shape="square"
        show-value
        aria-label="Square slider"
      />
    </div>
    <div>
      <s-text>Square soft</s-text>
      <s-slider
        v-model="values.soft"
        variant="soft"
        shape="square"
        show-value
        aria-label="Square soft slider"
      />
    </div>
    <div>
      <s-text>Square steps</s-text>
      <s-slider
        v-model="values.steps"
        variant="steps"
        shape="square"
        :step="10"
        show-value
        aria-label="Square steps slider"
      />
    </div>
  </div>
</template>

<style scoped>
.slider-shapes {
  display: grid;
  gap: 20px;
  width: min(100%, 560px);
}

.slider-shapes > div {
  display: grid;
  grid-template-columns: 92px 1fr;
  align-items: center;
  gap: 16px;
}
</style>
