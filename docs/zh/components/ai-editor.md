---
description: "围绕文档选区提供格式操作与可接入 AI 服务的辅助编辑。"
PROPS:
  - name: v-model
    type: "String"
    description: "文档纯文本，HTML 按普通文字处理。"
    default: "''"
    usage: '#default'
  - name: model-value
    type: "String"
    description: "受控的文档纯文本。"
    default: "''"
    usage: '#default'
  - name: v-model:marks
    type: "AiEditorMark[]"
    description: "受控行内格式范围。start 包含、end 不包含，位置使用 UTF-16 索引。"
    default: "[]"
    usage: '#formatting'
  - name: marks
    type: "AiEditorMark[]"
    description: "初始或外部控制的行内格式范围。"
    default: "[]"
    usage: '#formatting'
  - name: title
    type: "String"
    description: "可选的文档标题。"
    default: null
    usage: '#default'
  - name: label
    type: "String"
    description: "文档的可访问名称，默认使用 title 或本地化的文档名称。"
    default: null
    usage: '#default'
  - name: placeholder
    type: "String"
    description: "正文为空时的提示，默认使用本地化文案。"
    default: null
    usage: '#default'
  - name: prompt-placeholder
    type: "String"
    description: "AI 提问输入框提示，默认使用本地化文案。"
    default: null
    usage: '#async-request'
  - name: request
    type: "AiEditorRequestHandler"
    description: "接收提问、选区、文档、AbortSignal 和 report()。可返回文本、AiEditorResult 或增量文本块的异步迭代器，也支持 Promise。优先于 answer。"
    default: null
    usage: '#async-request'
  - name: answer
    type: "String"
    description: "用于本地预览或固定内容的回答。未配置 answer 或 request 时，格式操作可用，AI 提问不可用。"
    default: null
    usage: '#default'
  - name: formats
    type: "AiEditorFormat[]"
    values: "bold | italic | underline | strike | code"
    description: "工具栏可用的格式及格式快捷键。"
    default: "['bold', 'italic', 'underline', 'strike', 'code']"
    usage: '#formatting'
  - name: readonly
    type: "Boolean"
    values: "true | false"
    description: "允许选区和 AI 提问，阻止编辑、格式修改和应用回答。"
    default: "false"
    usage: '#shape'
  - name: disabled
    type: "Boolean"
    values: "true | false"
    description: "禁用文档交互，并关闭、取消浮动辅助会话。"
    default: "false"
    usage: '#shape'
  - name: shape
    type: "String"
    values: "rounded | square"
    description: "文档及浮动工具栏的外形，继承共享外形配置。"
    default: null
    usage: '#shape'
  - name: animate
    type: "Boolean"
    values: "true | false"
    description: "启用完整回答的逐步显示和工具栏动效，遵循减少动态效果偏好。"
    default: "true"
    usage: '#streaming'
  - name: stream-interval
    type: "Number"
    values: "milliseconds"
    description: "完整字符串回答的逐步显示间隔，长回答按字素分批显示以限制动画开销。异步迭代器遵循提供方的块输出节奏。0 立即显示完整字符串。"
    default: "18"
    usage: '#streaming'
EVENTS:
  - name: "update:modelValue"
    type: "(text: string) => void"
    description: "纯文本发生变化。"
  - name: "update:marks"
    type: "(marks: AiEditorMark[]) => void"
    description: "行内格式发生变化。"
  - name: "selection-change"
    type: "(selection: AiEditorSelection | null) => void"
    description: "选区发生变化，null 表示未选中文字。"
  - name: "format-change"
    type: "(format: AiEditorFormat, marks: AiEditorMark[]) => void"
    description: "执行格式命令后触发。"
  - name: "request"
    type: "(request: AiEditorRequest) => void"
    description: "提交 AI 请求时触发，通过 request 属性提供返回结果。"
  - name: "response"
    type: "(result: AiEditorResult) => void"
    description: "回答完成后返回完整文本和来源。"
  - name: "error"
    type: "(error: unknown) => void"
    description: "请求或复制操作失败。"
  - name: "cancel"
    type: "() => void"
    description: "取消进行中的操作。"
  - name: "apply"
    type: "(text: string, mode: 'replace' | 'insert') => void"
    description: "将回答应用到文档后触发。"
EXPOSES:
  - name: focus
    type: "() => void"
    description: "聚焦文档。"
  - name: select
    type: "(start: number, end: number) => boolean"
    description: "选中文本范围并打开工具栏。"
  - name: format
    type: "(format: AiEditorFormat) => void"
    description: "在保存的选区中切换指定格式。"
  - name: ask
    type: "(prompt?: string) => Promise<boolean>"
    description: "针对当前选区提交问题，返回是否完成。"
  - name: cancel
    type: "() => void"
    description: "取消当前回答并返回提问输入状态。"
  - name: close
    type: "(restoreFocus?: boolean) => void"
    description: "关闭工具栏并取消进行中的操作，restoreFocus 默认为 false。"
  - name: apply
    type: "(mode: 'replace' | 'insert') => boolean"
    description: "使用完整回答替换选区，或插入选区所在段落下方。"
SLOTS:
  - name: title
    type: Slot
    scope: "{}"
    description: "文档标题。"
  - name: toolbar
    type: Slot
    scope: "{ selection: AiEditorSelection; format: (format: AiEditorFormat) => void; activeFormats: AiEditorFormat[] }"
    description: "自定义格式操作，保留 AI 提问和关闭入口。"
  - name: answer
    type: Slot
    scope: "{ text: string; status: AiEditorStatus; selection: AiEditorSelection; apply: (mode: 'replace' | 'insert') => void }"
    description: "自定义回答内容，保留内置的回答操作。"
---

# AI Editor AI编辑器

<card>

## 默认

可直接编辑正文，或选中文字打开浮动工具栏。Ctrl/Cmd + B、I、U 切换支持的格式，Ctrl/Cmd + Enter 打开 AI 提问，Escape 关闭工具栏。本地示例使用固定回答，不调用远程 AI 服务。

<template #example><ai-editor-zh-default /></template>

<template #template>

@[code{16-26}](../../.vuepress/components/ai-editor-zh/default.vue)

</template>

<template #script>

@[code{1-14}](../../.vuepress/components/ai-editor-zh/default.vue)

</template>

<template #style>

@[code{28-37}](../../.vuepress/components/ai-editor-zh/default.vue)

</template>

</card>

<card>

## 行内格式

同时绑定 v-model 和 v-model:marks，可分别持久化正文与格式。格式可以重叠，工具栏操作会保留选区，Ctrl/Cmd + Z / Shift + Z 可撤销、重做编辑。格式范围使用当前正文的 UTF-16 索引。

<template #example><ai-editor-zh-formatting /></template>

<template #template>

@[code{9-25}](../../.vuepress/components/ai-editor-zh/formatting.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/ai-editor-zh/formatting.vue)

</template>

<template #style>

@[code{27-42}](../../.vuepress/components/ai-editor-zh/formatting.vue)

</template>

</card>

<card>

## 异步请求

通过 request 接入自己的 AI 服务。上下文包含问题、选中文字、完整文档、取消信号，以及更新进度文案和来源的 report()。失败后保留错误提示以便重试，关闭、停止或修改文档会取消会话，并忽略迟到的结果。此示例通过本地 Promise 展示加载、来源和失败状态。

<template #example><ai-editor-zh-request /></template>

<template #template>

@[code{28-43}](../../.vuepress/components/ai-editor-zh/request.vue)

</template>

<template #script>

@[code{1-26}](../../.vuepress/components/ai-editor-zh/request.vue)

</template>

<template #style>

@[code{45-57}](../../.vuepress/components/ai-editor-zh/request.vue)

</template>

</card>

<card>

## 流式回答

返回 `AsyncIterable<string>` 可逐块输出增量文本，组件按顺序追加而不重复。完整字符串也可通过 `stream-interval` 逐步显示。停止会中止请求，应用应将 `signal` 传给 fetch 或流读取器。回答完成后可替换选区、插入当前段落下方，或复制。

<template #example><ai-editor-zh-streaming /></template>

<template #template>

@[code{19-31}](../../.vuepress/components/ai-editor-zh/streaming.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/ai-editor-zh/streaming.vue)

</template>

<template #style>

@[code{33-42}](../../.vuepress/components/ai-editor-zh/streaming.vue)

</template>

</card>

<card>

## 外形与状态

对比圆角与直角外形及其对应的浮动控件。只读文档仍可选区和提问，禁用文档不会打开辅助会话。未设置 shape 时继承 SConfigProvider 的共享外形默认值。

<template #example><ai-editor-zh-shape /></template>

<template #template>

@[code{10-35}](../../.vuepress/components/ai-editor-zh/shape.vue)

</template>

<template #script>

@[code{1-8}](../../.vuepress/components/ai-editor-zh/shape.vue)

</template>

<template #style>

@[code{37-58}](../../.vuepress/components/ai-editor-zh/shape.vue)

</template>

</card>

<card>

## 自定义插槽

通过 toolbar 精简格式操作，通过 answer 自定义回答展示。插槽提供选区和组件命令，无需重新实现选区修改或请求状态。

<template #example><ai-editor-zh-slots /></template>

<template #template>

@[code{7-19}](../../.vuepress/components/ai-editor-zh/slots.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/ai-editor-zh/slots.vue)

</template>

</card>
