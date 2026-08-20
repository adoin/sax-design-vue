<script setup lang="ts">
const underlineEffects = [
  { value: 'slide', label: 'Slide / 滑入' },
  { value: 'center', label: 'Center / 中心展开' },
  { value: 'double', label: 'Double / 双线' },
  { value: 'highlight', label: 'Highlight / 标记' },
] as const
</script>

<template>
  <div class="link-demo">
    <div class="link-demo__group">
      <span class="link-demo__label">Effects / 动效</span>
      <div class="link-demo__row">
        <s-link href="https://vxeui.com" target="_blank">Default link</s-link>
        <s-link
          v-for="effect in underlineEffects"
          :key="effect.value"
          :href="`#link-${effect.value}-example`"
          :underline-effect="effect.value"
        >
          {{ effect.label }}
        </s-link>
        <s-link type="danger" :underline="false">No underline</s-link>
      </div>
    </div>

    <div class="link-demo__group">
      <span class="link-demo__label">Multiline / 跨行</span>
      <div class="link-demo__multiline-grid">
        <div
          v-for="effect in underlineEffects"
          :key="`multiline-${effect.value}`"
          class="link-demo__multiline-item"
        >
          <span class="link-demo__effect-label">{{ effect.label }}</span>
          <p>
            Read the
            <s-link
              :href="`#link-${effect.value}-multiline-example`"
              :underline-effect="effect.value"
            >
              component guidelines and accessibility recommendations for
              production interfaces
            </s-link>
            before shipping.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.link-demo {
  display: grid;
  gap: 24px;
}

.link-demo__group {
  display: grid;
  gap: 10px;
}

.link-demo__label {
  color: var(--sax-text-color-secondary);
  font-size: 12px;
  font-weight: 600;
}

.link-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 20px;
}

.link-demo__multiline-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
  gap: 20px 28px;
}

.link-demo__multiline-item {
  display: grid;
  max-width: 290px;
  gap: 6px;
}

.link-demo__effect-label {
  color: var(--sax-text-color-secondary);
  font-size: 11px;
  font-weight: 600;
}

.link-demo__multiline-item p {
  margin: 0;
  color: var(--sax-text-color-regular);
  line-height: 1.9;
}
</style>
