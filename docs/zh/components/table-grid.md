---
description: "组合查询表单、工具栏、分页和数据表格。"
PROPS:
  - name: "data"
    type: "TableRow[]"
    description: "外部管理的行数据；省略时请求代理在内部保存查询结果，显式传入的数组优先于代理数据。"
    default: null
    usage: "#请求代理"
  - name: "proxy-config"
    type: "Boolean | TableGridProxyConfig"
    description: "配置 query、save、delete 适配器；默认关闭。"
    default: false
    usage: "#请求代理"
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
  - name: "proxyStateChange"
    type: "(state: TableGridProxyState) => void"
    description: "请求加载状态和最近结果变化。"
    default: null
    usage: "#请求代理"
  - name: "proxySuccess"
    type: "(result: TableGridProxyResult) => void"
    description: "查询数据被接受或写请求成功后触发。"
    default: null
    usage: "#请求代理"
  - name: "proxyError"
    type: "(result: TableGridProxyResult) => void"
    description: "适配器抛出异常或查询响应格式无效；取消不触发。"
    default: null
    usage: "#请求代理"
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
  - name: "proxy-error"
    type: "TableGridExposes & { state: TableGridProxyState }"
    description: "自定义请求错误内容，接收 state 和 Grid 方法。"
    default: null
    usage: "#请求代理"
  - name: "query"
    type: "TableGridExposes & { model: FormModel }"
    description: "在同一个表单中追加 SFormItem，接收 model 和 Grid 方法。"
    default: null
    usage: "#插槽与声明式列"
  - name: "query-[name]"
    type: "Scoped slot"
    description: "查询字段插槽，提供 model、item、field、prop、value、disabled、readonly 和 setValue(value)；items 中填写不含 query- 的名称。"
    default: null
    usage: "#插槽与声明式列"
  - name: "query-actions"
    type: "TableGridExposes & { busy: boolean }"
    description: "替换查询操作，接收 query、resetQuery、refresh、busy 等。"
    default: null
    usage: "#插槽与声明式列"
  - name: "toolbar"
    type: "TableGridExposes & { busy: boolean }"
    description: "替换工具栏按钮区，接收 Grid 方法和 busy。"
    default: null
    usage: "#插槽与声明式列"
  - name: "toolbar-title"
    type: "Slot"
    description: "替换工具栏标题。"
    default: null
    usage: "#插槽与声明式列"
EXPOSES:
  - name: "commitProxy"
    type: "(action: TableGridProxyAction, rows?: TableRow[]) => Promise<TableGridProxyResult>"
    description: "按当前条件执行 query、refresh、save 或 delete。rows 仅用于 delete：省略时读取当前选中行，传 [] 则不删除；save 使用已跟踪的变更记录。"
    default: null
    usage: "#请求代理"
  - name: "cancelProxy"
    type: "() => void"
    description: "中止当前请求并忽略迟到的结果，不保证撤回已到达服务端的写入。"
    default: null
    usage: "#请求代理"
  - name: "getProxyState"
    type: "() => TableGridProxyState"
    description: "读取当前请求状态。"
    default: null
    usage: "#请求代理"
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

指定 `pagerConfig.currentPage` 或 `pageSize` 后，对应字段受控；使用 `v-model:pager-config` 接受更新。父组件拒绝第一页请求、字段校验失败、条件在异步校验期间改变、加载中或卸载后，查询方法返回 `false`，不会发出有效查询。未开启代理时，返回 `true` 只表示已发出事件；开启代理后，表示查询响应已被接受。

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

`query-*` 前缀保留给查询表单，`query`、`toolbar`、`toolbar-title` 和 `proxy-error` 由 Grid 自身使用；自定义 Table 列插槽请使用其他名称。条件插槽支持挂载后增加或移除，移除后恢复对应的默认内容。

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

<card>

## 请求代理

通过 `proxy-config.query` 接收 `{ action, reason, form, pager, sortBy, filters, signal }`，返回 `{ data, total }`。开启分页时必须提供非负整数 `total`，树形数据按根记录计数。代理自动使用远程分页、排序与筛选，返回的一页数据不会再次被本地截取或排序。

默认挂载后查询，`autoLoad: false` 可关闭；默认在已接受的页码、条数、排序或筛选变化后查询，`autoQuery: false` 可关闭。排序和筛选变化会请求第一页；表单输入不会单独触发请求。`query()` 先校验表单并请求第一页，`resetQuery()` 重置表单并请求第一页，`refresh()` 保持当前页。`commitProxy('query')` 和 `commitProxy('refresh')` 是直接派发当前条件的接口，不额外校验查询表单或重置页码。

未传入 `data` 时，Grid 保存已接受的响应；传入 `data` 后由父组件控制，必须通过 `v-model:data` 或 `update:data` 接受返回数组，否则结果为 `rejected`。请求失败保留上一次数据。关闭代理后仍可沿用手动接收 `query` 事件并管理数据的方式。

后发查询会取消前一个查询，迟到的响应不会覆盖新数据。显式取消、关闭代理、切换适配器、变更 `dataKey` 或卸载都会中止请求。将 `signal` 传给 `fetch` 等客户端，并在执行延迟写入前检查它；组件取消不代表服务端一定撤销写入。

下例用延迟函数模拟服务，支持分页、排序、部门筛选、失败重试和取消。表格同时开启固定列、动态行高和虚拟滚动。普通查询适配器接收有限的一页数组；按需生成的 `virtualSource` 继续由业务管理，直接代理查询返回 `unsupported`。

<template #example>
  <table-grid-zh-proxy-query />
</template>

<template #template>

@[code{82-131}](../../.vuepress/components/table-grid-zh/proxy-query.vue)

</template>

<template #script>

@[code{1-80}](../../.vuepress/components/table-grid-zh/proxy-query.vue)

</template>

</card>

<card>

## 保存与删除

开启 `change-config` 后，`commitProxy('save')` 将已有变更快照交给 `proxyConfig.save`。先通过 Table 的 `commitEdit()` 应用草稿，再持久化变更；活动草稿返回 `editing`。保存前校验新增和修改行，无效返回 `invalid`，没有变更返回 `empty`。

保存回调接收 `changes` 的新增、修改、删除记录及版本。回调成功后仅确认同一数据基线和版本；等待期间数据被外部替换或记录版本变化时返回 `stale`，保留当前数据。行引用只读，更新字段值已是快照；需要序列化哪些字段由业务决定。`validationColumns` 可限制保存校验范围。生成数据源保存时必须指定数字 `validationColumns` 和 `changeConfig.indexOf`，只访问受影响行和指定列；关闭自动刷新并在适配器中更新生成数据源。

`commitProxy('delete', rows)` 删除明确指定的行；省略 rows 时读取 Table 当前选中行，空数组返回 `empty`。查询和删除遇到尚未保存的变更返回 `dirty`，请先保存或调用 `getTable()?.revertChanges()`。删除适配器负责服务端删除，组件不会擅自删除本地行。

保存和删除互斥，写请求进行中其他代理操作返回 `busy`。回调返回 `false` 表示拒绝，抛出异常触发 `proxyError`；均保留数据和变更记录。成功后默认刷新，可用 `reloadAfterMutation: false` 关闭。写入成功但刷新失败时，外层结果仍为 `success`，另检查 `result.reload`，避免把已经成功的写入重复提交。

`getProxyState()` 和 `proxyStateChange` 提供 loading、action、error 与最近 result；取消返回 `cancelled`。下例模拟服务端数据，依次体验编辑、应用草稿、保存、新增、删除与还原。

<template #example>
  <table-grid-zh-proxy-edit />
</template>

<template #template>

@[code{99-151}](../../.vuepress/components/table-grid-zh/proxy-edit.vue)

</template>

<template #script>

@[code{1-97}](../../.vuepress/components/table-grid-zh/proxy-edit.vue)

</template>

</card>
