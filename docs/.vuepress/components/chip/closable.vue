<template>
  <div class="center" style="flex-direction: row; flex-wrap: wrap; gap: 8px">
    <vs-chip
      v-for="item in chips"
      :key="item"
      item
      closable
      @click="remove(item)"
      >{{ item }}</vs-chip
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const chips = ref(['Vuejs', 'Vuesax', 'Sax Design'])
const remove = (item: string) => {
  chips.value = chips.value.filter((c) => c !== item)
}
</script>
