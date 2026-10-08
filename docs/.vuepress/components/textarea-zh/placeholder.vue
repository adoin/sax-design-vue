<script setup lang="ts">
import { shallowRef } from 'vue'
const value = shallowRef('')
const hint = '描述你的想法，补充有助于理解的细节。\n这里可以输入多行内容。'
</script>

<template>
  <s-textarea
    v-model="value"
    label="说明"
    :placeholder="hint"
    :auto-size="{ minRows: 3, maxRows: 5 }"
  />
</template>
