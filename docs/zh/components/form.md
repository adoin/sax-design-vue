---
API_TITLES:
  PROPS: SForm 属性
  CHILD_PROPS: SFormItem 属性
  EVENTS: SForm 事件
  EXPOSES: SForm 暴露方法
PROPS:
  - name: model
    type: Object
    values: 响应式表单数据
    description: 必填。表单唯一数据源，按字段路径读写。
    default: —
  - name: rules
    type: FormRules
    values: '{ [field]: FormRule | FormRule[] }'
    description: 必填、自定义 validator 与 blur / change 触发规则。
    default: '{}'
  - name: items
    type: FormItemConfig[]
    values: 支持 children 的树形配置
    description: 配置式渲染表单项，并通过 children 递归组织复杂布局。
    default: '[]'
  - name: label-width
    type: String | Number
    values: CSS 宽度
    description: 横向布局的默认标签宽度，可容纳四个汉字和必填标记。
    default: 'calc(4em + 24px)'
  - name: label-position
    type: String
    values: left / right / top
    description: 子 Form Item 的默认标签位置。
    default: right
  - name: label-align
    type: String
    values: left / right
    description: 横向标签内部的默认文字对齐方式。
    default: right
  - name: inline
    type: Boolean
    values: true / false
    description: 使用行内表单布局。
    default: 'false'
  - name: disabled
    type: Boolean
    values: true / false
    description: 禁用全部声明式和配置式字段。
    default: 'false'
  - name: readonly
    type: Boolean
    values: true / false
    description: 将全部声明式和配置式字段设为只读。
    default: 'false'
  - name: show-message
    type: Boolean
    values: true / false
    description: 显示校验错误和字段帮助文字。
    default: 'true'
  - name: reserve-error-space
    type: Boolean
    values: true / false
    description: 为字段错误或帮助文字保留稳定高度，避免校验时布局跳动。
    default: 'true'
  - name: scroll-to-error
    type: Boolean
    values: true / false
    description: 校验失败时聚焦并滚动到第一个错误字段。
    default: 'true'
  - name: column-gap
    type: String | Number
    values: CSS 尺寸
    description: 24 栅格的横向间距。
    default: 16
  - name: row-gap
    type: String | Number
    values: CSS 尺寸
    description: 24 栅格的纵向间距。
    default: 4
CHILD_PROPS:
  - name: label
    type: String
    description: 字段标签，优先级高于 title。
    default: —
  - name: title
    type: String
    description: 未传 label 时使用的兼容别名。
    default: —
  - name: prop
    type: String
    values: 深层模型路径
    description: 例如 profile.name，优先级高于 field。
    default: —
  - name: field
    type: String
    values: 深层模型路径
    description: 未传 prop 时使用的兼容别名。
    default: —
  - name: id
    type: String
    description: 用于标签和控件关联的控件 id。
    default: 自动生成
  - name: description
    type: String
    description: 字段没有校验错误时显示的帮助文字。
    default: —
  - name: rules
    type: FormRule | FormRule[]
    description: 当前 Item 的校验规则，优先于 SForm rules 中的同字段规则。
    default: —
  - name: required
    type: Boolean
    values: true / false
    description: 独立于校验规则显示必填状态。
    default: 'false'
  - name: label-width
    type: String | Number
    values: CSS 宽度
    description: 覆盖当前 Item 的 SForm label-width。
    default: 继承
  - name: label-position
    type: String
    values: left / right / top
    description: 覆盖当前 Item 的 SForm label-position。
    default: 继承
  - name: span
    type: Number | FormItemSpan
    values: 1–24 / 响应式对象
    description: 当前 Item 在 24 栅格中占用的宽度。
    default: 24
  - name: vertical
    type: Boolean
    values: true / false
    description: 将当前 Item 的标签放到控件上方。
    default: 'false'
  - name: nested
    type: Boolean
    values: true / false
    description: 将默认插槽作为嵌套 Form Item 栅格处理。
    default: 'false'
  - name: align
    type: String
    values: left / center / right
    description: 控制当前 Item 内容在栅格单元中的对齐方式。
    default: left
  - name: reserve-error-space
    type: Boolean
    values: true / false
    description: 覆盖当前 Item 的 SForm reserve-error-space。
    default: 继承
  - name: disabled
    type: Boolean
    values: true / false
    description: 覆盖传给 itemRender 的禁用状态。
    default: 继承
  - name: readonly
    type: Boolean
    values: true / false
    description: 覆盖传给 itemRender 的只读状态。
    default: 继承
  - name: item-render
    type: FormItemRenderOptions
    description: 未提供默认插槽时渲染已注册或自定义控件。
    default: —
EVENTS:
  - name: validate
    description: 单个字段校验结束后触发，参数为 field、valid、message。
  - name: submit
    description: 提交校验通过后触发，参数为 model 和原生事件。
  - name: invalid-submit
    description: 提交校验未通过后触发，参数为 errors、model 和原生事件。
  - name: reset
    description: 原生重置操作恢复初始值后触发。
EXPOSES:
  - name: validate
    type: () => Promise<boolean>
    description: 校验全部已注册字段。
  - name: validateField
    type: '(prop: string, trigger?) => Promise<boolean>'
    description: 校验一个字段路径。
  - name: clearValidate
    type: '(props?: string | string[]) => void'
    description: 清除指定字段或全部字段的校验状态。
  - name: resetFields
    type: '(event?: Event) => void'
    description: 恢复初始模型值并清除错误。
  - name: submit
    type: '(event?: Event) => Promise<boolean>'
    description: 执行校验并触发 submit 或 invalid-submit。
  - name: getErrors
    type: () => Record<string, string>
    description: 返回当前字段错误映射。
description: '支持渲染器、嵌套 Item、24 栅格和稳定错误区的表单容器。'
---

# Form 表单

<card>

## 概览

Form 同时支持传统插槽写法与配置式 `items`。配置式 API 采用与 VxeUI
相近的 `children + itemRender` 思路：Form 管理模型和校验，renderer 只负责把字段值、组件属性与事件连接起来。

</card>

<card>

## 校验与触发器

校验由 Form 内部实现，不依赖外部校验运行时。规则支持 `required`，以及同步或异步的 `validator(value, model)` 函数。

- 未声明 `trigger` 时，交互校验默认使用 `blur`。
- `blur` 在焦点离开整个 Form Item 时触发；焦点在 Item 内部控件间移动不会误触发。
- `change` 监听字段模型的真实变化，声明式 Item 与配置式 renderer 使用同一套行为。
- `validate()`、`validateField()` 与表单提交直接执行规则；提交时忽略交互触发器并校验全部规则。

</card>

<card>

## 无界面校验

`createFormValidator(model, { rules, items })` 无需挂载 `SForm` 或创建 DOM，也能执行同一套校验规则，适用于懒渲染内容、提交前预检以及当前未渲染的数据。`validate()` 返回 `{ valid, errors }`，`validateField(field)` 返回单字段结果。

<template #example><form-headless-validation /></template>

<template #template>

@[code{40-71}](../../.vuepress/components/form/headless-validation.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/form/headless-validation.vue)

</template>

<template #style>

@[code{73-103}](../../.vuepress/components/form/headless-validation.vue)

</template>

</card>

<card>

## 配置式渲染与嵌套布局

`children` 可以无限递归；每一层都使用 24 栅格。数字 `span` 在手机端自动回落为整行，也可以传入 `{ xs, sm, md, lg, xl }` 精确控制响应式宽度。

<template #example><form-default /></template>

<template #template>

@[code{99-108}](../../.vuepress/components/form/default.vue)

</template>

<template #script>

@[code{1-97}](../../.vuepress/components/form/default.vue)

</template>

<template #style>

@[code{110-116}](../../.vuepress/components/form/default.vue)

</template>

</card>

<card>

## 自定义渲染器

通过 `formRenderer.add(name, definition)` 注册项目级 renderer。`renderItem`
会收到当前模型、字段路径、字段值、禁用状态、`setValue` 与 `validate`，适合封装组合控件或业务控件。

<template #example><form-renderer /></template>

<template #template>

@[code{32-34}](../../.vuepress/components/form/renderer.vue)

</template>

<template #script>

@[code{1-30}](../../.vuepress/components/form/renderer.vue)

</template>

</card>

<card>

## 声明式嵌套 Item

旧有 `<s-form-item>` API 保持兼容。给父 Item 添加 `nested` 后，可以直接嵌套子 Item，并继续使用 `span` 组织复杂布局。

<template #example><form-nested /></template>

<template #template>

@[code{13-33}](../../.vuepress/components/form/nested.vue)

</template>

<template #script>

@[code{1-11}](../../.vuepress/components/form/nested.vue)

</template>

</card>

<card>

## API 归属

Form 有三类相互关联的公开入参。它们存在同名字段，但使用位置不同：

| 传入位置                       | 公开类型                | 对应说明           |
| ------------------------------ | ----------------------- | ------------------ |
| `<s-form>`                     | `FormProps`             | **SForm 属性**     |
| `<s-form-item>`                | `FormItemProps`         | **SFormItem 属性** |
| `<s-form :items>` 的每个节点   | `FormItemConfig`        | **items[] 配置**   |
| `rules` 中的每条规则           | `FormRule`              | **校验规则**       |
| Item / 配置项中的 `itemRender` | `FormItemRenderOptions` | **渲染器配置**     |

### `items[]` 配置（`FormItemConfig`）

每个 `items` 节点都支持 `SFormItem` 的同名字段，配置对象使用 camelCase，例如 `labelWidth`、`labelPosition`、`reserveErrorSpace` 和 `itemRender`。此外还有以下仅用于配置式渲染的字段：

| 属性            | 类型                                            | 说明                                                    |
| --------------- | ----------------------------------------------- | ------------------------------------------------------- |
| `key`           | `string \| number`                              | 稳定的 Vue key；未传时依次使用 `prop`、`field` 和索引。 |
| `children`      | `FormItemConfig[]`                              | 递归创建嵌套的 Form Item 栅格。                         |
| `visible`       | `boolean`                                       | 静态决定是否渲染当前节点。                              |
| `visibleMethod` | `({ model, item }) => boolean`                  | 根据当前模型和配置节点动态决定是否渲染。                |
| `disabled`      | `boolean \| (model) => boolean`                 | 静态或根据模型计算禁用状态。                            |
| `readonly`      | `boolean \| (model) => boolean`                 | 静态或根据模型计算只读状态。                            |
| `class`         | `string \| string[] \| Record<string, boolean>` | 传给生成的 Form Item 的 class。                         |
| `style`         | `CSSProperties`                                 | 传给生成的 Form Item 的行内样式。                       |
| `slots`         | `{ label?, default?, error? }`                  | 引用声明在 `SForm` 上的作用域插槽名称。                 |

### 校验规则（`FormRule`）

| 属性        | 类型                                                | 说明                                                     |
| ----------- | --------------------------------------------------- | -------------------------------------------------------- |
| `required`  | `boolean`                                           | 拒绝 `undefined`、`null`、空字符串和空数组。             |
| `message`   | `string`                                            | 必填或自定义校验失败时显示的错误文字。                   |
| `validator` | `(value, model) => boolean \| string \| Promise<…>` | 合法时返回 `true`，非法时返回 `false` 或错误字符串。     |
| `trigger`   | `'blur' \| 'change' \| Array<'blur' \| 'change'>`   | 指定交互触发时机；未声明时，交互校验默认按 `blur` 运行。 |

### 渲染器配置（`FormItemRenderOptions`）

| 属性          | 类型                                           | 说明                                            |
| ------------- | ---------------------------------------------- | ----------------------------------------------- |
| `name`        | `string`                                       | 必填的渲染器注册名称。                          |
| `component`   | `Component \| string`                          | 覆盖 `name` 对应的已注册组件。                  |
| `props`       | `Record<string, unknown>`                      | 传给控件的组件属性。                            |
| `attrs`       | `Record<string, unknown>`                      | 传给控件的其他 HTML / 组件属性。                |
| `events`      | `Record<string, (params, ...args) => unknown>` | 事件处理器；第一个参数固定为当前渲染上下文。    |
| `modelProp`   | `string`                                       | 模型属性名，默认为 `modelValue`。               |
| `modelEvent`  | `string`                                       | 模型更新事件，默认为 `update:modelValue`。      |
| `content`     | `string \| (params) => VNodeChild`             | 默认插槽文字或内容渲染函数。                    |
| `options`     | `unknown[]`                                    | 传给 Select、Radio Group 等数据驱动组件的选项。 |
| `optionProps` | `Record<string, string>`                       | 自定义渲染器可使用的选项字段映射。              |
| `children`    | `FormItemRenderOptions[]`                      | 用于组合控件的嵌套渲染节点。                    |

默认 renderer 名称与仓库组件名称一致，例如 `SInput`、`SSelect`、`SSwitch`、`SCheckboxGroup`、`SRadioGroup`、`SDatePicker`、`STextarea` 和 `SButton`。

下面的自动表格已按归属拆开：`SForm 属性` 只用于 Form 容器，`SFormItem 属性` 用于声明式 Item，也对应 `items[]` 中的同名字段。

</card>
