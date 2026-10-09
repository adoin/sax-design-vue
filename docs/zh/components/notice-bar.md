---
description: "支持多条公告、溢出滚动、固定操作区与受控显示的公告栏。"
PROPS:
  - name: "content"
    type: "String"
    values: "text"
    description: "未提供内容插槽时的公告文本。"
    default: null
    usage: "#default"
  - name: "items"
    type: "Array<string | NoticeBarItem>"
    values: "string | NoticeBarItem"
    description: "多条公告数据；每条可设置 content、type、icon、href、target 和 disabled。"
    default: "[]"
    usage: "#multiple-notices"
  - name: "model-value"
    type: "Boolean"
    values: "true | false"
    description: "控制显示状态；省略时由组件内部管理关闭状态。"
    default: null
    usage: "#controlled-visibility"
  - name: "v-model"
    type: "Boolean"
    values: "true | false"
    description: "双向绑定公告栏显示状态。"
    default: null
    usage: "#controlled-visibility"
  - name: "active-index"
    type: "Number"
    values: "从 0 开始的整数"
    description: "控制当前公告索引，从 0 开始；越界值会限制在有效范围内。"
    default: null
    usage: "#multiple-notices"
  - name: "v-model:active-index"
    type: "Number"
    values: "从 0 开始的整数"
    description: "双向绑定当前公告索引。"
    default: null
    usage: "#multiple-notices"
  - name: "type"
    type: "NoticeBarType"
    values: "info | primary | success | warning | warn | danger"
    description: "默认公告语义类型；单条数据的 type 优先，warn 与 warning 等效。"
    default: "info"
    usage: "#colors-and-tone"
  - name: "color"
    type: "String"
    values: "primary | success | danger | warn | warning | dark | text | light | secondary | RGB | RGBA | HEX | HSL | HSLA"
    description: "自定义公告颜色，优先于 type 对应的颜色。"
    default: null
    usage: "#colors-and-tone"
  - name: "text-color"
    type: "String"
    values: "primary | success | danger | warn | warning | dark | text | light | secondary | RGB | RGBA | HEX | HSL | HSLA"
    description: "自定义前景色，适合搭配自定义实色背景。"
    default: null
    usage: "#variants"
  - name: "variant"
    type: "String"
    values: "soft | solid | plain"
    description: "公告栏视觉样式。"
    default: "soft"
    usage: "#variants"
  - name: "shape"
    type: "ComponentShape"
    values: "rounded | square"
    description: "公告栏外形；省略时继承 ConfigProvider 或安装配置。"
    default: "rounded"
    usage: "#shape"
  - name: "size"
    type: "ComponentSize"
    values: "small | default | large"
    description: "公告栏尺寸，省略时继承全局尺寸。"
    default: null
    usage: "#size"
  - name: "icon"
    type: "String | false"
    values: "图标名称 | false"
    description: "前置图标名称；false 隐藏默认铃铛图标，icon 插槽优先。"
    default: null
    usage: "#links-and-slots"
  - name: "closable"
    type: "Boolean"
    values: "true | false"
    description: "显示独立的关闭按钮。"
    default: false
    usage: "#controlled-visibility"
  - name: "scrollable"
    type: "Boolean"
    values: "true | false"
    description: "允许溢出文本横向滚动；短文本保持静止。"
    default: true
    usage: "#overflow-scrolling"
  - name: "duration"
    type: "Number"
    values: "秒"
    description: "单次文字滚动时长，单位为秒；传入 speed 后按速度计算时长。"
    default: 12
    usage: "#overflow-scrolling"
  - name: "speed"
    type: "Number"
    values: "像素/秒"
    description: "文字滚动速度，单位为像素/秒。"
    default: null
    usage: "#overflow-scrolling"
  - name: "delay"
    type: "Number"
    values: "毫秒"
    description: "文字开始滚动前的等待时间，单位为毫秒。"
    default: 1000
    usage: "#overflow-scrolling"
  - name: "gap"
    type: "Number"
    values: "像素"
    description: "滚动文本首尾之间的间距，单位为像素。"
    default: 32
    usage: "#overflow-scrolling"
  - name: "wrapable"
    type: "Boolean"
    values: "true | false"
    description: "开启自然换行并停止横向滚动。"
    default: false
    usage: "#wrapping-and-truncation"
  - name: "autoplay"
    type: "Boolean"
    values: "true | false"
    description: "多条公告时自动切换到下一条。"
    default: true
    usage: "#multiple-notices"
  - name: "interval"
    type: "Number"
    values: "毫秒，最低 500"
    description: "公告切换间隔，单位为毫秒，最低 500；长文本至少获得等待时间加完整一轮滚动的阅读时间。"
    default: 3000
    usage: "#multiple-notices"
  - name: "loop"
    type: "Boolean"
    values: "true | false"
    description: "导航与轮播是否循环；关闭时在列表边界停止。"
    default: true
    usage: "#multiple-notices"
  - name: "paused"
    type: "Boolean"
    values: "true | false"
    description: "暂停文字滚动和自动切换。"
    default: false
    usage: "#overflow-scrolling"
  - name: "pause-on-hover"
    type: "Boolean"
    values: "true | false"
    description: "鼠标位于公告栏时暂停自动运动。"
    default: true
    usage: "#multiple-notices"
  - name: "pause-on-focus"
    type: "Boolean"
    values: "true | false"
    description: "焦点位于公告栏内时暂停自动运动，仍可手动切换。"
    default: true
    usage: "#multiple-notices"
  - name: "reduced-motion"
    type: "Boolean"
    values: "true | false"
    description: "覆盖系统减少动态效果偏好；开启时停止自动轮播与滚动，并完整换行展示文本。"
    default: null
    usage: "#overflow-scrolling"
  - name: "show-navigation"
    type: "Boolean"
    values: "true | false"
    description: "多条公告时显示上一条、下一条按钮。"
    default: false
    usage: "#multiple-notices"
  - name: "show-indicator"
    type: "Boolean"
    values: "true | false"
    description: "多条公告时显示当前条目与总数。"
    default: false
    usage: "#multiple-notices"
  - name: "href"
    type: "String"
    values: "URL"
    description: "将内容区域设为原生链接；单条数据的 href 优先。"
    default: null
    usage: "#links-and-slots"
  - name: "target"
    type: "String"
    values: "_self | _blank"
    description: "链接打开方式；新窗口链接自动添加 noopener noreferrer。"
    default: "_self"
    usage: "#links-and-slots"
  - name: "clickable"
    type: "Boolean"
    values: "true | false"
    description: "没有链接时，将内容区域设为支持键盘操作的按钮；其他交互控件请放在 actions 插槽。"
    default: false
    usage: "#links-and-slots"
  - name: "live"
    type: "String"
    values: "off | polite | assertive"
    description: "读屏播报策略；单条默认 polite，多条默认 off，role=alert 默认 assertive。"
    default: null
    usage: "#multiple-notices"
SLOTS:
  - name: "default"
    type: Slot
    scope: NoticeBarSlotScope
    description: "默认公告内容。"
    usage: "#links-and-slots"
  - name: "content"
    type: Slot
    scope: NoticeBarSlotScope
    description: "当前公告的内容插槽，优先于默认插槽。"
    usage: "#links-and-slots"
  - name: "icon"
    type: Slot
    scope: NoticeBarSlotScope
    description: "前置图标，位于固定区域。"
    usage: "#links-and-slots"
  - name: "prefix"
    type: Slot
    scope: NoticeBarSlotScope
    description: "文字前方的固定内容。"
    usage: "#links-and-slots"
  - name: "suffix"
    type: Slot
    scope: NoticeBarSlotScope
    description: "文字后方的固定装饰内容。"
    usage: "#links-and-slots"
  - name: "actions"
    type: Slot
    scope: NoticeBarSlotScope
    description: "固定交互操作，点击不会触发公告栏 click 事件。"
    usage: "#links-and-slots"
  - name: "navigation"
    type: Slot
    scope: NoticeBarSlotScope
    description: "使用 next、prev 回调自定义公告导航区。"
    usage: "#links-and-slots"
  - name: "close-icon"
    type: Slot
    scope: NoticeBarSlotScope
    description: "仅替换关闭图形，保留原生关闭按钮及无障碍名称。"
    usage: "#links-and-slots"
EVENTS:
  - name: "update:modelValue"
    description: "显示状态变更请求。"
    type: "Boolean"
  - name: "update:activeIndex"
    description: "当前索引变更请求。"
    type: "Number"
  - name: "change"
    description: "当前公告索引发生变化，携带选中的公告条目。"
    type: "(index: number, item: NoticeBarItem) => void"
  - name: "click"
    description: "公告栏或内容区被点击；内置控件和操作区不会冒泡触发。"
    type: "MouseEvent"
  - name: "close"
    description: "申请关闭时触发。"
  - name: "closed"
    description: "退出动画结束时触发。"
  - name: "scroll-end"
    description: "完整一轮文字滚动结束时触发。"
EXPOSES:
  - name: "open"
    type: "() => void"
    description: "申请显示。"
  - name: "close"
    type: "() => void"
    description: "申请关闭。"
  - name: "next"
    type: "() => void"
    description: "切换下一条，遵循 loop 配置。"
  - name: "prev"
    type: "() => void"
    description: "切换上一条，遵循 loop 配置。"
  - name: "goTo"
    type: "(index: number) => void"
    description: "申请切换到从 0 开始的索引，越界值会限制在有效范围内。"
  - name: "pause"
    type: "() => void"
    description: "手动暂停自动活动。"
  - name: "resume"
    type: "() => void"
    description: "解除程序暂停，其他暂停条件仍然生效。"
  - name: "reset"
    type: "() => void"
    description: "返回首条公告，重新开始文字滚动与自动轮播计时。"
  - name: "visible"
    type: "Boolean"
    description: "实际显示状态。"
  - name: "activeIndex"
    type: "Number"
    description: "实际当前索引。"
  - name: "paused"
    type: "Boolean"
    description: "实际播放暂停状态。"
  - name: "scrolling"
    type: "Boolean"
    description: "溢出文本是否正在采用横向滚动展示。"
---

# Notice Bar（公告栏）

<card>

## 默认

短文本保持静止，溢出时才进行滚动。

<template #example><notice-bar-zh-default /></template>

<template #template>

@[code{5-9}](../../.vuepress/components/notice-bar-zh/default.vue)

</template>

<template #script>

@[code{1-3}](../../.vuepress/components/notice-bar-zh/default.vue)

</template>

</card>

<card>

## 颜色与语义

通过 type 设置语义类型，也可通过 color 配置品牌颜色；多条公告可分别设置类型。

<template #example><notice-bar-zh-colors /></template>

<template #template>

@[code{5-23}](../../.vuepress/components/notice-bar-zh/colors.vue)

</template>

<template #script>

@[code{1-3}](../../.vuepress/components/notice-bar-zh/colors.vue)

</template>

<template #style>

@[code{25-42}](../../.vuepress/components/notice-bar-zh/colors.vue)

</template>

</card>

<card>

## 视觉样式

soft、solid、plain 分别提供柔和底色、实色和简洁样式；text-color 可调整自定义实色背景的前景色。

<template #example><notice-bar-zh-variants /></template>

<template #template>

@[code{5-23}](../../.vuepress/components/notice-bar-zh/variants.vue)

</template>

<template #script>

@[code{1-3}](../../.vuepress/components/notice-bar-zh/variants.vue)

</template>

<template #style>

@[code{25-42}](../../.vuepress/components/notice-bar-zh/variants.vue)

</template>

</card>

<card>

## 外形

圆角与直角外形遵循共享 shape 配置。

<template #example><notice-bar-zh-shape /></template>

<template #template>

@[code{5-28}](../../.vuepress/components/notice-bar-zh/shape.vue)

</template>

<template #script>

@[code{1-3}](../../.vuepress/components/notice-bar-zh/shape.vue)

</template>

<template #style>

@[code{30-47}](../../.vuepress/components/notice-bar-zh/shape.vue)

</template>

</card>

<card>

## 尺寸

small、default、large 同时调整字号、间距与控件尺寸。

<template #example><notice-bar-zh-size /></template>

<template #template>

@[code{5-15}](../../.vuepress/components/notice-bar-zh/size.vue)

</template>

<template #script>

@[code{1-3}](../../.vuepress/components/notice-bar-zh/size.vue)

</template>

<template #style>

@[code{17-34}](../../.vuepress/components/notice-bar-zh/size.vue)

</template>

</card>

<card>

## 溢出滚动

仅溢出内容滚动。speed 使用像素/秒，duration 保持秒单位；悬停、聚焦、paused 和系统动态效果偏好共同控制播放。离开视口或页面隐藏时暂停自动活动。

<template #example><notice-bar-zh-marquee /></template>

<template #template>

@[code{7-19}](../../.vuepress/components/notice-bar-zh/marquee.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/notice-bar-zh/marquee.vue)

</template>

<template #style>

@[code{21-38}](../../.vuepress/components/notice-bar-zh/marquee.vue)

</template>

</card>

<card>

## 多条公告

items 支持字符串或公告对象。可通过 active-index 绑定当前项、使用内置导航，或自动轮播。interval 的单位是毫秒，长公告会先完成一轮文字滚动再切换；导航与操作区保持固定。

<template #example><notice-bar-zh-multiple /></template>

<template #template>

@[code{18-32}](../../.vuepress/components/notice-bar-zh/multiple.vue)

</template>

<template #script>

@[code{1-16}](../../.vuepress/components/notice-bar-zh/multiple.vue)

</template>

<template #style>

@[code{34-51}](../../.vuepress/components/notice-bar-zh/multiple.vue)

</template>

</card>

<card>

## 换行与省略

wrapable 完整展示换行后的公告；scrollable=false 保留静止单行，溢出部分省略，并提供原生 title。

<template #example><notice-bar-zh-multiline /></template>

<template #template>

@[code{7-16}](../../.vuepress/components/notice-bar-zh/multiline.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/notice-bar-zh/multiline.vue)

</template>

<template #style>

@[code{18-35}](../../.vuepress/components/notice-bar-zh/multiline.vue)

</template>

</card>

<card>

## 链接与插槽

内容区可作为原生链接或可点击按钮。prefix、suffix、actions 与滚动文字和关闭控件独立，操作保持固定。内容插槽适合文字和轻量装饰，交互控件请放在 actions。

<template #example><notice-bar-zh-actions /></template>

<template #template>

@[code{8-32}](../../.vuepress/components/notice-bar-zh/actions.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/notice-bar-zh/actions.vue)

</template>

<template #style>

@[code{34-51}](../../.vuepress/components/notice-bar-zh/actions.vue)

</template>

</card>

<card>

## 受控显示

通过 v-model 控制显示，也可重新显示已关闭的公告。close 表示关闭请求，closed 表示退出动画结束。

<template #example><notice-bar-zh-visibility /></template>

<template #template>

@[code{8-20}](../../.vuepress/components/notice-bar-zh/visibility.vue)

</template>

<template #script>

@[code{1-6}](../../.vuepress/components/notice-bar-zh/visibility.vue)

</template>

<template #style>

@[code{22-39}](../../.vuepress/components/notice-bar-zh/visibility.vue)

</template>

</card>
