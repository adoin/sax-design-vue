---
status: implemented
kind: project-specification
completed_at: 2026-10-19
---

# Tabs 排序与模型 API 文档去重

## 用户原始要求

> 另外tabs 增强一下 需要可以拖拽来排序改变原始值顺序的功能，并且排序会维护一个排序后的数组并且抛出事件（大部分场景用事件来维护而不是这个数组），还有我发现tabs的api里面多了个多余的model-value，v-model已经能覆盖他了，你看看其他的api是否也有一样的问题 也都去掉下。然后formGroup里面默认要带上这个可拖拽排序的入参，但是不传这个排序数组，并且在拖拽后通过事件改变最终值数组里面的顺序。然后更新组件库版本，并且弄到admin 上的路由tabs也开启这个，并且维护路由里面数组的索引。

## 已实现契约

- Tabs 默认不排序，`sortable` 开启基于指针捕获的拖动及 Alt+Shift+方向键排序；5px 阈值避免普通点击误触，Escape、pointercancel、失去捕获、组件卸载可取消；拖动后的 click 不激活标签。
- `v-model:order` 可选，省略时维护内部顺序；`sort(order, { value, oldIndex, newIndex })` 和 `update:order` 返回新的完整值数组，不修改传入数组。受控 order 未更新前仍以外部值为准。未知、重复值忽略，未列出的标签按源顺序追加。
- 推荐为可排序标签提供唯一、稳定的 name 与 key。排序只改变导航顺序，不重建内容实例、不改变激活值；事件消费者可直接重排源数组，外部后续调整源顺序也会同步到导航。非具名值沿用源槽位下标。
- 禁用标签不可拖动或作为投放目标；键盘排序按方向跨过禁用标签。折叠标签可激活后使用键盘排序。
- FormGroup 的 `sortable` 默认 true，不向内部 Tabs 传 order，监听 sort 重排最终模型数组；稳定 __index、表单实例、校验身份及 activeKey 保留，数组 index 按新顺序变化；`sort(items)` 在模型更新后通知调用者。
- 中英文 API 共合并 86 条 v-model 与背后属性的重复行；默认和具名模型均检查，运行时属性继续保留。Table API 审计按模型对应属性做语义比较，防止误报缺失或漏验默认值。

## 验证

- Tabs/FormGroup 36 项测试、web/vitest 类型检查、22 项文档检查、235 页生产文档构建通过。
- 浏览器实测指针拖动更新源数组，键盘更新可选 order；中文 Code 完整 SFC 与 Playground 内实际排序通过。
- 发布版本 2.5.0；Admin 使用 sort 事件重排路由记录，固定窗口保留其记录位置与缓存身份。
