<template>
  <div class="center tag-demo">
    <s-tag>Basic Tag</s-tag>
    <s-tag status="success">Success</s-tag>
    <s-tag status="warning" border>Warning outline</s-tag>
    <s-tag status="danger" disabled>Disabled</s-tag>
    <s-tag>
      <s-avatar><template #text>LD</template></s-avatar>
      Avatar Text
    </s-tag>
    <s-tag>
      <s-avatar>
        <s-icon name="cb:user" />
      </s-avatar>
      Avatar Icon
    </s-tag>
    <s-tag>
      <s-avatar>
        <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="" />
      </s-avatar>
      Avatar Image
    </s-tag>
    <s-tag v-model="showClosable" closable>Closable tag</s-tag>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const showClosable = ref(true)
</script>

<style scoped lang="scss">
.tag-demo {
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
