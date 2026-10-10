---
description: "Selection-based document formatting and AI assistance connected to your own service."
PROPS:
  - name: v-model
    type: "String"
    description: "Plain document text. HTML is treated as literal text."
    default: "''"
    usage: '#default'
  - name: model-value
    type: "String"
    description: "Controlled plain document text."
    default: "''"
    usage: '#default'
  - name: v-model:marks
    type: "AiEditorMark[]"
    description: "Controlled inline ranges. start is inclusive and end exclusive; offsets use UTF-16 code units."
    default: "[]"
    usage: '#formatting'
  - name: marks
    type: "AiEditorMark[]"
    description: "Initial or externally controlled inline formatting ranges."
    default: "[]"
    usage: '#formatting'
  - name: title
    type: "String"
    description: "Optional document heading."
    default: null
    usage: '#default'
  - name: label
    type: "String"
    description: "Accessible document name; falls back to title or the localized document label."
    default: null
    usage: '#default'
  - name: placeholder
    type: "String"
    description: "Hint shown when the document is empty; localized by default."
    default: null
    usage: '#default'
  - name: prompt-placeholder
    type: "String"
    description: "AI prompt hint; localized by default."
    default: null
    usage: '#async-request'
  - name: request
    type: "AiEditorRequestHandler"
    description: "Receives prompt, selection, document, AbortSignal and report(). Return text, an AiEditorResult, or an async iterable of incremental text chunks; Promise results are supported. Takes priority over answer."
    default: null
    usage: '#async-request'
  - name: answer
    type: "String"
    description: "Fixed answer for local previews or predetermined content. Without answer or request, formatting remains available and Ask AI is disabled."
    default: null
    usage: '#default'
  - name: formats
    type: "AiEditorFormat[]"
    values: "bold | italic | underline | strike | code"
    description: "Available toolbar formats and keyboard format commands."
    default: "['bold', 'italic', 'underline', 'strike', 'code']"
    usage: '#formatting'
  - name: readonly
    type: "Boolean"
    values: "true | false"
    description: "Allow selection and AI questions, but block editing, formatting and applying answers."
    default: "false"
    usage: '#shape'
  - name: disabled
    type: "Boolean"
    values: "true | false"
    description: "Disable document interaction and close/cancel the floating assistance session."
    default: "false"
    usage: '#shape'
  - name: shape
    type: "String"
    values: "rounded | square"
    description: "Document and floating toolbar geometry. Inherits the shared shape configuration."
    default: null
    usage: '#shape'
  - name: animate
    type: "Boolean"
    values: "true | false"
    description: "Animate whole-answer reveal and toolbar effects. Reduced-motion preferences are respected."
    default: "true"
    usage: '#streaming'
  - name: stream-interval
    type: "Number"
    values: "milliseconds"
    description: "Reveal step interval for complete string results. Long answers use bounded grapheme batches; async iterable chunks follow their producer's timing. 0 reveals strings immediately."
    default: "18"
    usage: '#streaming'
EVENTS:
  - name: "update:modelValue"
    type: "(text: string) => void"
    description: "Plain text changes."
  - name: "update:marks"
    type: "(marks: AiEditorMark[]) => void"
    description: "Inline formatting changes."
  - name: "selection-change"
    type: "(selection: AiEditorSelection | null) => void"
    description: "Selection changes; null means no selected text."
  - name: "format-change"
    type: "(format: AiEditorFormat, marks: AiEditorMark[]) => void"
    description: "A format command has been applied."
  - name: "request"
    type: "(request: AiEditorRequest) => void"
    description: "A request is submitted. Use the request prop to provide its result."
  - name: "response"
    type: "(result: AiEditorResult) => void"
    description: "The complete answer and its sources."
  - name: "error"
    type: "(error: unknown) => void"
    description: "A request or clipboard operation fails."
  - name: "cancel"
    type: "() => void"
    description: "A pending operation is cancelled."
  - name: "apply"
    type: "(text: string, mode: 'replace' | 'insert') => void"
    description: "Answer text is applied to the document."
EXPOSES:
  - name: focus
    type: "() => void"
    description: "Focus the document."
  - name: select
    type: "(start: number, end: number) => boolean"
    description: "Select a text range and open its toolbar."
  - name: format
    type: "(format: AiEditorFormat) => void"
    description: "Toggle one format on the saved selection."
  - name: ask
    type: "(prompt?: string) => Promise<boolean>"
    description: "Submit a question about the current selection; resolves whether it completed."
  - name: cancel
    type: "() => void"
    description: "Cancel the pending answer and return to prompt entry."
  - name: close
    type: "(restoreFocus?: boolean) => void"
    description: "Close the toolbar and cancel pending work; restoreFocus defaults to false."
  - name: apply
    type: "(mode: 'replace' | 'insert') => boolean"
    description: "Replace selected text or insert after its paragraph with a complete answer."
SLOTS:
  - name: title
    type: Slot
    scope: "{}"
    description: "Document heading."
  - name: toolbar
    type: Slot
    scope: "{ selection: AiEditorSelection; format: (format: AiEditorFormat) => void; activeFormats: AiEditorFormat[] }"
    description: "Custom format actions. Ask AI and close controls remain available."
  - name: answer
    type: Slot
    scope: "{ text: string; status: AiEditorStatus; selection: AiEditorSelection; apply: (mode: 'replace' | 'insert') => void }"
    description: "Custom answer content; built-in answer actions remain available."
---

# AI Editor

<card>

## Default

Edit the document directly or select text to show its floating toolbar. Ctrl/Cmd + B, I and U toggle supported formats; Ctrl/Cmd + Enter opens Ask AI; Escape closes the toolbar. This local example uses a fixed answer and does not call a remote AI service.

<template #example><ai-editor-default /></template>

<template #template>

@[code{16-28}](../.vuepress/components/ai-editor/default.vue)

</template>

<template #script>

@[code{1-14}](../.vuepress/components/ai-editor/default.vue)

</template>

<template #style>

@[code{30-39}](../.vuepress/components/ai-editor/default.vue)

</template>

</card>

<card>

## Formatting

Bind both v-model and v-model:marks to persist plain text and formatting independently. Formats may overlap. Toolbar actions preserve the selection, and Ctrl/Cmd + Z / Shift + Z undo and redo edits. Ranges refer to the current text using UTF-16 indices.

<template #example><ai-editor-formatting /></template>

<template #template>

@[code{11-29}](../.vuepress/components/ai-editor/formatting.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/ai-editor/formatting.vue)

</template>

<template #style>

@[code{31-46}](../.vuepress/components/ai-editor/formatting.vue)

</template>

</card>

<card>

## Async request

Provide request to connect your own AI service. Its context includes the prompt, selected text, complete document, a cancellation signal and report() for progress labels and sources. Errors remain visible for retry. Closing, stopping or changing the document cancels the session and ignores late results. This example uses a local Promise to demonstrate loading, sources and failure.

<template #example><ai-editor-request /></template>

<template #template>

@[code{30-45}](../.vuepress/components/ai-editor/request.vue)

</template>

<template #script>

@[code{1-28}](../.vuepress/components/ai-editor/request.vue)

</template>

<template #style>

@[code{47-59}](../.vuepress/components/ai-editor/request.vue)

</template>

</card>

<card>

## Streaming

Return an `AsyncIterable<string>` for incremental chunks; the component appends each chunk without duplicating it. Complete string results can also reveal progressively with `stream-interval`. Stop aborts the request, and applications should pass `signal` to their fetch or stream reader. Finished answers can replace the selection, insert after the current paragraph, or be copied.

<template #example><ai-editor-streaming /></template>

<template #template>

@[code{21-33}](../.vuepress/components/ai-editor/streaming.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/ai-editor/streaming.vue)

</template>

<template #style>

@[code{35-44}](../.vuepress/components/ai-editor/streaming.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry with matching floating controls. Readonly documents still support selection and AI questions; disabled documents do not start an assistance session. The shared SConfigProvider shape default applies when shape is omitted.

<template #example><ai-editor-shape /></template>

<template #template>

@[code{15-40}](../.vuepress/components/ai-editor/shape.vue)

</template>

<template #script>

@[code{1-13}](../.vuepress/components/ai-editor/shape.vue)

</template>

<template #style>

@[code{42-63}](../.vuepress/components/ai-editor/shape.vue)

</template>

</card>

<card>

## Slots

Use toolbar for focused format actions and answer for custom answer presentation. The slot scope contains the selection and component-owned commands so examples do not need to reimplement range manipulation or request state.

<template #example><ai-editor-slots /></template>

<template #template>

@[code{10-22}](../.vuepress/components/ai-editor/slots.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/ai-editor/slots.vue)

</template>

</card>
