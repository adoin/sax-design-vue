---
description: 'A movable, resizable non-modal window with a controlled title and keyboard controls.'
PROPS:
  - name: 'rect'
    type: 'WindowRect'
    description: 'Position and size; supports v-model:rect.'
    default: '{ x: 24, y: 24, width: 640, height: 480 }'
    usage: '#move-and-resize'
    values: '{ x, y, width, height }'
  - name: 'title'
    type: 'String'
    description: 'Window title; supports v-model:title.'
    default: ''
    usage: '#move-and-resize'
  - name: 'min-width'
    type: 'Number'
    description: 'Minimum width in pixels; takes precedence over a smaller workspace.'
    default: 280
    usage: '#move-and-resize'
  - name: 'min-height'
    type: 'Number'
    description: 'Minimum height in pixels, at least 48.'
    default: 180
    usage: '#move-and-resize'
  - name: 'draggable'
    type: 'Boolean'
    description: 'Allow dragging and keyboard movement.'
    default: true
    usage: '#move-and-resize'
  - name: 'resizable'
    type: 'Boolean'
    description: 'Allow eight-direction resizing and keyboard resizing.'
    default: true
    usage: '#move-and-resize'
  - name: 'boundary'
    type: 'Boolean'
    description: 'Constrain to the parent container; minimum size can overflow a smaller workspace.'
    default: true
    usage: '#move-and-resize'
  - name: 'active'
    type: 'Boolean'
    description: 'Show active feedback.'
    default: false
    usage: '#move-and-resize'
  - name: 'z-index'
    type: 'Number'
    description: 'Stacking order managed by the application.'
    default: 1
    usage: '#move-and-resize'
  - name: 'title-editable'
    type: 'Boolean'
    description: 'Show rename action; blank names are not saved.'
    default: false
    usage: '#move-and-resize'
  - name: 'keyboard-step'
    type: 'Number'
    description: 'Arrow-key step; Shift multiplies it by five.'
    default: 10
    usage: '#move-and-resize'
  - name: 'shape'
    type: 'ComponentShape'
    description: 'Geometry follows shared configuration.'
    default: 'rounded'
    usage: '#shape'
    values: 'rounded | square'
EVENTS:
  - name: 'update:rect'
    type: '(rect: WindowRect) => void'
    description: 'Position or size changes.'
    usage: '#move-and-resize'
  - name: 'update:title'
    type: '(title: string) => void'
    description: 'Rename confirmed.'
    usage: '#move-and-resize'
  - name: 'activate'
    type: '() => void'
    description: 'Pointer or keyboard activates the window.'
    usage: '#move-and-resize'
  - name: 'drag-start'
    type: '(rect: WindowRect) => void'
    description: 'Interaction boundary; end carries the final rectangle.'
    usage: '#move-and-resize'
  - name: 'drag-end'
    type: '(rect: WindowRect) => void'
    description: 'Interaction boundary; end carries the final rectangle.'
    usage: '#move-and-resize'
  - name: 'resize-start'
    type: '(rect: WindowRect) => void'
    description: 'Interaction boundary; end carries the final rectangle.'
    usage: '#move-and-resize'
  - name: 'resize-end'
    type: '(rect: WindowRect) => void'
    description: 'Interaction boundary; end carries the final rectangle.'
    usage: '#move-and-resize'
SLOTS:
  - name: 'default'
    type: '()'
    description: 'Window content.'
    usage: '#move-and-resize'
  - name: 'title'
    type: '{ title: string }'
    description: 'Custom title.'
    usage: '#move-and-resize'
  - name: 'actions'
    type: '()'
    description: 'Window actions.'
    usage: '#move-and-resize'
EXPOSES:
  - name: 'focus'
    type: '() => void'
    description: 'Focus the title move button.'
    usage: '#move-and-resize'
  - name: 'rename'
    type: '() => void'
    description: 'Start editing the title.'
    usage: '#move-and-resize'
---

# Window

<card>

## Move and resize

Drag the title to move; drag an edge or corner to resize. Each window retains its own input. Use the pencil action to rename.

Focus the title and use arrow keys to move. Focus the lower-right handle to resize. Shift increases the step; Escape cancels a pointer gesture. The parent needs positioning and a definite height.

<template #example><window-default /></template>

<template #template>

@[code{22-46}](../.vuepress/components/window/default.vue)

</template>

<template #script>

@[code{1-20}](../.vuepress/components/window/default.vue)

</template>

<template #style>

@[code{48-57}](../.vuepress/components/window/default.vue)

</template>

</card>

<card>

## Shape

Compare rounded and square geometry with the same interactions.

<template #example><window-shape /></template>

<template #template>

@[code{10-29}](../.vuepress/components/window/shape.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/window/shape.vue)

</template>

<template #style>

@[code{31-40}](../.vuepress/components/window/shape.vue)

</template>

</card>

<card>

## Content lifecycle

Window does not manage routing, caching or refresh. The application controls content mounting and closing; place a restore action in the actions slot. Keep the same component instance when relocating an existing page, and explicitly restore scroll and focus. Size-sensitive content should observe its actual container.

</card>
