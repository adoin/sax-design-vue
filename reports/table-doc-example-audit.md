# Table 双语示例完整性验收（2026-09-05）

## 范围与结构

中英文 Table 文档各有 59 个示例，顺序和能力一一对应。新增的自动核对不依赖标题翻译猜测，而是比较每张卡实际渲染的组件名：中文的 `table-zh-*` 去掉语言前缀后必须与同位置英文 `table-*` 完全相同。

所有 118 个示例都满足：

- `<template #example>` 位于 `<card>` 内；文档不存在卡片外的示例入口。
- 同一卡片在示例前包含标题和面向使用者的说明，不把实现任务或验收提示放进示例文案。
- 英文卡只引用 `components/table/` 下的示例，中文卡只引用 `components/table-zh/` 下的本地化示例。
- 英文示例源码不含中文可见文案；每个中文示例源码包含对应中文文案。
- 一张卡的 template、script/script setup、style 源码都来自同一个 SFC。

## 完整 Code 与 Playground

测试读取每个 `@[code]` 范围，重建 Code 与 Playground 共用的 SFC，并将解析后的四类顶层块逐字与实际示例文件比较：

- `<template>` 内容必须完全相同；
- `<script>` 和 `<script setup>` 的存在性及内容必须完全相同；
- 所有 `<style>` 块的数量、顺序和内容必须完全相同。

因此，截断标签、遗漏类型/导入、只给局部 template、漏掉样式等情况都会失败。重建后还会通过项目的 Playground 编译器编译，并使用真实 Sax Design Vue 插件挂载和卸载；Code 弹窗和 Playground 使用同一份重建源码，不维护第二份示例实现。

本轮 `pnpm run test:docs-examples` 共 2 个文件、9 项测试通过，覆盖全部组件示例的重建/挂载、Table 的 59 对精确源码及逐行 API 元数据。`pnpm run normalize:doc-examples` 检查 144 页，结果为 0 修改、0 跳过；新增测试通过 Prettier 和 `git diff --check`。

## 结论边界

这些证据满足中英文示例文案、渲染示例、完整 Code/Playground 源码以及同卡片组织的静态与运行时编译验收。浏览器中的明暗主题、键盘焦点、弹层和固定/虚拟布局交互仍由最后一个独立验收项跟踪，未用编译通过替代浏览器行为。
