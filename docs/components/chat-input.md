---
description: "An IME-safe composer with controlled text, attachments, sending and cancellation."
PROPS:
  - name: "v-model:fast"
    type: "Boolean"
    description: "Fast mode, shown only for models that support it."
    default: "false"
    usage: "#default"
  - name: "fast"
    type: "Boolean"
    description: "Fast mode, shown only for models that support it."
    default: "false"
    usage: "#default"
  - name: "v-model:reasoning"
    type: "String"
    description: "Controlled reasoning effort; switching models falls back to a supported option."
    default: null
    usage: "#default"
  - name: "reasoning"
    type: "String"
    description: "Controlled reasoning effort; switching models falls back to a supported option."
    default: null
    usage: "#default"
  - name: "v-model:attachments"
    type: "AgentAttachment[]"
    description: "Controlled attachments. Raw File objects stay in file and images receive previews."
    default: "[]"
    usage: "#default"
  - name: "v-model:model"
    type: "String"
    description: "Controlled model value."
    default: null
    usage: "#default"
  - name: "model"
    type: "String"
    description: "Selected value matching models entries."
    default: null
    usage: "#default"
  - name: "models"
    type: "ChatInputModel[]"
    description: "Model options with labels, image icon URLs and disabled entries."
    default: "[]"
    usage: "#default"
  - name: "file-picker"
    type: "Boolean"
    description: "Use SUpload.pick on the add action. Disable to handle selection through attach."
    default: "true"
    usage: "#default"
  - name: "accept"
    type: "String"
    description: "Accepted file types for native selection and validation."
    default: null
    usage: "#default"
  - name: "file-limit-size"
    type: "Number"
    description: "Maximum file size in MB."
    default: null
    usage: "#default"
  - name: "voice-input"
    type: "Boolean"
    description: "Show dictation and the empty-draft voice action."
    default: "true"
    usage: "#default"
  - name: "speech-language"
    type: "String"
    description: "Recognition language such as en-US; defaults to the page language."
    default: null
    usage: "#default"
  - name: "transcribe"
    type: "ChatInputTranscribe"
    description: "Custom transcription service receiving an AbortSignal and returning text; overrides browser recognition."
    default: null
    usage: "#default"
  - name: "v-model"
    type: "String"
    description: "Controlled draft text."
    default: "''"
    usage: "#default"
  - name: "model-value"
    type: "String"
    description: "Controlled draft text."
    default: "''"
    usage: "#default"
  - name: "attachments"
    type: "AgentAttachment[]"
    description: "Controlled attachments with native picking and image previews. Applications own upload requests."
    default: "[]"
    usage: "#default"
  - name: "placeholder"
    type: "String"
    description: "Input hint with a localized default."
    default: null
    usage: "#default"
  - name: "label"
    type: "String"
    description: "Accessible name, with a localized default."
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "Disable component actions."
    default: "false"
    usage: "#default"
  - name: "loading"
    type: "Boolean"
    description: "Show busy feedback and block normal actions. Chat Input keeps Stop available."
    default: "false"
    usage: "#default"
  - name: "submit-on-enter"
    type: "Boolean"
    description: "Enter sends, Shift+Enter inserts a newline. Ctrl/Command+Enter also sends. Composition events never send."
    default: "true"
    usage: "#default"
  - name: "max-length"
    type: "Number"
    description: "Maximum input length, forwarded to STextarea."
    default: null
    usage: "#default"
EVENTS:
  - name: "update:fast"
    type: "(value: boolean) => void"
    description: "Requests a Fast mode change."
  - name: "update:reasoning"
    type: "(value: string) => void"
    description: "Requests a reasoning effort change."
  - name: "update:attachments"
    type: "(attachments: AgentAttachment[]) => void"
    description: "Request an attachment update."
  - name: "update:model"
    type: "(model: string) => void"
    description: "Request a model change."
  - name: "files-selected"
    type: "(files: File[]) => void"
    description: "Native selection succeeded; the component does not upload files."
  - name: "file-error"
    type: "(error: unknown) => void"
    description: "File picking or validation failed."
  - name: "voice-start"
    type: "() => void"
    description: "Voice input started."
  - name: "voice-end"
    type: "() => void"
    description: "Voice input ended or was cancelled."
  - name: "voice-error"
    type: "(error: unknown) => void"
    description: "Recognition is unavailable or failed."
  - name: "update:modelValue"
    type: "(text: string) => void"
    description: "Controlled model update requested."
  - name: "submit"
    type: "(text: string, attachments: AgentAttachment[]) => void"
    description: "Validated content submitted."
  - name: "stop"
    type: "() => void"
    description: "Stop the active response."
  - name: "attach"
    type: "() => void"
    description: "Emitted on the add action. Set file-picker=false to provide your own picker."
  - name: "remove-attachment"
    type: "(attachment: AgentAttachment) => void"
    description: "Remove the selected attachment."
SLOTS:
  - name: "default"
    description: "Replace the default content."
  - name: "attachments"
    type: "Slot"
    scope: "{ attachments: AgentAttachment[] }"
    description: "Customize attachment presentation."
  - name: "tools"
    description: "Add tools alongside built-in model selection and voice input."
EXPOSES:
  - name: "startVoice"
    type: "() => Promise<void>"
    description: "Start or toggle voice input."
  - name: "stopVoice"
    type: "() => void"
    description: "Stop and cancel current voice input."
  - name: "focus"
    type: "() => void"
    description: "Component-owned focus access."
  - name: "submit"
    type: "() => void"
    description: "Component-owned submit access."
---

# Chat Input

<card>

## Default

Use v-model for text and loading for an active response. Sending does not clear the draft automatically. The add action opens a native file picker. Bind v-model:attachments for image previews and removal, and v-model:model with models for concrete model profiles. Bind v-model:fast for the lightning toggle and v-model:reasoning for reasoning effort. The settings panel shows supported capabilities; its bubbles-textured progress track supports dragging, keyboard control, and clickable levels. Empty drafts show Voice; text or attachments switch to Send. Dictation requires browser support and microphone permission, or you can provide transcribe for your own service. Enter sends, Shift+Enter inserts a newline, and IME composition never sends.

<template #example><chat-input-default /></template>

<template #template>

@[code{53-68}](../.vuepress/components/chat-input/default.vue)

</template>

<template #script>

@[code{1-51}](../.vuepress/components/chat-input/default.vue)

</template>

<template #style>

@[code{70-83}](../.vuepress/components/chat-input/default.vue)

</template>

</card>
