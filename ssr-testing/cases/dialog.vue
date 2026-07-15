<template>
  <s-button @click="dialogVisible = true">click to open the Dialog</s-button>

  <s-dialog v-model="dialogVisible" title="Tips" width="30%">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <s-button
          color="danger"
          style="margin-right: 10px"
          @click="dialogVisible = false"
          >Cancel</s-button
        >
        <s-button color="primary" @click="dialogVisible = false">
          Confirm
        </s-button>
      </span>
    </template>
  </s-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const dialogVisible = ref(true)
</script>
