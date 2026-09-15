---
description: '集中注册可复用渲染器，并在表单、表格、筛选、编辑和工具栏中按名称使用。'
---

# Renderer 渲染器

全局 `renderer` 注册表为可复用的界面行为提供稳定名称。Form 与 Table 使用同一个注册表，因此一份定义可以负责表格单元格显示、编辑、表单项、筛选控件或工具栏内容。

应用级渲染器应在入口文件或专门的启动模块中注册。不要在组件的 setup 中注册，否则组件重新挂载会重复执行全局副作用。只服务于单个组件实例的特殊内容应使用插槽。

<card>

## 注册渲染器

使用 `renderer.add(name, definition)` 注册一个渲染器。推荐在独立的 `.tsx` 启动模块中使用 TSX；项目不启用 JSX 时可切换查看等价的 `h()` 写法。下面每个阶段都显式标注了 `options`、`params` 和返回类型，不需要依靠编辑器悬浮提示猜测上下文。

<code-variants>
<template #tsx>

@[code](../../.vuepress/example-sources/renderer-zh/status-tsx.tsx)

</template>
<template #h>

@[code](../../.vuepress/example-sources/renderer-zh/status-h.ts)

</template>
</code-variants>

从应用入口导入该模块一次即可。`renderer.mixin()` 可一次注册多份定义。注册表还提供 `get`、`has`、`entries` 和 `delete`；使用已有名称再次注册会替换对应的全局定义。

`defineTableRenderer<Row, QueryForm>()` 将业务行和查询表单类型贯穿五个阶段。正文和编辑阶段获得 `row` 与 `draftRow`，表单阶段获得查询模型，筛选阶段获得对应列，工具栏阶段通过 `params.source.table` 和 `params.source.context.form` 获得完整类型。

```ts
// main.ts
import { createApp } from 'vue'
import SaxDesignVue from 'sax-design-vue'
import App from './App.vue'
import './app/renderers'

createApp(App).use(SaxDesignVue).mount('#app')
```

</card>

<card>

## 使用已注册的渲染器

Form 通过 `itemRender.name` 引用渲染器。Table 列通过 `renderer.name` 处理正文显示与编辑，通过 `filterRender.name` 处理筛选面板；工具栏则在 `toolbarConfig.left` 或 `toolbarConfig.right` 中使用 `itemRender`。

```ts
import type {
  FormItemConfig,
  TableColumn,
  TableToolbarConfig,
} from 'sax-design-vue'

type ProjectRow = {
  id: number
  status: string
}

const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '暂停', value: 'paused' },
]

const formItems: FormItemConfig[] = [
  {
    field: 'status',
    title: '状态',
    itemRender: { name: '$status', options: statusOptions },
  },
]

const columns: TableColumn<ProjectRow>[] = [
  {
    field: 'status',
    title: '状态',
    editor: true,
    renderer: { name: '$status', options: statusOptions },
    filterRender: { name: '$status', options: statusOptions },
    filterMethod: ({ value, values }) => value === values[0],
  },
]

const toolbarConfig: TableToolbarConfig = {
  left: [
    {
      itemRender: '$buttons',
      props: { maxVisible: 1, trigger: 'click' },
      options: [
        { code: 'create', text: '新建' },
        { code: 'delete', text: '删除' },
      ],
    },
  ],
  right: [{ itemRender: '$refresh' }, { itemRender: '$columnConfig' }],
}
```

`props` 与 `attrs` 会传给实际组件，`options` 用于提供选项或操作。`events` 中的处理函数先接收渲染器上下文，再接收组件事件参数。显式插槽或 Table 局部渲染器的优先级高于全局注册项。

</card>

<card>

## 渲染器契约

`RendererOptions<Model>` 是 Form、Table 正文、编辑、筛选和工具栏共用的渲染配置。`Model` 在正文和编辑阶段是 `Row`，在表单阶段是 `QueryForm`。旧名称 `FormItemRenderOptions` 仅作为废弃兼容别名保留。

一份定义只需实现实际使用的方法。五种方法都返回 `VNodeChild`，完整签名如下：

```ts
interface RendererMethods<Row extends object, QueryForm extends object> {
  renderDefault?: (
    options: RendererOptions<Row>,
    params: TableDefaultRendererParams<Row>,
  ) => VNodeChild
  renderEdit?: (
    options: RendererOptions<Row>,
    params: TableGlobalEditRendererParams<Row>,
  ) => VNodeChild
  renderFormItem?: (
    options: RendererOptions<QueryForm>,
    params: FormRendererParams<QueryForm>,
  ) => VNodeChild
  renderFilter?: (
    options: RendererOptions,
    params: TableGlobalFilterRendererParams<Row>,
  ) => VNodeChild
  renderToolbar?: (
    options: RendererOptions,
    params: TableGlobalToolbarRendererParams<Row, QueryForm>,
  ) => VNodeChild
}
```

下表列出的就是各个 `params` 对象中可直接读取或调用的主要字段：

| 方法             | `params` 可用字段                                                                                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------ |
| `renderDefault`  | `row`、`column`、`value`、`index`、`rowIndex`、`columnIndex`、`depth`、`expanded`、`loading`、`toggleExpand` |
| `renderEdit`     | `row`、`draftRow`、`column`、`value`、`setValue`、`commit`、`cancel`、校验状态                               |
| `renderFormItem` | `model`、`field`、`value`、`setValue`、`validate`、`submit`、`reset`                                         |
| `renderFilter`   | `column`、`values`、`setValues`、`apply`、`reset`、`close`；`value` 是当前控件草稿                           |
| `renderToolbar`  | `placement`、`disabled`、`action`、`source.table`、`source.context`、`source.busy`                           |

正文、编辑和筛选参数还包含 `FormRendererParams` 的通用字段；`params.source` 指向进入共享渲染器之前的原始 Table 上下文。`events` 回调先接收对应阶段的 `params`，再接收组件事件参数。

**`RendererOptions` 完整类型：**

```ts
interface RendererOptions<Model extends object = FormModel> {
  name: string
  component?: Component | string
  props?: Record<string, unknown>
  attrs?: Record<string, unknown>
  events?: Record<
    string,
    (params: FormRendererParams<Model>, ...args: unknown[]) => unknown
  >
  modelProp?: string
  modelEvent?: string
  changeEvent?: string
  content?: string | ((params: FormRendererParams<Model>) => VNodeChild)
  options?: unknown[]
  optionProps?: Record<string, string>
  children?: RendererOptions<Model>[]
}
```

在 Form 和 Table 列配置中通过 `name` 选择注册项。工具栏入口使用 `itemRender`，调用渲染器前会被转换为 `RendererOptions`，因此回调内部仍通过 `options.name` 读取名称。`props`、`attrs`、`options` 会传给目标组件；业务渲染器可以把 `unknown[]` 收窄为自己的选项类型。

</card>

<card>

## 内置渲染器

输入型渲染器通过 `renderDefault` 显示普通文本，并在 `renderEdit`、`renderFormItem` 和 `renderFilter` 中使用对应组件。

| 渲染器           | 对应组件或行为                             |
| ---------------- | ------------------------------------------ |
| `$input`         | `SInput`                                   |
| `$textarea`      | `STextarea`                                |
| `$date`          | `SDatePicker`                              |
| `$dateRange`     | `SDatePicker`，默认 `type="daterange"`     |
| `$time`          | `STimeSelect`                              |
| `$timePicker`    | `STimePicker`                              |
| `$select`        | `SSelect`                                  |
| `$radio`         | `SRadioGroup`                              |
| `$checkbox`      | `SCheckbox`                                |
| `$checkboxGroup` | `SCheckboxGroup`                           |
| `$treeSelect`    | 开启树形模式的 `STableSelect`              |
| `$cascader`      | `SCascader`                                |
| `$rate`          | `SRate`                                    |
| `$slider`        | `SSlider`                                  |
| `$switch`        | `SSwitch`                                  |
| `$verCode`       | `SVerificationCode`                        |
| `$buttons`       | 用于通用显示、表单操作和表格工具栏的操作组 |

`$buttons.options` 接收操作数组，每项可配置 `code`、`text`、`icon`、`visible`、`disabled`、`loading`、`props` 和可选的 `onClick`。`props.maxVisible` 指定直接显示的数量，其余操作进入 `SPopper`；`props.trigger` 支持 `click` 或 `hover`。在 Form 中，未单独处理的 `submit` 与 `reset` 会调用当前表单方法。

Table 还注册了以下工具栏专用渲染器：

| 渲染器          | 行为                                                                  |
| --------------- | --------------------------------------------------------------------- |
| `button`        | 渲染一个 `SButton`；存在 `props.children` 时通过 `SPopper` 显示子操作 |
| `$refresh`      | 刷新当前 Table 的查询或数据代理请求                                   |
| `$columnConfig` | 打开关联当前 Table 的 `STableColumnConfig`                            |

输入轮廓型渲染器用于 Table 编辑时默认接收 `shape: 'square'`，使轮廓贴合单元格边缘。显式设置的 `props.shape` 优先；Form 与 Table 筛选仍使用正常的形状解析。

</card>
