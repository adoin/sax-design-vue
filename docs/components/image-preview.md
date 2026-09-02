---
PROPS:
  - name: v-model
    type: Boolean
    values: 'true | false'
    description: Control preview visibility.
    default: 'false'
  - name: url-list
    type: Array
    values: 'string[]'
    description: Image URLs displayed by the preview.
    default: '[]'
  - name: alt-list
    type: Array
    values: 'string[]'
    description: Accessible descriptions aligned with url-list.
    default: '[]'
  - name: initial-index
    type: Number
    values: 'number >= 0'
    description: Index of the image shown when the preview opens.
    default: '0'
  - name: infinite
    type: Boolean
    values: 'true | false'
    description: Loop from the first and last images when navigating.
    default: 'true'
  - name: hide-on-click-modal
    type: Boolean
    values: 'true | false'
    description: Close the preview when its empty backdrop is clicked.
    default: 'true'
  - name: close-on-press-escape
    type: Boolean
    values: 'true | false'
    description: Close the preview when Escape is pressed.
    default: 'true'
  - name: show-toolbar
    type: Boolean
    values: 'true | false'
    description: Show zoom, rotation, sizing, and reset controls.
    default: 'true'
  - name: wheel-zoom
    type: Boolean
    values: 'true | false'
    description: Zoom toward the pointer when the mouse wheel is used.
    default: 'true'
  - name: draggable
    type: Boolean
    values: 'true | false'
    description: Allow a magnified image to be panned with pointer dragging.
    default: 'true'
  - name: zoom-rate
    type: Number
    values: 'number > 1'
    description: Scale multiplier applied by each zoom step.
    default: '1.2'
  - name: min-scale
    type: Number
    values: 'number > 0'
    description: Minimum manual zoom scale. Fit mode can go lower for large images.
    default: '0.2'
  - name: max-scale
    type: Number
    values: 'number > 0'
    description: Maximum zoom scale.
    default: '7'
  - name: z-index
    type: Number
    values: 'layer number'
    description: Set the preview overlay stacking order.
    default: '3000'
EVENTS:
  - name: close
    description: Fired when the preview requests to close.
  - name: switch
    description: Fired with the active index after image navigation.
  - name: transform
    description: Fired after zooming, rotation, panning, sizing, or reset.
EXPOSES:
  - name: close
    description: Close the preview.
  - name: next
    description: Show the next image when available.
  - name: previous
    description: Show the previous image when available.
  - name: setIndex
    description: Show an image by index.
  - name: zoomIn
    description: Increase the current image scale.
  - name: zoomOut
    description: Decrease the current image scale.
  - name: rotateLeft
    description: Rotate the current image 90 degrees counterclockwise.
  - name: rotateRight
    description: Rotate the current image 90 degrees clockwise.
  - name: toggleFit
    description: Toggle between fit-to-screen and original-size modes.
  - name: fitToScreen
    description: Fit the current image inside the viewport.
  - name: showOriginal
    description: Display the current image at its original size.
  - name: reset
    description: Reset rotation, position, and scale to fit mode.
description: 'A full-screen image viewer with navigation, transforms, and accessible controls.'
---

# Image preview

<card>

## Full viewer

Open any thumbnail to navigate, zoom, rotate, fit, reset, and drag a magnified image. The viewer also supports the mouse wheel and the <kbd>←</kbd>, <kbd>→</kbd>, <kbd>+</kbd>, <kbd>-</kbd>, <kbd>R</kbd>, <kbd>Shift+R</kbd>, <kbd>F</kbd>, <kbd>0</kbd>, and <kbd>Esc</kbd> keys.

The thumbnails use native image buttons because the image itself is the accessible preview trigger; no repository button preset represents that pattern.

<template #example><image-preview-default /></template>

<template #template>

@[code{23-43}](../.vuepress/components/image-preview/default.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/image-preview/default.vue)

</template>

<template #style>

@[code{45-80}](../.vuepress/components/image-preview/default.vue)

</template>

</card>
