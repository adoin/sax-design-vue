<template>
  <div class="center tag-demo">
    <s-tag color="primary">Basic Tag</s-tag>
    <s-tag color="success">
      <s-avatar><template #text>LD</template></s-avatar>
      Avatar Text
    </s-tag>
    <s-tag color="danger">
      <s-avatar>
        <s-icon name="cb:user" />
      </s-avatar>
      Avatar Icon
    </s-tag>
    <s-tag color="warning">
      <s-avatar>
        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
      </s-avatar>
      Avatar Image
    </s-tag>
    <s-tag v-model="closableDark" closable color="dark"> Closable tag </s-tag>
    <s-tag
      v-model="closableCustom"
      closable
      color="#24c1a0"
      close-icon="cb:close"
    >
      <s-avatar>
        <img src="https://randomuser.me/api/portraits/men/16.jpg" alt="" />
      </s-avatar>
      Closable tag
    </s-tag>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const closableDark = ref(true)
const closableCustom = ref(true)
</script>

<style scoped lang="scss">
.tag-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
