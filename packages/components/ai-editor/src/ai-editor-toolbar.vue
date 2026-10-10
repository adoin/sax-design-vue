<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { SInput } from '@vuesax-alpha/components/input'
import { SIcon, SLogoLoading } from '@vuesax-alpha/components/icon'
import { useLocale } from '@vuesax-alpha/hooks'
import { segmentEditorText } from './segment-text'
import AiEditorIcon from './ai-editor-icon.vue'
import type {
  AiEditorFormat,
  AiEditorSelection,
  AiEditorSource,
  AiEditorStatus,
} from './ai-editor'

const props = defineProps<{
  asking: boolean
  aiIcon?: string
  prompt: string
  response: string
  error: string
  status: AiEditorStatus
  statusLabel: string
  sources: AiEditorSource[]
  busy: boolean
  selection: AiEditorSelection
  formats: AiEditorFormat[]
  activeFormats: AiEditorFormat[]
  readonly: boolean
  canAsk: boolean
  promptPlaceholder?: string
  animated: boolean
}>()
const emit = defineEmits<{
  'update:prompt': [value: string]
  ask: []
  submit: []
  close: []
  stop: []
  format: [format: AiEditorFormat]
  apply: [mode: 'replace' | 'insert']
  copy: []
  resize: []
}>()
const loading = computed(() => props.busy && !props.response)
const loadingVisible = ref(loading.value)
watch(
  loading,
  (active) => {
    if (active) loadingVisible.value = true
  },
  { flush: 'sync' },
)
watch(loadingVisible, () => nextTick(() => emit('resize')))
const finishLoading = () => {
  if (!loading.value) loadingVisible.value = false
}
const { t } = useLocale()
const icons: Record<AiEditorFormat, string> = {
  bold: 'cb:text-bold',
  italic: 'cb:text-italic',
  underline: 'cb:text-underline',
  strike: 'cb:text-strikethrough',
  code: 'cb:code',
}
const safeSources = computed(() =>
  props.sources.map((source) => ({
    ...source,
    href: /^https?:\/\//i.test(source.href || '') ? source.href : undefined,
  })),
)
const responseWords = computed(() => segmentEditorText(props.response, 'word'))
</script>

<template>
  <div
    class="s-ai-editor__toolbar"
    :class="{ 'is-asking': asking, 'is-static': !animated }"
    @pointerdown.stop
  >
    <div
      class="s-ai-editor__toolbar-row"
      role="toolbar"
      :aria-label="t('vs.aiEditor.toolbar')"
    >
      <template v-if="!asking">
        <button
          type="button"
          class="s-ai-editor__ask"
          :disabled="!canAsk"
          @mousedown.prevent
          @pointerdown.prevent
          @click="emit('ask')"
        >
          <AiEditorIcon :src="aiIcon" :busy="false">
            <slot name="ai-icon" :status="status" :busy="busy" /> </AiEditorIcon
          >{{ t('vs.aiEditor.ask') }}
        </button>
        <span
          v-if="!readonly"
          class="s-ai-editor__divider"
          aria-hidden="true"
        />
        <slot
          name="toolbar"
          :selection="selection"
          :format="(value: AiEditorFormat) => emit('format', value)"
          :active-formats="activeFormats"
        >
          <button
            v-for="format in readonly ? [] : formats"
            :key="format"
            type="button"
            class="s-ai-editor__tool"
            :aria-label="t(`vs.aiEditor.${format}`)"
            :aria-pressed="activeFormats.includes(format)"
            @mousedown.prevent
            @pointerdown.prevent
            @click="emit('format', format)"
          >
            <SIcon :name="icons[format]" />
          </button>
        </slot>
      </template>
      <template v-else>
        <AiEditorIcon :src="aiIcon" :busy="busy">
          <slot name="ai-icon" :status="status" :busy="busy" />
        </AiEditorIcon>
        <SInput
          v-if="status === 'idle' || status === 'error'"
          :model-value="prompt"
          size="small"
          dir="auto"
          :aria-label="t('vs.aiEditor.promptLabel')"
          :placeholder="promptPlaceholder || t('vs.aiEditor.promptPlaceholder')"
          class="s-ai-editor__prompt"
          shape="rounded"
          @update:model-value="emit('update:prompt', String($event ?? ''))"
          @keydown.enter.prevent="emit('submit')"
        />
        <span v-else class="s-ai-editor__query">{{ prompt }}</span>
        <button
          v-if="status === 'idle' || status === 'error'"
          type="button"
          class="s-ai-editor__tool is-submit"
          :disabled="!prompt.trim() || !canAsk"
          :aria-label="t('vs.aiEditor.send')"
          @click="emit('submit')"
        >
          <SIcon name="cb:arrow-right" />
        </button>
        <button
          v-if="busy"
          type="button"
          class="s-ai-editor__tool"
          :aria-label="t('vs.aiEditor.stop')"
          @click="emit('stop')"
        >
          <SIcon name="cb:stop" />
        </button>
      </template>
      <button
        type="button"
        class="s-ai-editor__tool s-ai-editor__close"
        :aria-label="t('vs.aiEditor.close')"
        @mousedown.prevent
        @click="emit('close')"
      >
        <SIcon name="sax:close" />
      </button>
    </div>
    <div
      v-if="loadingVisible"
      class="s-ai-editor__status"
      role="status"
      aria-live="polite"
    >
      <SLogoLoading
        :active="loading"
        size="18"
        shape="rounded"
        :reduced-motion="!animated ? true : undefined"
        stop-behavior="corners"
        @restored="finishLoading"
      />
      <span class="s-ai-editor__shimmer">{{
        statusLabel ||
        t(
          `vs.aiEditor.${status === 'researching' ? 'researching' : 'thinking'}`,
        )
      }}</span>
    </div>
    <div v-if="error" class="s-ai-editor__error" role="alert">{{ error }}</div>
    <div v-if="response" class="s-ai-editor__response" :aria-busy="busy">
      <slot
        name="answer"
        :text="response"
        :status="status"
        :selection="selection"
        :apply="(mode: 'replace' | 'insert') => emit('apply', mode)"
      >
        <p dir="auto">
          <span
            v-for="(word, index) in responseWords"
            :key="index"
            class="s-ai-editor__word"
            >{{ word }}</span
          >
        </p>
      </slot>
      <div v-if="status === 'complete'" class="s-ai-editor__actions">
        <button
          v-if="!readonly"
          type="button"
          @click="emit('apply', 'replace')"
        >
          {{ t('vs.aiEditor.replace') }}
        </button>
        <button v-if="!readonly" type="button" @click="emit('apply', 'insert')">
          {{ t('vs.aiEditor.insert') }}
        </button>
        <button type="button" @click="emit('copy')">
          {{ t('vs.aiEditor.copy') }}
        </button>
      </div>
    </div>
    <div
      v-if="safeSources.length"
      class="s-ai-editor__sources"
      :aria-label="t('vs.aiEditor.sources')"
    >
      <template
        v-for="(source, index) in safeSources"
        :key="`${source.label}-${index}`"
      >
        <a
          v-if="source.href"
          :href="source.href"
          target="_blank"
          rel="noopener noreferrer"
          >{{ source.label }}</a
        >
        <span v-else>{{ source.label }}</span>
      </template>
    </div>
  </div>
</template>
