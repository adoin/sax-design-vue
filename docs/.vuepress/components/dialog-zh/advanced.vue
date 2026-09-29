<template>
  <s-button @click="visible = true">打开确认对话框</s-button>
  <s-dialog
    v-model="visible"
    title="归档草稿"
    content="归档后，可以在归档记录中恢复这份草稿。"
    show-footer
    show-cancel-button
    show-confirm-button
    confirm-button-text="归档"
    @confirm="confirmed = true"
  />
  <p v-if="confirmed">已归档。</p>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const visible = ref(false)
const confirmed = ref(false)
</script>
