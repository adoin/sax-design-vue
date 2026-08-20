# Grid（栅格）

<card>

## 默认

<docs-warn />

栅格系统通过行与列划分内容区域，使页面各部分保持稳定、可预测的布局。

基本规则如下：

- 使用 `s-row` 定义一行水平空间，在行内使用 `s-col` 划分列。
- 内容应直接放入列中，行的直接子元素应为列。
- 每行划分为 **12** 份。例如，`w="4"` 可创建三个等宽列（各占 **33.3%**）。
- 同一行内列宽总和超过 **12** 时，超出的列会整体换到下一行。

通过 `w` 属性设置 `s-col` 的宽度，可选值为 **1–12**。例如：`12 = 100%`、`6 = 50%`、`4 = 33.3%`。

<template #example>
<grid-default />
</template>

<template #template>

@[code{1-27}](../../.vuepress/components/grid/default.vue)

</template>

</card>

<card>

## 偏移

使用 `offset` 属性设置列左侧偏移，取值同样为 **1–12**。例如：`12 = 100%`、`6 = 50%`、`4 = 33.3%`。

<template #example>
<grid-offset />
</template>

<template #template>

@[code{1-23}](../../.vuepress/components/grid/offset.vue)

</template>

</card>

<card>

## 水平对齐

使用 `SRow` 的 `justify` 属性控制整组列的水平对齐，支持 `start`（靠左）、`center`、`end`（靠右）、`space-around`、`space-between` 和 `space-evenly`。

如果只需让某个 `SCol` 靠向行首或行尾，使用 `justify-self="start | end"`。它基于自动逻辑外边距实现，因此可以将同一行中的最后一列推到最右侧，并兼容 RTL 布局。

<template #example>
<grid-flex-justify />
</template>

<template #template>

@[code](../../.vuepress/components/grid/flex-justify.vue)

</template>

</card>

<card>

## 垂直对齐

使用 `align` 属性控制元素的垂直对齐，支持 `top`、`center` 和 `bottom`。

<template #example>
<grid-flex-align />
</template>

<template #template>

@[code{1-15}](../../.vuepress/components/grid/flex-align.vue)

</template>

</card>

<card>

## 响应式

响应式系统采用**移动端优先**策略。

可使用以下断点属性为不同视口设置列宽：

- **xxl**: 1536px
- **xl**: 1280px
- **lg**: 1024px
- **md**: 768px
- **smx**: 640px
- **sm**：默认断点

<template #example>
<grid-responsive />
</template>

<template #template>

@[code{1-15}](../../.vuepress/components/grid/responsive.vue)

</template>

<template #script>

@[code{17-40}](../../.vuepress/components/grid/responsive.vue)

</template>

</card>
