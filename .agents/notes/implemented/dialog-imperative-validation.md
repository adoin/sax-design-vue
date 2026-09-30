---
status: implemented
kind: project-specification
updated_at: 2026-09-29
modules:
  - packages/components/dialog
  - packages/sax-design-vue
  - docs/components/dialog.md
  - docs/zh/components/dialog.md
---

# Dialog 命令式调用与提交前校验

## 用户要求

> 然后Prompt貌似和dialog重叠了，把现在的Prompt的命令式调用这个概念拿过来放Dialog这，还有提交前校验功能，以此增强dialog 然后Prompt是不是就可以删了

## 契约

- 声明式 SDialog 与命令式 SDialogBox / $dialog 复用 DialogSurface，不维护另一套 Prompt 弹层。
- beforeConfirm 支持同步及异步 boolean/void。false 保持打开；成功后触发 confirm，再遵循 confirmClosable 和 beforeClose。
- 确认等待期间显示按钮 loading 并拦截重复请求。关闭或销毁后忽略过期结果；异常触发 confirmError，保持弹窗打开。
- confirmDisabled 禁用确认入口；实例 confirm() 和 footer 的 confirm/cancel/pending/disabled 作用域复用相同流程。
- SDialogBox() 在关闭动画结束及实例清理后返回 confirm/cancel/close。alert() 是单确认按钮入口；confirm() 成功返回 true，取消或关闭拒绝为 cancel/close，调用方必须处理取消。
- 命令式实例独立管理生命周期。beforeClose 阻止关闭时不能提前结束 Promise；创建失败及最终关闭均须清理挂载节点。
- beforeClose 的无参数 Promise 校验、关闭原因通知及统一关闭入口遵循 [dialog-async-close-guard.md](dialog-async-close-guard.md)。独立关闭前校验示例展示 Promise 的 resolve/reject。
- Prompt、SPromptBox、$prompt 的实现、注册、样式、公共类型、导航和示例已移除；README 与生成脚本同步更新。
- 保留 Dialog 最小化及 global 生命周期契约。

## 验证

Dialog 的确认校验、异步防重、过期结果、异常、命令式取消与清理及关闭拦截测试通过。ConfigProvider 和 Image Preview 回归通过；文档测试、类型检查、主题与完整组件库构建通过。已验证构建入口导出 SDialogBox 且不再导出 Prompt。中英文示例及 Playground 已核对。

## 历史业务流程示例（2026-09-30，已被自定义页脚示例替代）

用户反馈：

> Dialog这个高级能力一点也不高级啊。。。换个title太傻了

- Advanced 示例展示完整的工作区更新发布流程：SForm 内置 `$input` / `$textarea` 字段校验、异步请求、首次失败与重试成功、保留草稿和发布结果。
- 自定义 footer 使用 DialogFooterScope 的 confirm/cancel/pending/disabled，复用组件的确认流程和防重行为。请求中禁用编辑，关闭守卫提示等待；请求结束立即清理等待提示。
- 未保存内容关闭时，在同一 Dialog 内通过 SAlert 和 SButton 提供继续编辑或放弃选择；取消不会丢失内容。组件卸载取消本地模拟请求，清理待关闭回调。
- 请求明确标注为本地模拟，不执行真实发布。公开说明聚焦 API 用法；中英文示例文本、完整 SFC 源码和 API 用法链接同步更新。用户随后要求去掉泛化的“高级能力”标题，当时使用“发布流程与草稿保护” / “Publishing and draft protection”，canonical URL 为 `#publishing-and-draft-protection`。
- 21 项文档检查通过。浏览器验证空值错误、提交中关闭拦截、失败草稿保留、重试成功、继续编辑和放弃关闭；核对按钮布局及中英文 Code/Playground 的完整性和预览运行。

## 当前通用示例（2026-09-30）

用户反馈：

> 这么看好像很业务啊，我们做的是通用组件 这个有必要吗？

- 用“自定义页脚” / “Custom footer”（`#custom-footer`）替代完整发布与草稿保护流程，移除业务表单、失败重试和未保存草稿选择。
- 单个小型示例展示 footer 插槽的 confirm/cancel/pending/closePending/disabled、确认后保持打开和事件反馈。异步确认与关闭守卫仍保留独立示例。
- 英中文示例、完整 SFC 源码和 API usage 链接同步。
- 验证：21 项文档检查通过；浏览器核对中文 confirm → cancel → closed 事件、确认后保持打开与取消关闭，以及两种语言的完整 Code 源码和 Playground 预览。
