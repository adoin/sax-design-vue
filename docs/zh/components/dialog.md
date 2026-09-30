---
description: '展示聚焦的模态内容并要求用户作出决定。'
PROPS:
  - name: before-confirm
    type: DialogBeforeConfirmFn
    default: null
    description: 提交前同步或异步校验。返回 false 保持打开；通过后触发 confirm，并按 confirm-closable 关闭。异常触发 confirm-error 并保持打开。
    usage: '#before-confirm'
  - name: confirm-disabled
    type: Boolean
    default: false
    description: 禁用内置确认操作。
    usage: '#before-confirm'
  - name: minimizable
    type: Boolean
    default: null
    description: 是否显示最小化入口；省略时全屏弹窗默认开启，普通弹窗默认关闭。
    usage: '#full-screen'
  - name: global
    type: Boolean
    default: false
    description: 创建时决定是否独立于所属组件存活。开启后，已打开的弹窗和最小化气泡在所属组件销毁后保留，最终关闭时释放。
    usage: '#global-lifetime'
  - name: minimized-label
    type: String
    default: null
    description: 底部气泡的名称，默认使用 title，未提供时使用本地化通用名称。
    usage: '#full-screen'
  - name: before-close
    type: DialogBeforeCloseFn
    values: "() => Promise<void>"
    description: 无参数的异步关闭校验。仅 Promise resolve 时继续关闭；reject 或抛错时保留弹窗，并用 Notification 显示字符串或 Error.message。未返回 Promise 时阻止关闭。
    default: null
    usage: '#before-close'
  - name: cancel-button-text
    type: String
    values: "按钮文字"
    description: 设置内置取消按钮文字。
    default: null
  - name: cancel-closable
    type: Boolean
    values: "true | false"
    description: 触发取消操作后是否关闭对话框。
    default: true
  - name: confirm-button-text
    type: String
    values: "按钮文字"
    description: 设置内置确认按钮文字。
    default: null
  - name: confirm-closable
    type: Boolean
    values: "true | false"
    description: 触发确认操作后是否关闭对话框。
    default: true
  - name: color
    type: String
    values: "主题色 | RGB | HEX | HSL"
    description: 设置对话框强调色。
    default: primary
  - name: height
    type: String | Number
    values: "CSS 长度"
    description: 设置对话框高度。
    default: null
  - name: mask
    type: Boolean
    values: "true | false"
    description: 是否显示背景遮罩。
    default: true
  - name: mask-closable
    type: Boolean
    values: "true | false"
    description: 点击遮罩后是否关闭对话框。
    default: true
  - name: min-height
    type: String | Number
    values: "CSS 长度"
    description: 设置对话框最小高度。
    default: null
  - name: min-width
    type: String | Number
    values: "CSS 长度"
    description: 设置对话框最小宽度。
    default: null
  - name: show-close
    type: Boolean
    values: "true | false"
    description: 是否显示关闭按钮。
    default: true
  - name: show-header
    type: Boolean
    values: "true | false"
    description: 是否显示内置标题区域。
    default: true
  - name: top
    type: String | Number
    values: "CSS 长度"
    description: 设置对话框顶部偏移。
    default: null
  - name: v-model
    type: Boolean
    values: "true,false"
    description: 是否显示对话框。
    default: false
    link: null
    usage: '#default'
    code: null

  - name: not-center
    type: Boolean
    values: "true, false"
    description: 默认标题栏内容居中；启用后取消居中。
    default: false
    link: null
    usage: '#type'
    code: null

  - name: width
    type: String
    values: "px"
    description: 设置对话框宽度。
    default: null
    link: null
    usage: '#type'
    code: null

  - name: loading
    type: Boolean
    values: "true, false"
    description: 为对话框添加加载动画。
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: not-close
    type: Boolean
    values: "true, false"
    description: 隐藏对话框关闭按钮。
    default: false
    link: null
    usage: '#no-close-button'
    code: null

  - name: scroll
    type: Boolean
    values: "true, false"
    description: 限制内容最大高度，溢出时显示滚动条。
    default: false
    link: null
    usage: '#scroll'
    code: null

  - name: lock-scroll
    type: Boolean
    values: "true, false"
    description: 打开对话框时锁定页面滚动。
    default: false
    link: null
    usage: '#lock-scroll-body'
    code: null

  - name: auto-width
    type: Boolean
    values: "true, false"
    description: 使对话框宽度自动适应内容。
    default: false
    link: null
    usage: '#scroll'
    code: null

  - name: not-padding
    type: Boolean
    values: "true, false"
    description: 移除对话框基础内容区域内边距。
    default: false
    link: null
    usage: '#not-padding'
    code: null

  - name: full-screen
    type: Boolean
    values: "true, false"
    description: 使对话框占满窗口。
    default: false
    link: null
    usage: '#full-screen'
    code: null

  - name: overlay-blur
    type: Boolean
    values: "true, false"
    description: 打开时使背景元素模糊。
    default: false
    link: null
    usage: '#overlay-blur'
    code: null

  - name: shape
    type: String
    values: "rounded | square"
    description: 设置圆角或方形对话框外观。
    default: rounded
    link: null
    usage: '#shape'
    code: null

  - name: prevent-close
    type: Boolean
    values: "true, false"
    description: 限制遮罩点击和 Esc 关闭，不影响主动关闭入口。
    default: false
    link: null
    usage: '#restrict-dismissal'
    code: null
  - name: title
    type: String | Number
    values: "header text"
    description: 未使用 header 插槽时显示的内置标题。
    default: null
    usage: '#custom-footer'
  - name: content
    type: String | Number
    values: "content text"
    description: 未使用默认插槽时显示的内置内容。
    default: null
    usage: '#imperative'
  - name: show-footer
    type: Boolean
    values: "true | false"
    description: 是否显示内置操作区。
    default: false
    usage: '#custom-footer'
  - name: show-cancel-button
    type: Boolean
    values: "true | false"
    description: 是否在内置操作区显示取消按钮。
    default: false
    usage: '#before-confirm'
  - name: show-confirm-button
    type: Boolean
    values: "true | false"
    description: 是否在内置操作区显示确认按钮。
    default: false
    usage: '#before-confirm'

EVENTS:
  - name: close-error
    type: '(error: unknown) => void'
    description: 关闭校验被拒绝、抛错或未返回 Promise 时触发；组件同时显示拒绝提示。
    usage: '#before-close'
  - name: confirm-error
    type: "(error: unknown) => void"
    description: 提交前校验抛错或 Promise 拒绝时触发。
    usage: '#before-confirm'
  - name: minimize
    description: 最小化后触发，不修改 v-model。
  - name: restore
    description: 从底部气泡恢复后触发。
  - name: close
    type: Function
    values: "null"
    description: 对话框关闭时触发。
    default: null
    link: null
    usage: null
    code: >
      <s-dialog @close="handleClose" v-model="active">
        ...
      </s-dialog>

EXPOSES:
  - name: closePending
    type: Boolean
    description: 是否正在等待关闭校验。同一校验期间重复关闭请求会合并。
    usage: '#before-close'
  - name: confirm
    type: "() => Promise<void> | undefined"
    description: 执行与内置确认按钮相同的校验和提交流程。
    usage: '#before-confirm'
  - name: minimize
    type: '() => void'
    description: 将已打开且允许最小化的弹窗收起到底部。
    usage: '#full-screen'
  - name: restore
    type: '() => void'
    description: 恢复最小化弹窗并还原焦点。
    usage: '#full-screen'
  - name: open
    type: '() => void'
    description: 打开弹窗。
  - name: close
    type: '() => Promise<boolean> | undefined'
    description: 通过 before-close 请求关闭，返回是否获准进入关闭流程；最终关闭完成通过 closed 事件观察。
SLOTS:
  - name: default
    type: slot
    values: "null"
    description: Dialog 默认内容插槽。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: header
    type: slot
    values: "null"
    description: Dialog 标题插槽。
    default: null
    link: null
    usage: '#default'
    code: null

  - name: footer
    type: Slot
    scope: DialogFooterScope
    description: Dialog 页脚插槽。
    default: null
    link: null
    usage: '#custom-footer'
    code: >
      <s-dialog>
        <template #footer>
          <h1>This is slot footer</h1>
        </template>
      </s-dialog>
---

# Dialog 对话框



<card>

## 默认

<docs-warn />

使用 `s-dialog` 可创建高度可定制的对话框；通过插槽可组合任意业务界面。表单输入框使用 `block` 属性填满可用宽度。

<template #example>
<dialog-zh-default />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/dialog-zh/default.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog-zh/default.vue)

</template>

<template #style>

@[code{44-97}](../../.vuepress/components/dialog-zh/default.vue)

</template>

</card>

<card>

## 类型

通过 `header`、默认和 `footer` 插槽，可快速创建 **提示**、**确认** 等常见对话框结构。

<template #example>
<dialog-type />
</template>

<template #template>

@[code{1-70}](../../.vuepress/components/dialog/type.vue)

</template>

<template #script>

@[code{71-78}](../../.vuepress/components/dialog/type.vue)

</template>

<template #style>

@[code{80-136}](../../.vuepress/components/dialog/type.vue)

</template>

</card>

<card>

## 加载

通过 `loading` 属性为对话框添加加载动画。

<template #example>
<dialog-zh-loading />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/dialog-zh/loading.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog-zh/loading.vue)

</template>

<template #style>

@[code{45-98}](../../.vuepress/components/dialog-zh/loading.vue)

</template>

</card>

<card>

## 无关闭按钮

通过 `not-close` 属性隐藏右上角的关闭按钮。其他关闭方式仍由各自的配置控制。

<template #example>
<dialog-zh-not-close />
</template>

<template #template>

@[code{1-33}](../../.vuepress/components/dialog-zh/not-close.vue)

</template>

<template #script>

@[code{34-41}](../../.vuepress/components/dialog-zh/not-close.vue)

</template>

<template #style>

@[code{42-95}](../../.vuepress/components/dialog-zh/not-close.vue)

</template>

</card>

<card>

## 滚动

对话框内容较多时，可使用 `scroll` 属性启用滚动。

<template #example>
<dialog-scroll />
</template>

<template #template>

@[code{1-80}](../../.vuepress/components/dialog/scroll.vue)

</template>

<template #script>

@[code{82-86}](../../.vuepress/components/dialog/scroll.vue)

</template>

<template #style>

@[code{88-98}](../../.vuepress/components/dialog/scroll.vue)

</template>

</card>

<card>

## 锁定页面滚动

需要在打开对话框时锁定页面滚动，可使用 `lock-scroll` 属性。

<template #example>
<dialog-zh-lock-scroll />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/dialog-zh/lock-scroll.vue)

</template>

<template #script>

@[code{36-43}](../../.vuepress/components/dialog-zh/lock-scroll.vue)

</template>

<template #style>

@[code{44-97}](../../.vuepress/components/dialog-zh/lock-scroll.vue)

</template>

</card>

<card>

## 无内边距

需要移除对话框内边距以构建自定义界面时，可使用 `not-padding` 属性。

<template #example>
<dialog-not-padding />
</template>

<template #template>

@[code{1-12}](../../.vuepress/components/dialog/not-padding.vue)

</template>

<template #script>

@[code{14-18}](../../.vuepress/components/dialog/not-padding.vue)

</template>

<template #style>

@[code{20-30}](../../.vuepress/components/dialog/not-padding.vue)

</template>

</card>

<card>

## 嵌套对话框

可按需嵌套多个 `s-dialog`。

<template #example>
<dialog-zh-nested />
</template>

<template #template>

@[code{1-41}](../../.vuepress/components/dialog-zh/nested.vue)

</template>

<template #script>

@[code{42-50}](../../.vuepress/components/dialog-zh/nested.vue)

</template>

<template #style>

@[code{52-105}](../../.vuepress/components/dialog-zh/nested.vue)

</template>

</card>

<card>

## 全屏

`full-screen` 弹窗默认显示最小化入口；`:minimizable="false"` 可隐藏入口。最小化保留内容实例与表单状态，不改变 `v-model`，并释放遮罩和页面滚动锁。底部气泡可恢复或关闭弹窗，关闭仍遵循 `before-close`；多个气泡并排展示。使用 `minimized-label` 设置气泡名称。

<template #example>
<dialog-zh-full-screen />
</template>

<template #template>

@[code{7-21}](../../.vuepress/components/dialog-zh/full-screen.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/dialog-zh/full-screen.vue)

</template>

</card>

<card>

## 遮罩模糊

通过 `overlay-blur` 可为对话框后的元素添加模糊样式；该功能依赖 CSS 属性 [backdrop-filter](https://caniuse.com/#feat=css-backdrop-filter)。

<template #example>
<dialog-zh-blur />
</template>

<template #template>

@[code{1-33}](../../.vuepress/components/dialog-zh/blur.vue)

</template>

<template #script>

@[code{35-42}](../../.vuepress/components/dialog-zh/blur.vue)

</template>

<template #style>

@[code{44-97}](../../.vuepress/components/dialog-zh/blur.vue)

</template>

</card>

<card>

## 形状

移除对话框圆角，使其变为直角矩形。

<template #example>
<dialog-zh-square />
</template>

<template #template>

@[code{1-35}](../../.vuepress/components/dialog-zh/square.vue)

</template>

<template #script>

@[code{37-44}](../../.vuepress/components/dialog-zh/square.vue)

</template>

<template #style>

@[code{46-99}](../../.vuepress/components/dialog-zh/square.vue)

</template>

</card>

<card>

## 限制关闭方式

设置 `prevent-close` 后，点击遮罩或按 **Esc** 键不会关闭对话框。关闭按钮、确认／取消操作以及程序调用仍遵循各自的关闭配置和 `before-close` 校验。

<template #example>
<dialog-zh-prevent-close />
</template>

<template #template>

@[code{1-33}](../../.vuepress/components/dialog-zh/prevent-close.vue)

</template>

<template #script>

@[code{35-42}](../../.vuepress/components/dialog-zh/prevent-close.vue)

</template>

<template #style>

@[code{44-97}](../../.vuepress/components/dialog-zh/prevent-close.vue)

</template>

</card>

<card>

## 自定义页脚

通过 `footer` 插槽自定义操作区布局。使用作用域中的 `confirm`、`cancel` 回调复用确认和取消流程，通过 `pending`、`closePending` 和 `disabled` 同步按钮及状态提示。示例设置 `confirm-closable="false"`，异步确认后保持打开，便于观察事件；取消后关闭。

<template #example>
<dialog-zh-footer />
</template>

<template #template>

@[code{29-68}](../../.vuepress/components/dialog-zh/footer.vue)

</template>

<template #script>

@[code{1-27}](../../.vuepress/components/dialog-zh/footer.vue)

</template>

<template #style>

@[code{70-100}](../../.vuepress/components/dialog-zh/footer.vue)

</template>

</card>

<card>

## 关闭前校验

`before-close` 使用 `() => Promise<void>`，不接收回调参数。返回 `Promise.resolve()` 或完成 `async` 函数才会进入关闭流程；`Promise.reject('原因')` 或抛出 `Error` 会阻止关闭并弹出原因。关闭按钮、遮罩、Escape、取消、确认后的关闭、气泡关闭、实例 `close()` 及 `v-model` 关闭请求共用这一校验。最小化本身不触发校验。

等待期间保留弹窗与遮罩，关闭按钮显示 loading，重复请求复用同一次校验。拒绝受控关闭时会回写 `v-model=true`。`close-error` 可用于记录拒绝；自定义 footer 提供 `closePending`。卸载或重新打开后，过期结果不会关闭新实例或弹出提示。`SDialogBox` 也遵循此流程，并在真正关闭及清理后才结束调用 Promise。 关闭指示器先完成前摇，再让彩色线条在四个点收起消失，之后进入退出流程；确认按钮仍使用默认的标志还原后摇。瞬间完成而未显示的 loading 不额外等待，减少动态效果或页面不可见时直接结束动效。

<template #example>
<dialog-zh-before-close />
</template>

<template #template>

@[code{25-45}](../../.vuepress/components/dialog-zh/before-close.vue)

</template>

<template #script>

@[code{1-23}](../../.vuepress/components/dialog-zh/before-close.vue)

</template>

<template #style>

@[code{47-60}](../../.vuepress/components/dialog-zh/before-close.vue)

</template>

</card>

<card>

## 全局生命周期

默认情况下，弹窗和气泡随所属组件销毁。创建时传入 `global` 后，同一弹窗实例在所属组件销毁后仍可恢复，直到用户关闭；页面刷新不保留。请在创建实例前确定 `global`，运行中切换该属性不会迁移实例。全局实例保留当时的插槽、注入上下文与回调；所属组件销毁后不再接收它的新属性。调用方负责回调引用、异步任务和订阅资源，避免访问已销毁的页面实例。

<template #example>
<dialog-zh-global />
</template>

<template #template>

@[code{40-58}](../../.vuepress/components/dialog-zh/global.vue)

</template>

<template #script>

@[code{1-38}](../../.vuepress/components/dialog-zh/global.vue)

</template>

<template #style>

@[code{60-74}](../../.vuepress/components/dialog-zh/global.vue)

</template>

</card>

<card>

## 命令式调用

完整安装 `app.use(SaxDesignVue)` 后可用 `$dialog`；按需使用可导入 `SDialogBox`，也可通过 `app.use(SDialogBox)` 绑定应用上下文。

`SDialogBox` 与 `$dialog` 复用 Dialog 的内容、按钮和生命周期，无需声明模板。`alert()` 返回动作；`confirm()` 确认后返回 true，取消或关闭时拒绝为 cancel 或 close。直接调用返回 confirm、cancel、close 之一，并在关闭动画结束及实例清理后完成。命令式实例自行管理生命周期，调用方必须处理 confirm() 的取消分支。

<template #example>
<dialog-zh-imperative />
</template>

<template #template>

@[code{23-31}](../../.vuepress/components/dialog-zh/imperative.vue)

</template>

<template #script>

@[code{1-21}](../../.vuepress/components/dialog-zh/imperative.vue)

</template>

<template #style>

@[code{33-46}](../../.vuepress/components/dialog-zh/imperative.vue)

</template>

</card>

<card>

## 提交前校验

`before-confirm` 可调用 `SForm.validate()` 并等待异步操作。返回 false 时保留弹窗，等待期间确认按钮显示 loading，重复提交会被忽略；取消或关闭后，过期结果不会再次触发 confirm。抛错会触发 confirm-error，可用于显示业务错误。自定义 footer 可使用其作用域中的 confirm、cancel、pending、disabled，复用同一流程。

<template #example>
<dialog-zh-validation />
</template>

<template #template>

@[code{29-46}](../../.vuepress/components/dialog-zh/validation.vue)

</template>

<template #script>

@[code{1-27}](../../.vuepress/components/dialog-zh/validation.vue)

</template>

<template #style>

@[code{48-57}](../../.vuepress/components/dialog-zh/validation.vue)

</template>

</card>
