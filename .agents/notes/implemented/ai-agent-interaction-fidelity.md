---
status: implemented
kind: project-specification
updated_at: 2026-10-10
---

# AI Agent 组件完整交互复核

## 用户原始要求

> 其他几个你也复刻地比较差，好好处理一下我再验收

> 我觉得你应该在 https://kobra.systems/components/reasoning-steps 上多停留会儿 看看他一整个渲染过程

## 范围与原则

复核既有 Agents 的其余 12 个组件：Chat History、File Diff、Image Generation、Streaming Text、Inline Citations、Code Block、Task List、Chat Input、Plan Card、Question Card、Message、Message Scroller。保留已确认的 Reasoning Steps 完整流程及项目默认 Loading，既有 AI Editor 不回退。

以 Kobra 公开页面的完整交互和动画为参考，保留 Sax 无边框、全局 shape / radius / shadow / color tokens、共享 SPopper 和受控业务事件。不得读取受限源码，不自动批准计划、发送消息、请求麦克风或绑定服务。

## 已观察差异与修复方向

- Chat History：提问集合覆盖淡化的 transcript，紧凑历史触发器与 composer 可组合；禁止仅做普通下拉菜单。
- File Diff / Code Block：紧凑文件头、右侧图标操作、独立代码区、行号与真实高亮；差异增删背景需有语义。
- Image Generation：画布自身展示生成过程与角落进度，而非正文式占位卡。
- Streaming Text：状态提示与正文渐入，须观察完成过程及多段正文。
- Inline Citations：正文内紧凑来源标记，多个来源通过一个可前后翻页的浮层呈现。
- Task List：紧凑任务行、当前任务进度、展开收起与完整状态推进。
- Chat Input：一行紧凑 composer、图标操作、多行自然增长与可扩展 tools；不伪造语音服务。
- Plan Card：计划图标与标题、内嵌紧凑待办、展开更多；保留显式批准，不复制自动批准倒计时。
- Question Card：字母快捷选项、下一题与上一题、可选题跳过、自定义回答与已完成呈现。
- Message：消息气泡与头像、点击揭示时间、assistant 行为区；消息不是独立大卡。
- Message Scroller：紧凑滚动视口、底部悬浮图标入口、边缘提示、离开底部后不抢滚动。

## 完成条件

逐项记录公开原站关键状态，修复并浏览器验证；所有修改涉及的双语渲染示例、Code、Playground同步；组件回归、文档示例、类型、主题构建通过。共享示例编译管线保持不变。验收记录完成后移入 implemented。

## 实现与验证（2026-10-10）

- 已逐项观察 12 个公开页面及可操作状态，按 Sax 主题适配结构、密度与反馈；不声称复制受限源码或逐像素一致。
- Chat History 以透明 SPopper 承载用户气泡覆盖层，ResizeObserver 同步 transcript 尺寸；Chat Input 默认约 49px 高，支持自然增高。
- 引用卡逐项翻页，AgentSource 新增可选 publisher / date；Message 默认仅 assistant 显示操作区，显式 actions 可覆盖，正文可切换受控时间。
- Code / Diff 使用紧凑文件头、内建图标和安全词法高亮；Task List 以语义进度徽标与完成划线展示受控状态。
- Image Generation 使用受控进度驱动的 procedural canvas 动效，帧率上限 25fps、DPR 上限 2，支持减少动态效果并清理资源；示例失败时停止进度定时器。
- Plan Card 默认预览前三项、真实总数与展开更多，批准始终由显式事件触发；Question Card 支持字母选项快捷键，输入自定义回答时不抢按键。
- Streaming Text 展示分段正文与项目默认 Loading；Message Scroller 使用浮动首尾控制与边缘提示，保留历史视图和滚动所有权。
- 54 项组件回归通过；最终计划布局调整后再次运行 31 项 Agent 回归通过。21 项文档检查、web / vitest / play 类型检查、主题构建通过。
- 23 个英文与 23 个中文示例的 Code 与 Playground 实际渲染均通过，最后 Plan Card 修改后二次复查四个示例。原站观察包含动态中间态，不将未观察的每个服务完成态记为已验证。
- 浏览器确认引用 1/2 → 2/2、问答字母选择与下一题、计划 3 → 5 项展开、消息时间、历史覆盖层、实际 Canvas、滚动首尾控制。窄布局检查的组件可用宽度约 420px，无组件内部横向溢出；未记录为 375px 测试。
- 保留已确认的 Reasoning Steps 与 AI Editor；仅将 Reasoning Steps 的末项访问改为兼容项目 target 的索引写法。
