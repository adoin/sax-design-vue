<script setup lang="ts">
import { shallowRef } from 'vue'
defineProps<{ zh: boolean; compact?: boolean }>()
defineEmits<{ navigate: [path: string] }>()
const percent = shallowRef(68)
const animated = shallowRef(true)
</script>
<template>
  <section class="gallery-visual" :class="{ compact }">
    <header>
      <strong>{{ zh ? '纹理与动效' : 'Texture & motion' }}</strong
      ><s-text type="primary" effect="neon">{{
        zh ? '亿点点不同' : 'A little extra'
      }}</s-text>
    </header>
    <div class="texture">
      <span
        >{{ zh ? '气泡进度' : 'Bubble progress' }} <b>{{ percent }}%</b></span
      ><s-progress
        :percent="percent"
        :height="compact ? 10 : 22"
        texture="bubbles"
        :texture-animated="animated"
      />
    </div>
    <template v-if="!compact">
      <s-slider
        v-model="percent"
        :aria-label="zh ? '调整进度' : 'Adjust progress'"
      />
      <s-switch v-model="animated">{{
        zh ? '播放纹理动效' : 'Animate the texture'
      }}</s-switch>
      <div class="glass-stage">
        <s-card texture="liquid-glass" :title="zh ? '液态镜片' : 'Liquid glass'"
          ><p>
            {{
              zh
                ? '背景折射，让材质真正有变化。'
                : 'Backdrop refraction adds an optical layer.'
            }}
          </p>
          <s-button
            size="small"
            @click="$emit('navigate', '/components/card.html')"
            >{{ zh ? '探索 Card' : 'Explore Card' }} ↗</s-button
          ></s-card
        >
      </div>
    </template>
  </section>
</template>
<style scoped lang="scss">
.gallery-visual {
  display: grid;
  gap: 14px;
  min-width: 0;
}
header {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}
header :deep(.s-text) {
  font-size: 12px;
}
.texture {
  display: grid;
  gap: 9px;
}
.texture > span {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: hsl(var(--sax-theme-color) / 0.6);
}
.texture b {
  color: hsl(var(--sax-accent-color));
  font-weight: 600;
}
.glass-stage {
  position: relative;
  isolation: isolate;
  display: grid;
  place-items: center;
  padding: 24px;
  border-radius: 16px;
  background:
    repeating-linear-gradient(
      120deg,
      transparent 0 24px,
      rgb(255 255 255 / 0.18) 25px 27px,
      transparent 28px 48px
    ),
    linear-gradient(135deg, #6f50ef, #25d9d4);
}
.glass-stage :deep(.s-card) {
  width: 100%;
  max-width: 380px;
}
.glass-stage p {
  margin: 0 0 12px;
  font-size: 12px;
}
</style>
