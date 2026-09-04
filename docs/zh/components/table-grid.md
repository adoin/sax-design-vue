---
description: "组合查询表单、工具栏、分页和数据表格。"
PROPS:
  - name: "query-config"
    type: "Boolean | TableGridQueryConfig"
    description: "查询表单配置；model、items、rules 和布局参数沿用 SForm。"
    default: false
    usage: "#查询与工具栏"
  - name: "toolbar-config"
    type: "Boolean | TableGridToolbarConfig"
    description: "工具栏标题、刷新按钮及带 code 的业务按钮配置。"
    default: false
    usage: "#查询与工具栏"
EVENTS:
  - name: "query"
    type: "(context: TableGridQueryContext) => void"
    description: "查询、重置或刷新时提供独立的表单、分页、排序与筛选快照。"
    default: null
    usage: "#查询与工具栏"
  - name: "queryError"
    type: "(error: unknown) => void"
    description: "查询编排异常；字段校验失败由表单展示，不触发此事件。"
    default: null
    usage: "#查询与工具栏"
  - name: "toolbarClick"
    type: "(code: string, context: TableGridQueryContext, event: MouseEvent) => void"
    description: "点击已配置的业务按钮。"
    default: null
    usage: "#查询与工具栏"
SLOTS:
  - name: "query"
    type: "Slot"
    description: "在同一个表单中追加 SFormItem，接收 model 和 Grid 方法。"
    default: null
    usage: "#插槽与声明式列"
  - name: "query-[name]"
    type: "Scoped slot"
    description: "转发给查询表单的命名插槽；items 中填写不含 query- 的名称。"
    default: null
    usage: "#插槽与声明式列"
  - name: "query-actions"
    type: "Slot"
    description: "替换查询操作，接收 query、resetQuery、refresh、busy 等。"
    default: null
    usage: "#插槽与声明式列"
  - name: "toolbar"
    type: "Slot"
    description: "替换工具栏按钮区，接收 Grid 方法和 busy。"
    default: null
    usage: "#插槽与声明式列"
  - name: "toolbar-title"
    type: "Slot"
    description: "替换工具栏标题。"
    default: null
    usage: "#插槽与声明式列"
EXPOSES:
  - name: "query"
    type: "() => Promise<boolean>"
    description: "校验表单，通过后回到第一页并发出 query。"
    default: null
    usage: "#查询与工具栏"
  - name: "resetQuery"
    type: "() => Promise<boolean>"
    description: "还原表单初始字段值并回到第一页，再发出 query。"
    default: null
    usage: "#查询与工具栏"
  - name: "refresh"
    type: "() => Promise<boolean>"
    description: "保持当前页与条件，不校验表单，发出 query。"
    default: null
    usage: "#查询与工具栏"
  - name: "getQueryContext"
    type: "() => TableGridQueryContext"
    description: "读取条件快照；reason 默认为 submit。"
    default: null
    usage: "#查询与工具栏"
  - name: "getTable"
    type: "() => TableExposes | undefined"
    description: "获取内部 STable 的公开方法，挂载前不可用。"
    default: null
    usage: "#按需生成数据"
  - name: "getForm"
    type: "() => FormInstance | undefined"
    description: "获取查询表单；挂载前或未启用时不可用。"
    default: null
    usage: "#查询与工具栏"
---

# Table Grid（业务表格）

<card>

## 查询与工具栏

`s-table-grid` 接受 [Table](./table.md) 的属性、事件和插槽，使用同一套分页、排序、筛选和行选择行为。通过 `query-config` 添加 [Form](./form.md) 查询表单，通过 `toolbar-config` 添加业务按钮。

`queryConfig.model` 应为响应式对象，字段更新和重置遵循 SForm 的模型契约。`items`、`rules`、`labelPosition` 等沿用表单配置。点击查询或在表单内提交，会先校验字段；通过后请求第一页，再发出 `query`。重置恢复字段挂载时的初始值并请求第一页；刷新保留当前页和条件，不执行字段校验。

`query` 提供 `{ reason, form, pager, sortBy, filters }` 快照，`reason` 为 `submit`、`reset` 或 `refresh`。本例由事件处理函数筛选本地数据；Grid 不会自动把表单字段映射成表格筛选，也不会自动发送网络请求。远程业务可接收该事件，自行更新 `data`、`loading` 和分页总数。

指定 `pagerConfig.currentPage` 或 `pageSize` 后，对应字段受控；使用 `v-model:pager-config` 接受更新。父组件拒绝第一页请求、字段校验失败、条件在异步校验期间改变、加载中或卸载后，查询方法返回 `false`，不会发出有效查询。返回 `true` 只表示已发出事件，不代表业务数据请求成功。

工具栏按钮通过 `buttons` 配置，使用 `code` 区分 `toolbarClick` 操作；支持 `visible`、`disabled`、`loading` 和 `props`。`refresh: false` 隐藏默认刷新按钮。列设置通过 Table 的 `column-manager-config` 开启。

<template #example>
  <table-grid-zh-basic />
</template>

<template #template>

@[code{85-108}](../../.vuepress/components/table-grid-zh/basic.vue)

</template>

<template #script>

@[code{1-83}](../../.vuepress/components/table-grid-zh/basic.vue)

</template>

<template #style>

@[code{110-114}](../../.vuepress/components/table-grid-zh/basic.vue)

</template>

</card>

<card>

## 插槽与声明式列

通过 `query-[name]` 自定义查询字段；在 `items[].slots.default` 中填写不含 `query-` 的名称。`query-actions` 替换查询按钮区，`toolbar` 替换工具栏按钮，`toolbar-title` 替换标题。`query` 插槽可以追加 `s-form-item`，所有查询控件共用一个表单。

其余插槽继续传给 Table，包括 `header`、`footer`、单元格与编辑插槽，以及默认插槽中的 `s-table-column`。下例把声明式列、树节点展开、左右固定列和虚拟滚动组合使用；应用条件后显示收到的关键词，树数据保持原样。

<template #example>
  <table-grid-zh-slots />
</template>

<template #template>

@[code{24-83}](../../.vuepress/components/table-grid-zh/slots.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/table-grid-zh/slots.vue)

</template>

<template #style>

@[code{85-89}](../../.vuepress/components/table-grid-zh/slots.vue)

</template>

</card>

<card>

## 按需生成数据

通过 `getTable()` 调用原有 Table 方法，例如 `scrollToRow`、`scrollToColumn`、编辑、校验及变更操作。`virtualSource` 和 `virtualConfig` 沿用 Table 的配置。

此例按需提供 100 万行、10 万列，行数据只读取被渲染的字段。查询快照仅包含查询条件，不复制这些行列；按钮可定位首端和末端。普通数组仍由业务提供，生成数据源的远程加载和保存也由业务管理。

<template #example>
  <table-grid-zh-virtual />
</template>

<template #template>

@[code{40-53}](../../.vuepress/components/table-grid-zh/virtual.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/table-grid-zh/virtual.vue)

</template>

</card>
