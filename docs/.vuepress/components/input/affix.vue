<script setup lang="ts">
import { shallowRef } from 'vue'

const query = shallowRef('')
const profileName = shallowRef('')
</script>

<template>
  <div class="input-affix-demo">
    <s-input
      v-model="query"
      prefix-icon="cb:search"
      placeholder="Search keywords"
    />
    <s-input
      v-model="profileName"
      suffix-icon="cb:user"
      placeholder="Profile name"
    />
  </div>
</template>

<style scoped>
.input-affix-demo {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
</style>
