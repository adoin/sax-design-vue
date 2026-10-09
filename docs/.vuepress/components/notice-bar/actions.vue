<script setup lang="ts">
import { shallowRef } from 'vue'
const visible = shallowRef(true)
const read = shallowRef(false)
</script>

<template>
  <div class="notice-demo">
    <s-button size="small" type="flat" @click="visible = true"
      >Show notice</s-button
    ><s-notice-bar v-model="visible" type="primary" href="#api" closable
      ><template #prefix><s-tag size="small">Notice</s-tag></template
      ><template #content
        ><strong>Explore the NoticeBar API</strong> · Select the message to jump
        to the reference</template
      ><template #suffix
        ><s-tag size="small" :color="read ? 'success' : 'primary'">{{
          read ? 'Read' : 'Unread'
        }}</s-tag></template
      ><template #actions="{ close }"
        ><s-button size="small" type="flat" @click="read = true"
          >Mark as read</s-button
        ><s-button size="small" type="flat" @click="close()"
          >Dismiss</s-button
        ></template
      ></s-notice-bar
    >
  </div>
</template>

<style scoped>
.notice-demo {
  display: grid;
  align-items: start;
  justify-items: start;
  gap: 16px;
  width: 100%;
}
.notice-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
}
.notice-grid p {
  margin: 0 0 12px;
}
</style>
