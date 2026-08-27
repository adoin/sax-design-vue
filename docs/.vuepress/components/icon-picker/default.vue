<script lang="ts" setup>
import { computed, shallowRef, useTemplateRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import { useRoute } from 'vue-router'
import { SIconPicker } from 'sax-design-vue'

const route = useRoute()
const { locale } = useLocale()
const editorRef = useTemplateRef<HTMLElement>('editorRef')
const savedRange = shallowRef<Range>()
const isZh = computed(() => route.path.startsWith('/zh/'))

const rememberSelection = () => {
  const selection = window.getSelection()
  const range = selection?.rangeCount ? selection.getRangeAt(0) : undefined
  if (range && editorRef.value?.contains(range.commonAncestorContainer)) {
    savedRange.value = range.cloneRange()
  }
}

const insertSvg = (svg: string) => {
  const editor = editorRef.value
  if (!editor) return

  const range = savedRange.value || document.createRange()
  if (!savedRange.value) {
    range.selectNodeContents(editor)
    range.collapse(false)
  }

  const fragment = range.createContextualFragment(svg)
  const lastNode = fragment.lastChild
  range.deleteContents()
  range.insertNode(fragment)

  if (lastNode) {
    range.setStartAfter(lastNode)
    range.collapse(true)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
    savedRange.value = range.cloneRange()
  }
  editor.focus()
}

const openPicker = async () => {
  const svg = await SIconPicker({
    locale: locale.value,
    title: isZh.value ? '插入图标' : 'Insert icon',
    color: '#5667F4',
    size: 28,
    showAlpha: true,
    predefine: [
      { name: isZh.value ? '品牌蓝' : 'Brand blue', value: '#5667F4' },
      { name: isZh.value ? '成功' : 'Success', value: '#19A873' },
      { name: isZh.value ? '警告' : 'Warning', value: '#E8792E' },
    ],
  })
  if (svg) insertSvg(svg)
}
</script>

<template>
  <div class="rich-editor-demo">
    <div class="rich-editor-toolbar">
      <s-button type="flat" @mousedown="rememberSelection" @click="openPicker">
        <s-icon name="cb:add" />
        {{ isZh ? '插入图标' : 'Insert icon' }}
      </s-button>
      <span>{{
        isZh ? '将光标放在正文中再插入' : 'Place the caret before inserting'
      }}</span>
    </div>
    <div
      ref="editorRef"
      class="rich-editor-content"
      contenteditable="true"
      role="textbox"
      aria-multiline="true"
      :aria-label="isZh ? '富文本编辑器' : 'Rich text editor'"
      @focus="rememberSelection"
      @keyup="rememberSelection"
      @mouseup="rememberSelection"
    >
      <p v-if="isZh">这是一个可编辑段落。把光标放在任意位置，然后插入图标。</p>
      <p v-else>
        This paragraph is editable. Place the caret anywhere, then insert an
        icon.
      </p>
    </div>
  </div>
</template>

<style scoped>
.rich-editor-demo {
  width: min(680px, 100%);
  margin: auto;
  overflow: hidden;
  border-radius: 16px;
  background: var(--sax-theme-bg);
  box-shadow: 0 14px 34px rgb(37 52 91 / 10%);
}

.rich-editor-toolbar {
  display: flex;
  min-height: 52px;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: var(--sax-theme-bg2);
  box-shadow: 0 1px 0 rgb(55 72 120 / 10%);
}

.rich-editor-toolbar :deep(.s-button__content) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.rich-editor-toolbar > span {
  color: rgb(80 97 132 / 80%);
  font-size: 12px;
}

.rich-editor-content {
  min-height: 148px;
  padding: 22px;
  color: var(--sax-theme-color);
  font-size: 15px;
  line-height: 1.8;
  outline: 0;
}

.rich-editor-content:focus {
  box-shadow: 0 0 0 2px rgb(86 103 244 / 18%) inset;
}

.rich-editor-content p {
  margin: 0;
}

.rich-editor-content :deep(svg) {
  display: inline-block;
  margin: 0 4px;
  vertical-align: -0.18em;
}
</style>
