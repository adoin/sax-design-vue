<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'
import { resolveExtension } from './file-model'
import FileGlyph from './file-glyph.vue'
import type {
  FileManagerGraphic,
  FileManagerPreviewContext,
  FileManagerPreviewRenderer,
} from './types'

const props = defineProps<{
  context: FileManagerPreviewContext
  renderers: FileManagerPreviewRenderer[]
  graphic?: FileManagerGraphic
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
const renderDefault = () =>
  h(FileGlyph, { kind: props.context.entry.kind, graphic: props.graphic })
</script>

<template>
  <div class="s-file-manager__preview" aria-hidden="true">
    <slot
      v-if="context.entry.kind === 'folder'"
      name="folder-preview"
      v-bind="{ ...context, renderDefault }"
      ><FileGlyph kind="folder" :graphic="graphic"
    /></slot>
    <RenderPreview v-else-if="renderer" />
    <FileGlyph
      v-else
      kind="file"
      :extension="resolveExtension(context.entry)"
      :graphic="
        graphic ||
        (context.entry.thumbnail ? { src: context.entry.thumbnail } : undefined)
      "
    />
  </div>
</template>
