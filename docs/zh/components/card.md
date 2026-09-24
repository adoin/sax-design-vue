---
description: '用灵活的内容表面组织媒体、正文、操作与交互状态。'
EXAMPLE_GROUPS:
  - title: 类型
    items:
      [
        default,
        classic,
        overlay,
        split,
        frosted,
        reveal,
        profile,
        metric,
        article,
      ]
  - title: 纹理
    items: [default-solid, liquid-glass, liquid-glass-2]
  - title: 特效
    items: [no-effect, spotlight, gradient-glow]
PROPS:
  - name: title
    type: String
    values: String
    description: 卡片标题；title 插槽优先。
    default: null
    usage: '#default'
  - name: subtitle
    type: String
    values: String
    description: 标题下方的辅助文本。
    default: null
    usage: '#default'
  - name: text
    type: String
    values: String
    description: 卡片描述；text 插槽优先。
    default: null
    usage: '#default'
  - name: color
    type: String
    values: Sax Design 颜色 | RGB | HEX
    description: 彩色表面与交互效果使用的语义强调色。
    default: primary
    usage: '#complete-configuration'
  - name: texture
    type: CardTexture
    values: default | liquid-glass | liquid-glass-2
    description: 表面材质，与布局和装饰特效彼此独立。
    default: default
    usage: '#default-solid'
  - name: effect
    type: CardEffect
    values: default | spotlight | gradient-glow
    description: 装饰性交互特效，与布局和纹理彼此独立。
    default: default
    usage: '#no-effect'
  - name: orientation
    type: String
    values: vertical | horizontal
    description: 在保留所选类型表现的同时，垂直或水平排列媒体与内容。
    default: null
    usage: '#orientation'
  - name: hover-effect
    type: String
    values: none | lift | glow
    description: 鼠标悬停与键盘聚焦时的视觉反馈。
    default: null
    usage: '#hover-effects'
  - name: shape
    type: String
    values: rounded | square
    description: 卡片圆角形态，可继承 ConfigProvider 的全局配置。
    default: rounded
    usage: '#shape'
  - name: interactive
    type: Boolean
    values: true | false
    description: 为可点击卡片添加按钮语义与键盘焦点。
    default: 'false'
    usage: '#hover-effects'
  - name: selectable
    type: Boolean
    values: true | false
    description: 让卡片成为可切换的选择表面。
    default: 'false'
    usage: '#selection-and-loading'
  - name: selected
    type: Boolean
    values: true | false
    description: 受控选中状态，支持 v-model:selected。
    default: 'false'
    usage: '#selection-and-loading'
  - name: loading
    type: Boolean
    values: true | false
    description: 显示稳定的骨架屏并禁用交互。
    default: 'false'
    usage: '#selection-and-loading'
  - name: type
    type: CardType
    values: default | classic | overlay | split | frosted | reveal | profile | metric | article
    description: 选择一套有明确语义的完整卡片预设；数字 1-5 仅作为兼容别名保留。
    default: default
    usage: '#default'
EVENTS:
  - name: update:selected
    type: Boolean
    description: 可选择卡片请求改变选中状态时触发。
  - name: select
    type: Boolean, MouseEvent
    description: 选中后携带新状态与触发事件。
SLOTS:
  - name: default
    type: slot
    values: 'null'
    description: 自定义正文内容。
    default: null
  - name: header
    type: slot
    values: 'null'
    description: 自定义卡片头部。
    default: null
  - name: extra
    type: slot
    values: 'null'
    description: 添加位于头部末端的内容。
    default: null
  - name: media
    type: slot
    values: 'null'
    description: 为结构化卡片布局添加图片或视频媒体。
    default: null
  - name: title
    type: slot
    values: 'null'
    description: 自定义标题。
    default: null
  - name: subtitle
    type: slot
    values: 'null'
    description: 自定义副标题。
    default: null
  - name: text
    type: slot
    values: 'null'
    description: 自定义描述。
    default: null
  - name: footer
    type: slot
    values: 'null'
    description: 替换完整底部区域。
    default: null
  - name: actions
    type: slot
    values: 'null'
    description: 为结构化卡片布局添加底部操作。
    default: null
  - name: interactions
    type: slot
    values: 'null'
    description: 在媒体区域上方添加控件。
    default: null
  - name: img
    type: slot
    values: 'null'
    description: 为预设卡片添加图片或视频内容。
    default: null
  - name: buttons
    type: slot
    values: 'null'
    description: 为预设卡片添加按钮。
    default: null
---

# Card 卡片

<card>

## 默认

`default` 是无需显式传入的默认预设，用简洁的标题区、正文区和可选操作区组织内容。

<template #example>
<card-zh-default />
</template>

<template #template>

@[code{1-13}](../../.vuepress/components/card-zh/default.vue)

</template>

<template #style>

@[code{15-21}](../../.vuepress/components/card-zh/default.vue)

</template>

</card>

<card>

## 经典图文

设置 `type="classic"`，使用原有的媒体优先布局与覆盖式媒体操作。

<template #example>
<card-zh-classic />
</template>

<template #template>

@[code{1-22}](../../.vuepress/components/card-zh/classic.vue)

</template>

<template #style>

@[code{24-35}](../../.vuepress/components/card-zh/classic.vue)

</template>

</card>

<card>

## 图片叠层

设置 `type="overlay"`，让文字在图片上渐进浮现。

<template #example>
<card-zh-type2 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type2.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type2.vue)

</template>

</card>

<card>

## 横向分栏

设置 `type="split"`，使用紧凑的图文横向分栏布局。

<template #example>
<card-zh-type3 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type3.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type3.vue)

</template>

</card>

<card>

## 毛玻璃说明

设置 `type="frosted"`，在沉浸式图片上显示半透明说明面板。

<template #example>
<card-zh-type4 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type4.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type4.vue)

</template>

</card>

<card>

## 居中浮现

设置 `type="reveal"`，让居中的说明面板从图片下方浮现。

<template #example>
<card-zh-type5 />
</template>

<template #template>

@[code{1-24}](../../.vuepress/components/card-zh/type5.vue)

</template>

<template #style>

@[code{26-37}](../../.vuepress/components/card-zh/type5.vue)

</template>

</card>

<card>

## 人物资料

`profile` 提供头像、身份信息、关键数据和操作区，组成一张完整的人物资料卡。

<template #example>
<card-zh-profile />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/card-zh/profile.vue)

</template>

<template #style>

@[code{27-45}](../../.vuepress/components/card-zh/profile.vue)

</template>

</card>

<card>

## 数据指标

`metric` 用清晰的层级组织主指标、变化趋势、小型图表与目标进度。

<template #example>
<card-zh-metric />
</template>

<template #template>

@[code{1-32}](../../.vuepress/components/card-zh/metric.vue)

</template>

<template #script>

@[code{34-36}](../../.vuepress/components/card-zh/metric.vue)

</template>

<template #style>

@[code{38-70}](../../.vuepress/components/card-zh/metric.vue)

</template>

</card>

<card>

## 文章卡片

`article` 组合响应式配图、内容元数据、作者信息与明确的阅读操作。

<template #example>
<card-zh-article />
</template>

<template #template>

@[code{1-25}](../../.vuepress/components/card-zh/article.vue)

</template>

<template #style>

@[code{27-44}](../../.vuepress/components/card-zh/article.vue)

</template>

</card>

<card>

## 默认纯色

使用 `texture="default"`，保留常规纯色表面，不增加额外材质层。

<template #example>
<card-zh-texture-default />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/card-zh/texture-default.vue)

</template>

<template #style>

@[code{9-18}](../../.vuepress/components/card-zh/texture-default.vue)

</template>

</card>

<card>

## 液态镜片

`texture="liquid-glass"` 使用实例级 SVG 位移图，让半透明表面真正弯折后方内容；不支持 URL backdrop-filter 的浏览器会降级为饱和模糊玻璃。

<template #example>
<card-zh-texture-liquid-glass />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/card-zh/texture-liquid-glass.vue)

</template>

<template #style>

@[code{9-112}](../../.vuepress/components/card-zh/texture-liquid-glass.vue)

</template>

</card>

<card>

## 液态镜片 2

`texture="liquid-glass-2"` 保持完全相同的 Card 表面、标题、模糊、高光与动态背景，只替换为带 component transfer 和镜面光照的另一套 SVG 滤镜，便于直接比较。

<template #example>
<card-zh-texture-liquid-glass-2 />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/card-zh/texture-liquid-glass-2.vue)

</template>

<template #style>

@[code{9-112}](../../.vuepress/components/card-zh/texture-liquid-glass-2.vue)

</template>

</card>

<card>

## 无特效

使用 `effect="default"`，让 Card 不渲染交互装饰。

<template #example>
<card-zh-effect-default />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/card-zh/effect-default.vue)

</template>

<template #style>

@[code{9-21}](../../.vuepress/components/card-zh/effect-default.vue)

</template>

</card>

<card>

## 聚光边框

`spotlight` 不改变内部颜色，只在指针附近显示局部单色边框高光。

<template #example>
<card-zh-effect-spotlight />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/card-zh/effect-spotlight.vue)

</template>

<template #style>

@[code{9-23}](../../.vuepress/components/card-zh/effect-spotlight.vue)

</template>

</card>

<card>

## 渐变光晕

`gradient-glow` 组合随指针转向的多色边缘光弧、模糊外层光晕与克制的内部微光。

<template #example>
<card-zh-effect-gradient-glow />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/card-zh/effect-gradient-glow.vue)

</template>

<template #style>

@[code{9-23}](../../.vuepress/components/card-zh/effect-gradient-glow.vue)

</template>

</card>

<card>

## 悬停效果

卡片默认保持静态。整张卡片需要执行操作时，添加 `interactive` 获取键盘语义，并选择 `lift` 或 `glow`。

<template #example>
<card-zh-hover-effects />
</template>

<template #template>

@[code{1-26}](../../.vuepress/components/card-zh/hover-effects.vue)

</template>

<template #style>

@[code{28-36}](../../.vuepress/components/card-zh/hover-effects.vue)

</template>

</card>

<card>

## 排列方向

使用 `horizontal` 将媒体放在内容侧面，同时保留所选类型的表现；窄屏下会自动恢复为竖排。

<template #example>
<card-zh-orientation />
</template>

<template #template>

@[code{1-29}](../../.vuepress/components/card-zh/orientation.vue)

</template>

<template #style>

@[code{31-38}](../../.vuepress/components/card-zh/orientation.vue)

</template>

</card>

<card>

## 选择与加载

`selectable` 通过 `v-model:selected` 支持受控选择；加载状态在禁止交互的同时保持卡片尺寸稳定。

<template #example>
<card-zh-states />
</template>

<template #template>

@[code{7-23}](../../.vuepress/components/card-zh/states.vue)

</template>

<template #script>

@[code{1-5}](../../.vuepress/components/card-zh/states.vue)

</template>

<template #style>

@[code{25-33}](../../.vuepress/components/card-zh/states.vue)

</template>

</card>

<card>

## 外形

可以为单个卡片设置 `shape="square"`，也可以继承 `s-config-provider` 的全局配置。

<template #example>
<card-zh-shape />
</template>

<template #template>

@[code{1-14}](../../.vuepress/components/card-zh/shape.vue)

</template>

<template #style>

@[code{16-24}](../../.vuepress/components/card-zh/shape.vue)

</template>

</card>

<card>

## 综合配置

在一个示例中调节 Card 的布局、排列方向、纹理、特效、外形、颜色与交互状态。

<template #example>
<card-zh-configurator />
</template>

<template #template>

@[code{65-140}](../../.vuepress/components/card-zh/configurator.vue)

</template>

<template #script>

@[code{1-63}](../../.vuepress/components/card-zh/configurator.vue)

</template>

<template #style>

@[code{142-203}](../../.vuepress/components/card-zh/configurator.vue)

</template>

</card>
