---
PROPS:
  - name: min-width
    type: Number
    values: "像素"
    description: 设置菜单最小宽度，不超出视口。
    default: '184'
  - name: items
    type: ContextMenuItem[]
    values: "ContextMenuItem[]"
    description: 菜单项配置。
    default: '[]'
  - name: v-model
    type: Boolean
    values: "true / false"
    description: 控制菜单显示状态。
    default: 'false'
  - name: disabled
    type: Boolean
    values: "true / false"
    description: 禁用右键触发。
    default: 'false'
EXPOSES:
  - name: show
    type: '(event: MouseEvent | KeyboardEvent, target?: HTMLElement) => Promise<boolean>'
    description: 根据鼠标位置或键盘触发元素打开菜单，返回是否成功打开。
    default: null
  - name: close
    type: '(restoreFocus?: boolean) => void'
    description: 关闭菜单，默认在焦点仍位于菜单内时恢复来源焦点。
    default: null
EVENTS:
  - name: select
    type: '(item: ContextMenuItem) => void'
    description: 选择可用菜单项时触发。
  - name: open
    type: '(event: MouseEvent | KeyboardEvent) => void'
    description: 打开时返回鼠标或键盘触发事件。
  - name: close
    type: '() => void'
    description: 菜单关闭时触发。
description: "右键菜单。"
---

# 右键菜单

<card>

右键或聚焦触发区域后按 Shift + F10 / 菜单键打开。方向键、Home / End 移动菜单焦点，Enter / Space 选择，Escape 关闭并恢复焦点；Tab 关闭并继续浏览。菜单使用共享弹层进行视口避让，默认传送到页面弹层。

<template #example><context-menu-default /></template>

<template #template>

@[code{19-47}](../../.vuepress/components/context-menu/default.vue)

</template>

<template #script>

@[code{1-17}](../../.vuepress/components/context-menu/default.vue)

</template>

<template #style>

@[code{49-147}](../../.vuepress/components/context-menu/default.vue)

</template>

</card>
