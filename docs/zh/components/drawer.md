---
description: '从页面边缘打开的可配置面板，支持关闭校验、完整插槽、嵌套和尺寸调整。'
PROPS:
  - name: 'model-value'
    type: 'Boolean'
    values: 'true | false'
    description: '控制可见状态；提供 open 时优先使用 open。'
    default: false
    usage: '#default'
  - name: 'v-model'
    type: 'Boolean'
    values: 'true | false'
    description: '控制可见状态；提供 open 时优先使用 open。'
    default: false
    usage: '#default'
  - name: 'open'
    type: 'Boolean'
    values: 'true | false'
    description: '控制可见状态；提供 open 时优先使用 open。'
    default: null
    usage: '#default'
  - name: 'v-model:open'
    type: 'Boolean'
    values: 'true | false'
    description: '控制可见状态；提供 open 时优先使用 open。'
    default: false
    usage: '#default'
  - name: 'placement'
    type: 'DrawerPlacement'
    values: 'left | right | top | bottom'
    description: '抽屉打开的边缘方向。'
    default: 'right'
    usage: '#placement-and-size'
  - name: 'direction'
    type: 'DrawerDirection'
    values: 'ltr | rtl | ttb | btt'
    description: '方向兼容写法；提供时覆盖 placement。'
    default: null
    usage: '#placement-and-size'
  - name: 'size'
    type: 'String | Number'
    values: 'CSS length | default | large'
    description: '左右方向表示宽度，上下方向表示高度；default 为 360px，large 为 736px。'
    default: '360px'
    usage: '#placement-and-size'
  - name: 'width'
    type: 'String | Number'
    values: 'CSS length'
    description: '左右方向时覆盖 size。'
    default: null
    usage: '#placement-and-size'
  - name: 'height'
    type: 'String | Number'
    values: 'CSS length'
    description: '上下方向时覆盖 size。'
    default: null
    usage: '#placement-and-size'
  - name: 'title'
    type: 'DrawerContent'
    values: 'String | VNodeChild | render function'
    description: '对应区域内容；同名插槽优先。'
    default: null
    usage: '#slots-and-regions'
  - name: 'extra'
    type: 'DrawerContent'
    values: 'String | VNodeChild | render function'
    description: '对应区域内容；同名插槽优先。'
    default: null
    usage: '#slots-and-regions'
  - name: 'footer'
    type: 'DrawerContent'
    values: 'String | VNodeChild | render function'
    description: '对应区域内容；同名插槽优先。'
    default: null
    usage: '#slots-and-regions'
  - name: 'with-header'
    type: 'Boolean'
    values: 'true | false'
    description: '是否显示标题区域；隐藏后仍可保留独立关闭按钮。'
    default: true
    usage: '#slots-and-regions'
  - name: 'show-close'
    type: 'Boolean'
    values: 'true | false'
    description: '独立于标题控制内置关闭按钮。'
    default: true
    usage: '#slots-and-regions'
  - name: 'closable'
    type: 'Boolean'
    values: 'true | false'
    description: 'show-close 的兼容别名，提供时优先。'
    default: null
    usage: '#slots-and-regions'
  - name: 'close-icon'
    type: 'DrawerContent'
    values: 'icon name | VNodeChild | render function'
    description: '自定义关闭图标；close-icon 插槽优先。'
    default: null
    usage: '#slots-and-regions'
  - name: 'header-aria-level'
    type: 'String | Number'
    values: '1–6'
    description: '默认标题的无障碍层级。'
    default: 2
    usage: '#slots-and-regions'
  - name: 'aria-label'
    type: 'String'
    values: 'accessible name'
    description: '无障碍名称，适用于没有可见标题的抽屉。'
    default: null
    usage: '#slots-and-regions'
  - name: 'mask'
    type: 'Boolean'
    values: 'true | false'
    description: '是否显示遮罩。'
    default: true
    usage: '#mounting-and-modality'
  - name: 'modal'
    type: 'Boolean'
    values: 'true | false'
    description: 'mask 的兼容别名，提供时优先。'
    default: null
    usage: '#mounting-and-modality'
  - name: 'modal-penetrable'
    type: 'Boolean'
    values: 'true | false'
    description: 'mask 为 false 时允许操作页面；此模式默认不限制焦点。'
    default: false
    usage: '#mounting-and-modality'
  - name: 'mask-closable'
    type: 'Boolean'
    values: 'true | false'
    description: '点击遮罩申请关闭；有 before-close 时，只有实例明确传入 true 才启用。'
    default: 'true；有校验时需实例明确启用'
    usage: '#before-close'
  - name: 'close-on-click-modal'
    type: 'Boolean'
    values: 'true | false'
    description: 'mask-closable 的兼容别名，遵循相同的校验显式启用规则。'
    default: null
    usage: '#before-close'
  - name: 'keyboard'
    type: 'Boolean'
    values: 'true | false'
    description: '允许最上层抽屉按 Escape 申请关闭。'
    default: true
    usage: '#before-close'
  - name: 'close-on-press-escape'
    type: 'Boolean'
    values: 'true | false'
    description: 'keyboard 的兼容别名，提供时优先。'
    default: null
    usage: '#before-close'
  - name: 'before-close'
    type: 'DrawerBeforeCloseFn'
    values: 'Promise approval | done(cancel?) callback'
    description: '关闭控件、实例 close 和 v-model=false 请求的校验。拒绝时保留抽屉并提示原因；false 或 done(true) 静默阻止关闭。'
    default: null
    usage: '#before-close'
  - name: 'teleported'
    type: 'Boolean'
    values: 'true | false'
    description: '是否传送到指定挂载位置。'
    default: true
    usage: '#mounting-and-modality'
  - name: 'append-to-body'
    type: 'Boolean'
    values: 'true | false'
    description: 'teleported 的兼容别名。'
    default: null
    usage: '#mounting-and-modality'
  - name: 'append-to'
    type: 'String | HTMLElement'
    values: 'CSS selector | HTMLElement'
    description: '挂载目标，优先于 get-container；容器需要定位上下文。'
    default: null
    usage: '#mounting-and-modality'
  - name: 'get-container'
    type: 'DrawerContainer'
    values: 'selector | HTMLElement | function | false'
    description: '兼容挂载目标获取方式；false 表示原地渲染。'
    default: null
    usage: '#mounting-and-modality'
  - name: 'lock-scroll'
    type: 'Boolean'
    values: 'true | false'
    description: '展示期间锁定页面滚动；嵌套弹层共享锁定状态。'
    default: true
    usage: '#mounting-and-modality'
  - name: 'auto-focus'
    type: 'Boolean'
    values: 'true | false'
    description: '自动聚焦面板；open-auto-focus 可阻止默认操作。'
    default: true
    usage: '#before-close'
  - name: 'autofocus'
    type: 'Boolean'
    values: 'true | false'
    description: 'auto-focus 的兼容别名。'
    default: null
    usage: '#before-close'
  - name: 'trap-focus'
    type: 'Boolean'
    values: 'true | false'
    description: '将键盘焦点限制在最上层抽屉；除可穿透模式外默认启用。'
    default: null
    usage: '#before-close'
  - name: 'restore-focus'
    type: 'Boolean'
    values: 'true | false'
    description: '关闭完成后恢复触发元素焦点；close-auto-focus 可阻止默认操作。'
    default: true
    usage: '#before-close'
  - name: 'open-delay'
    type: 'Number'
    values: 'milliseconds'
    description: '打开请求的展示延迟，单位毫秒。'
    default: 0
    usage: '#content-lifecycle'
  - name: 'close-delay'
    type: 'Number'
    values: 'milliseconds'
    description: '获准关闭后的延迟；祖先组件关闭或销毁不等待此延迟。'
    default: 0
    usage: '#content-lifecycle'
  - name: 'destroy-on-close'
    type: 'Boolean'
    values: 'true | false'
    description: '关闭动画结束后销毁内容。'
    default: false
    usage: '#content-lifecycle'
  - name: 'force-render'
    type: 'Boolean'
    values: 'true | false'
    description: '首次打开前渲染内容，优先于 destroy-on-close。'
    default: false
    usage: '#content-lifecycle'
  - name: 'z-index'
    type: 'Number'
    values: 'stack level'
    description: '覆盖共享弹层层级；内部弹出面板使用更高层级。'
    default: null
    usage: '#nested-drawers'
  - name: 'push'
    type: 'Boolean | DrawerPushOptions'
    values: 'false | true | { distance: CSS length }'
    description: '子抽屉打开时推开父面板；默认距离为 180px。'
    default: true
    usage: '#nested-drawers'
  - name: 'loading'
    type: 'Boolean'
    values: 'true | false'
    description: '显示内容加载状态并保留内容实例；完成后摇后恢复内容。'
    default: false
    usage: '#loading'
  - name: 'resizable'
    type: 'Boolean'
    values: 'true | false'
    description: '启用支持键盘操作的边缘尺寸调整。'
    default: false
    usage: '#resizable'
  - name: 'min-size'
    type: 'String | Number'
    values: 'CSS length'
    description: '最小调整尺寸，会限制在可用容器范围内。'
    default: 120
    usage: '#resizable'
  - name: 'max-size'
    type: 'String | Number'
    values: 'CSS length'
    description: '最大调整尺寸，默认可用容器尺寸。'
    default: null
    usage: '#resizable'
  - name: 'resize-step'
    type: 'Number'
    values: 'pixels'
    description: '方向键调整步长；Shift 放大为五倍。'
    default: 10
    usage: '#resizable'
  - name: 'resize-label'
    type: 'String'
    values: 'accessible name'
    description: '尺寸调整手柄的无障碍名称。'
    default: null
    usage: '#resizable'
  - name: 'shape'
    type: 'String'
    values: 'rounded | square'
    description: '通过共享外形配置解析面板几何。'
    default: 'ConfigProvider 或 rounded'
    usage: '#shape'
  - name: 'root-class-name'
    type: 'String'
    values: 'class name'
    description: '为对应区域附加类名。'
    default: null
    usage: '#slots-and-regions'
  - name: 'modal-class'
    type: 'String'
    values: 'class name'
    description: '为对应区域附加类名。'
    default: null
    usage: '#slots-and-regions'
  - name: 'header-class'
    type: 'String'
    values: 'class name'
    description: '为对应区域附加类名。'
    default: null
    usage: '#slots-and-regions'
  - name: 'body-class'
    type: 'String'
    values: 'class name'
    description: '为对应区域附加类名。'
    default: null
    usage: '#slots-and-regions'
  - name: 'footer-class'
    type: 'String'
    values: 'class name'
    description: '为对应区域附加类名。'
    default: null
    usage: '#slots-and-regions'
  - name: 'root-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: '为对应区域设置样式，不替换内置结构。'
    default: null
    usage: '#slots-and-regions'
  - name: 'content-wrapper-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: '为对应区域设置样式，不替换内置结构。'
    default: null
    usage: '#slots-and-regions'
  - name: 'mask-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: '为对应区域设置样式，不替换内置结构。'
    default: null
    usage: '#slots-and-regions'
  - name: 'header-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: '为对应区域设置样式，不替换内置结构。'
    default: null
    usage: '#slots-and-regions'
  - name: 'body-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: '为对应区域设置样式，不替换内置结构。'
    default: null
    usage: '#slots-and-regions'
  - name: 'footer-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: '为对应区域设置样式，不替换内置结构。'
    default: null
    usage: '#slots-and-regions'
  - name: 'class-names'
    type: 'DrawerRegionClasses'
    values: 'mask | wrapper | header | body | footer'
    description: '按语义区域设置类名。'
    default: null
    usage: '#slots-and-regions'
  - name: 'styles'
    type: 'DrawerRegionStyles'
    values: 'mask | wrapper | header | body | footer'
    description: '按语义区域设置样式。'
    default: null
    usage: '#slots-and-regions'
SLOTS:
  - name: 'default'
    type: Slot
    scope: DrawerSlotScope
    description: '默认内容。'
    usage: '#slots-and-regions'
  - name: 'header'
    type: Slot
    scope: DrawerSlotScope
    description: '替换标题内容，保留关闭按钮和 extra。'
    usage: '#slots-and-regions'
  - name: 'title'
    type: Slot
    scope: DrawerSlotScope
    description: '自定义默认标题内容。'
    usage: '#slots-and-regions'
  - name: 'extra'
    type: Slot
    scope: DrawerSlotScope
    description: '标题额外操作。'
    usage: '#slots-and-regions'
  - name: 'footer'
    type: Slot
    scope: DrawerSlotScope
    description: '页脚操作。'
    usage: '#slots-and-regions'
  - name: 'close-icon'
    type: Slot
    scope: DrawerSlotScope
    description: '关闭按钮图标。'
    usage: '#slots-and-regions'
  - name: 'closeIcon'
    type: Slot
    scope: DrawerSlotScope
    description: 'close-icon 的兼容别名。'
    usage: '#slots-and-regions'
  - name: 'loading'
    type: Slot
    scope: DrawerSlotScope
    description: '自定义内容加载反馈。'
    usage: '#loading'
  - name: 'mask'
    type: Slot
    scope: DrawerSlotScope
    description: '遮罩装饰内容。'
    usage: '#mounting-and-modality'
  - name: 'resizer'
    type: Slot
    scope: DrawerSlotScope
    description: '尺寸手柄内容，保留内置拖动与键盘行为。'
    usage: '#resizable'
EVENTS:
  - name: 'update:modelValue'
    type: 'Boolean'
    description: '可见状态更新。'
  - name: 'update:open'
    type: 'Boolean'
    description: '可见状态别名更新。'
  - name: 'update:size'
    type: 'Number'
    description: '调整尺寸的像素值。'
  - name: 'update:width'
    type: 'Number'
    description: '调整后的横向尺寸。'
  - name: 'update:height'
    type: 'Number'
    description: '调整后的纵向尺寸。'
  - name: 'before-open'
    type: '() => void'
    description: '开始打开。'
  - name: 'before-close'
    type: '() => void'
    description: '获准关闭后开始退出。'
  - name: 'open'
    type: '() => void'
    description: '打开动画完成。'
  - name: 'opened'
    type: '() => void'
    description: '打开动画完成。'
  - name: 'close'
    type: '() => void'
    description: '关闭动画完成。'
  - name: 'closed'
    type: '() => void'
    description: '关闭动画完成。'
  - name: 'after-open-change'
    type: 'Boolean'
    description: '动画完成，携带最终可见状态。'
  - name: 'close-request'
    type: 'DrawerCloseReason'
    description: '关闭请求，第二个可选参数为触发事件。'
  - name: 'close-error'
    type: 'unknown'
    description: '校验拒绝或失败，第二个参数为关闭来源。'
  - name: 'open-auto-focus'
    type: 'Event'
    description: '默认聚焦前触发，可通过 preventDefault 阻止。'
  - name: 'close-auto-focus'
    type: 'Event'
    description: '恢复触发元素焦点前触发，可通过 preventDefault 阻止。'
  - name: 'resize-start'
    type: 'DrawerResizeEvent'
    description: '拖动或键盘尺寸调整开始。'
  - name: 'resize'
    type: 'DrawerResizeEvent'
    description: '尺寸更新。'
  - name: 'resize-end'
    type: 'DrawerResizeEvent'
    description: '尺寸调整完成或被终止。'
EXPOSES:
  - name: 'open'
    type: '() => void'
    description: '申请打开。'
  - name: 'handleOpen'
    type: '() => void'
    description: 'open 的别名。'
  - name: 'close'
    type: '(reason?: DrawerCloseReason) => Promise<boolean>'
    description: '申请校验关闭，返回是否获准。'
  - name: 'handleClose'
    type: '(reason?: DrawerCloseReason) => Promise<boolean>'
    description: 'close 的别名。'
  - name: 'focus'
    type: '() => void'
    description: '聚焦面板。'
  - name: 'visible'
    type: 'Boolean'
    description: '当前展示状态。'
  - name: 'size'
    type: 'String | Number'
    description: '当前尺寸，包含本地调整结果。'
  - name: 'resizing'
    type: 'Boolean'
    description: '是否正在进行拖动调整。'
---

# Drawer（抽屉）

<card>

## 默认

通过 v-model 打开抽屉，并使用 footer 作用域中的 close 申请关闭。

<template #example>
<drawer-zh-default />
</template>

<template #template>

@[code{7-19}](../../.vuepress/components/drawer-zh/default.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/drawer-zh/default.vue)

</template>

<template #style>

@[code{21-28}](../../.vuepress/components/drawer-zh/default.vue)

</template>

</card>

<card>

## 方向与尺寸

选择四个方向与 CSS 长度或 default/large 预设，也支持 direction 的 ltr/rtl/ttb/btt 写法。

<template #example>
<drawer-zh-placement />
</template>

<template #template>

@[code{21-37}](../../.vuepress/components/drawer-zh/placement.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/drawer-zh/placement.vue)

</template>

<template #style>

@[code{39-46}](../../.vuepress/components/drawer-zh/placement.vue)

</template>

</card>

<card>

## 插槽与区域

header、title、extra、footer 与关闭图标彼此独立。作用域提供 close、titleId、titleClass、状态和当前尺寸；区域样式覆盖遮罩、外壳、标题、内容和页脚。

<template #example>
<drawer-zh-slots />
</template>

<template #template>

@[code{9-39}](../../.vuepress/components/drawer-zh/slots.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/drawer-zh/slots.vue)

</template>

<template #style>

@[code{41-48}](../../.vuepress/components/drawer-zh/slots.vue)

</template>

</card>

<card>

## 关闭前校验

返回 Promise 或接收 done(cancel?)。拒绝会提示原因，false 或 done(true) 静默保留抽屉。受控关闭请求共用校验；有校验时，遮罩点击须实例明确传入 true。重复请求复用校验，关闭前等待 loading 后摇。组件销毁及祖先强制关闭会释放待处理任务。

<template #example>
<drawer-zh-before-close />
</template>

<template #template>

@[code{24-46}](../../.vuepress/components/drawer-zh/before-close.vue)

</template>

<template #script>

@[code{1-22}](../../.vuepress/components/drawer-zh/before-close.vue)

</template>

<template #style>

@[code{48-59}](../../.vuepress/components/drawer-zh/before-close.vue)

</template>

</card>

<card>

## 内容生命周期

内容默认懒渲染并在关闭后保留。destroy-on-close 在退出后重置组件内状态；force-render 提前挂载并保留内容。open-delay 和 close-delay 控制请求时序。open/close 与 opened/closed 均表示动画完成，before-open/before-close 表示开始。

<template #example>
<drawer-zh-lifecycle />
</template>

<template #template>

@[code{21-40}](../../.vuepress/components/drawer-zh/lifecycle.vue)

</template>

<template #script>

@[code{1-19}](../../.vuepress/components/drawer-zh/lifecycle.vue)

</template>

<template #style>

@[code{42-49}](../../.vuepress/components/drawer-zh/lifecycle.vue)

</template>

</card>

<card>

## 嵌套抽屉

嵌套抽屉共享层级、Escape 所有权与滚动锁。push 控制父面板位移；父抽屉关闭时也会关闭可见子抽屉。

<template #example>
<drawer-zh-nested />
</template>

<template #template>

@[code{9-30}](../../.vuepress/components/drawer-zh/nested.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/drawer-zh/nested.vue)

</template>

<template #style>

@[code{32-39}](../../.vuepress/components/drawer-zh/nested.vue)

</template>

</card>

<card>

## 挂载与非模态

默认启用 Teleport。append-to/get-container 指定目标；teleported=false 或 get-container=false 原地渲染。具有定位上下文的容器提供局部边界；mask=false 搭配 modal-penetrable 和 lock-scroll=false 允许操作页面。

<template #example>
<drawer-zh-container />
</template>

<template #template>

@[code{11-41}](../../.vuepress/components/drawer-zh/container.vue)

</template>

<template #script>

@[code{1-9}](../../.vuepress/components/drawer-zh/container.vue)

</template>

<template #style>

@[code{43-59}](../../.vuepress/components/drawer-zh/container.vue)

</template>

</card>

<card>

## 加载

加载期间保留默认内容实例。loading 插槽提供当前加载请求，可替换指示器；基于 SLogoLoading 的指示器会参与结束等待。

<template #example>
<drawer-zh-loading />
</template>

<template #template>

@[code{9-24}](../../.vuepress/components/drawer-zh/loading.vue)

</template>

<template #script>

@[code{1-7}](../../.vuepress/components/drawer-zh/loading.vue)

</template>

<template #style>

@[code{26-33}](../../.vuepress/components/drawer-zh/loading.vue)

</template>

</card>

<card>

## 调整尺寸

拖动边缘，手柄也支持方向键、Shift、Home 和 End。v-model:size 接收像素值，update:width/update:height 对应当前轴；调整事件提供 size、placement 与输入事件。

<template #example>
<drawer-zh-resizable />
</template>

<template #template>

@[code{12-37}](../../.vuepress/components/drawer-zh/resizable.vue)

</template>

<template #script>

@[code{1-10}](../../.vuepress/components/drawer-zh/resizable.vue)

</template>

<template #style>

@[code{39-46}](../../.vuepress/components/drawer-zh/resizable.vue)

</template>

</card>

<card>

## 外形

圆角与方形面板遵循组件属性及共享配置。

<template #example>
<drawer-zh-shape />
</template>

<template #template>

@[code{8-21}](../../.vuepress/components/drawer-zh/shape.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/drawer-zh/shape.vue)

</template>

<template #style>

@[code{23-30}](../../.vuepress/components/drawer-zh/shape.vue)

</template>

</card>
