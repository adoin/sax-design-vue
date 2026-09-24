---
description: 'Provide styled scroll areas with programmatic scroll control.'
PROPS:
  - name: placement
    type: String
    values: 'inside, outside'
    description: Custom track placement. outside reserves space beside the viewport; ignored in native mode.
    default: inside
    usage: '#outside-scrollbars'

  - name: gap
    type: Number
    values: 'number'
    description: Gap in pixels between outside tracks and the viewport. Negative values are clamped to zero.
    default: 6
    usage: '#outside-scrollbars'

  - name: height
    type: String, Number
    values: 'number'
    description: height of scrollbar
    default:
    link: null
    usage: '#default'
    code: null

  - name: max-height
    type: String, Number
    values: 'number'
    description: max height of scrollbar
    default: null
    link: null
    usage: '#max-height'
    code: null

  - name: native
    type: Boolean
    values: 'true, false'
    description: whether to use the native scrollbar
    default: false
    link: null
    usage: null
    code: null

  - name: fade
    type: ScrollbarFade
    values: 'false | true | y | x | top/t | bottom/b | left/l | right/r | start/s | end/e | number | ScrollbarFadeOptions'
    description: Scroll-aware content edge fade. `true` uses both vertical edges; a number sets their size in pixels; options select a direction and CSS size.
    default: false
    usage: '#edge-fade'

  - name: wrap-style
    type: String, Object, Array
    values: 'CSSProperties, CSSProperties[], string[]'
    description: style of wrap container
    default: null
    link: null
    usage: null
    code: null

  - name: wrap-class
    type: String
    values: 'string'
    description: class of wrap container
    default: null
    link: null
    usage: null
    code: null

  - name: view-style
    type: String, Object, Array
    values: 'CSSProperties, CSSProperties[], string[]'
    description: style of view container
    default: null
    link: null
    usage: null
    code: null

  - name: view-class
    type: String
    values: 'string'
    description: class of view container
    default: null
    link: null
    usage: null
    code: null

  - name: noresize
    type: Boolean
    values: 'true, false'
    description: do not respond to container size changes, if the container size does not change, it is better to set it to optimize performance
    default: false
    link: null
    usage: null
    code: null

  - name: tag
    type: string
    values: 'HTML Tag'
    description: element tag of the view
    default: div
    link: null
    usage: null
    code: null

  - name: always
    type: Boolean
    values: 'true, false'
    description: always show scrollbar
    default: true
    link: null
    usage: null
    code: null

  - name: min-size
    type: Number
    values: ''
    description: minimum size of scrollbar
    default: 20
    link: null
    usage: null
    code: null

  - name: thickness
    type: Number, String
    values: 'number'
    description: thumb width
    default: 6
    link: null
    usage: null
    code: null

EVENTS:
  - name: scroll
    type: function
    values: '({ scrollLeft: number, scrollTop: number }) => void'
    description: triggers when scrolling, return distance of scrolling
    default: null
    link: null
    usage: null
    code: null

SLOTS:
  - name: default
    type: slot
    values: ''
    description: customize default content
    default: null
    example: null
    link: null
    usage: null
    code: null

EXPOSES:
  - name: handleScroll
    type: function
    values: '() => void'
    description: handle scroll event
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: scrollTo
    type: function
    values: '(options: ScrollToOptions | number, yCoord?: number) => void'
    description: scrolls to a particular set of coordinates
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: setScrollTop
    type: function
    values: '(scrollTop: number) => void'
    description: Set distance to scroll top
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: setScrollLeft
    type: function
    values: '(scrollLeft: number) => void'
    description: Set distance to scroll left
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: update
    type: function
    values: '() => void'
    description: update scrollbar state manually
    default: null
    example: null
    link: null
    usage: null
    code: null

  - name: wrapRef
    type: object
    values: 'Ref HTMLElement'
    description: scrollbar wrap ref
    default: null
    example: null
    link: null
    usage: null
    code: null
---

# Scrollbar

<card>

## Edge fade

Set `fade` to hint that more content remains beyond a scroll edge. `true` and `"y"` cover both vertical edges; `"x"` covers both horizontal edges. Use `top`, `bottom`, `left`, or `right` for physical edges and `start` or `end` for direction-aware inline edges. The shadcn-style aliases `t`, `b`, `l`, `r`, `s`, and `e` are accepted too. A number is a vertical fade size in pixels, while `{ direction, size }` accepts a CSS length or percentage.

The fade follows actual overflow and scroll position. Content that fits is never masked, and each edge clears as it is reached. The implementation uses Scrollbar's existing measurements rather than adding another scroll owner.

<template #example>
<scrollbar-fade />
</template>

<template #template>

@[code{21-40}](../.vuepress/components/scrollbar/fade.vue)

</template>

<template #script>

@[code{1-19}](../.vuepress/components/scrollbar/fade.vue)

</template>

<template #style>

@[code{42-68}](../.vuepress/components/scrollbar/fade.vue)

</template>

</card>

<card>

## Outside scrollbars

Set `placement="outside"` to place both tracks beside the viewport, keeping the thumbs clear of your content. Use `gap` for track spacing and `thickness` for track thickness; colors follow the component’s HSL primary tokens.

This example uses `max-height`: removing items lets the viewport shrink, and tracks appear only on overflowing axes. Outside tracks stay within the component’s footprint, without negative offsets or changes to the parent’s overflow.

Drag a thumb, click a track, or use a wheel or touchpad. Tab into the viewport to scroll with arrow keys. With `always` disabled, tracks hide after the pointer leaves while their space stays reserved to avoid layout shifts.

<template #example>
<scrollbar-outside />
</template>

<template #template>

@[code{9-33}](../.vuepress/components/scrollbar/outside.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/scrollbar/outside.vue)

</template>

<template #style>

@[code{35-66}](../.vuepress/components/scrollbar/outside.vue)

</template>

</card>

<card>

## Default

<docs-warn />

Used to replace the browser's native scrollbar.

Use `height` property to set the height of the scrollbar, or if not set, it adapts according to the parent container height.

<template #example>
<scrollbar-default />
</template>

<template #template>

@[code{1-5}](../.vuepress/components/scrollbar/default.vue)

</template>

<template #style>

@[code{7-19}](../.vuepress/components/scrollbar/default.vue)

</template>

</card>

<card>

## Horizontal scroll

When the element width is greater than the scrollbar width, the horizontal scrollbar is displayed.

<template #example>
<scrollbar-hirizontal />
</template>

<template #template>

@[code{1-9}](../.vuepress/components/scrollbar/hirizontal.vue)

</template>

<template #style>

@[code{11-28}](../.vuepress/components/scrollbar/hirizontal.vue)

</template>

</card>

<card>

## Max height

The scrollbar is displayed only when the element height exceeds the max height.

<template #example>
<scrollbar-max-height />
</template>

<template #template>

@[code{1-11}](../.vuepress/components/scrollbar/max-height.vue)

</template>

<template #script>

@[code{13-25}](../.vuepress/components/scrollbar/max-height.vue)

</template>

<template #style>

@[code{27-39}](../.vuepress/components/scrollbar/max-height.vue)

</template>

</card>
