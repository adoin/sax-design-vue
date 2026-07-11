<template>
  <div class="center">
    <p>{{ chips }}</p>
    <vs-chips v-model="chips" placeholder="New element">
      <vs-chip v-for="chip in chips" :key="chip" closable>{{ chip }}</vs-chip>
    </vs-chips>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const chips = ref(['Vuejs', 'Node', 'Vuesax'])
</script>

<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
