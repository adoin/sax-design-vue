<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const selected = shallowRef('')
const items = computed(() => [
  { label: isZh.value ? '复制' : 'Copy', icon: 'cb:copy' },
  { label: isZh.value ? '重命名' : 'Rename', icon: 'cb:edit' },
  {
    label: isZh.value ? '删除' : 'Delete',
    icon: 'cb:trash-can',
    divided: true,
  },
])
</script>

<template>
  <s-context-menu :items="items" @select="selected = $event.label">
    <div
      class="context-menu-demo"
      :aria-label="
        isZh ? '在此区域点击鼠标右键' : 'Right-click inside this area'
      "
    >
      <div class="context-menu-demo__hint">
        <s-icon name="cb:cursor-1" />
        <span>{{ isZh ? '鼠标右键区域' : 'Right-click area' }}</span>
        <kbd>{{ isZh ? '右键' : 'RMB' }}</kbd>
      </div>

      <strong>{{
        isZh ? '在此处点击右键' : 'Right-click anywhere here'
      }}</strong>
      <small>
        {{
          isZh ? '打开菜单并选择一个操作' : 'Open the menu and choose an action'
        }}
      </small>

      <p v-if="selected" class="context-menu-demo__result">
        {{ isZh ? '已选择' : 'Selected' }}：{{ selected }}
      </p>
    </div>
  </s-context-menu>
</template>

<style scoped>
.context-menu-demo {
  position: relative;
  display: flex;
  width: min(360px, calc(100vw - 64px));
  min-height: 148px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow: hidden;
  border-radius: var(--sax-radius);
  background:
    radial-gradient(
      circle at 50% 0%,
      rgba(var(--sax-primary), 0.13),
      transparent 58%
    ),
    rgb(var(--sax-background));
  color: rgb(var(--sax-text));
  cursor: context-menu;
  box-shadow:
    0 14px 32px rgba(var(--sax-primary), 0.12),
    0 7px 14px -12px rgba(var(--sax-text), 0.42) inset;
  user-select: none;
  transition:
    background-color var(--sax-motion-duration-fast),
    box-shadow var(--sax-motion-duration-fast),
    transform var(--sax-motion-duration-fast);
}

.context-menu-demo:hover {
  background-color: rgb(var(--sax-background));
  box-shadow:
    0 18px 38px rgba(var(--sax-primary), 0.18),
    0 8px 18px -13px rgba(var(--sax-primary), 0.48) inset;
  transform: translateY(-2px);
}

.context-menu-demo__hint {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-bottom: 14px;
  padding: 6px 8px 6px 10px;
  border-radius: var(--sax-radius-pill);
  background: rgba(var(--sax-primary), 0.1);
  color: rgb(var(--sax-primary));
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 6px 14px rgba(var(--sax-primary), 0.1);
}

.context-menu-demo__hint :deep(.s-icon) {
  font-size: 16px;
}

.context-menu-demo__hint kbd {
  padding: 2px 6px;
  border: 0;
  border-radius: var(--sax-radius-pill);
  background: rgb(var(--sax-background));
  color: rgba(var(--sax-text), 0.62);
  font-family: inherit;
  font-size: 10px;
  font-weight: 600;
  box-shadow: 0 2px 7px rgba(var(--sax-text), 0.13);
}

.context-menu-demo strong {
  font-size: 16px;
  line-height: 1.4;
}

.context-menu-demo small {
  margin-top: 5px;
  color: rgba(var(--sax-text), 0.62);
  font-size: 12px;
  line-height: 1.5;
}

.context-menu-demo__result {
  margin: 12px 0 0;
  color: rgb(var(--sax-primary));
  font-size: 12px;
  font-weight: 600;
}

@media (prefers-reduced-motion: reduce) {
  .context-menu-demo {
    transition: none;
  }

  .context-menu-demo:hover {
    transform: none;
  }
}
</style>
