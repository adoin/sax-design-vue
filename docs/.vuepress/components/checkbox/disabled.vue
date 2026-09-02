<script setup lang="ts">
import { shallowRef } from 'vue'

const unchecked = shallowRef(false)
const checked = shallowRef(true)
</script>

<template>
  <div class="checkbox-states">
    <s-checkbox v-model="unchecked">Enabled · unchecked</s-checkbox>
    <s-checkbox v-model="checked">Enabled · checked</s-checkbox>
    <s-checkbox disabled :model-value="false">Disabled · unchecked</s-checkbox>
    <s-checkbox disabled :model-value="true">Disabled · checked</s-checkbox>
    <s-checkbox disabled indeterminate :model-value="true">
      Disabled · indeterminate
    </s-checkbox>
  </div>
</template>

<style scoped>
.checkbox-states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}
</style>
