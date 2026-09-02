<script setup lang="ts">
import { shallowRef } from 'vue'

const selected = shallowRef(false)
</script>

<template>
  <div class="state-grid">
    <s-card
      v-model:selected="selected"
      selectable
      hover-effect="glow"
      title="Selectable"
      :subtitle="selected ? 'Selected' : 'Click or press Enter / Space'"
      text="The controlled state is exposed through v-model:selected and aria-pressed."
    />
    <s-card
      loading
      title="Loading"
      text="The skeleton preserves the card footprint while content is pending."
    />
  </div>
</template>

<style lang="scss" scoped>
.state-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
  padding: 12px;
}
</style>
