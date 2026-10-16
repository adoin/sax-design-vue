<script setup lang="ts">
import { ref } from 'vue'
const printer = ref<{ print: () => void }>()
</script>

<template>
  <div class="print-demo">
    <s-button @click="printer?.print()">Print invoice</s-button>
    <s-print ref="printer" title="Invoice">
      <article class="invoice">
        <h3>Invoice #SAX-2026</h3>
        <p>Professional subscription · $49.00</p>
        <strong>Total $49.00</strong>
      </article>
    </s-print>
  </div>
</template>

<style scoped>
.print-demo {
  display: grid;
  justify-items: start;
  gap: 14px;
  width: 100%;
}
.invoice {
  width: min(100%, 320px);
  box-sizing: border-box;
  padding: 20px;
  border-radius: 12px;
  background: var(--sax-css-background);
  color: var(--sax-css-text);
  box-shadow: inset 0 2px 8px rgb(0 0 0 / 0.1);
}
.invoice h3 {
  margin: 0 0 8px;
  color: inherit;
}
.invoice p {
  margin: 0 0 12px;
  color: color-mix(in srgb, var(--sax-css-text) 72%, transparent);
}
.invoice strong {
  display: block;
  color: var(--sax-css-primary);
}
@media print {
  .invoice {
    padding: 0;
    background: #fff;
    color: #1f2937;
    box-shadow: none;
  }
  .invoice p {
    color: #475569;
  }
  .invoice strong {
    color: #1f2937;
  }
}
</style>
