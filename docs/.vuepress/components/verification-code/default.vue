<script setup lang="ts">
import { reactive } from 'vue'

const values = reactive({
  soft: '2604',
  capsule: '8062',
  underline: '',
})
</script>

<template>
  <div class="verification-code-demo">
    <div>
      <s-text>Soft cells</s-text>
      <s-verification-code
        v-model="values.soft"
        variant="soft"
        aria-label="Soft verification code"
      />
    </div>
    <div>
      <s-text>Connected capsule</s-text>
      <s-verification-code
        v-model="values.capsule"
        variant="capsule"
        mask
        aria-label="Masked verification code"
      />
    </div>
    <div>
      <s-text>Underline shadow</s-text>
      <s-verification-code
        v-model="values.underline"
        variant="underline"
        status="error"
        aria-label="Verification code with error"
      />
    </div>
  </div>
</template>

<style scoped>
.verification-code-demo {
  display: grid;
  gap: 22px;
}

.verification-code-demo > div {
  display: grid;
  gap: 8px;
  justify-items: start;
}
</style>
