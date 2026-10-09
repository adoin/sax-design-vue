---
description: "An announcement bar with notice cycling, overflow scrolling, fixed actions and controlled visibility."
PROPS:
  - name: "content"
    type: "String"
    values: "text"
    description: "Text used without a content/default slot."
    default: null
    usage: "#default"
  - name: "items"
    type: "Array<string | NoticeBarItem>"
    values: "string | NoticeBarItem"
    description: "Notices to cycle; each item may supply content, type, icon, href, target and disabled."
    default: "[]"
    usage: "#multiple-notices"
  - name: "model-value"
    type: "Boolean"
    values: "true | false"
    description: "Controlled visibility. Omit to use internal closing state."
    default: null
    usage: "#controlled-visibility"
  - name: "v-model"
    type: "Boolean"
    values: "true | false"
    description: "Two-way visibility binding."
    default: null
    usage: "#controlled-visibility"
  - name: "active-index"
    type: "Number"
    values: "zero-based integer"
    description: "Controlled current index; out-of-range values are clamped."
    default: null
    usage: "#multiple-notices"
  - name: "v-model:active-index"
    type: "Number"
    values: "zero-based integer"
    description: "Two-way current-notice binding."
    default: null
    usage: "#multiple-notices"
  - name: "type"
    type: "NoticeBarType"
    values: "info | primary | success | warning | warn | danger"
    description: "Default tone. Per-item type overrides it; warn aliases warning."
    default: "info"
    usage: "#colors-and-tone"
  - name: "color"
    type: "String"
    values: "primary | success | danger | warn | warning | dark | text | light | secondary | RGB | RGBA | HEX | HSL | HSLA"
    description: "Custom surface accent; overrides the type color."
    default: null
    usage: "#colors-and-tone"
  - name: "text-color"
    type: "String"
    values: "primary | success | danger | warn | warning | dark | text | light | secondary | RGB | RGBA | HEX | HSL | HSLA"
    description: "Custom foreground, useful with a custom solid surface."
    default: null
    usage: "#variants"
  - name: "variant"
    type: "String"
    values: "soft | solid | plain"
    description: "Surface treatment."
    default: "soft"
    usage: "#variants"
  - name: "shape"
    type: "ComponentShape"
    values: "rounded | square"
    description: "Geometry; inherits ConfigProvider/install defaults when omitted."
    default: "rounded"
    usage: "#shape"
  - name: "size"
    type: "ComponentSize"
    values: "small | default | large"
    description: "Density; inherits the shared size configuration."
    default: null
    usage: "#size"
  - name: "icon"
    type: "String | false"
    values: "icon name | false"
    description: "Custom leading icon name; false hides the built-in bell. The icon slot takes precedence."
    default: null
    usage: "#links-and-slots"
  - name: "closable"
    type: "Boolean"
    values: "true | false"
    description: "Display an independent close control."
    default: false
    usage: "#controlled-visibility"
  - name: "before-close"
    type: "() => Promise<void>"
    description: "Async approval for the built-in close button, slot close() and instance close(). Fulfillment permits closing; rejection or throwing retains the notice and emits close-error. Pending requests merge and pause autoplay."
    usage: "#before-close"
  - name: "scrollable"
    type: "Boolean"
    values: "true | false"
    description: "Permit horizontal scrolling only when content overflows. Short notices remain stationary."
    default: true
    usage: "#overflow-scrolling"
  - name: "duration"
    type: "Number"
    values: "seconds"
    description: "Marquee cycle duration in seconds; speed takes precedence when supplied."
    default: 12
    usage: "#overflow-scrolling"
  - name: "speed"
    type: "Number"
    values: "pixels per second"
    description: "Constant marquee speed in pixels per second."
    default: null
    usage: "#overflow-scrolling"
  - name: "delay"
    type: "Number"
    values: "milliseconds"
    description: "Initial marquee delay, in milliseconds."
    default: 1000
    usage: "#overflow-scrolling"
  - name: "gap"
    type: "Number"
    values: "pixels"
    description: "Spacing between repeated notice text."
    default: 32
    usage: "#overflow-scrolling"
  - name: "wrapable"
    type: "Boolean"
    values: "true | false"
    description: "Show full wrapped content and disable marquee."
    default: false
    usage: "#wrapping-and-truncation"
  - name: "autoplay"
    type: "Boolean"
    values: "true | false"
    description: "Automatically advance when there is more than one notice."
    default: true
    usage: "#multiple-notices"
  - name: "interval"
    type: "Number"
    values: "milliseconds, minimum 500"
    description: "Time between notices. Overflowing text gets at least its initial delay plus one full marquee cycle."
    default: 3000
    usage: "#multiple-notices"
  - name: "loop"
    type: "Boolean"
    values: "true | false"
    description: "Wrap navigation/autoplay around the notice list; false stops at its ends."
    default: true
    usage: "#multiple-notices"
  - name: "paused"
    type: "Boolean"
    values: "true | false"
    description: "Pause marquee and automatic notice changes."
    default: false
    usage: "#overflow-scrolling"
  - name: "pause-on-hover"
    type: "Boolean"
    values: "true | false"
    description: "Pause automatic motion while the pointer is over the bar."
    default: true
    usage: "#multiple-notices"
  - name: "pause-on-focus"
    type: "Boolean"
    values: "true | false"
    description: "Pause automatic motion while focus is inside the bar; manual navigation stays available."
    default: true
    usage: "#multiple-notices"
  - name: "reduced-motion"
    type: "Boolean"
    values: "true | false"
    description: "Override the system preference. Reduced motion disables autoplay/marquee and wraps the full text."
    default: null
    usage: "#overflow-scrolling"
  - name: "show-navigation"
    type: "Boolean"
    values: "true | false"
    description: "Show previous/next controls for multiple notices."
    default: false
    usage: "#multiple-notices"
  - name: "show-indicator"
    type: "Boolean"
    values: "true | false"
    description: "Show the current/total counter for multiple notices."
    default: false
    usage: "#multiple-notices"
  - name: "href"
    type: "String"
    values: "URL"
    description: "Native link for the content area. Per-item href takes precedence."
    default: null
    usage: "#links-and-slots"
  - name: "target"
    type: "String"
    values: "_self | _blank"
    description: "Link target; blank links include noopener noreferrer."
    default: "_self"
    usage: "#links-and-slots"
  - name: "clickable"
    type: "Boolean"
    values: "true | false"
    description: "Use a keyboard-operable content button when there is no link. Keep interactive controls in actions."
    default: false
    usage: "#links-and-slots"
  - name: "live"
    type: "String"
    values: "off | polite | assertive"
    description: "Announcement policy. Single notices default to polite, lists to off; role=alert defaults to assertive."
    default: null
    usage: "#multiple-notices"
SLOTS:
  - name: "default"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Notice content fallback."
    usage: "#links-and-slots"
  - name: "content"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Scoped current-notice content; takes precedence over default."
    usage: "#links-and-slots"
  - name: "icon"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Leading icon; retains its fixed region."
    usage: "#links-and-slots"
  - name: "prefix"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Fixed content before the message."
    usage: "#links-and-slots"
  - name: "suffix"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Fixed decorative content after the message."
    usage: "#links-and-slots"
  - name: "actions"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Fixed interactive actions; their clicks do not trigger the bar click event."
    usage: "#links-and-slots"
  - name: "navigation"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Replace the notice navigation area using next/prev scope callbacks."
    usage: "#links-and-slots"
  - name: "close-icon"
    type: Slot
    scope: NoticeBarSlotScope
    description: "Replace only the close artwork; the native accessible close button remains."
    usage: "#links-and-slots"
EVENTS:
  - name: "update:modelValue"
    description: "Visibility request."
    type: "Boolean"
  - name: "update:activeIndex"
    description: "Current-index request."
    type: "Number"
  - name: "change"
    description: "Current notice index changed; receives the selected item."
    type: "(index: number, item: NoticeBarItem) => void"
  - name: "click"
    description: "Click on the bar/content; reserved controls and actions stop propagation."
    type: "MouseEvent"
  - name: "close"
    description: "An approved close request; not emitted while awaiting approval or after rejection."
  - name: "close-error"
    type: "(reason: unknown) => void"
    description: "Close approval rejected, threw or returned a non-Promise; receives the original reason."
    usage: "#before-close"
  - name: "closed"
    description: "Exit animation completed."
  - name: "scroll-end"
    description: "One full marquee cycle completed."
EXPOSES:
  - name: "open"
    type: "() => void"
    description: "Request visibility."
  - name: "close"
    type: "() => Promise<boolean>"
    description: "Request guarded closing; resolves true after approval or false after rejection/cancellation. closed reports the completed exit animation."
    usage: "#before-close"
  - name: "closePending"
    type: "Boolean"
    description: "Close approval is pending; also available in every slot scope."
    usage: "#before-close"
  - name: "next"
    type: "() => void"
    description: "Next notice, respecting loop."
  - name: "prev"
    type: "() => void"
    description: "Previous notice, respecting loop."
  - name: "goTo"
    type: "(index: number) => void"
    description: "Request a zero-based index; clamps invalid bounds."
  - name: "pause"
    type: "() => void"
    description: "Pause automatic activity manually."
  - name: "resume"
    type: "() => void"
    description: "Release manual pause; other pause conditions still apply."
  - name: "reset"
    type: "() => void"
    description: "Return to the first notice and restart the marquee/autoplay timing."
  - name: "visible"
    type: "Boolean"
    description: "Effective visibility."
  - name: "activeIndex"
    type: "Number"
    description: "Effective current index."
  - name: "paused"
    type: "Boolean"
    description: "Effective playback pause state."
  - name: "scrolling"
    type: "Boolean"
    description: "Whether overflowing text uses marquee."
---

# Notice Bar

<card>

## Default

Short text stays stationary; overflow scrolls automatically.

<template #example><notice-bar-default /></template>

<template #template>

@[code{1-5}](../.vuepress/components/notice-bar/default.vue)

</template>

</card>

<card>

## Colors and tone

Use type for a semantic tone and color for a brand accent. Per-item tones work in notice lists.

<template #example><notice-bar-colors /></template>

<template #template>

@[code{1-20}](../.vuepress/components/notice-bar/colors.vue)

</template>

<template #style>

@[code{22-39}](../.vuepress/components/notice-bar/colors.vue)

</template>

</card>

<card>

## Variants

Choose a soft, solid or plain surface independently of geometry. text-color can adjust custom solid foregrounds.

<template #example><notice-bar-variants /></template>

<template #template>

@[code{1-17}](../.vuepress/components/notice-bar/variants.vue)

</template>

<template #style>

@[code{19-36}](../.vuepress/components/notice-bar/variants.vue)

</template>

</card>

<card>

## Shape

Rounded and square geometry use the shared shape configuration.

<template #example><notice-bar-shape /></template>

<template #template>

@[code{1-22}](../.vuepress/components/notice-bar/shape.vue)

</template>

<template #style>

@[code{24-41}](../.vuepress/components/notice-bar/shape.vue)

</template>

</card>

<card>

## Size

The shared small, default and large scale changes text, spacing and controls together.

<template #example><notice-bar-size /></template>

<template #template>

@[code{1-9}](../.vuepress/components/notice-bar/size.vue)

</template>

<template #style>

@[code{11-28}](../.vuepress/components/notice-bar/size.vue)

</template>

</card>

<card>

## Overflow scrolling

Only overflowing content scrolls. speed uses px/s; duration keeps its seconds unit. Hover/focus, paused and system motion preferences control playback. Offscreen and hidden pages pause automatic activity.

<template #example><notice-bar-marquee /></template>

<template #template>

@[code{6-17}](../.vuepress/components/notice-bar/marquee.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/notice-bar/marquee.vue)

</template>

<template #style>

@[code{19-36}](../.vuepress/components/notice-bar/marquee.vue)

</template>

</card>

<card>

## Multiple notices

items accepts strings or notice objects. Bind active-index, use built-in navigation, or let autoplay advance. The interval is in milliseconds; long scrolling messages finish a reading cycle before advancing. Controls and actions stay fixed.

<template #example><notice-bar-multiple /></template>

<template #template>

@[code{25-38}](../.vuepress/components/notice-bar/multiple.vue)

</template>

<template #script>

@[code{1-23}](../.vuepress/components/notice-bar/multiple.vue)

</template>

<template #style>

@[code{40-57}](../.vuepress/components/notice-bar/multiple.vue)

</template>

</card>

<card>

## Wrapping and truncation

Use wrapable to show the entire message. scrollable=false keeps a single stationary line with an ellipsis and native title.

<template #example><notice-bar-multiline /></template>

<template #template>

@[code{6-13}](../.vuepress/components/notice-bar/multiline.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/notice-bar/multiline.vue)

</template>

<template #style>

@[code{15-32}](../.vuepress/components/notice-bar/multiline.vue)

</template>

</card>

<card>

## Links and slots

Content can be a native link or clickable button. Fixed prefix, suffix and actions slots remain separate from scrolling text and the close control. Content slots are best for text and lightweight decoration; put interactive controls in actions.

<template #example><notice-bar-actions /></template>

<template #template>

@[code{7-29}](../.vuepress/components/notice-bar/actions.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/notice-bar/actions.vue)

</template>

<template #style>

@[code{31-48}](../.vuepress/components/notice-bar/actions.vue)

</template>

</card>

<card>

## Controlled visibility

Use v-model to show a previously closed notice again. close reports the close request; closed reports the completed exit.

<template #example><notice-bar-visibility /></template>

<template #template>

@[code{7-17}](../.vuepress/components/notice-bar/visibility.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/notice-bar/visibility.vue)

</template>

<template #style>

@[code{19-36}](../.vuepress/components/notice-bar/visibility.vue)

</template>

</card>

<card>

## Before close

Use `before-close` to wait for a choice, save a preference or complete other asynchronous work before closing. Resolve the Promise to approve; reject to keep the notice visible. The example uses Dialog to choose temporary or permanent dismissal, with the application saving the preference in localStorage. Reset clears this example's saved preference.

The built-in button, slot `close()` and instance `close()` use the hook. Direct changes to `v-model` remain controlled by the owner. Waiting pauses automatic motion and disables duplicate button requests; `closePending` is available on the instance and in slot scopes. Handle `close-error` when rejected reasons need feedback.

<template #example><notice-bar-before-close /></template>

<template #template>

@[code{66-110}](../.vuepress/components/notice-bar/before-close.vue)

</template>

<template #script>

@[code{1-64}](../.vuepress/components/notice-bar/before-close.vue)

</template>

<template #style>

@[code{112-130}](../.vuepress/components/notice-bar/before-close.vue)

</template>

</card>
