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
    message.value = 'Reveal complete. Look for DEMO-2026-001 in the result.'
  } catch {
    message.value =
      'Unable to read image. Choose a screenshot below 20 MB and 24 megapixels.'
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <div class="blind-demo">
    <div class="blind-controls">
      <s-checkbox v-model="both">Also show visible watermark</s-checkbox>
      <s-button :loading="busy" @click="reveal">Reveal a screenshot</s-button>
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
        <s-tag>Demo document</s-tag>
        <h3>Product design handoff</h3>
        <p>
          A blind watermark is applied here. Capture this area as an original
          PNG, then select the screenshot to reveal it.
        </p>
        <p>Watermark ID: DEMO-2026-001, a demonstration identifier.</p>
        <s-input placeholder="You can still type here" />
      </div>
    </s-watermark>
    <s-text v-if="message" role="status" aria-live="polite">{{
      message
    }}</s-text>
    <s-image
      v-if="result"
      :src="result"
      alt="Blind watermark revealed from the screenshot"
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
