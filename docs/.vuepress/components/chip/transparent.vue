<template>
  <div class="center chip-demo">
    <vs-chip transparent color="primary">Basic Chip</vs-chip>
    <vs-chip transparent color="success">
      <vs-avatar><template #text>LD</template></vs-avatar>
      Avatar Text
    </vs-chip>
    <vs-chip transparent color="danger">
      <vs-avatar>
        <i class="material-icons notranslate">person</i>
      </vs-avatar>
      Avatar Icon
    </vs-chip>
    <vs-chip transparent color="warning">
      <vs-avatar>
        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
      </vs-avatar>
      Avatar Image
    </vs-chip>
    <vs-chip v-model="closableDark" transparent closable color="dark">
      Closable chip
    </vs-chip>
    <vs-chip
      v-model="closableCustom"
      transparent
      closable
      color="#24c1a0"
      close-icon="close"
    >
      <vs-avatar>
        <img src="https://randomuser.me/api/portraits/men/16.jpg" alt="" />
      </vs-avatar>
      Closable chip
    </vs-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const closableDark = ref(true)
const closableCustom = ref(true)
</script>

<style scoped lang="scss">
.chip-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
