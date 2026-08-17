<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

type DeckPreset = 'single' | 'layered' | 'soft'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const activePreset = shallowRef<DeckPreset>('layered')

const items = computed(() =>
  isZh.value
    ? [
        { title: '聚焦', description: '当前内容位于中央前景' },
        { title: '层级', description: '相邻内容退到左右后方' },
        { title: '流动', description: '方向与空间连续变化' },
        { title: '景深', description: '远处内容逐渐弱化' },
        { title: '回响', description: '多层卡片保持稳定对称' },
      ]
    : [
        { title: 'Focus', description: 'Active content stays in front' },
        { title: 'Layer', description: 'Adjacent content recedes evenly' },
        { title: 'Flow', description: 'Spatial movement stays continuous' },
        { title: 'Depth', description: 'Distant content becomes quieter' },
        { title: 'Echo', description: 'Layers remain visually balanced' },
      ],
)

const presets = computed(() => [
  {
    key: 'single' as const,
    label: isZh.value ? '单层露出' : 'One layer',
    visible: 1,
    blur: false,
    scale: 0.88,
  },
  {
    key: 'layered' as const,
    label: isZh.value ? '双层露出' : 'Two layers',
    visible: 2,
    blur: false,
    scale: 0.86,
  },
  {
    key: 'soft' as const,
    label: isZh.value ? '双层虚化' : 'Soft depth',
    visible: 2,
    blur: true,
    scale: 0.86,
  },
])

const currentPreset = computed(
  () =>
    presets.value.find((preset) => preset.key === activePreset.value) ??
    presets.value[1],
)
</script>

<template>
  <div class="deck-example">
    <div class="deck-example__controls">
      <s-button
        v-for="preset in presets"
        :key="preset.key"
        type="flat"
        size="small"
        :active="activePreset === preset.key"
        @click="activePreset = preset.key"
      >
        {{ preset.label }}
      </s-button>
    </div>

    <s-carousel
      :items="items"
      effect="deck"
      :autoplay="false"
      :radius="16"
      :deck-visible="currentPreset.visible"
      :deck-blur="currentPreset.blur"
      :deck-scale="currentPreset.scale"
      :depth="140"
      :perspective="960"
      draggable
      arrow="always"
      indicator-position="outside"
      height="250"
    >
      <template #item="{ item, index }">
        <div class="deck-slide" :class="`deck-slide--${(index % 5) + 1}`">
          <span>0{{ index + 1 }}</span>
          <strong>{{ item.title }}</strong>
          <small>{{ item.description }}</small>
        </div>
      </template>
    </s-carousel>
  </div>
</template>

<style scoped>
.deck-example {
  min-width: 0;
}
.deck-example__controls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.deck-slide {
  display: flex;
  height: 100%;
  box-sizing: border-box;
  flex-direction: column;
  justify-content: flex-end;
  gap: 4px;
  padding: 24px;
  border-radius: inherit;
  color: white;
}
.deck-slide--1 {
  background: linear-gradient(145deg, #285fff, #7656ee);
}
.deck-slide--2 {
  background: linear-gradient(145deg, #007f94, #38c9b0);
}
.deck-slide--3 {
  background: linear-gradient(145deg, #c8497b, #f47d65);
}
.deck-slide--4 {
  background: linear-gradient(145deg, #5f43b7, #aa68e8);
}
.deck-slide--5 {
  background: linear-gradient(145deg, #2675a8, #44b4d5);
}
.deck-slide span {
  font-size: 10px;
  letter-spacing: 0.16em;
  opacity: 0.72;
}
.deck-slide strong {
  font-size: 18px;
}
.deck-slide small {
  opacity: 0.78;
}
</style>
