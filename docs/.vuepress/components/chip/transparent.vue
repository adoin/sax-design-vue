<template>
  <div class="center chip-demo">
    <s-chip transparent color="primary">Basic Chip</s-chip>
    <s-chip transparent color="success">
      <s-avatar><template #text>LD</template></s-avatar>
      Avatar Text
    </s-chip>
    <s-chip transparent color="danger">
      <s-avatar>
        <i class="material-icons notranslate">person</i>
      </s-avatar>
      Avatar Icon
    </s-chip>
    <s-chip transparent color="warning">
      <s-avatar>
        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
      </s-avatar>
      Avatar Image
    </s-chip>
    <s-chip v-model="closableDark" transparent closable color="dark">
      Closable chip
    </s-chip>
    <s-chip
      v-model="closableCustom"
      transparent
      closable
      color="#24c1a0"
      close-icon="close"
    >
      <s-avatar>
        <img src="https://randomuser.me/api/portraits/men/16.jpg" alt="" />
      </s-avatar>
      Closable chip
    </s-chip>
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
