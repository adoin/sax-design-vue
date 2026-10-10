---
description: "Safe code presentation with lexical highlighting, copying, downloading and disclosure."
PROPS:
  - name: "code"
    type: "String"
    description: "Plain source code. HTML is rendered as literal text."
    default: "''"
    usage: "#default"
  - name: "filename"
    type: "String"
    description: "Filename shown in the header; also used for code downloads."
    default: null
    usage: "#default"
  - name: "language"
    type: "String"
    description: "Lexical highlighting for js, jsx, ts, tsx, javascript, typescript, python and json. Other languages render as plain text; use the line slot for a full highlighter."
    default: "text"
    usage: "#default"
  - name: "line-numbers"
    type: "Boolean"
    description: "Show visual line numbers; copied content excludes them."
    default: "true"
    usage: "#default"
  - name: "v-model:expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "true"
    usage: "#default"
  - name: "expanded"
    type: "Boolean"
    description: "Controlled disclosure state. Use v-model:expanded to respond to toggles."
    default: "true"
    usage: "#default"
  - name: "download"
    type: "Boolean"
    description: "Show the local text-file download action."
    default: "true"
    usage: "#default"
  - name: "shape"
    type: "'rounded' | 'square'"
    description: "Geometry resolved from the component and SConfigProvider."
    default: null
    usage: "#shape"
EVENTS:
  - name: "update:expanded"
    type: "(value: boolean) => void"
    description: "Disclosure toggle requested."
  - name: "copy"
    type: "() => void"
    description: "Clipboard write succeeded."
  - name: "copy-error"
    type: "(error: unknown) => void"
    description: "Clipboard write failed."
  - name: "download"
    type: "() => void"
    description: "Download action requested; image results provide their URL."
SLOTS:
  - name: "actions"
    type: "{ copy: () => Promise<void>; download: () => void }"
    description: "Customize the action row."
  - name: "line"
    type: "{ line: AgentCodeToken[]; index: number }"
    description: "Customize one safely tokenized source line."
EXPOSES:
  - name: "copy"
    type: "() => Promise<void>"
    description: "Component-owned copy access."
  - name: "download"
    type: "() => void"
    description: "Component-owned download access."
---

# Code Block

<card>

## Default

Copy preserves exact source text and line breaks. Download creates a local text file. The built-in lexical highlighter is intentionally lightweight; the line slot can integrate a dedicated language highlighter. Clipboard failure emits copy-error.

<template #example><code-block-default /></template>

<template #template>

@[code{8-17}](../.vuepress/components/code-block/default.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/code-block/default.vue)

</template>

<template #style>

@[code{19-32}](../.vuepress/components/code-block/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry side by side. Both previews share controlled state so the same content and actions can be compared. Omitting shape follows the global configuration.

<template #example><code-block-shape /></template>

<template #template>

@[code{8-31}](../.vuepress/components/code-block/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/code-block/shape.vue)

</template>

<template #style>

@[code{33-52}](../.vuepress/components/code-block/shape.vue)

</template>

</card>
