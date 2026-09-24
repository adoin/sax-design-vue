---
API_TITLES:
  PROPS: SForm 属性
  CHILD_PROPS: SFormItem 属性
  ITEMS: items[] 配置（FormItemConfig）
  RULES: 校验规则（FormRule）
  RENDERERS: 渲染器配置（RendererOptions）
  EVENTS: SForm 事件
  EXPOSES: SForm 暴露方法
PROPS:
  - name: model
    type: Object
    values: '响应式表单数据'
    description: 必填。表单唯一数据源，按字段路径读写。
    default: null
  - name: size
    type: ComponentSize
    values: 'default / small / large'
    description: 配置渲染器和插槽控件继承的默认尺寸；控件自身声明的 size 优先。
    default: null
  - name: rules
    type: FormRules
    values: '{ [field]: FormRule | FormRule[] }'
    description: 必填、自定义 validator 与 blur / change 触发规则。
    default: '{}'
  - name: items
    type: FormItemConfig[]
    values: '支持 children 的树形配置'
    description: 配置式渲染表单项；每个节点支持 SFormItem 字段及下方 items[] 的额外配置。
    default: '[]'
  - name: label-width
    type: String | Number
    values: 'CSS 宽度'
    description: 横向布局的默认标签宽度，可容纳四个汉字和必填标记。
    default: 'calc(4em + 24px)'
  - name: label-position
    type: String
    values: 'left / right / top'
    description: 子 Form Item 的默认标签位置。
    default: right
  - name: label-align
    type: String
    values: 'left / right'
    description: 横向标签内部的默认文字对齐方式。
    default: right
  - name: inline
    type: Boolean
    values: 'true / false'
    description: 使用行内表单布局。
    default: 'false'
  - name: disabled
    type: Boolean
    values: 'true / false'
    description: 禁用全部声明式和配置式字段。
    default: 'false'
  - name: readonly
    type: Boolean
    values: 'true / false'
    description: 将全部声明式和配置式字段设为只读。
    default: 'false'
  - name: show-message
    type: Boolean
    values: 'true / false'
    description: 显示校验错误和字段帮助文字。
    default: 'true'
  - name: reserve-error-space
    type: Boolean
    values: 'true / false'
    description: 为字段错误或帮助文字保留稳定高度，避免校验时布局跳动。
    default: 'true'
  - name: scroll-to-error
    type: Boolean
    values: 'true / false'
    description: 校验失败时聚焦并滚动到第一个错误字段。
    default: 'true'
  - name: column-gap
    type: String | Number
    values: 'CSS 尺寸'
    description: 24 栅格的横向间距。
    default: 16
  - name: row-gap
    type: String | Number
    values: 'CSS 尺寸'
    description: 24 栅格的纵向间距。
    default: 4
CHILD_PROPS:
  - name: label
    type: String
    description: 字段标签，优先级高于 title。
    default: null
  - name: title
    type: String
    description: 未传 label 时使用的兼容别名。
    default: null
  - name: prop
    type: String
    values: '深层模型路径'
    description: 例如 profile.name，优先级高于 field。
    default: null
  - name: field
    type: String
    values: '深层模型路径'
    description: 未传 prop 时使用的兼容别名。
    default: null
  - name: id
    type: String
    description: 用于标签和控件关联的控件 id。
    default: 自动生成
  - name: description
    type: String
    description: 字段没有校验错误时显示的帮助文字。
    default: null
  - name: rules
    type: FormRule | FormRule[]
    description: 当前 Item 的校验规则，优先于 SForm rules 中的同字段规则。
    default: null
  - name: required
    type: Boolean
    values: 'true / false'
    description: 独立于校验规则显示必填状态。
    default: 'false'
  - name: label-width
    type: String | Number
    values: 'CSS 宽度'
    description: 覆盖当前 Item 的 SForm label-width。
    default: 继承
  - name: label-position
    type: String
    values: 'left / right / top'
    description: 覆盖当前 Item 的 SForm label-position。
    default: 继承
  - name: span
    type: Number | FormItemSpan
    values: '1–24 / 响应式对象'
    description: 当前 Item 在 24 栅格中占用的宽度。
    default: 24
  - name: vertical
    type: Boolean
    values: 'true / false'
    description: 将当前 Item 的标签放到控件上方。
    default: 'false'
  - name: nested
    type: Boolean
    values: 'true / false'
    description: 将默认插槽作为嵌套 Form Item 栅格处理。
    default: 'false'
  - name: align
    type: String
    values: 'left / center / right'
    description: 控制当前 Item 内容在栅格单元中的对齐方式。
    default: left
  - name: reserve-error-space
    type: Boolean
    values: 'true / false'
    description: 覆盖当前 Item 的 SForm reserve-error-space。
    default: 继承
  - name: disabled
    type: Boolean
    values: 'true / false'
    description: 覆盖传给 itemRender 的禁用状态。
    default: 继承
  - name: readonly
    type: Boolean
    values: 'true / false'
    description: 覆盖传给 itemRender 的只读状态。
    default: 继承
  - name: item-render
    type: RendererOptions
    description: 未提供默认插槽时渲染已注册或自定义控件。
    default: null
ITEMS:
  - name: key
    type: 'string | number'
    description: 配置节点的稳定 Vue key；缺省依次使用 prop、field 和索引。
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: children
    type: 'FormItemConfig[]'
    description: 递归创建嵌套的 Form Item 栅格。
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: visible
    type: boolean
    description: 静态决定当前配置节点是否渲染。
    default: true
    usage: '#schema-renderers-and-nested-layout'
  - name: visibleMethod
    type: '({ model, item }) => boolean'
    description: 根据当前模型和配置节点动态决定是否渲染。
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: disabled
    type: 'boolean | (model) => boolean'
    description: 覆盖当前配置节点的禁用状态，或根据模型计算。
    default: 继承
    usage: '#schema-renderers-and-nested-layout'
  - name: readonly
    type: 'boolean | (model) => boolean'
    description: 覆盖当前配置节点的只读状态，或根据模型计算。
    default: 继承
    usage: '#schema-renderers-and-nested-layout'
  - name: class
    type: 'string | string[] | Record<string, boolean>'
    description: 传给生成的 Form Item 的 class。
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: style
    type: CSSProperties
    description: 传给生成的 Form Item 的行内样式。
    default: null
    usage: '#schema-renderers-and-nested-layout'
  - name: slots
    type: '{ label?: string; default?: string; error?: string }'
    description: 引用在 SForm 上声明的作用域插槽名称。
    default: null
    usage: '#schema-renderers-and-nested-layout'
RULES:
  - name: required
    type: boolean
    description: 拒绝 undefined、null、空字符串和空数组。
    default: false
    usage: '#validation-and-triggers'
  - name: message
    type: string
    description: 必填失败或 validator 返回 false 时使用；validator 返回错误字符串时后者优先。
    default: null
    usage: '#validation-and-triggers'
  - name: validator
    type: '(value, model) => boolean | string | Promise<boolean | string>'
    description: 合法时返回 true，非法时返回 false 或直接返回要显示的错误文字。
    default: null
    usage: '#validation-and-triggers'
  - name: trigger
    type: "'blur' | 'change' | Array<'blur' | 'change'>"
    description: 交互触发时机；未声明时默认在 blur 运行，提交时运行所有规则。
    default: null
    usage: '#validation-and-triggers'
RENDERERS:
  - name: name
    type: string
    description: 必填的渲染器注册名称。
    default: null
    usage: '#custom-renderer'
  - name: component
    type: 'Component | string'
    description: 覆盖 name 对应的已注册组件。
    default: null
    usage: '#custom-renderer'
  - name: props
    type: 'Record<string, unknown>'
    description: 传给渲染控件的组件属性。
    default: null
    usage: '#custom-renderer'
  - name: attrs
    type: 'Record<string, unknown>'
    description: 传给控件的其他 HTML 或组件属性。
    default: null
    usage: '#custom-renderer'
  - name: events
    type: 'Record<string, (params, ...args) => unknown>'
    description: 事件处理器先接收渲染上下文，再接收组件事件参数。
    default: null
    usage: '#custom-renderer'
  - name: modelProp
    type: string
    description: 自定义控件的模型属性；Form 字段值覆盖同名 props。
    default: modelValue
    usage: '#custom-renderer'
  - name: modelEvent
    type: string
    description: 模型更新事件；事件首参直接写回 Form 字段。
    default: 'update:modelValue'
    usage: '#custom-renderer'
  - name: content
    type: 'string | (params) => VNodeChild'
    description: 默认插槽文字或内容渲染函数。
    default: null
    usage: '#custom-renderer'
  - name: options
    type: 'unknown[]'
    description: 传给 Select、Radio Group 等数据驱动组件的选项。
    default: null
    usage: '#custom-renderer'
  - name: optionProps
    type: 'Record<string, string>'
    description: 自定义渲染器可使用的选项字段映射。
    default: null
    usage: '#custom-renderer'
  - name: children
    type: 'RendererOptions[]'
    description: 用于组合控件的嵌套渲染节点。
    default: null
    usage: '#custom-renderer'
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

## 尺寸

对比组件继承后的 `small`、`default`、`large` 三档尺寸。

<template #example><form-zh-size /></template>

<template #template>

@[code{7-20}](../../.vuepress/components/form-zh/size.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/form-zh/size.vue)

</template>

<template #style>

@[code{22-27}](../../.vuepress/components/form-zh/size.vue)

</template>

</card>

<card>

## 配置式渲染与嵌套布局

`children` 可以无限递归；每一层都使用 24 栅格。数字 `span` 在手机端自动回落为整行，也可以传入 `{ xs, sm, md, lg, xl }` 精确控制响应式宽度。`itemRender` 可直接使用内置的 `$input`、`$select`、`$switch` 和 `$textarea`；`$buttons` 能提供 Form 的 `submit`、`reset` 操作，无需重新编写操作插槽。

<template #example><form-default /></template>

<template #template>

@[code{104-106}](../../.vuepress/components/form/default.vue)

</template>

<template #script>

@[code{1-102}](../../.vuepress/components/form/default.vue)

</template>

</card>

<card>

## 自定义渲染器

可复用的项目级渲染器应从应用入口统一注册。下例组件只引用 `$uppercaseInput`，该名称已由本站在组件外全局注册。注册方式、回调契约、Form 与 Table 的使用位置以及内置对应关系统一参见[渲染器](./renderer.md)。

<template #example><form-renderer /></template>

<template #template>

@[code{19-21}](../../.vuepress/components/form/renderer.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/form/renderer.vue)

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
