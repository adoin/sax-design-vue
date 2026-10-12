---
status: implemented
kind: project-specification
updated_at: 2026-10-12
---

# Chat Input 完整输入流程

用户要求补齐模型选择、语音输入、空稿/发送动作切换、真实文件选择和图片预览，并修复附件加入后的布局。

- Chat Input 负责草稿、选定模型、附件集合与事件；模型设置复用 SPopper；具体模型名称、Fast 闪电开关、支持的思考度分开配置。
- 原生选文件复用 SUpload.pick，file-picker=false 允许应用接管。保留原始 File，组件不上传。
- ChatAttachments 负责缩略图与文件卡，复用 SImage 预览，集中清理 Object URL。
- useChatVoice 负责浏览器 SpeechRecognition / webkitSpeechRecognition 与可注入 transcribe 服务，显式点击启动，停止/卸载取消并忽略迟到结果。识别不可用或权限失败有本地化提示。
- 空稿显示语音波形，文字或附件切换发送，loading 保留 Stop。多行与附件使用正常圆角，不恢复方角 API。
- 思考度复用 SSlider 输入与 SProgress bubbles 纹理，支持拖动、键盘和档位点击；只显示模型支持的档位，切换模型自动回退到有效默认值。
- 语音波形读取真实 WebAudio 分析频段；停止、禁用或卸载释放音轨、AudioContext 和帧循环。
- 图片移除按钮位于隔离层顶层，尺寸 26px，避免被缩略图覆盖。
- 双语示例使用真实选择，不再添加假 notes.txt。验证模型选择、文件选择/预览/移除、语音成功和失败/取消/清理、移动布局，以及 Code / Playground。

## 验证

- web / play / vitest 类型检查通过；Agent 组件 40 项测试、文档 21 项检查通过，主题构建通过。
- 浏览器验证具体模型、Fast、思考度键盘与档位切换、能力回退、真实选图/预览/移除及双语 Code / Playground。320px 预览宽度与 scrollWidth 均为 320px。
- 语音识别与实时频段生命周期使用模拟 SpeechRecognition、媒体流和 analyser 验证；未进行真实硬件麦克风录音验收。
