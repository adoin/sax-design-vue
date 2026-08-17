<template>
  <div class="anchor-demo-container">
    <s-anchor
      :get-container="getContainer"
      :items="items"
      :offset="18"
      :target-offset="18"
    />
    <div ref="container" class="anchor-demo-container__scroll">
      <section v-for="item in items" :id="item.href.slice(1)" :key="item.href">
        <h4>{{ item.title }}</h4>
        <p>Scroll this panel or select an item from the navigation.</p>
      </section>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const container = ref<HTMLElement>()
const items = [
  { href: '#anchor-container-first', title: 'First section' },
  { href: '#anchor-container-second', title: 'Second section' },
  { href: '#anchor-container-third', title: 'Third section' },
  { href: '#anchor-container-fourth', title: 'Fourth section' },
]
const getContainer = () => container.value || window
</script>

<style scoped>
.anchor-demo-container {
  display: grid;
  grid-template-columns: 172px minmax(0, 1fr);
  gap: 22px;
  min-height: 360px;
  padding: 18px;
}

.anchor-demo-container__scroll {
  height: 360px;
  overflow: auto;
  border: 1px solid rgba(var(--sax-theme-color), 0.09);
  border-radius: 12px;
  background: rgba(var(--sax-theme-color), 0.025);
}

.anchor-demo-container section {
  min-height: 178px;
  padding: 20px;
  border-bottom: 1px solid rgba(var(--sax-theme-color), 0.08);
}

.anchor-demo-container section:last-child {
  border-bottom: 0;
}

.anchor-demo-container h4 {
  margin: 0 0 8px;
}

.anchor-demo-container p {
  margin: 0;
}

@media (max-width: 640px) {
  .anchor-demo-container {
    grid-template-columns: 1fr;
  }
}
</style>
