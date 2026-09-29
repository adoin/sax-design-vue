---
status: implemented
kind: project-specification
updated_at: 2026-09-29
modules:
  - packages/components/dialog
  - packages/hooks/use-lockscreen
  - packages/hooks/use-modal
---

# Dialog 最小化与独立生命周期

## 用户要求

> 然后dialog的全屏功能要带上最小化，最小化之后会在页面永远有个在底部的气泡，让人一看就知道有个东西，并且气泡上面还有关闭按钮。同时，这个功能需要增加配置，默认的情况下随着父组件或者说所在组件的销毁而消失，但也可以配置global属性让它一直存在，只是这时候要处理回调之类的问题 这就交给开发者吧

## 契约

- fullScreen 默认提供最小化入口，minimizable 可显式覆盖。普通弹窗默认不开启最小化。
- 最小化保留同一内容实例与内部状态，不触发 close/closed，不修改 v-model；退出 modal 栈并释放自身滚动锁。
- 底部气泡可恢复和关闭，关闭遵循 beforeClose。多个实例共用排列容器，最后一个释放后清理容器。
- 恢复时提升弹窗层级，并将焦点恢复到原内容或弹窗本身；弹窗显示时保留键盘焦点边界。
- 默认随所属组件卸载清理。global 在创建时决定：开启后的活动实例通过独立渲染根保留，在所属组件卸载后仍可最小化、恢复和关闭；未打开的实例不应留下空根。
- global 不是跨刷新持久化。所属组件卸载后保留最后的属性、插槽、注入上下文和回调。调用方负责回调闭包、请求与订阅资源；最终关闭清理独立渲染根。
- local 与 global 均保留 ConfigProvider 的几何形状和 Dialog 默认配置。
- 模态栈按实例移除；滚动锁引用计数，最小化或销毁一个实例不能释放其他活动弹窗的锁。

## 验证

Dialog 生命周期、配置继承、共享滚动锁及 Image Preview 回归测试通过。浏览器验证了默认销毁清理、global 所属组件销毁后恢复草稿、气泡关闭后的根节点与滚动锁清理。中英文文档示例及 Code/Playground 已核对。
