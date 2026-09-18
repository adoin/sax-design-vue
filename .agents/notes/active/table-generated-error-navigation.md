---
status: active
kind: project-specification
updated_at: 2026-09-16
modules:
  - packages/components/table
  - docs/zh/components/table
supersedes: []
---

# Table 生成数据的远距离错误导航验证

## 项目目标

保证 Table 在 `virtualSource` 生成数据中同时存在多个、且行列距离很远的验证错误时，上一项/下一项导航仍能以有界读取完成定位、挂载、聚焦和循环切换，不因百万行或十万列规模退化为全量扫描。

## 已确认的项目规格

- 错误导航继续复用既有 locator 管线，不单独实现另一套虚拟滚动定位逻辑。
- 验证只导航已经收集的错误；不得为了导航隐式获取远端未加载数据。
- 每次定位必须保持行列读取有界，并兼容纵向虚拟行、横向虚拟列及 `virtualSource` 坐标。
- 导航到远距离错误后，目标单元格必须完成挂载和聚焦；上一项/下一项在首尾之间按现有契约循环。
- 该验证只补齐尚未覆盖的多错误序列，不改变已经实现并验证通过的 Table 验证浮层契约。

## 项目级待办

- [ ] 增加至少两个远距离 `virtualSource` 错误的集成测试，覆盖前进、后退、首尾循环、横纵向挂载和焦点。
- [ ] 在测试中断言读取次数保持有界，避免实现意外遍历完整数据源。
- [ ] 运行相关验证测试与完整 Table 测试；全部通过后把本规格移入 `implemented/` 并记录验证证据。

## 相关契约

- `.agents/notes/implemented/table-validation-overlay.md`
- `.agents/notes/implemented/table-component-architecture.md`
- `.agents/notes/implemented/table-documentation-information-architecture.md`
