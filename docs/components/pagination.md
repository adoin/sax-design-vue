---
description: 'Navigate long collections one page at a time.'
PROPS:
  - name: size
    type: ComponentSize
    values: 'small | default | large'
    description: Set or inherit pager buttons and page-size Select density.
    default: null
    usage: '#size'
  - name: v-model:current-page
    type: Number
    values: 'number'
    description: Determine the page where the user is.
    default: 1
    link: null
    usage: '#default'
    code: >
      <s-pagination v-model:current-page="page" :total="20" />
  - name: total
    type: Number
    values: 'number'
    description: Total number of records; use page-count when only the page count is known.
    default: null
    link: null
    usage: '#default'
    code: >
      <s-pagination v-model:current-page="page" :total="20" />
  - name: color
    type: String
    values: 'Theme colors, RGB, HEX'
    description: Change the base color of the component.
    default: primary
    link: null
    usage: '#color'
    code: >
      <s-pagination color="danger" v-model:current-page="page" :total="20" />

  - name: disabled
    type: Boolean
    values: 'true, false'
    description: Determine if the entire component is in the disabled state.
    default: false
    link: null
    usage: '#disabled'
    code: >
      <s-pagination disabled v-model:current-page="page" :total="20" />

  - name: shape
    type: String
    values: 'circle, square'
    description: Use circular or square page buttons.
    default: null
    link: null
    usage: '#shape'
    code: >
      <s-pagination shape="circle" v-model:current-page="page" :total="20" />

      <s-pagination shape="square" v-model:current-page="page" :total="20" />

  - name: buttons-dotted
    type: Boolean
    values: 'true, false'
    description: Makes the buttons not have the internal number and changes its size.
    default: false
    link: null
    usage: '#buttons-dotted'
    code: >
      <s-pagination buttons-dotted v-model:current-page="page" :total="20" />

  - name: disabled-items
    type: Number[]
    values: 'number[]'
    description: Determine which items are in the disabled state.
    default: []
    link: null
    usage: '#disabled-items'
    code: >
      <s-pagination :disabled-items="[3,4,9,10,11,12,19]" v-model:current-page="page" :total="20" />

  - name: loading-items
    type: Number[]
    values: 'number[]'
    description: Determine which items are in the charging state.
    default: []
    link: null
    usage: '#loading-items'
    code: >
      <s-pagination :loading-items="[3,4,9,10,11,12,19]" v-model:current-page="page" :total="20" />

  - name: not-margin
    type: Boolean
    values: 'true, false'
    description: Change the margin between the items causing them to be fully glued and the radius is removed making them square.
    default: false
    link: null
    usage: '#not-margin'
    code: >
      <s-pagination not-margin v-model:current-page="page" :total="20" />

  - name: progress
    type: Boolean
    values: 'true, false'
    description: Add a progress bar to the component determined by the current page and the total of pages.
    default: false
    link: null
    usage: '#progress'
    code: >
      <s-pagination progress v-model:current-page="page" :total="20" />

  - name: infinite
    type: Boolean
    values: 'true, false'
    description: Determine if the pagination is infinite.
    default: false
    link: null
    usage: '#infinite'
    code: >
      <s-pagination infinite v-model:current-page="page" :total="100" />

  - name: v-model:page-size
    type: Number
    values: 'null'
    description: item count of each page.
    default: 10
    link: null
    usage: '#layout'
    code: null

  - name: default-page-size
    type: Number
    values: 'null'
    description: default initial value of page size
    default: null
    link: null
    usage: null
    code: null

  - name: page-count
    type: Number
    values: 'null'
    description: total page count. Set either total or page-count and pages will be displayed; if you need page-sizes, total is required
    default: null
    link: null
    usage: null
    code: null

  - name: pager-count
    type: Number
    values: '5, 7, 9, 11, 13, 15, 17, 19, 21'
    description: number of pagers. Pagination collapses when the total page count exceeds this value
    default: 7
    link: null
    usage: null
    code: null

  - name: default-current-page
    type: Number
    values: 'null'
    description: default initial value of current-page
    default: null
    link: null
    usage: null
    code: null

  - name: layout
    type: String, String[]
    values: 'prev, pager, next, jumper, ->, total, slot, sizes'
    description: layout of Pagination, an array or elements separated with a comma
    default: [prev, pager, next, jumper, ->, total, slot, sizes]
    link: null
    usage: '#layout'
    code: null

  - name: page-sizes
    type: Array
    values: 'number[]'
    description: options of item count per page
    default: [10, 20, 30, 40, 50, 100]
    link: null
    usage: null
    code: null

  - name: hide-on-single-page
    type: Boolean
    values: 'true, false'
    description: Hide the pagination when only one page exists.
    default: false
    link: null
    usage: null
    code: null

  - name: prev-text
    type: String
    values: 'null'
    description: text for the prev button
    default: null
    link: null
    usage: null
    code: null

  - name: prev-icon
    type: String, Component
    values: 'null'
    description: icon for the prev button, higher priority of prev-text
    default: cb:chevron-left
    link: null
    usage: null
    code: null

  - name: next-text
    type: String
    values: 'null'
    description: text for the next button
    default: null
    link: null
    usage: null
    code: null

  - name: next-icon
    type: String, Component
    values: 'null'
    description: icon for the next button, higher priority of next-text
    default: cb:chevron-right
    link: null
    usage: null
    code: null

EVENTS:
  - name: update:current-page
    type: Number
    description: Fire when the current page changes.
  - name: page-change
    type: Number
    description: Fire when the current page changes.
  - name: update:page-size
    type: Number
    description: Fire when the page size changes.
  - name: size-change
    type: Number
    description: Fire when the page size changes.
  - name: prev-click
    type: Number
    description: Fire with the resulting page after a previous or next action.
  - name: next-click
    type: Number
    description: Fire with the resulting page after a previous or next action.
SLOTS:
  - name: default
    type: Slot
    scope: "{ currentPage: number; total: number; pageSize: number; pageSizes: number[]; pagerCount: number }"
    description: Custom content placed where layout includes slot.
    default: null
    link: null
    usage: '#layout'
    code: >
      <s-pagination v-model:current-page="page" :total="20" layout="prev,pager,slot,next">
        <template #default="{ currentPage }">
          <span>Page {{ currentPage }}</span>
        </template>
      </s-pagination>
---

# Pagination

<card>

## Default

Pass the total number of records and bind the current page. With 50 records, this example uses the component's default layout: page navigation, a jump input, total count, and page-size selection. Use `v-model:page-size` when the page-size selector is shown.

<template #example>
<pagination-default />
</template>

<template #template>

@[code{8-16}](../.vuepress/components/pagination/default.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/pagination/default.vue)

</template>

<template #style>

@[code{18-24}](../.vuepress/components/pagination/default.vue)

</template>

</card>

<card>

## Layout

Choose which parts to show with a comma-separated string or an array. `prev`, `pager`, and `next` provide navigation; `total`, `sizes`, and `jumper` add counts and input controls. Use `slot` for custom content, and `->` to align subsequent parts to the right. Provide either `total` or `page-count`; `total` is required when showing the page-size selector.

<template #example>
<pagination-layout />
</template>

<template #template>

@[code{10-44}](../.vuepress/components/pagination/layout.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/pagination/layout.vue)

</template>

<template #style>

@[code{46-64}](../.vuepress/components/pagination/layout.vue)

</template>

</card>

<card>

## Size

Compare the inherited `small`, `default`, and `large` component sizes.

<template #example><pagination-size /></template>

<template #template>

@[code{7-27}](../.vuepress/components/pagination/size.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/pagination/size.vue)

</template>

<template #style>

@[code{29-34}](../.vuepress/components/pagination/size.vue)

</template>

</card>

<card>

## Color

Set a semantic color token or a custom RGB/HEX value.

<template #example>
<pagination-color />
</template>

<template #template>

@[code{9-23}](../.vuepress/components/pagination/color.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/pagination/color.vue)

</template>

<template #style>

@[code{25-39}](../.vuepress/components/pagination/color.vue)

</template>

</card>

<card>

## Disabled

Change the disabled state of the component with the `disabled` property, this property is a boolean and you can add it without value

<template #example>
<pagination-disabled />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/pagination/disabled.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/pagination/disabled.vue)

</template>

<template #style>

@[code{13-26}](../.vuepress/components/pagination/disabled.vue)

</template>

</card>

<card>

## Shape

Use `shape="circle"` for circular page buttons or `shape="square"` for square corners.

<template #example>
<pagination-shape />
</template>

<template #template>

@[code{8-29}](../.vuepress/components/pagination/shape.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/pagination/shape.vue)

</template>

<template #style>

@[code{31-49}](../.vuepress/components/pagination/shape.vue)

</template>

</card>

<card>

## Buttons Dotted

Use `buttons-dotted` to replace the inner page numbers with dot-style controls.

<template #example>
<pagination-buttons-dotted />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/pagination/buttons-dotted.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/pagination/buttons-dotted.vue)

</template>

<template #style>

@[code{13-26}](../.vuepress/components/pagination/buttons-dotted.vue)

</template>

</card>

<card>

## Disabled Items

You can put disabled buttons specific to the pagination component with the `disabled-items` property, this property is an array with the number of the button you want to put in disabled status

::: tip
The buttons that are in disabled will skip when changing the value for example on the next or back buttons
:::

<template #example>
<pagination-disabled-items />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/pagination/disabled-items.vue)

</template>

<template #script>

@[code{11-15}](../.vuepress/components/pagination/disabled-items.vue)

</template>

<template #style>

@[code{17-30}](../.vuepress/components/pagination/disabled-items.vue)

</template>

</card>

<card>

## Loading Items

You can make a button inside the pagination be in the state of loading with the `loading-items` property, this property is an array with the number of the button that you want to put in the disabled state

::: tip
The buttons that are in loading will skip when changing the value for example in the next or back buttons
:::

<template #example>
<pagination-loading-items />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/pagination/loading-items.vue)

</template>

<template #script>

@[code{11-15}](../.vuepress/components/pagination/loading-items.vue)

</template>

<template #style>

@[code{17-30}](../.vuepress/components/pagination/loading-items.vue)

</template>

</card>

<card>

## Not Margin

Change the style of the entire component by removing the margin between the buttons and changing the radius with the `not-margin` property

<template #example>
<pagination-not-margin />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/pagination/not-margin.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/pagination/not-margin.vue)

</template>

<template #style>

@[code{13-26}](../.vuepress/components/pagination/not-margin.vue)

</template>

</card>

<card>

## Progress

Add a progress bar to the pagination by referencing where you find the last page with the `progress` property

<template #example>
<pagination-progress />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/pagination/progress.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/pagination/progress.vue)

</template>

<template #style>

@[code{13-26}](../.vuepress/components/pagination/progress.vue)

</template>

</card>

<card>

## Infinite

You can make the pagination infinite with the `infinite` property, this means that the arrow buttons are no longer in the disabled state

<template #example>
<pagination-infinite />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/pagination/infinite.vue)

</template>

<template #script>

@[code{7-11}](../.vuepress/components/pagination/infinite.vue)

</template>

<template #style>

@[code{13-26}](../.vuepress/components/pagination/infinite.vue)

</template>

</card>
