<template>
  <s-icon-picker v-model="icon" clearable /><span class="value">{{
    icon || 'No icon'
  }}</span>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const icon = ref('favorite')
</script>
<style scoped>
.value {
  margin-left: 12px;
  color: #506184;
  font-size: 13px;
}
</style>
