<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'
import { SButton } from '@vuesax-alpha/components/button'

import { fileDiffEmits, fileDiffProps } from './file-diff'

defineOptions({ name: 'SFileDiff' })
const props = defineProps(fileDiffProps)
const emit = defineEmits(fileDiffEmits)
const ns = useNamespace('file-diff')
const shape = useShape()
const { t } = useLocale()
const added = computed(
  () => props.lines.filter((line) => line.type === 'add').length,
)
const removed = computed(
  () => props.lines.filter((line) => line.type === 'remove').length,
)
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
        {{ filename }}
        <span aria-hidden="true">{{ expanded ? '−' : '+' }}</span></button
      ><span class="s-agent-added">+{{ added }}</span
      ><span class="s-agent-removed">−{{ removed }}</span>
    </figcaption>
    <Transition name="s-agent-reveal"
      ><div v-if="expanded" class="s-agent-code-scroll">
        <div
          v-for="(line, index) in lines"
          :key="index"
          :class="['s-agent-code-line', `is-${line.type}`]"
        >
          <span class="s-agent-line-number" aria-hidden="true">{{
            line.oldLine
          }}</span
          ><span class="s-agent-line-number" aria-hidden="true">{{
            line.newLine
          }}</span
          ><span class="s-agent-diff-symbol">{{
            line.type === 'add' ? '+' : line.type === 'remove' ? '−' : ' '
          }}</span
          ><code>{{ line.content }}</code>
        </div>
      </div></Transition
    >
    <slot name="actions"
      ><div class="s-agent-actions">
        <SButton :shape="shape" :disabled="disabled" @click="emit('apply')">{{
          t('vs.agent.apply')
        }}</SButton
        ><SButton
          type="flat"
          :shape="shape"
          :disabled="disabled"
          @click="emit('reject')"
          >{{ t('vs.agent.reject') }}</SButton
        >
      </div></slot
    >
  </figure>
</template>
