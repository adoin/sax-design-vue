<script setup lang="ts">
import { onBeforeUnmount, shallowRef, watch } from 'vue'
import { SImage } from '@vuesax-alpha/components/images'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale } from '@vuesax-alpha/hooks'
import type { AgentAttachment } from '../../ai-editor/src/agent-shared/types'
const props = defineProps<{
  attachments: AgentAttachment[]
  disabled: boolean
}>()
const emit = defineEmits<{ remove: [attachment: AgentAttachment] }>()
const { t } = useLocale()
const isImage = (item: AgentAttachment) =>
  (item.type || item.file?.type || '').startsWith('image/') ||
  /\.(png|jpe?g|gif|webp|avif|svg)$/i.test(item.name)
const urls = shallowRef(new Map<File, string>())
watch(
  () => props.attachments,
  (items) => {
    const next = new Map<File, string>()
    for (const item of items)
      if (
        typeof window !== 'undefined' &&
        item.file &&
        !item.url &&
        isImage(item)
      )
        next.set(
          item.file,
          next.get(item.file) ??
            urls.value.get(item.file) ??
            URL.createObjectURL(item.file),
        )
    for (const [file, url] of urls.value)
      if (!next.has(file)) URL.revokeObjectURL(url)
    urls.value = next
  },
  { immediate: true, deep: true },
)
onBeforeUnmount(() => {
  for (const url of urls.value.values()) URL.revokeObjectURL(url)
})
const preview = (item: AgentAttachment) =>
  isImage(item)
    ? item.url || (item.file ? urls.value.get(item.file) : undefined)
    : undefined
</script>
<template>
  <div class="s-chat-input__attachments">
    <div
      v-for="attachment in attachments"
      :key="attachment.id"
      class="s-chat-input__attachment"
    >
      <SImage
        v-if="preview(attachment)"
        :src="preview(attachment)"
        :alt="attachment.name"
        width="72"
        height="64"
        fit="cover"
        preview
      />
      <div v-else class="s-chat-input__file-icon">
        <SIcon name="cb:document" :size="28" />
      </div>
      <span :title="attachment.name">{{ attachment.name }}</span>
      <button
        type="button"
        class="s-agent-control s-chat-input__remove"
        :disabled="disabled || attachment.disabled"
        :aria-label="t('vs.agent.removeFile', { name: attachment.name })"
        @click="emit('remove', attachment)"
      >
        <SIcon name="cb:close" :size="20" />
      </button>
    </div>
  </div>
</template>
