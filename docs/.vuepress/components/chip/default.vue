<template>
  <div class="center chip-demo">
    <s-chip>Basic Chip</s-chip>
    <s-chip>
      <s-avatar><template #text>LD</template></s-avatar>
      Avatar Text
    </s-chip>
    <s-chip>
      <s-avatar>
        <i class="material-icons notranslate">person</i>
      </s-avatar>
      Avatar Icon
    </s-chip>
    <s-chip>
      <s-avatar>
        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
      </s-avatar>
      Avatar Image
    </s-chip>
    <s-chip v-model="showClosable" closable>Closable chip</s-chip>
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
