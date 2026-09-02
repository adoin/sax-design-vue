<script setup lang="ts">
import { shallowRef } from 'vue'

const selected = shallowRef('selected')
</script>

<template>
  <div class="radio-states">
    <s-radio-group v-model="selected">
      <s-radio value="unselected">Enabled · unchecked</s-radio>
      <s-radio value="selected">Enabled · checked</s-radio>
    </s-radio-group>
    <s-radio disabled model-value="selected" value="unselected">
      Disabled · unchecked
    </s-radio>
    <s-radio disabled model-value="selected" value="selected">
      Disabled · checked
    </s-radio>
  </div>
</template>

<style scoped>
.radio-states {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 24px;
}
</style>
