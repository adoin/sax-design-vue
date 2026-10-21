<script setup lang="ts">
import { computed, defineComponent } from 'vue'
import { resolveExtension } from './file-model'
import type {
  FileManagerPreviewContext,
  FileManagerPreviewRenderer,
} from './types'

const props = defineProps<{
  context: FileManagerPreviewContext
  renderers: FileManagerPreviewRenderer[]
}>()
const renderer = computed(() =>
  props.context.entry.kind === 'file'
    ? props.renderers.find(
        (item) =>
          item.match?.(props.context.entry) ||
          item.extensions?.some(
            (ext) =>
              ext.replace(/^\./, '').toLowerCase() ===
              resolveExtension(props.context.entry),
          ) ||
          item.mimeTypes?.some((mime) =>
            mime.endsWith('/*')
              ? props.context.entry.mimeType?.startsWith(mime.slice(0, -1))
              : mime === props.context.entry.mimeType,
          ),
      )
    : undefined,
)
const RenderPreview = defineComponent({
  setup: () => () => renderer.value?.render(props.context),
})
</script>

<template>
  <div class="s-file-manager__preview" aria-hidden="true">
    <slot
      v-if="context.entry.kind === 'folder'"
      name="folder-preview"
      v-bind="context"
    >
      <svg viewBox="0 0 96 76" class="s-file-manager__folder" fill="none">
        <path
          d="M6 17a7 7 0 0 1 7-7h24l9 10h37a7 7 0 0 1 7 7v36a7 7 0 0 1-7 7H13a7 7 0 0 1-7-7Z"
          fill="currentColor"
          opacity=".6"
        />
        <path
          d="M6 32a6 6 0 0 1 6-6h72a6 6 0 0 1 6 6v31a7 7 0 0 1-7 7H13a7 7 0 0 1-7-7Z"
          fill="currentColor"
        />
      </svg>
    </slot>
    <RenderPreview v-else-if="renderer" />
    <img
      v-else-if="context.entry.thumbnail"
      :src="context.entry.thumbnail"
      alt=""
      loading="lazy"
      draggable="false"
    />
    <template v-else>
      <svg viewBox="0 0 64 76" class="s-file-manager__file" fill="none">
        <path
          d="M10 3h28l16 17v49a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z"
          fill="currentColor"
          opacity=".12"
        />
        <path
          d="M38 3v17h16"
          stroke="currentColor"
          stroke-width="3"
          stroke-linejoin="round"
        />
      </svg>
      <span class="s-file-manager__extension">{{
        resolveExtension(context.entry).slice(0, 8) || 'FILE'
      }}</span>
    </template>
  </div>
</template>
