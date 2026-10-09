---
description: 'An edge panel with close approval, scoped regions, nesting and resizing.'
PROPS:
  - name: 'model-value'
    type: 'Boolean'
    values: 'true | false'
    description: 'Controlled visibility; open takes precedence when provided.'
    default: false
    usage: '#default'
  - name: 'v-model'
    type: 'Boolean'
    values: 'true | false'
    description: 'Controlled visibility; open takes precedence when provided.'
    default: false
    usage: '#default'
  - name: 'open'
    type: 'Boolean'
    values: 'true | false'
    description: 'Controlled visibility; open takes precedence when provided.'
    default: null
    usage: '#default'
  - name: 'v-model:open'
    type: 'Boolean'
    values: 'true | false'
    description: 'Controlled visibility; open takes precedence when provided.'
    default: false
    usage: '#default'
  - name: 'placement'
    type: 'DrawerPlacement'
    values: 'left | right | top | bottom'
    description: 'Edge used to open the drawer.'
    default: 'right'
    usage: '#placement-and-size'
  - name: 'direction'
    type: 'DrawerDirection'
    values: 'ltr | rtl | ttb | btt'
    description: 'Direction alias; when provided it overrides placement.'
    default: null
    usage: '#placement-and-size'
  - name: 'size'
    type: 'String | Number'
    values: 'CSS length | default | large'
    description: 'Width for left/right and height for top/bottom; default is 360px, large is 736px.'
    default: '360px'
    usage: '#placement-and-size'
  - name: 'width'
    type: 'String | Number'
    values: 'CSS length'
    description: 'Overrides size for left/right drawers.'
    default: null
    usage: '#placement-and-size'
  - name: 'height'
    type: 'String | Number'
    values: 'CSS length'
    description: 'Overrides size for top/bottom drawers.'
    default: null
    usage: '#placement-and-size'
  - name: 'title'
    type: 'DrawerContent'
    values: 'String | VNodeChild | render function'
    description: 'Region content; the matching slot takes precedence.'
    default: null
    usage: '#slots-and-regions'
  - name: 'extra'
    type: 'DrawerContent'
    values: 'String | VNodeChild | render function'
    description: 'Region content; the matching slot takes precedence.'
    default: null
    usage: '#slots-and-regions'
  - name: 'footer'
    type: 'DrawerContent'
    values: 'String | VNodeChild | render function'
    description: 'Region content; the matching slot takes precedence.'
    default: null
    usage: '#slots-and-regions'
  - name: 'with-header'
    type: 'Boolean'
    values: 'true | false'
    description: 'Show the header; hiding it keeps an independent floating close control.'
    default: true
    usage: '#slots-and-regions'
  - name: 'show-close'
    type: 'Boolean'
    values: 'true | false'
    description: 'Show the built-in close control, independently from the title.'
    default: true
    usage: '#slots-and-regions'
  - name: 'closable'
    type: 'Boolean'
    values: 'true | false'
    description: 'Alias of show-close; overrides it when supplied.'
    default: null
    usage: '#slots-and-regions'
  - name: 'close-icon'
    type: 'DrawerContent'
    values: 'icon name | VNodeChild | render function'
    description: 'Custom close artwork; the close-icon slot takes precedence.'
    default: null
    usage: '#slots-and-regions'
  - name: 'header-aria-level'
    type: 'String | Number'
    values: '1–6'
    description: 'Heading level used by the default title.'
    default: 2
    usage: '#slots-and-regions'
  - name: 'aria-label'
    type: 'String'
    values: 'accessible name'
    description: 'Accessible name, useful without a visible header.'
    default: null
    usage: '#slots-and-regions'
  - name: 'mask'
    type: 'Boolean'
    values: 'true | false'
    description: 'Show the overlay.'
    default: true
    usage: '#mounting-and-modality'
  - name: 'modal'
    type: 'Boolean'
    values: 'true | false'
    description: 'Alias of mask; overrides it when supplied.'
    default: null
    usage: '#mounting-and-modality'
  - name: 'modal-penetrable'
    type: 'Boolean'
    values: 'true | false'
    description: 'Allow page interaction when mask is false; focus trapping defaults to off in this mode.'
    default: false
    usage: '#mounting-and-modality'
  - name: 'mask-closable'
    type: 'Boolean'
    values: 'true | false'
    description: 'Request closing on overlay clicks. With before-close, only a local explicit true enables this entry.'
    default: 'true; explicit opt-in when guarded'
    usage: '#before-close'
  - name: 'close-on-click-modal'
    type: 'Boolean'
    values: 'true | false'
    description: 'Alias of mask-closable, following the same guarded opt-in rule.'
    default: null
    usage: '#before-close'
  - name: 'keyboard'
    type: 'Boolean'
    values: 'true | false'
    description: 'Allow the top overlay to request closing with Escape.'
    default: true
    usage: '#before-close'
  - name: 'close-on-press-escape'
    type: 'Boolean'
    values: 'true | false'
    description: 'Alias of keyboard; overrides it when supplied.'
    default: null
    usage: '#before-close'
  - name: 'before-close'
    type: 'DrawerBeforeCloseFn'
    values: 'Promise approval | done(cancel?) callback'
    description: 'Approval for controls, exposed close and v-model false requests. Rejection keeps the drawer and notifies the reason; false or done(true) veto silently.'
    default: null
    usage: '#before-close'
  - name: 'teleported'
    type: 'Boolean'
    values: 'true | false'
    description: 'Teleport to the selected mounting target.'
    default: true
    usage: '#mounting-and-modality'
  - name: 'append-to-body'
    type: 'Boolean'
    values: 'true | false'
    description: 'Alias of teleported.'
    default: null
    usage: '#mounting-and-modality'
  - name: 'append-to'
    type: 'String | HTMLElement'
    values: 'CSS selector | HTMLElement'
    description: 'Mounting target; takes precedence over get-container. Containers need a positioning context.'
    default: null
    usage: '#mounting-and-modality'
  - name: 'get-container'
    type: 'DrawerContainer'
    values: 'selector | HTMLElement | function | false'
    description: 'Compatibility target getter; false renders inline.'
    default: null
    usage: '#mounting-and-modality'
  - name: 'lock-scroll'
    type: 'Boolean'
    values: 'true | false'
    description: 'Lock body scrolling while present; nested overlays share ownership.'
    default: true
    usage: '#mounting-and-modality'
  - name: 'auto-focus'
    type: 'Boolean'
    values: 'true | false'
    description: 'Focus the panel automatically; open-auto-focus can prevent it.'
    default: true
    usage: '#before-close'
  - name: 'autofocus'
    type: 'Boolean'
    values: 'true | false'
    description: 'Compatibility alias of auto-focus.'
    default: null
    usage: '#before-close'
  - name: 'trap-focus'
    type: 'Boolean'
    values: 'true | false'
    description: 'Keep keyboard focus inside the top drawer; defaults to enabled unless penetrable.'
    default: null
    usage: '#before-close'
  - name: 'restore-focus'
    type: 'Boolean'
    values: 'true | false'
    description: 'Restore the opener after closing; close-auto-focus can prevent it.'
    default: true
    usage: '#before-close'
  - name: 'open-delay'
    type: 'Number'
    values: 'milliseconds'
    description: 'Delay displaying an opening request.'
    default: 0
    usage: '#content-lifecycle'
  - name: 'close-delay'
    type: 'Number'
    values: 'milliseconds'
    description: 'Delay approved closing; ancestor teardown does not wait for this delay.'
    default: 0
    usage: '#content-lifecycle'
  - name: 'destroy-on-close'
    type: 'Boolean'
    values: 'true | false'
    description: 'Destroy content after the closing animation.'
    default: false
    usage: '#content-lifecycle'
  - name: 'force-render'
    type: 'Boolean'
    values: 'true | false'
    description: 'Mount content before first opening; takes precedence over destroy-on-close.'
    default: false
    usage: '#content-lifecycle'
  - name: 'z-index'
    type: 'Number'
    values: 'stack level'
    description: 'Override the shared overlay level; descendants use a higher layer.'
    default: null
    usage: '#nested-drawers'
  - name: 'push'
    type: 'Boolean | DrawerPushOptions'
    values: 'false | true | { distance: CSS length }'
    description: 'Push the parent panel while a nested drawer is open; default distance is 180px.'
    default: true
    usage: '#nested-drawers'
  - name: 'loading'
    type: 'Boolean'
    values: 'true | false'
    description: 'Show body loading without destroying content; complete the compact exit before restoring it.'
    default: false
    usage: '#loading'
  - name: 'resizable'
    type: 'Boolean'
    values: 'true | false'
    description: 'Enable an accessible edge resize handle.'
    default: false
    usage: '#resizable'
  - name: 'min-size'
    type: 'String | Number'
    values: 'CSS length'
    description: 'Minimum resize extent, clamped to the available container.'
    default: 120
    usage: '#resizable'
  - name: 'max-size'
    type: 'String | Number'
    values: 'CSS length'
    description: 'Maximum resize extent; defaults to the available container.'
    default: null
    usage: '#resizable'
  - name: 'resize-step'
    type: 'Number'
    values: 'pixels'
    description: 'Arrow-key step; Shift multiplies it by five.'
    default: 10
    usage: '#resizable'
  - name: 'resize-label'
    type: 'String'
    values: 'accessible name'
    description: 'Accessible name for the resize handle.'
    default: null
    usage: '#resizable'
  - name: 'shape'
    type: 'String'
    values: 'rounded | square'
    description: 'Resolve panel geometry through the shared shape configuration.'
    default: 'ConfigProvider or rounded'
    usage: '#shape'
  - name: 'root-class-name'
    type: 'String'
    values: 'class name'
    description: 'Add classes to the corresponding region.'
    default: null
    usage: '#slots-and-regions'
  - name: 'modal-class'
    type: 'String'
    values: 'class name'
    description: 'Add classes to the corresponding region.'
    default: null
    usage: '#slots-and-regions'
  - name: 'header-class'
    type: 'String'
    values: 'class name'
    description: 'Add classes to the corresponding region.'
    default: null
    usage: '#slots-and-regions'
  - name: 'body-class'
    type: 'String'
    values: 'class name'
    description: 'Add classes to the corresponding region.'
    default: null
    usage: '#slots-and-regions'
  - name: 'footer-class'
    type: 'String'
    values: 'class name'
    description: 'Add classes to the corresponding region.'
    default: null
    usage: '#slots-and-regions'
  - name: 'root-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: 'Style the corresponding region without replacing built-in structure.'
    default: null
    usage: '#slots-and-regions'
  - name: 'content-wrapper-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: 'Style the corresponding region without replacing built-in structure.'
    default: null
    usage: '#slots-and-regions'
  - name: 'mask-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: 'Style the corresponding region without replacing built-in structure.'
    default: null
    usage: '#slots-and-regions'
  - name: 'header-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: 'Style the corresponding region without replacing built-in structure.'
    default: null
    usage: '#slots-and-regions'
  - name: 'body-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: 'Style the corresponding region without replacing built-in structure.'
    default: null
    usage: '#slots-and-regions'
  - name: 'footer-style'
    type: 'CSSProperties'
    values: 'CSS properties'
    description: 'Style the corresponding region without replacing built-in structure.'
    default: null
    usage: '#slots-and-regions'
  - name: 'class-names'
    type: 'DrawerRegionClasses'
    values: 'mask | wrapper | header | body | footer'
    description: 'Classes grouped by semantic region.'
    default: null
    usage: '#slots-and-regions'
  - name: 'styles'
    type: 'DrawerRegionStyles'
    values: 'mask | wrapper | header | body | footer'
    description: 'Styles grouped by semantic region.'
    default: null
    usage: '#slots-and-regions'
SLOTS:
  - name: 'default'
    type: Slot
    scope: DrawerSlotScope
    description: 'Body content.'
    usage: '#slots-and-regions'
  - name: 'header'
    type: Slot
    scope: DrawerSlotScope
    description: 'Replace heading content while retaining close and extra controls.'
    usage: '#slots-and-regions'
  - name: 'title'
    type: Slot
    scope: DrawerSlotScope
    description: 'Customize the default title wrapper.'
    usage: '#slots-and-regions'
  - name: 'extra'
    type: Slot
    scope: DrawerSlotScope
    description: 'Header actions.'
    usage: '#slots-and-regions'
  - name: 'footer'
    type: Slot
    scope: DrawerSlotScope
    description: 'Footer actions.'
    usage: '#slots-and-regions'
  - name: 'close-icon'
    type: Slot
    scope: DrawerSlotScope
    description: 'Close control artwork.'
    usage: '#slots-and-regions'
  - name: 'closeIcon'
    type: Slot
    scope: DrawerSlotScope
    description: 'Compatibility alias of close-icon.'
    usage: '#slots-and-regions'
  - name: 'loading'
    type: Slot
    scope: DrawerSlotScope
    description: 'Custom body loading feedback.'
    usage: '#loading'
  - name: 'mask'
    type: Slot
    scope: DrawerSlotScope
    description: 'Decorative overlay content.'
    usage: '#mounting-and-modality'
  - name: 'resizer'
    type: Slot
    scope: DrawerSlotScope
    description: 'Resize-handle content; built-in gesture and keyboard behavior remains.'
    usage: '#resizable'
EVENTS:
  - name: 'update:modelValue'
    type: 'Boolean'
    description: 'Visibility update.'
  - name: 'update:open'
    type: 'Boolean'
    description: 'Visibility alias update.'
  - name: 'update:size'
    type: 'Number'
    description: 'Resize extent in pixels.'
  - name: 'update:width'
    type: 'Number'
    description: 'Resized horizontal extent.'
  - name: 'update:height'
    type: 'Number'
    description: 'Resized vertical extent.'
  - name: 'before-open'
    type: '() => void'
    description: 'Opening starts.'
  - name: 'before-close'
    type: '() => void'
    description: 'Approved closing starts.'
  - name: 'open'
    type: '() => void'
    description: 'Opening animation completes.'
  - name: 'opened'
    type: '() => void'
    description: 'Opening animation completes.'
  - name: 'close'
    type: '() => void'
    description: 'Closing animation completes.'
  - name: 'closed'
    type: '() => void'
    description: 'Closing animation completes.'
  - name: 'after-open-change'
    type: 'Boolean'
    description: 'Animation completes with the final visibility.'
  - name: 'close-request'
    type: 'DrawerCloseReason'
    description: 'Closing request; a second optional parameter is the initiating event.'
  - name: 'close-error'
    type: 'unknown'
    description: 'Rejected or failed approval; second parameter is the close reason.'
  - name: 'open-auto-focus'
    type: 'Event'
    description: 'Before default focusing; preventDefault overrides it.'
  - name: 'close-auto-focus'
    type: 'Event'
    description: 'Before restoring the opener; preventDefault overrides it.'
  - name: 'resize-start'
    type: 'DrawerResizeEvent'
    description: 'Resize gesture or keyboard adjustment starts.'
  - name: 'resize'
    type: 'DrawerResizeEvent'
    description: 'Resize extent updates.'
  - name: 'resize-end'
    type: 'DrawerResizeEvent'
    description: 'Resize completes or is terminated.'
EXPOSES:
  - name: 'open'
    type: '() => void'
    description: 'Request opening.'
  - name: 'handleOpen'
    type: '() => void'
    description: 'Alias of open.'
  - name: 'close'
    type: '(reason?: DrawerCloseReason) => Promise<boolean>'
    description: 'Request guarded closing; resolves whether approval was accepted.'
  - name: 'handleClose'
    type: '(reason?: DrawerCloseReason) => Promise<boolean>'
    description: 'Alias of close.'
  - name: 'focus'
    type: '() => void'
    description: 'Focus the panel.'
  - name: 'visible'
    type: 'Boolean'
    description: 'Current display state.'
  - name: 'size'
    type: 'String | Number'
    description: 'Current extent, including local resizing.'
  - name: 'resizing'
    type: 'Boolean'
    description: 'Whether a pointer gesture is in progress.'
---

# Drawer

<card>

## Default

Open with v-model and use a scoped footer to request closing.

<template #example>
<drawer-default />
</template>

<template #template>

@[code{6-16}](../.vuepress/components/drawer/default.vue)

</template>

<template #script>

@[code{1-4}](../.vuepress/components/drawer/default.vue)

</template>

<template #style>

@[code{18-25}](../.vuepress/components/drawer/default.vue)

</template>

</card>

<card>

## Placement and size

Choose one of four edges and a CSS length or the default/large preset. Direction ltr/rtl/ttb/btt is also supported.

<template #example>
<drawer-placement />
</template>

<template #template>

@[code{18-32}](../.vuepress/components/drawer/placement.vue)

</template>

<template #script>

@[code{1-16}](../.vuepress/components/drawer/placement.vue)

</template>

<template #style>

@[code{34-41}](../.vuepress/components/drawer/placement.vue)

</template>

</card>

<card>

## Slots and regions

Header, title, extra, footer and close artwork are independent. Scoped slots receive close, titleId, titleClass, state and live size. Region styles apply to mask, wrapper, header, body and footer.

<template #example>
<drawer-slots />
</template>

<template #template>

@[code{8-36}](../.vuepress/components/drawer/slots.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/drawer/slots.vue)

</template>

<template #style>

@[code{38-45}](../.vuepress/components/drawer/slots.vue)

</template>

</card>

<card>

## Before close

Return a Promise or accept done(cancel?). Rejection shows a notification; false or done(true) keeps the drawer quietly. All controlled closing requests share approval. With a guard, overlay clicks require a local explicit true. Pending requests are deduplicated and loader exits finish before closing. Component destruction and forced ancestor closing release pending work.

<template #example>
<drawer-before-close />
</template>

<template #template>

@[code{23-43}](../.vuepress/components/drawer/before-close.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/drawer/before-close.vue)

</template>

<template #style>

@[code{45-56}](../.vuepress/components/drawer/before-close.vue)

</template>

</card>

<card>

## Content lifecycle

Content mounts lazily and is retained after closing. destroy-on-close resets component-local state after the exit; force-render mounts ahead of opening and keeps content. open-delay and close-delay control request timing. Legacy open/close and opened/closed report animation completion; before-open/before-close report the start.

<template #example>
<drawer-lifecycle />
</template>

<template #template>

@[code{20-37}](../.vuepress/components/drawer/lifecycle.vue)

</template>

<template #script>

@[code{1-18}](../.vuepress/components/drawer/lifecycle.vue)

</template>

<template #style>

@[code{39-46}](../.vuepress/components/drawer/lifecycle.vue)

</template>

</card>

<card>

## Nested drawers

Nested drawers share z-index, Escape ownership and scroll locking. push controls the parent displacement. Closing the parent also closes visible child drawers.

<template #example>
<drawer-nested />
</template>

<template #template>

@[code{8-27}](../.vuepress/components/drawer/nested.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/drawer/nested.vue)

</template>

<template #style>

@[code{29-36}](../.vuepress/components/drawer/nested.vue)

</template>

</card>

<card>

## Mounting and modality

Teleport is enabled by default. append-to/get-container select a target; teleported=false or get-container=false renders inline. Positioned containers define local bounds. mask=false with modal-penetrable and lock-scroll=false allows page interaction.

<template #example>
<drawer-container />
</template>

<template #template>

@[code{10-38}](../.vuepress/components/drawer/container.vue)

</template>

<template #script>

@[code{1-8}](../.vuepress/components/drawer/container.vue)

</template>

<template #style>

@[code{40-56}](../.vuepress/components/drawer/container.vue)

</template>

</card>

<card>

## Loading

The default content instance stays mounted during loading. The loading slot receives the active loading request and can render a custom indicator. SLogoLoading-based indicators participate in completion waiting.

<template #example>
<drawer-loading />
</template>

<template #template>

@[code{8-19}](../.vuepress/components/drawer/loading.vue)

</template>

<template #script>

@[code{1-6}](../.vuepress/components/drawer/loading.vue)

</template>

<template #style>

@[code{21-28}](../.vuepress/components/drawer/loading.vue)

</template>

</card>

<card>

## Resizable

Drag the edge; the handle supports arrow keys, Shift, Home and End. v-model:size receives pixels, and update:width/update:height follows the active axis. Resize events provide size, placement and the input event.

<template #example>
<drawer-resizable />
</template>

<template #template>

@[code{11-34}](../.vuepress/components/drawer/resizable.vue)

</template>

<template #script>

@[code{1-9}](../.vuepress/components/drawer/resizable.vue)

</template>

<template #style>

@[code{36-43}](../.vuepress/components/drawer/resizable.vue)

</template>

</card>

<card>

## Shape

Rounded and square panels follow local props and shared configuration.

<template #example>
<drawer-shape />
</template>

<template #template>

@[code{7-18}](../.vuepress/components/drawer/shape.vue)

</template>

<template #script>

@[code{1-5}](../.vuepress/components/drawer/shape.vue)

</template>

<template #style>

@[code{20-27}](../.vuepress/components/drawer/shape.vue)

</template>

</card>
