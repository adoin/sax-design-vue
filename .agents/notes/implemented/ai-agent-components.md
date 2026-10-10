---
status: implemented
kind: project-specification
updated_at: 2026-10-10
completed_at: 2026-10-10
modules:
  - packages/components
  - packages/theme-chalk/src
  - docs/.vuepress/app/component-categories.ts
  - docs/components
  - docs/zh/components
supersedes: []
---

# AI 相关的 Agent 组件

## 项目目的

在 Sax Design Vue 的“AI相关”组件组中提供可组合、可复用的 Agent 交互组件，参考 Kobra 公开展示的交互与动画，同时保持 Sax 已有的设计语言、组件架构和文档体验。

## 用户原始要求

> 提交一次代码，然后接下来要做一组新功能开发，主要是吸纳[https://kobra.systems  ](https://kobra.systems)先把当前轮播图加一种[https://kobra.systems/components/carousel](https://kobra.systems/components/carousel) 一样的展示。 然后在当前除了 数据展示 数据录入 反馈等等之外，增加一个新的组件组“AI相关” 而后先复刻第一个[https://kobra.systems/components/ai-editor](https://kobra.systems/components/ai-editor)

> 然后[https://kobra.systems/](https://kobra.systems/) 还有这些Agents下面的各种业务组件也都放到AI相关中去，并且注意一点这里面的很多内容并不符合当前项目的设计风格，要保留当前项目的风格，对交互和动画等进行吸纳，对样式进行增量但保留 ：没有border 用gap和shadow布局。  并且圆角等多使用全局变量，阴影数值等也都尽量用已有的

## 范围解释与验收要求

用户所附 Agents 导航图片对应以下 13 个组件，全部属于批准的开发范围：

1. Reasoning Steps
2. Chat History
3. File Diff
4. Image Generation
5. Streaming Text
6. Inline Citations
7. Code Block
8. Task List
9. Chat Input
10. Plan Card
11. Question Card
12. Message
13. Message Scroller

- 每个组件必须具有真实可用的通用交互、受控数据接口、适当的事件与插槽，不能只添加导航或静态占位演示。
- 参考网站公开预览的行为和动画；以 Sax 组件体系独立实现，不引入参考项目的 React 实现，不绕过付费源码访问限制。
- 采用无边框设计，以 gap、现有阴影和层级组织内容；圆角尽量使用全局变量，阴影优先使用已有变量。不得引入硬边框、outline 或 ring shadow 作为普通容器和焦点反馈。
- 保持语义颜色、深浅主题、键盘交互、合理焦点反馈、响应式布局和减少动态效果偏好；不以颜色作为唯一状态标记。
- 浮层复用 SPopper；几何形态复用共享 shape 解析；标准控件优先复用现有组件。
- AI 请求、文件应用、实际上传等由消费方通过事件或回调接入，组件负责通用交互与展示，不绑定业务服务。
- 新组件接入统一导出、按需样式、全局安装、类型声明、离线图标与语言资源，并加入“AI相关 / AI”分类。
- 提供中英文 API 文档和足以理解组件行为的示例。两种语言的渲染示例、完整 Code 源码与 Playground 必须同步，标题 slug 保持一致。
- 验证核心状态转换、异步取消和生命周期清理；流式内容与滚动避免无界增长的定时器或重复更新，代码及引用内容安全渲染。

## 架构契约与已实现基础

- 保留已完成的 Carousel `effect="arc"`、SAiEditor 和 AI 分类，参见 [AI Editor 与弧形轮播契约](../implemented/ai-editor-and-carousel-arc.md)。
- 保持 [无边框焦点与状态反馈](../implemented/component-borderless-focus-treatment.md) 和 [两层颜色变量](../implemented/css-color-token-layer.md)。
- 公共文档及控件架构继续遵守根目录 AGENTS.md；共享逻辑应提取为复用模块，避免每个 AI 组件重复实现流式展示、定位或基础控件行为。

## 已完成目标

- 已实现并集成以上 13 个组件的行为、样式、类型和可组合接口。
- 已完成全部组件的双语示例与 API 文档，并验证渲染、Code 与 Playground。
- 已完成组件测试、类型检查、文档检查和主题、文档构建；验收通过后移入 implemented。

## 禁止方案

- [公开文档包含对话与纠错历史](../prohibited/conversation-history-in-public-docs.md)：公开页面只解释当前 API、行为与用法。
- [公共类型别名退化为纯文字](../prohibited/plain-text-public-api-type-alias.md)：新公共具名类型必须进入统一类型解析和递归详情。
- [整段类型表达式的扁平弹层](../prohibited/flat-api-type-details-popover.md)：继续使用逐引用递归详情。

## 已实现接口与架构契约

- 组件入口为 SReasoningSteps、SChatHistory、SFileDiff、SImageGeneration、SStreamingText、SInlineCitations、SCodeBlock、STaskList、SChatInput、SPlanCard、SQuestionCard、SMessage、SMessageScroller；保持现有 SAiEditor 与 Carousel 行为。
- AgentTask、AgentStatus、AgentSource、AgentHistoryMessage、AgentAttachment、AgentQuestion、AgentQuestionOption、AgentAnswer、FileDiffLine、AgentCodeToken 与各组件 Props / Instance 类型统一公开导出，文档沿用递归类型详情。
- 共享类型、链接过滤、进度限制、文本渐显与复制反馈放在 ai-editor/src/agent-shared；复用既有文本分段，避免顶层工具目录被组件元数据扫描误认为可安装组件。每个新组件有独立源码与按需样式入口。
- 共享 ai-agent.scss 复用全局圆角、box-shadow、motion 与完整颜色变量；不加入普通 border、outline 或 ring。保留深色主题、减少动态效果与可见键盘反馈。
- Reasoning Steps 与 Task List 使用消费方控制的任务状态；折叠和步骤 / 任务选择分别发出事件，不在组件内伪造服务进度。
- Reasoning Steps 的默认形态为无外层卡片的紧凑状态条，expanded 默认 false。真实 steps 驱动当前阶段；来源标签在 reasoning 尚为空时显示，正文逐段追加后替代来源。全部步骤 complete 后正文收起，显示本轮实际耗时摘要；duration 可覆盖秒数，点击摘要通过受控 expanded 展开正文。保留不传 reasoning 时的步骤列表与 step-click 契约。来源支持 icon / iconSrc 与 source-icon 插槽，优先级为插槽、图片、SIcon 名称、默认文档图标。
- 运行阶段的左侧标记采用项目默认 SLogoLoading（14px），继承解析后的 shape 与默认 reduced-motion 行为；不继续仿制外站点阵。
- 2026-10-10 对照 Kobra 原站完整观察两轮（1750ms 阶段、650ms 正文节奏、约 7 秒完成与展开记录），并以可重播本地示例验证对应状态顺序。28 项 Agent 测试、21 项文档测试、test/play 类型检查、主题构建通过；四个中英文示例的渲染、Code 与 Playground 已验证。状态与正文动画遵守 reduced-motion；使用 Sax 的字体、颜色、阴影和无边框设计，未复制来源网站的外层页面或品牌图标。
- Chat History 只汇集 user 消息，通过 SPopper 展开；可选默认插槽展示 transcript，展开时淡化并设为 inert，关闭时移除 inert；select 提供定位数据。Inline Citations 复用 SPopper，只有绝对 HTTP / HTTPS 来源可以作为链接。
- File Diff 接收已计算差异行与旧、新行号，明确发出 apply / reject。Code Block 以文本节点安全渲染轻量词法高亮，支持复制、错误事件、折叠、本地下载与 line 插槽。
- Image Generation 接收受控 status / progress / src，复用 SImage 的实际图片与内置预览；cancel / retry / download 由消费方执行。示例使用既有 Sax SVG 素材，不请求生成服务。
- Streaming Text 展示累积文本，支持追加、替换、暂停、finish 与 replay；使用字素分段、单实例单定时器和最多 200 次推进，卸载清理定时器及媒体查询监听。streaming 独立反映生产方状态。
- Chat Input 复用 Textarea / Tag，支持草稿、附件、发送、停止与工具插槽。发送不自动清空；输入法组合、229 键码和 Shift+Enter 不发送。容器不额外触发原生表单提交，避免重复发送。
- Plan Card 明确确认计划，不自动批准或执行。Question Card 使用受控回答集合与 activeIndex；验证启用选项或非空自定义回答，仅 optional 可跳过，最终提交不能绕过前面的必答题。
- Message 组合角色、纯文本 / 插槽、时间与受控评价。Message Scroller 用 ResizeObserver / MutationObserver 和帧级合并跟随内容；用户离开底部时暂停跟随；向直接消息子项前插入历史时保留阅读位置，卸载断开观察器并取消待处理帧。
- Button 的既有圆角渲染能力补齐公开 shape="rounded" 类型。新组件明确下传解析结果，因此全局 square 下的局部 rounded 覆盖可传到按钮；circle / square 及默认行为继续兼容。Button 增加独立双语形状示例。

## 验收证据（2026-10-10）

- 相关组件测试：5 个文件、92 项通过，包括 27 项新增 Agent 行为 / 生命周期 / SSR / 下载 / 全局形状覆盖检查，既有 AiEditor、Carousel 与 Button 回归。
- pnpm run typecheck:web、typecheck:play、typecheck:vitest 通过。
- pnpm run test:docs-examples：4 个文件、21 项通过；全部组件示例源码重建与编译检查通过。
- pnpm run normalize:doc-examples 已执行并审核修改范围；最终图像素材更新不需要调整源码范围。
- 新组件、共享模块及 Button 类型 / 新示例的 ESLint 检查通过；主题静态检查未加入正宽度边框、outline 或 ring。
- pnpm gen:builtin-icons 通过，既有离线图标 fallback 可用。
- pnpm run build:theme 通过；pnpm run docs:build 最终完整渲染 229 页。既有插件耗时与 chunk 体积警告不阻断构建。
- 单一临时浏览器 tab 检查全部 13 页的中英文渲染、Code 与 Playground：50 个 Agent 示例全部通过；新增 Button 形状示例两种语言亦通过，共 52 个新增 / 调整示例。
- 双语实际交互覆盖推理推进、任务状态 / 进度、差异应用、引用预览、复制、输入发送 / 停止、附件、计划批准 / 拒绝、问题提交 / 跳过、流式暂停 / 继续 / 重播、时间 / 评价 / 重新生成、图片取消 / 失败 / 重试 / 预览、滚动阅读保持与返回最新消息。
- 浏览器读数：向上阅读时追加消息前后 scrollTop 均为 0；前插历史使 scrollHeight 从 720 增至 840，同时 scrollTop 从 0 增至 120，保留原视图。全局 square 下局部 rounded / square / circle 按钮实测圆角为 12px / 0px / 50%。
- 最终四份本地化图像示例源码与 Playground 素材均为 /sax-logo-mark.svg，图片 complete=true、naturalWidth=175；浅色与深色样式均已观察。
- 静态文档浏览器存在通用 hydration mismatch 提示，已在未改动的既有 AiEditor 页复现；所有本次示例完成挂载后可实际交互，未发现新组件特有运行错误。
