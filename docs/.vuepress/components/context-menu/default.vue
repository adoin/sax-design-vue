<template>
  <s-context-menu :items="items" @select="selected = $event.label">
    <div class="context-menu-demo">
      Right-click here<span>{{ selected }}</span>
    </div>
  </s-context-menu>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const selected = ref('')
const items = [
  { label: 'Copy', icon: 'content_copy' },
  { label: 'Rename', icon: 'edit' },
  { label: 'Delete', icon: 'delete', divided: true },
]
</script>

<style scoped>
.context-menu-demo {
  display: grid;
  width: 260px;
  min-height: 96px;
  place-items: center;
  border: 1px dashed #b8c6ee;
  border-radius: 12px;
  color: #506184;
  font-size: 13px;
  user-select: none;
}
.context-menu-demo span {
  color: #2463eb;
}
</style>
