<template>
  <div class="center chips-demo">
    <p class="modelx">{{ chips }}</p>
    <vs-chips
      v-model="chips"
      color="rgb(145, 32, 159)"
      placeholder="New Element"
      remove-icon="delete_forever"
    >
      <vs-chip
        v-for="chip in chips"
        :key="chip"
        item
        closable
        close-icon="delete"
        @click="remove(chip)"
      >
        {{ chip }}
      </vs-chip>
    </vs-chips>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const chips = ref(['Vuejs', 'Node', 'Vuesax'])

const remove = (item: string) => {
  chips.value = chips.value.filter((c) => c !== item)
}
</script>

<style scoped lang="scss">
.chips-demo {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modelx {
  margin: 0;
}
</style>
