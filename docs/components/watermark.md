---
description: "Visible and screenshot-tracing blind watermarks."
PROPS:
  - name: content
    type: String
    values: "text"
    description: "Visible watermark text; supports line breaks. Also the fallback blind identifier."
    default: null
  - name: mode
    type: String
    values: "visible, blind, both"
    description: "Visible, blind, or combined watermarks."
    default: "visible"
  - name: blind-content
    type: String
    values: "text"
    description: "Separate blind identifier, such as an application-provided user or session ID. Falls back to content."
    default: null
  - name: blind-strength
    type: Number
    values: "1 - 16"
    description: "Blind color-channel modulation; higher values improve reveal contrast but become more perceptible."
    default: 2
  - name: gap
    type: Number
    values: "0 - 1000"
    description: "Spacing between watermark tiles in pixels."
    default: 96
  - name: opacity
    type: Number
    values: "0 - 1"
    description: "Visible watermark opacity only; does not affect blind watermarks."
    default: 0.12
  - name: rotate
    type: Number
    values: "-360 - 360"
    description: "Rotation of each watermark tile."
    default: -18
  - name: font-size
    type: Number
    values: "8 - 96"
    description: "Watermark font size in pixels."
    default: 13
  - name: color
    type: String
    values: "CSS color"
    description: "Visible watermark color; defaults to the HSL text token."
    default: null
  - name: z-index
    type: Number
    values: "number"
    description: "Watermark stacking level inside its container."
    default: 10
---

# Watermark

<card>

## Visible watermark

Text repeats across the whole container, covering content without intercepting pointer input. Adjust spacing, angle, font size, color and opacity.

<template #example>
<watermark-default />
</template>

<template #template>

@[code{6-17}](../.vuepress/components/watermark/default.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/watermark/default.vue)

</template>

<template #style>

@[code{19-24}](../.vuepress/components/watermark/default.vue)

</template>

</card>

<card>

## Blind watermark and screenshot reveal

Set `mode="blind"` to encode an identifier through tiny color-channel differences, or `mode="both"` to combine it with a visible watermark. Pass an application user or session ID through `blind-content`; the revealed identifier can be read manually and matched to application records. The component neither collects identity nor detects screenshots.

Capture the document below as an original PNG, then choose “Reveal a screenshot”. `revealWatermark(file, { gain: 32 })` returns a revealed PNG data URL locally in the browser without uploading the image. This example uses a demonstration identifier only.

This reveals a page color signal; it is not encryption or automatic identity verification. Original PNGs and flat backgrounds work best. Colorful content can interfere; JPEG compression, resizing, filters or photographs may destroy the signal. It cannot prevent editing the page before capturing it. Blind regions use the theme background by default; keep custom backgrounds opaque.

<template #example>
<watermark-blind />
</template>

<template #template>

@[code{28-64}](../.vuepress/components/watermark/blind.vue)

</template>

<template #script>

@[code{1-26}](../.vuepress/components/watermark/blind.vue)

</template>

<template #style>

@[code{66-88}](../.vuepress/components/watermark/blind.vue)

</template>

</card>
