<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'

import { useAgentCopy } from '../../ai-editor/src/agent-shared/use-copy'
import { downloadAgentText } from '../../ai-editor/src/agent-shared/utils'
import { codeBlockEmits, codeBlockProps } from './code-block'
import { tokenizeAgentCode } from './tokenize-code'
defineOptions({ name: 'SCodeBlock' })
const props = defineProps(codeBlockProps)
const emit = defineEmits(codeBlockEmits)
const ns = useNamespace('code-block')
const shape = useShape()
const { t } = useLocale()
const lines = computed(() => tokenizeAgentCode(props.code, props.language))
const { copied, copy } = useAgentCopy(
  () => props.code,
  () => emit('copy'),
  (error) => emit('copy-error', error),
)
const downloadCode = () => {
  downloadAgentText(props.code, props.filename || `code.${props.language}`)
  emit('download')
}
defineExpose({ copy, download: downloadCode })
</script>

<template>
  <figure :class="[ns.b(), 's-agent-surface', `is-${shape}`]">
    <figcaption class="s-agent-heading">
      <button
        type="button"
        class="s-agent-control s-agent-text-button"
        :aria-expanded="expanded"
        @click="emit('update:expanded', !expanded)"
      >
        {{ filename || language }}
        <span aria-hidden="true">{{ expanded ? '−' : '+' }}</span>
      </button>
      <div class="s-agent-actions">
        <SButton type="flat" :shape="shape" @click="copy">{{
          copied ? t('vs.agent.copied') : t('vs.agent.copy')
        }}</SButton
        ><SButton
          v-if="download"
          type="flat"
          :shape="shape"
          @click="downloadCode"
          >{{ t('vs.agent.download') }}</SButton
        ><slot name="actions" :copy="copy" :download="downloadCode" />
      </div>
    </figcaption>
    <Transition name="s-agent-reveal"
      ><div v-if="expanded" class="s-agent-code-scroll">
        <div
          v-for="(line, index) in lines"
          :key="index"
          class="s-agent-code-line"
        >
          <span
            v-if="lineNumbers"
            class="s-agent-line-number"
            aria-hidden="true"
            >{{ index + 1 }}</span
          ><code
            ><slot name="line" :line="line" :index="index"
              ><span
                v-for="(token, i) in line"
                :key="i"
                :class="token.kind && `s-agent-token-${token.kind}`"
                >{{ token.text }}</span
              ></slot
            ></code
          >
        </div>
      </div></Transition
    ><span class="s-agent-sr-only" role="status">{{
      copied ? t('vs.agent.copied') : ''
    }}</span>
  </figure>
</template>
