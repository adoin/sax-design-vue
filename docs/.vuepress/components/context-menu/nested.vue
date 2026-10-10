<script setup lang="ts">
import { ref } from 'vue'

const innerDisabled = ref(false)
const opened = ref('None')
const selected = ref('None')
const outerItems = [{ label: 'Outer action', value: 'outer' }]
const middleItems = [{ label: 'Middle action', value: 'middle' }]
const innerItems = [{ label: 'Inner action', value: 'inner' }]
</script>

<template>
  <div class="nested-context-demo">
    <s-switch v-model="innerDisabled" aria-label="Disable the inner menu"
      >Disable the inner menu</s-switch
    >

    <s-context-menu
      :items="outerItems"
      @open="opened = 'Outer region'"
      @select="selected = $event.label"
    >
      <div class="nested-region nested-region--outer">
        <strong>01 · Outer region</strong>
        <span>Right-click this area to open the outer menu.</span>

        <s-context-menu
          :items="middleItems"
          @open="opened = 'Middle region'"
          @select="selected = $event.label"
        >
          <div class="nested-region nested-region--middle">
            <strong>02 · Middle region</strong>
            <span>Right-click here to open only the middle menu.</span>

            <s-context-menu
              :items="innerItems"
              :disabled="innerDisabled"
              @open="opened = 'Inner region'"
              @select="selected = $event.label"
            >
              <div class="nested-region nested-region--inner">
                <strong>03 · Inner region</strong>
                <span>{{
                  innerDisabled
                    ? 'Disabled: the middle menu handles this area.'
                    : 'Right-click here to open only the inner menu.'
                }}</span>
              </div>
            </s-context-menu>
          </div>
        </s-context-menu>
      </div>
    </s-context-menu>

    <div class="nested-context-demo__feedback" aria-live="polite">
      <span
        >Last opened: <strong>{{ opened }}</strong></span
      >
      <span
        >Selected: <strong>{{ selected }}</strong></span
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
