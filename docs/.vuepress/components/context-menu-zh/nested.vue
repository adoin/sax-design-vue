<script setup lang="ts">
import { ref } from 'vue'

const innerDisabled = ref(false)
const opened = ref('暂无')
const selected = ref('暂无')
const outerItems = [{ label: '外层操作', value: 'outer' }]
const middleItems = [{ label: '中层操作', value: 'middle' }]
const innerItems = [{ label: '内层操作', value: 'inner' }]
</script>

<template>
  <div class="nested-context-demo">
    <s-switch v-model="innerDisabled" aria-label="禁用最内层菜单"
      >禁用最内层菜单</s-switch
    >

    <s-context-menu
      :items="outerItems"
      @open="opened = '外层区域'"
      @select="selected = $event.label"
    >
      <div class="nested-region nested-region--outer">
        <strong>01 · 外层区域</strong>
        <span>右键此处打开外层菜单。</span>

        <s-context-menu
          :items="middleItems"
          @open="opened = '中层区域'"
          @select="selected = $event.label"
        >
          <div class="nested-region nested-region--middle">
            <strong>02 · 中层区域</strong>
            <span>右键此处只打开中层菜单。</span>

            <s-context-menu
              :items="innerItems"
              :disabled="innerDisabled"
              @open="opened = '内层区域'"
              @select="selected = $event.label"
            >
              <div class="nested-region nested-region--inner">
                <strong>03 · 内层区域</strong>
                <span>{{
                  innerDisabled
                    ? '已禁用：此区域交给中层菜单处理。'
                    : '右键此处只打开最内层菜单。'
                }}</span>
              </div>
            </s-context-menu>
          </div>
        </s-context-menu>
      </div>
    </s-context-menu>

    <div class="nested-context-demo__feedback" aria-live="polite">
      <span
        >最近打开： <strong>{{ opened }}</strong></span
      >
      <span
        >已选择： <strong>{{ selected }}</strong></span
      >
    </div>
  </div>
</template>

<style scoped>
.nested-context-demo {
  display: grid;
  width: min(100%, 560px);
  gap: 16px;
  color: var(--sax-css-text);
}

.nested-context-demo :deep(.s-context-menu) {
  display: block;
  min-width: 0;
}

.nested-region {
  display: grid;
  gap: 8px;
  padding: clamp(12px, 3vw, 20px);
  border-radius: var(--sax-radius);
  cursor: context-menu;
  line-height: 1.6;
}

.nested-region > span {
  font-size: 13px;
}

.nested-region > :deep(.s-context-menu) {
  margin-top: 8px;
}

.nested-region--outer {
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 7%,
    var(--sax-css-background)
  );
}

.nested-region--middle {
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 12%,
    var(--sax-css-background)
  );
}

.nested-region--inner {
  background: var(--sax-css-background);
}

.nested-context-demo :deep(.s-context-menu:focus-visible) > .nested-region {
  background: color-mix(
    in srgb,
    var(--sax-css-primary) 18%,
    var(--sax-css-background)
  );
}

.nested-context-demo__feedback {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  font-size: 13px;
  line-height: 1.6;
}
</style>
