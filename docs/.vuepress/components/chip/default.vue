<template>
  <div class="center chip-demo">
    <vs-chip>Basic Chip</vs-chip>
    <vs-chip>
      <vs-avatar><template #text>LD</template></vs-avatar>
      Avatar Text
    </vs-chip>
    <vs-chip>
      <vs-avatar>
        <i class="material-icons notranslate">person</i>
      </vs-avatar>
      Avatar Icon
    </vs-chip>
    <vs-chip>
      <vs-avatar>
        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
      </vs-avatar>
      Avatar Image
    </vs-chip>
    <vs-chip v-model="showClosable" closable>Closable chip</vs-chip>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showClosable = ref(true)
</script>

<style scoped lang="scss">
.chip-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
