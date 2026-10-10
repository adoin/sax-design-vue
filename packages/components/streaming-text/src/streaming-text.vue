<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace } from '@vuesax-alpha/hooks'
import { SLogoLoading } from '@vuesax-alpha/components/icon'

import { useTextReveal } from '../../ai-editor/src/agent-shared/use-text-reveal'
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
  replay,
} = useTextReveal(props, () => emit('finish'))
const chunks = computed(() => revealed.value.match(/\S+\s*|\s+/g) || [])
defineExpose({ finish, replay })
</script>

<template>
  <div :class="[ns.b(), 's-agent-stream']" :aria-busy="busy || streaming">
    <div v-if="busy || streaming" class="s-agent-stream-status">
      <SLogoLoading :size="14" aria-hidden="true" /><span>{{
        t('vs.agent.running')
      }}</span>
    </div>
    <slot :text="revealed" :busy="busy"
      ><span
        v-for="(chunk, index) in chunks"
        :key="index"
        class="t-stream-w is-in s-agent-stream-word"
        >{{ chunk }}</span
      ></slot
    ><span
      v-if="busy || streaming"
      class="s-agent-caret"
      aria-hidden="true"
    /><span class="s-agent-sr-only" role="status">{{
      busy || streaming ? t('vs.agent.running') : t('vs.agent.complete')
    }}</span>
  </div>
</template>
