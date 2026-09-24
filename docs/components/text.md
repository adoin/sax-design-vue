---
PROPS:
  - name: tag
    type: String
    values: 'semantic HTML tag'
    description: Select the rendered element and semantic color state.
    default: 'span'
  - name: status
    type: String
    values: 'theme status'
    description: Select the rendered element and semantic color state.
    default: null
  - name: content
    type: String | Number
    values: 'text'
    description: Text when no default slot is supplied.
    default: null
  - name: effect
    type: TextEffect
    values: 'default | shimmer | typing | rainbow | neon | shadow'
    description: Select a text treatment. `shimmer` sweeps a highlight, `typing` reveals `content`, `rainbow` cycles semantic colors, `neon` pulses a glow, and `shadow` moves a soft gradient shadow. Motion becomes static under reduced-motion preferences.
    default: 'default'
  - name: line-clamp
    type: false | Number
    values: 'false | positive integer'
    description: Truncation lines. `false` disables truncation, `1` truncates one line, and `2+` clamps multiple lines.
    default: false
description: 'Semantic text with optional visual, truncation, and typewriter effects.'
---

# Text

<card>

Use `effect="shimmer"` for live, in-progress copy, `effect="typing"` to reveal `content` character by character, and `rainbow`, `neon`, or `shadow` for decorative emphasis. Effects are visual only; add an appropriate live-region role when the surrounding product state needs to be announced.

<template #example><text-default /></template>

<template #template>

@[code{1-57}](../.vuepress/components/text/default.vue)

</template>

<template #style>

@[code{59-102}](../.vuepress/components/text/default.vue)

</template>

</card>
