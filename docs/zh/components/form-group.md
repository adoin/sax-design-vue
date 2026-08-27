---
PROPS:
  - name: v-model
    type: FormGroupItem[]
    values: 表单数据数组
    description: 每项对应一个标签页和一个独立的 SForm；缺少的 __index 会自动补齐。
    default: '[]'
  - name: get-form-setting
    type: (data, index) => FormGroupFormSetting
    values: 函数
    description: 根据当前数据返回内部 SForm 的配置。
  - name: tab-label
    type: String
    values: 文本
    description: 默认标签前缀。
    default: Item
  - name: get-tab-label
    type: (data, index) => string
    values: 函数
    description: 自定义每个标签的完整文本。
  - name: get-context-menu-items
    type: ({ item, index, key, list }) => ContextMenuItem[]
    values: 函数
    description: 返回标签右键菜单项；index 是当前数组下标，key 是稳定的 __index。
  - name: tabs-type
    type: String
    values: line / pill / card / connected-card / editable-card
    description: 传给内部 STabs 的展示风格；新增、删除能力不受该配置影响。
    default: connected-card
  - name: editable / show-add
    type: Boolean
    values: true / false
    description: 分别控制删除按钮和新增按钮。
    default: 'false'
  - name: create-item
    type: ({ list }) => object | Promise<object>
    values: 函数
    description: 创建新表单数据；支持异步返回。
  - name: max
    type: Number
    values: 正数
    description: 表单项最大数量。
    default: Infinity
  - name: lazy-error-mark
    type: Boolean
    values: true / false
    description: 校验失败时只标记标签，不自动切换到第一个错误标签。
    default: 'false'
  - name: render-threshold
    type: Number
    values: 非负整数
    description: 项数超过该值时启用标签内容懒渲染；force-render 可关闭该优化。
    default: '5'
description: '基于 STabs 与 SForm 的动态表单组。'
EVENTS:
  - name: add / remove
    type: (item, index)
    description: 新增或删除表单项时触发。
  - name: change
    type: (activeKey, index, item)
    description: 当前标签变化时触发。
  - name: tab-contextmenu
    type: (context, mouseEvent)
    description: 右键标签时触发；context 包含 item、index、key 与 list。
  - name: context-menu-select
    type: (menuItem, context)
    description: 选择内置标签右键菜单项后触发。
  - name: validate
    type: (index, valid)
    description: 单个表单完成校验时触发。
---

# 表单组

<card>

`SFormGroup` 将数组中的每项数据封装为一个标签页和一个独立的 `SForm`。标签默认使用连体卡片风格，可通过 `tabs-type` 切换成其他 `STabs` 外观，同时不影响新增与删除能力。超过 `render-threshold` 后，表单会在标签首次激活时才挂载；未挂载项仍可通过无界面规则引擎参与 `validateAll` 和 `validateFields`。右键菜单操作可以直接更新绑定数组，FormGroup 会自动清理已删除标签、表单实例与校验状态。组件实例还提供 `clearValidate`、`resetFields` 与 `getErrors` 方法。

需要在组件外独立校验时，可使用导出的 `createFormValidator(model, { rules, items })`；其 `validate` 和 `validateField` 不依赖 Vue 组件或 DOM。

</card>

<card>

## 基础用法

<template #example><form-group-default /></template><template #template>

@[code](../../.vuepress/components/form-group/default.vue)

</template></card>

<card>

## 大数据校验

此示例初始绑定 25 组数据，默认只有第 20 组不通过。初始只挂载当前表单；点击“校验全部”仍会检查所有未渲染项，并自动切换到第一个错误标签。可以新增数据或右键标签，对比当前从 0 开始的数组下标与稳定 `__index`。

<template #example><form-group-large-data /></template><template #template>

@[code](../../.vuepress/components/form-group/large-data.vue)

</template></card>
