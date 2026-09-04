<script setup lang="ts">
import { shallowRef } from 'vue'
import { SUpload, revealWatermark } from 'sax-design-vue'

const both = shallowRef(false)
const result = shallowRef('')
const message = shallowRef('')
const busy = shallowRef(false)

const reveal = async () => {
  try {
    const file = await SUpload.pick({ accept: 'image/*', limitSize: 20 })
    if (!file) return
    busy.value = true
    result.value = ''
    message.value = ''
    result.value = await revealWatermark(file, { gain: 32 })
    message.value = '显影完成，请在结果图中查找 DEMO-2026-001。'
  } catch {
    message.value = '无法读取图片，请选择 20 MB、2400 万像素以内的截图。'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="blind-demo">
    <div class="blind-controls">
      <s-checkbox v-model="both">同时显示明水印</s-checkbox>
      <s-button :loading="busy" @click="reveal">选择截图显影</s-button>
    </div>
    <s-watermark
      :mode="both ? 'both' : 'blind'"
      content="Sax Design Vue"
      blind-content="DEMO-2026-001"
      :blind-strength="2"
      :font-size="20"
      :gap="48"
    >
      <div class="blind-document">
        <s-tag>演示文档</s-tag>
        <h3>产品设计交付说明</h3>
        <p>
          这里已叠加暗水印。先截取这块区域并保存为原始 PNG，再选择截图进行显影。
        </p>
        <p>水印编号：DEMO-2026-001，仅使用演示标识。</p>
        <s-input placeholder="仍可正常输入" />
      </div>
    </s-watermark>
    <s-text v-if="message" role="status" aria-live="polite">{{
      message
    }}</s-text>
    <s-image
      v-if="result"
      :src="result"
      alt="截图的暗水印显影结果"
      fit="contain"
      width="100%"
    />
  </div>
</template>

<style scoped>
.blind-demo {
  display: grid;
  gap: 20px;
  width: 100%;
  min-width: 0;
}
.blind-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}
.blind-document {
  padding: 32px;
}
.blind-document h3 {
  margin: 16px 0;
}
.blind-document p {
  line-height: 1.8;
}
</style>
