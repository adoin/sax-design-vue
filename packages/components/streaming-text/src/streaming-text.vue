<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SIcon, SLogoLoading } from '@vuesax-alpha/components/icon'

import { useTextReveal } from '../../ai-editor/src/agent-shared/use-text-reveal'
import { segmentEditorText } from '../../ai-editor/src/segment-text'
import { streamingTextEmits, streamingTextProps } from './streaming-text'
defineOptions({ name: 'SStreamingText' })
const props = defineProps(streamingTextProps)
const emit = defineEmits(streamingTextEmits)
const ns = useNamespace('streaming-text')

const { t } = useLocale()
const {
  text: revealed,
  busy,
  finish,
  replay: replayReveal,
} = useTextReveal(props, () => emit('finish'))
const cycle = shallowRef(0)
const active = computed(() => busy.value || props.streaming)
const loadingVisible = shallowRef(active.value)
const elapsed = shallowRef(0)
let startedAt = Date.now()
watch(active, (running) => {
  if (running) {
    startedAt = Date.now()
    elapsed.value = 0
    loadingVisible.value = true
  } else elapsed.value = Math.round((Date.now() - startedAt) / 100) / 10
})
const replay = () => {
  cycle.value++
  startedAt = Date.now()
  replayReveal()
}
const chunks = computed(() =>
  segmentEditorText(revealed.value, 'word').map((text, index) => ({
    text,
    key: `${cycle.value}-${index}`,
  })),
)
const paragraphs = computed(() => {
  let index = 0
  return revealed.value.split('\n\n').map((text) => {
    const units = segmentEditorText(text, 'word').map((text) => ({
      text,
      key: `${cycle.value}-${index++}`,
    }))
    index += 2
    return units
  })
})
const wordClass = computed(() =>
  props.animate ? 's-agent-stream-word' : 's-agent-stream-static',
)
defineExpose({ finish, replay })
</script>

<template>
  <div :class="[ns.b(), 's-agent-stream']" :aria-busy="busy || streaming">
    <div class="s-agent-stream-status">
      <SLogoLoading
        v-if="loadingVisible"
        :active="active"
        stop-behavior="corners"
        :size="14"
        shape="rounded"
        aria-hidden="true"
        @restored="!active && (loadingVisible = false)"
      />
      <SIcon v-else name="cb:checkmark" aria-hidden="true" />
      <span>{{
        active
          ? t('vs.agent.running')
          : t('vs.agent.answeredDuration', { seconds: elapsed.toFixed(1) })
      }}</span>
    </div>
    <slot
      :text="revealed"
      :busy="busy"
      :chunks="chunks"
      :paragraphs="paragraphs"
      :word-class="wordClass"
      ><span v-for="chunk in chunks" :key="chunk.key" :class="wordClass">{{
        chunk.text
      }}</span> </slot
    ><span
      class="s-agent-caret"
      :style="{
        visibility: active ? undefined : 'hidden',
        animation: active ? undefined : 'none',
      }"
      aria-hidden="true"
    /><span class="s-agent-sr-only" role="status">{{
      busy || streaming ? t('vs.agent.running') : t('vs.agent.complete')
    }}</span>
  </div>
</template>
