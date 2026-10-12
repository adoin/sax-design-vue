---
description: "支持输入法的聊天输入，提供受控文本、附件、发送与取消。"
PROPS:
  - name: "v-model:fast"
    type: "Boolean"
    description: "Fast 闪电模式；仅支持该能力的模型显示。"
    default: "false"
    usage: "#default"
  - name: "fast"
    type: "Boolean"
    description: "Fast 闪电模式；仅支持该能力的模型显示。"
    default: "false"
    usage: "#default"
  - name: "v-model:reasoning"
    type: "String"
    description: "受控思考度，切换模型时自动回退到有效选项。"
    default: null
    usage: "#default"
  - name: "reasoning"
    type: "String"
    description: "受控思考度，切换模型时自动回退到有效选项。"
    default: null
    usage: "#default"
  - name: "v-model:attachments"
    type: "AgentAttachment[]"
    description: "受控附件。原生 File 保留在 file，图片自动创建预览。"
    default: "[]"
    usage: "#default"
  - name: "v-model:model"
    type: "String"
    description: "受控模型值。"
    default: null
    usage: "#default"
  - name: "model"
    type: "String"
    description: "当前模型值，与 models 的 value 对应。"
    default: null
    usage: "#default"
  - name: "models"
    type: "ChatInputModel[]"
    description: "模型配置：名称、图标、Fast 能力、思考度选项、默认思考度和禁用状态。"
    default: "[]"
    usage: "#default"
  - name: "file-picker"
    type: "Boolean"
    description: "点击加号使用 SUpload.pick。关闭后仅发出 attach，由应用选择文件。"
    default: "true"
    usage: "#default"
  - name: "accept"
    type: "String"
    description: "原生文件选择与选择前校验的文件类型。"
    default: null
    usage: "#default"
  - name: "file-limit-size"
    type: "Number"
    description: "文件大小上限，单位 MB。"
    default: null
    usage: "#default"
  - name: "voice-input"
    type: "Boolean"
    description: "显示语音听写及空草稿语音入口。"
    default: "true"
    usage: "#default"
  - name: "speech-language"
    type: "String"
    description: "语音识别语言，例如 zh-CN；默认使用页面语言。"
    default: null
    usage: "#default"
  - name: "transcribe"
    type: "ChatInputTranscribe"
    description: "自定义转写服务。接收 AbortSignal，返回文字；优先于浏览器语音识别。"
    default: null
    usage: "#default"
  - name: "v-model"
    type: "String"
    description: "受控草稿文本。"
    default: "''"
    usage: "#default"
  - name: "model-value"
    type: "String"
    description: "受控草稿文本。"
    default: "''"
    usage: "#default"
  - name: "attachments"
    type: "AgentAttachment[]"
    description: "受控附件描述。默认内置文件选择与图片预览，上传由应用处理。"
    default: "[]"
    usage: "#default"
  - name: "placeholder"
    type: "String"
    description: "输入提示，默认使用本地化文本。"
    default: null
    usage: "#default"
  - name: "label"
    type: "String"
    description: "无障碍名称，默认使用本地化文本。"
    default: null
    usage: "#default"
  - name: "disabled"
    type: "Boolean"
    description: "禁用组件操作。"
    default: "false"
    usage: "#default"
  - name: "loading"
    type: "Boolean"
    description: "显示忙碌状态并阻止普通操作；聊天输入保留停止入口。"
    default: "false"
    usage: "#default"
  - name: "submit-on-enter"
    type: "Boolean"
    description: "Enter 发送，Shift+Enter 换行；Ctrl/Command+Enter 也可发送，输入法组合事件不会发送。"
    default: "true"
    usage: "#default"
  - name: "max-length"
    type: "Number"
    description: "最大输入长度，传给 STextarea。"
    default: null
    usage: "#default"
EVENTS:
  - name: "update:fast"
    type: "(value: boolean) => void"
    description: "请求切换 Fast 模式。"
  - name: "update:reasoning"
    type: "(value: string) => void"
    description: "请求更新思考度。"
  - name: "update:attachments"
    type: "(attachments: AgentAttachment[]) => void"
    description: "请求更新附件集合。"
  - name: "update:model"
    type: "(model: string) => void"
    description: "请求更新模型值。"
  - name: "files-selected"
    type: "(files: File[]) => void"
    description: "文件选择成功；组件不会上传文件。"
  - name: "file-error"
    type: "(error: unknown) => void"
    description: "文件选择或校验失败。"
  - name: "voice-start"
    type: "() => void"
    description: "语音输入开始。"
  - name: "voice-end"
    type: "() => void"
    description: "语音输入结束或取消。"
  - name: "voice-error"
    type: "(error: unknown) => void"
    description: "语音识别不可用或失败。"
  - name: "update:modelValue"
    type: "(text: string) => void"
    description: "请求更新受控模型。"
  - name: "submit"
    type: "(text: string, attachments: AgentAttachment[]) => void"
    description: "提交有效内容。"
  - name: "stop"
    type: "() => void"
    description: "请求停止当前响应。"
  - name: "attach"
    type: "() => void"
    description: "点击加号时触发。file-picker=false 时由应用接管文件选择。"
  - name: "remove-attachment"
    type: "(attachment: AgentAttachment) => void"
    description: "请求删除所选附件。"
SLOTS:
  - name: "default"
    description: "替换默认内容。"
  - name: "attachments"
    type: "Slot"
    scope: "{ attachments: AgentAttachment[] }"
    description: "自定义附件展示。"
  - name: "tools"
    description: "添加内置模型选择和语音操作之外的输入工具。"
EXPOSES:
  - name: "startVoice"
    type: "() => Promise<void>"
    description: "开始或切换语音输入。"
  - name: "stopVoice"
    type: "() => void"
    description: "停止并取消当前语音输入。"
  - name: "focus"
    type: "() => void"
    description: "组件提供的 focus 接口。"
  - name: "submit"
    type: "() => void"
    description: "组件提供的 submit 接口。"
---

# Chat Input（聊天输入）

<card>

## 基础用法

使用 v-model 控制文本，loading 表示响应处理中。发送不会自动清空草稿。加号打开真实文件选择，使用 v-model:attachments 保存附件；图片可预览、移除。通过 v-model:model 与 models 配置具体模型；用 v-model:fast 控制闪电模式，v-model:reasoning 控制思考度。思考度使用泡泡纹理进度条，支持拖动和键盘操作，仅展示当前生效的强度名称；配置面板仅显示所选模型支持的能力。空草稿显示语音入口，输入文字或添加附件后切换为发送。语音听写由用户点击启动，需要浏览器支持和麦克风权限；也可传入 transcribe 接入自己的服务。Enter 发送、Shift+Enter 换行，输入法组合过程不会发送。

models 使用 ChatInputModel[]：value 是后端模型标识，label 是显示名称，group 配置列表分组。capabilities.fast 声明 Fast 支持；capabilities.reasoning.options 按强度从低到高排列各模型的 value/label，default 指定默认值。不提供 reasoning 时隐藏滑轨并清空思考值；切换模型保留有效选项，否则使用默认值或首项。不支持 Fast 时自动关闭。示例中的能力配置仅用于演示联动，应用应从自己的模型目录获取实际能力。

<template #example><chat-input-default-zh /></template>

<template #template>

@[code{94-109}](../../.vuepress/components/chat-input/default-zh.vue)

</template>

<template #script>

@[code{1-92}](../../.vuepress/components/chat-input/default-zh.vue)

</template>

<template #style>

@[code{111-124}](../../.vuepress/components/chat-input/default-zh.vue)

</template>

</card>
