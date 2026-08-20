---
PROPS:
  - name: auto-start
    type: Boolean
    values: true | false
    description: Start the countdown automatically after mounting.
    default: true
  - name: speed
    type: Number
    values: number >= 0
    description: Countdown speed multiplier. Zero freezes the remaining time.
    default: 1
  - name: value
    type: Number
    values: timestamp
    description: Target timestamp in milliseconds.
    default: null
  - name: format
    type: String
    values: DD HH mm ss
    description: Display format tokens. The highest visible unit includes omitted larger units.
    default: HH:mm:ss
  - name: formatter
    type: Function
    values: (time) => string
    description: Format custom text from the remaining time. When provided, it takes precedence over format, and returned digits keep the selected effect.
    default: null
  - name: effect
    type: String
    values: default | flip | fade | particle | slide
    description: Digit transition effect. Separators remain static.
    default: default
EVENTS:
  - name: finish
    description: Fired at zero.
  - name: change
    description: Remaining milliseconds change.
EXPOSES:
  - name: start / stop
    description: Resume or pause the countdown imperatively.
description: 'Countdown display.'
---

# Countdown

<card>

## Basic

The existing static digit presentation remains the default.

<template #example><countdown-default /></template><template #template>

@[code](../.vuepress/components/countdown/default.vue)

</template>

</card>

<card>

## Effects, formats, speed, and custom display

Use the radio control to apply one digit effect to every example. Flip, fade, particle dissolve and gather, and vertical slide only animate changed digits and fall back to an immediate update when reduced motion is enabled.

The highest unit in `format` absorbs omitted larger units: `ss` shows total seconds (including values over 60), `mm:ss` allows minutes over 59, and `HH:mm:ss` allows hours over 23. Add `DD` when days should be split out.

Use `speed` to change the rate (`0` freezes, `1` is real time, and `2` is twice as fast). Use either `format` for token-based output or `formatter(time)` for custom text; when `formatter` is provided, `format` is ignored. Formatter output still passes through the built-in digit renderer, so the selected `effect` remains active.

<template #example><countdown-formats /></template><template #template>

@[code](../.vuepress/components/countdown/formats.vue)

</template>

</card>
