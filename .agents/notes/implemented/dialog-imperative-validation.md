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
- Prompt、SPromptBox、$prompt 的实现、注册、样式、公共类型、导航和示例已移除；README 与生成脚本同步更新。
- 保留 Dialog 最小化及 global 生命周期契约。

## 验证

Dialog 的确认校验、异步防重、过期结果、异常、命令式取消与清理及关闭拦截测试通过。ConfigProvider 和 Image Preview 回归通过；文档测试、类型检查、主题与完整组件库构建通过。已验证构建入口导出 SDialogBox 且不再导出 Prompt。中英文示例及 Playground 已核对。
