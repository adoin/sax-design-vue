<template>
  <div class="center chip-demo">
    <vs-button v-if="chips.length === 0" type="filled" @click="reset">
      Reset Chips
    </vs-button>
    <vs-chip
      v-for="chip in chips"
      :key="chip"
      item
      closable
      @click="remove(chip)"
    >
      {{ chip }}
    </vs-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const defaultChips = ['Dribbble', 'GitHub', 'Behance', 'Vuejs', 'Vuesax']
const chips = ref([...defaultChips])

const reset = () => {
  chips.value = [...defaultChips]
}

const remove = (item: string) => {
  chips.value = chips.value.filter((c) => c !== item)
}
</script>

<style scoped lang="scss">
.chip-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}
</style>
