<template>
  <div>
    <s-button @click="printer?.print()">Print invoice</s-button
    ><s-print ref="printer" title="Invoice"
      ><article class="invoice">
        <h3>Invoice #SAX-2026</h3>
        <p>Professional subscription · $49.00</p>
        <strong>Total $49.00</strong>
      </article></s-print
    >
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
const printer = ref<{ print: () => void }>()
</script>
<style scoped>
.invoice {
  width: 320px;
  margin-top: 14px;
  padding: 18px;
  border: 1px solid #d9e1f2;
  border-radius: 10px;
  color: #2b3857;
}
</style>
