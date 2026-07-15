<template>
  <div class="play-container play-index">
    <header class="play-index__header">
      <h1>Sax Design Vue Playground</h1>
      <p>选择组件 demo 进行本地验证</p>
    </header>

    <section class="play-index__section">
      <h2>新增组件 Demo</h2>
      <ul class="play-index__list">
        <li v-for="item in newDemos" :key="item.path">
          <a :href="`/${item.path}`">{{ item.label }}</a>
        </li>
      </ul>
    </section>

    <section class="play-index__section">
      <h2>已有组件 Demo</h2>
      <ul class="play-index__list">
        <li v-for="item in existingDemos" :key="item.path">
          <a :href="`/${item.path}`">{{ item.label }}</a>
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
const newDemos = [
  { path: 'spacer', label: 'Spacer' },
  { path: 'divider', label: 'Divider' },
  { path: 'progress', label: 'Progress' },
  { path: 'chip', label: 'Chip' },
  { path: 'breadcrumb', label: 'Breadcrumb' },
  { path: 'textarea', label: 'Textarea' },
  { path: 'collapse', label: 'Collapse' },
  { path: 'list', label: 'List' },
  { path: 'images', label: 'Images' },
  { path: 'prompt', label: 'Prompt' },
  { path: 'tabs', label: 'Tabs' },
  { path: 'slider', label: 'Slider' },
  { path: 'upload', label: 'Upload' },
]

const existingDemos = [{ path: 'alert', label: 'Alert' }]
</script>

<style lang="scss" scoped>
.play-index {
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  padding: 32px;
  gap: 24px;
  overflow: auto;

  &__header h1 {
    margin: 0 0 8px;
    font-size: 1.5rem;
  }

  &__header p {
    margin: 0;
    color: rgba(0, 0, 0, 0.55);
  }

  &__section h2 {
    margin: 0 0 12px;
    font-size: 1.1rem;
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;

    a {
      display: block;
      padding: 10px 12px;
      border-radius: 8px;
      background: rgba(25, 91, 255, 0.08);
      color: #195bff;
      text-decoration: none;
      font-weight: 500;

      &:hover {
        background: rgba(25, 91, 255, 0.15);
      }
    }
  }
}
</style>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  #play {
    height: 100%;
    width: 100%;
    .play-container {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
