<script setup lang="ts">
import { shallowRef } from 'vue'

const protocol = shallowRef('https://')
const address = shallowRef('sax-design.dev')
</script>

<template>
  <div class="control-group-demo">
    <span id="website-address-label" class="control-group-demo__label">
      Website address
    </span>
    <s-control-group aria-labelledby="website-address-label">
      <s-select v-model="protocol" :span="8">
        <s-option label="HTTPS" value="https://">HTTPS</s-option>
        <s-option label="HTTP" value="http://">HTTP</s-option>
      </s-select>
      <s-input v-model="address" placeholder="Domain" />
    </s-control-group>
  </div>
</template>

<style scoped>
.control-group-demo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.control-group-demo__label {
  color: var(--sax-text-color);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
