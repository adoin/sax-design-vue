---
description: 'Table 的编辑、校验与变更功能、配置方式与可运行示例。'
---

# 编辑、校验与变更指南

<card class="table-doc-section-start">

## 编辑、校验与变更

本节围绕数据写入流程组织：先编辑，再校验，随后追踪、还原或撤销变更。

### 单元格与整行编辑

设置 `edit-config` 并为列添加 `editor`，再通过共享渲染器注册表选择控件；本例使用 `$input`、`$select`、`$date` 和 `$switch`，渲染器的 `props`、`options` 会传给对应组件。输入框、文本域、选择器、级联选择器、日期和时间等带输入轮廓的编辑器，在表格单元格内默认使用 `shape="square"`，使轮廓贴合单元格；渲染器或编辑器显式传入的 `props.shape` 仍然优先。默认双击进入单元格编辑；`mode: 'row'` 开启整行编辑，`trigger` 可选 `click`、`dblclick` 或 `manual`，`editableMethod` 限制可编辑行或单元格。此例的归档项目不可编辑。

默认编辑只改变草稿。未开启 `change-config` 时，接收 `editCommit` 的 `updatedRow` 或 `changes` 后，由应用更新 `data` 或提交到服务端；组件不会直接修改业务记录。普通输入按 Enter 提交、Escape 取消，选择器和日期面板优先处理自身按键，也可使用保存按钮或 Ctrl/⌘ + Enter。Tab 可进入可编辑单元格，再按 Enter 或 F2 开始。

<template #example><table-zh-editing /></template>

<template #template>

@[code{107-138}](../../../.vuepress/components/table-zh/editing.vue)

</template>

<template #script>

@[code{1-105}](../../../.vuepress/components/table-zh/editing.vue)

</template>

<template #style>

@[code{140-154}](../../../.vuepress/components/table-zh/editing.vue)

</template>

</card>

<card>

### 编辑渲染器

给列设置 `editor: true`，并在 `columns[].renderer` 中指定已注册的控件名称。Table 用该注册项的 `renderEdit` 渲染草稿，静止展示仍由 `renderDefault` 负责。下面的内置 `$input` 与 `$select` 编辑表格显示的同一份数据。双击单元格、修改并提交后，应用通过 `editCommit` 的 `updatedRow` 接收结果。

<template #example><table-zh-edit-renderers /></template>

<template #template>

@[code{47-59}](../../../.vuepress/components/table-zh/edit-renderers.vue)

</template>

<template #script>

@[code{1-45}](../../../.vuepress/components/table-zh/edit-renderers.vue)

</template>

<template #style>

@[code{61-70}](../../../.vuepress/components/table-zh/edit-renderers.vue)

</template>

</card>

<card>

### 编辑生命周期

通过 `edit-config.onSwitch` 设置切换单元格时的行为，默认 `commit`；通过 `onContextChange` 设置排序、筛选、分页或列变更时的行为，默认 `cancel`。受控查询只有在父组件接受新状态后才结束编辑。Enter 提交草稿，Escape 放弃草稿。

虚拟滚动的 `onScroll: 'keep'` 默认在编辑器移出渲染窗口后保留草稿，也可选择 `commit` 或 `cancel`。整行模式会等该行最后一个编辑器移出窗口后再执行。可在下方关闭分页、开启虚拟滚动进行体验。

<template #example><table-zh-editing-lifecycle /></template>

<template #template>

@[code{103-167}](../../../.vuepress/components/table-zh/editing-lifecycle.vue)

</template>

<template #script>

@[code{1-101}](../../../.vuepress/components/table-zh/editing-lifecycle.vue)

</template>

<template #style>

@[code{169-189}](../../../.vuepress/components/table-zh/editing-lifecycle.vue)

</template>

</card>

<card>

### 自定义编辑器

使用 `STableColumn #edit`、通过 `columns[].slots.edit` 显式映射的插槽或通用 `#edit-cell` 定制编辑内容，调用 `setValue` 更新草稿。`value` 是当前字段草稿，`draftRow` 可读取本行其他字段的草稿；不要直接修改插槽参数中的对象。

编辑内容按指定列插槽、通用编辑插槽、列 `edit` 函数、命名渲染器的 `edit`、内置编辑器依次回退。展示态继续使用原有单元格渲染规则。此例通过操作按钮启动整行编辑；任务列使用带 `auto-size` 的 Textarea，让长文本换行并撑高编辑行，优先级列使用 Select。

<template #example><table-zh-editing-custom /></template>

<template #template>

@[code{23-80}](../../../.vuepress/components/table-zh/editing-custom.vue)

</template>

<template #script>

@[code{1-21}](../../../.vuepress/components/table-zh/editing-custom.vue)

</template>

</card>

<card>

### 虚拟数据编辑

生成源通过稳定行键与字段标识编辑位置。此例按需生成 100 万行、10 万列，仅保存已修改字段；接收 `changes` 即可把补丁发送给服务端，不需要构造完整二维数据。

默认离开虚拟视口时保留当前草稿，返回后继续编辑；`onScroll: 'commit'` 或 `'cancel'` 可在编辑器离开窗口时结束会话。整行模式只在整行编辑器都离开窗口时应用此策略。`startEdit` 会滚动到目标行列并聚焦，隐藏列不可启动编辑。

<template #example><table-zh-editing-source /></template>

<template #template>

@[code{66-95}](../../../.vuepress/components/table-zh/editing-source.vue)

</template>

<template #script>

@[code{1-64}](../../../.vuepress/components/table-zh/editing-source.vue)

</template>

<template #style>

@[code{97-108}](../../../.vuepress/components/table-zh/editing-source.vue)

</template>

</card>

<card>

### 数据校验

为列配置 `rules`，或通过 `validation-rules` 按字段配置规则；列规则优先，`rules: []` 可关闭该列校验。支持必填、类型、数值范围、字符串或数组长度、正则，以及自定义同步或异步 `validator`。规则不会转换数据类型；可选空值跳过类型与范围检查，但仍执行自定义函数。

显式开启 `validation-config` 后，提交编辑会先校验草稿。单元格模式检查当前字段，整行模式检查该行所有规则字段；失败保留草稿，不触发 `editCommit`。没有开启编辑时也能调用 `validateCell`、`validateRow` 或 `validate`。手动调用这些校验方法会先取消当前编辑，避免同时显示编辑器和上一轮校验状态。任意校验进行期间，Table 会显示 loading 遮罩并设置 `aria-busy`，在完成或取消前阻断编辑及其他数据区域交互。

错误单元格使用不改变行高的内阴影和错误标记。错误刚收集、通过标记激活或导航到达时，浮层显示完整消息两秒后自动隐藏；悬停错误单元格可再次预览。浮层忽略鼠标事件，不会阻挡单元格点击或双击编辑。它会传送到 Table 数据视图内的专用裁剪层，因此错误格滚走时，浮层无法绘制到该区域之外。存在多个错误时，表格右下角会显示上一处、下一处和关闭操作，导航会复用错误定位能力。进入错误单元格编辑会清除该格的旧错误状态；再次提交仍未通过时，阴影、标记和浮层才会重新出现。错误文本仍通过 `aria-describedby` 和实时区域提供给辅助技术。

<template #example><table-zh-validation /></template>

<template #template>

@[code{108-162}](../../../.vuepress/components/table-zh/validation.vue)

</template>

<template #script>

@[code{1-106}](../../../.vuepress/components/table-zh/validation.vue)

</template>

<template #style>

@[code{164-178}](../../../.vuepress/components/table-zh/validation.vue)

</template>

</card>

<card>

### 错误定位与校验范围

`validate()` 默认检查所有已提供的数据，包括已加载的折叠树节点；`scope: 'view'` 仅检查筛选、展开和分页后的行，不限于虚拟滚动当前挂载的窗口。它不会请求尚未加载的树节点或远程页。

使用 `validate({ rowKeys: [...] })` 按稳定行键选择普通数组或树形记录，也适用于变更追踪返回的记录。生成数据源使用 `rowKeys` 时必须同时提供数字 `rows` 索引；通过数字 `columns` 指定校验列范围。

<template #example><table-zh-validation-navigation /></template>

<template #template>

@[code{47-72}](../../../.vuepress/components/table-zh/validation-navigation.vue)

</template>

<template #script>

@[code{1-45}](../../../.vuepress/components/table-zh/validation-navigation.vue)

</template>

<template #style>

@[code{74-88}](../../../.vuepress/components/table-zh/validation-navigation.vue)

</template>

</card>

<card>

### 生成数据校验

生成数据源使用全局数字行列索引。`validateCell(999_999, 99_998)` 可直接检查一个远端位置；`validate({ rows, columns })` 可指定一组目标，避免扫描整张生成表。下例生成 100 万行、10 万列，只有末行的指定字段为空。

全量校验按需读取数据；内置规则使用同步快路径，只在时间片耗尽时让出执行权。自定义 validator 会按顺序进行有界分批并发，可通过 `validationConfig.concurrency` 或单次调用的 `concurrency` 控制批大小，默认 8，范围 1–32。可通过 `AbortSignal` 或 `cancelValidation()` 取消。`maxErrors` 默认 100，每批还会受剩余错误容量限制；达到上限后阻断后续读取并设置 `truncated: true`。截断后的导航显示下限而不是精确总数：上限为 100 时显示 `99+`，初始位置为 `1 / 99+`。`checked` 是已校验的规则字段数。取消时返回 `cancelled: true`，不会发布部分结果或覆盖之前的错误。应检查 `valid`，不能仅凭错误数组为空判断通过。

<template #example><table-zh-validation-source /></template>

<template #template>

@[code{76-105}](../../../.vuepress/components/table-zh/validation-source.vue)

</template>

<template #script>

@[code{1-74}](../../../.vuepress/components/table-zh/validation-source.vue)

</template>

<template #style>

@[code{107-121}](../../../.vuepress/components/table-zh/validation-source.vue)

</template>

</card>

<card>

### 变更追踪

开启 `change-config`，通过 `v-model:data` 接受普通数组的增删改提案。`row-key` 必须是稳定且唯一的字符串或数字，不能依赖行序号；组件不会原地修改业务行。排序、筛选和分页不改变变更 API 的行键含义。

编辑中的草稿不计入变更记录；编辑校验通过且父组件接受数据后，才触发 `editCommit` 并更新记录。开启变更追踪时无需再在 `editCommit` 中手动替换行。`insertRows`、`removeRows`、`updateRow` 是独立的数据 API，不自动执行编辑校验；保存前可调用 `validate()`。

<template #example><table-zh-changes /></template>

<template #template>

@[code{108-176}](../../../.vuepress/components/table-zh/changes.vue)

</template>

<template #script>

@[code{1-106}](../../../.vuepress/components/table-zh/changes.vue)

</template>

<template #style>

@[code{178-189}](../../../.vuepress/components/table-zh/changes.vue)

</template>

</card>

<card>

### 树分支变更与还原

`insertRows(rows, { parentKey, index })` 插入子行；删除父节点会记录已加载的整个分支。`revertChanges([parentKey])` 包含未修改的中间节点下的后代，也能还原已删除的分支；不会恢复在本次基线之后新增又删除的行。

懒加载只处理已经载入的记录，不会为变更追踪主动请求后代。修改已加载子节点时，提案会复制对应祖先并写入子数组；原始业务对象保持不变。下方可以依次加载、修改后代、插入子行、删除分支，再还原分支。

<template #example><table-zh-changes-tree /></template>

<template #template>

@[code{74-143}](../../../.vuepress/components/table-zh/changes-tree.vue)

</template>

<template #script>

@[code{1-72}](../../../.vuepress/components/table-zh/changes-tree.vue)

</template>

<template #style>

@[code{145-156}](../../../.vuepress/components/table-zh/changes-tree.vue)

</template>

</card>

<card>

### 生成源变更适配

生成源提供 `changeConfig.indexOf(key)` 定位当前全局行索引，并通过 `apply({ operations, signal })` 接受变更。适配器完成数据写入后返回 `true`，拒绝返回 `false`；异步写入前必须检查 `signal.aborted`，以免取消或切换数据后写回旧结果。同一张表已有待处理请求时，新请求返回 `busy`。

生成行可以按需提供字段。`row` 应表示该次读取的只读数据版本；更新优先读取 `patches`，不要展开整行或遍历完整行列矩阵。插入和删除由适配器维护源行数、稳定键映射及恢复位置；本例为固定行数源，只接受字段更新。表格记录只随已改行和字段增长，示例在百万行、十万列中保存稀疏覆盖值。

<template #example><table-zh-changes-source /></template>

<template #template>

@[code{105-157}](../../../.vuepress/components/table-zh/changes-source.vue)

</template>

<template #script>

@[code{1-103}](../../../.vuepress/components/table-zh/changes-source.vue)

</template>

<template #style>

@[code{159-170}](../../../.vuepress/components/table-zh/changes-source.vue)

</template>

</card>

<card>

### 撤销与重做

同时开启 `change-config` 和 `history-config`，通过 `undo()`、`redo()` 回放已接受的编辑、增删及还原操作。一次整行提交或批量增删只占一个历史步骤；未提交的草稿、校验失败、被拒绝或取消的操作不进入历史。活动草稿期间回放返回 `editing`，请先提交或取消草稿。

`history-config.limit` 默认 100，示例设为 30。历史保存受影响字段的前后值及增删行的只读引用，不复制整张数据集；删除大型已加载分支仍会保留该分支，条数上限不等于固定内存上限。业务应通过变更 API 更新数据，避免原地修改历史引用。

<template #example><table-zh-history /></template>

<template #template>

@[code{51-126}](../../../.vuepress/components/table-zh/history.vue)

</template>

<template #script>

@[code{1-49}](../../../.vuepress/components/table-zh/history.vue)

</template>

<template #style>

@[code{128-139}](../../../.vuepress/components/table-zh/history.vue)

</template>

</card>
