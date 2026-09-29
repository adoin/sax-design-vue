<script setup lang="ts">
import { ref } from 'vue'
import { SDialogBox } from 'sax-design-vue'
const result = ref('')
const notify = async () => {
  await SDialogBox.alert('草稿已保存。', '提示', {
    confirmButtonText: '知道了',
  })
}
const confirm = async () => {
  try {
    await SDialogBox.confirm('确认归档这份草稿？', '确认归档', {
      confirmButtonText: '归档',
      cancelButtonText: '取消',
    })
    result.value = '已确认归档'
  } catch {
    result.value = '已取消操作'
  }
}
</script>

<template>
  <div class="dialog-service-example">
    <div class="dialog-service-example__actions">
      <s-button @click="notify">消息提示</s-button>
      <s-button @click="confirm">操作确认</s-button>
    </div>
    <p v-if="result" role="status">{{ result }}</p>
  </div>
</template>

<style scoped>
.dialog-service-example {
  display: grid;
  gap: 16px;
}
.dialog-service-example__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.dialog-service-example p {
  margin: 0;
}
</style>
