---
description: "通过可选图标采集或展示评分。"
PROPS:
  #__________________________________
  - name: model-value
    type: Number
    values: "Number"
    description: 绑定值。
    default: 0
    link: null
    usage: '#default'
    code: >
      <s-rate v-model="value" />
    #__________________________________
  - name: v-model
    type: Number
    values: "Number"
    description: 绑定值。
    default: 0
    link: null
    usage: '#default'
    code: >
      <s-rate v-model="value" />
    #__________________________________
  - name: id
    type: String
    values: "String"
    description: 原生 <code>id</code> 属性。
    default: null
    link: null
    usage: '#id'
    code: null
    #__________________________________
  - name: low-threshold
    type: Number
    values: "Number"
    description: 低分与中分间的阈值；该值本身属于低分级别。
    default: 2
    link: null
    usage: '#low-threshold'
    code: null
    #__________________________________
  - name: high-threshold
    type: Number
    values: "Number"
    description: 中分与高分间的阈值；该值本身属于高分级别。
    default: 4
    link: null
    usage: '#high-threshold'
    code: null
    #__________________________________
  - name: max
    type: Number
    values: "Number"
    description: 最大评分值。
    default: 5
    link: null
    usage: '#max'
    code: >
      <s-rate v-model="value" max="5" />
    #__________________________________
  - name: colors
    type: Object
    values: "string[] , Record:< number| string>"
    description: 图标颜色。数组应含 3 项，分别对应三个评分级别；对象时键为等级阈值，值为对应颜色。
    default: ['#f7ba2a', '#f7ba2a', '#f7ba2a']
    link: null
    usage: '#default'
    code: >
      <s-rate v-model="value2" colors="['#99A9BF', '#F7BA2A', '#FF9900']" />
    #__________________________________
  - name: void-color
    type: String
    values: "String"
    description: 未选中图标颜色。
    default: '#c6d1de'
    link: null
    usage: '#void-color'
    code: >
      <s-rate v-model="value" void-color="#c6d1de" />
    #__________________________________
  - name: disabled-void-color
    type: String
    values: "String"
    description: 只读状态未选中图标颜色。
    default: '#eff2f7'
    link: null
    usage: '#disabled-void-color'
    code: null
    #__________________________________
  - name: icons
    type: Object
    values: "string[],component[],Record< number，string | Component>"
    description: 图标组件。数组应含 3 项，分别对应三个评分级别；对象时键为等级阈值，值为对应图标组件。
    default: '[StarFilled, StarFilled, StarFilled]'
    link: null
    usage: '#more-icons'
    code: >
      <s-rate v-model="value" icons="[StarFilled, StarFilled, StarFilled]" />
    #__________________________________
  - name: void-icon
    type: String
    values: "string,Component"
    description: 未选中图标组件。
    default: 'Star'
    link: null
    usage: '#more-icons'
    code: >
      <s-rate v-model="value" void-icon="Star" />
    #__________________________________
  - name: disabled-void-icon
    type: String
    values: "string,Component"
    description: 只读状态未选中图标组件。
    default: 'StarFilled'
    link: null
    usage: '#disabled-void-icon'
    code: null
    #__________________________________
  - name: disabled
    type: Boolean
    values: "true,false"
    description: 是否只读。
    default: 'false'
    link: null
    usage: '#read-only'
    code: >
      <s-rate v-model="value" disabled />
  #__________________________________
  - name: allow-half
    type: Boolean
    values: "true,false"
    description: 是否允许选择半星。
    default: 'false'
    link: null
    usage: '#with-allow-half'
    code: >
      <s-rate v-model="value" allow-half />
  #__________________________________
  - name: show-text
    type: Boolean
    values: "true,false"
    description: 是否显示文本。
    default: 'false'
    link: null
    usage: '#with-text'
    code: >
      <s-rate
      v-model="value"
      :texts="['oops', 'disappointed', 'normal', 'good', 'great']"
      show-text
      />
  #__________________________________
  - name: show-score
    type: Boolean
    values: "true,false"
    description: 是否显示当前评分；show-score 与 show-text 不可同时为 true。
    default: 'false'
    link: null
    usage: '#read-only'
    code: >
      <s-rate
      v-model="value"
      show-score
      text-color="#ff9900"
      score-template="{value} points"
      />
  #__________________________________
  - name: text-color
    type: String
    values: "String"
    description: 文本颜色。
    default: ''
    link: null
    usage: '#text-color'
    code: >
      <s-rate
      v-model="value"
      show-score
      text-color="#ff9900"
      score-template="{value} points"
      />
  #__________________________________
  - name: texts
    type: array
    values: "String[]"
    description: 文本数组。
    default: '[Extremely bad, Disappointed, Fair, Satisfied, Surprise]'
    link: null
    usage: '#texts'
    code: null
  #__________________________________
  - name: score-template
    type: String
    values: "String"
    description: 评分模板。
    default: ''
    link: null
    usage: '#score-template'
    code: >
      <s-rate
      v-model="value"
      show-score
      text-color="#ff9900"
      score-template="{value} points"
      />
  #__________________________________
  - name: size
    type: String
    values: "large,default, small"
    description: Rate 尺寸。
    default: 'default'
    link: null
    usage: '#size'
    code: >
      <s-rate
      v-model="value"
      size="small"
      />
    #__________________________________
  - name: clearable
    type: Boolean
    values: "true,false"
    description: 是否允许将值重置为 <code>0</code>。
    default: 'false'
    link: null
    usage: '#clearable'
    code: >
      <s-rate
      v-model="value"
      clearable
      />
    #__________________________________
  - name: label
    type: String
    values: "String"
    description: 与 Rate 的 <code>aria-label</code> 相同。
    default: ''
    link: null
    usage: '#label'
    code: null

EVENTS:
  - name: change
    type: 'Function'
    values: "(value: number) => void"
    description: 评分值变化时触发。
    default: null
    link: null
    code: null
    usage: ''

EXPOSES:
  - name: setCurrentValue
    type: 'Function'
    values: "(value: number) => void"
    description: 设置当前值。
    default: null
    link: null
    code: null
    usage: ''
    #__________________________________
  - name: resetCurrentValue
    type: 'Function'
    values: "(value: number) => void"
    description: 重置当前值。
    default: null
    link: null
    code: null
    usage: ''
---

# Rate 评分

<card>

## 默认

Rate 将评分分为多个等级，并可用不同背景色区分。默认背景色相同；可通过 <code>colors</code> 传入三个元素的数组对应三个等级，并用 <code>low-threshold</code>、<code>high-threshold</code> 定义阈值；也可传入对象，以等级阈值为键、颜色为值。

<template #example>
<rate-default />
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/rate/default.vue)

</template>

<template #script>

@[code{12-18}](../../.vuepress/components/rate/default.vue)

</template>

<template #style>

@[code{20-38}](../../.vuepress/components/rate/default.vue)

</template>

</card>

<card>

## 尺寸

Rate 支持 `small`、`default`、`large` 三种尺寸。

<template #example>
<rate-size />
</template>

<template #template>

@[code{1-7}](../../.vuepress/components/rate/size.vue)

</template>

<template #script>

@[code{9-13}](../../.vuepress/components/rate/size.vue)

</template>

<template #style>

@[code{15-20}](../../.vuepress/components/rate/size.vue)

</template>

</card>

<card>

## 允许半星

添加 `allow-half` 属性即可允许半星评分。

<template #example>
<rate-allow-half />
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/rate/allow-half.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/rate/allow-half.vue)

</template>

</card>

<card>

## 显示文本

使用文本表示评分。

添加 `show-text` 可在 Rate 右侧显示文本。通过 `texts` 可为不同评分设置文本；数组长度应等于最大评分 `max`。

<template #example>
<rate-text/>
</template>

<template #template>

@[code{1-9}](../../.vuepress/components/rate/text.vue)

</template>

<template #script>

@[code{11-15}](../../.vuepress/components/rate/text.vue)

</template>

<template #style>

@[code{17-27}](../../.vuepress/components/rate/text.vue)

</template>

</card>

<card>

## 可清空

再次点击当前评分可将值重置为 0。

<template #example>
<rate-clearable/>
</template>

<template #template>

@[code{1-5}](../../.vuepress/components/rate/clearable.vue)

</template>

<template #script>

@[code{7-11}](../../.vuepress/components/rate/clearable.vue)

</template>

</card>

<card>

## 更多图标

可使用不同图标区分不同评分状态。

可通过 `icons` 传入三个元素的数组，或以等级阈值为键、图标为值的对象来自定义图标。本示例还使用 `void-icon` 设置未选中图标。

<template #example>
<rate-more-icons/>
</template>

<template #template>

@[code{1-10}](../../.vuepress/components/rate/more-icons.vue)

</template>

<template #script>

@[code{12-21}](../../.vuepress/components/rate/more-icons.vue)

</template>

</card>

<card>

## 只读

只读 Rate 用于展示评分，支持半星。

使用 `disabled` 使组件只读。添加 `show-score` 可在右侧显示评分；还可用 `score-template` 设置评分模板，模板必须包含 `{value}`，会自动替换为当前评分。

<template #example>
<rate-read-only/>
</template>

<template #template>

@[code{1-11}](../../.vuepress/components/rate/read-only.vue)

</template>

<template #script>

@[code{13-17}](../../.vuepress/components/rate/read-only.vue)

</template>

</card>
