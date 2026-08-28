---
PROPS:
  - name: model-value / v-model
    type: Number
    values: slide index
    description: Active slide index.
    default: '0'
  - name: items
    type: CarouselItem[]
    values: '{ name?, label?, src?, alt?, title?, description?, disabled?, ...customData }[]'
    description: Slide data. Extra business fields are forwarded to the item slot.
    default: '[]'
  - name: height
    type: Number | String
    values: CSS height
    description: Carousel height.
    default: '260'
  - name: radius
    type: Boolean | Number | String
    values: true / false / CSS length
    description: Shared radius for the viewport and every slide; false uses square corners.
    default: 'true'
  - name: effect
    type: String
    values: slide / fade / deck / orbit / prism
    description: Transition presentation. Deck, orbit, and prism use CSS 3D perspective.
    default: slide
  - name: direction
    type: String
    values: horizontal / vertical
    description: Slide and control direction.
    default: horizontal
  - name: autoplay
    type: Boolean
    values: true / false
    description: Automatically advance slides.
    default: 'true'
  - name: interval
    type: Number
    values: milliseconds
    description: Autoplay interval.
    default: '4000'
  - name: loop
    type: Boolean
    values: true / false
    description: Wrap navigation at both ends.
    default: 'true'
  - name: pause-on-hover
    type: Boolean
    values: true / false
    description: Pause autoplay while pointer is over the carousel.
    default: 'true'
  - name: arrow
    type: String
    values: always / hover / never
    description: Arrow visibility behavior.
    default: hover
  - name: indicator-position
    type: String
    values: inside / outside / top / bottom / left / right / none
    description: Indicator placement.
    default: inside
  - name: indicator-type
    type: String
    values: dot / line / number
    description: Indicator presentation.
    default: line
  - name: trigger
    type: String
    values: click / hover
    description: Indicator activation trigger. Click remains available for accessibility.
    default: click
  - name: transition-duration
    type: Number
    values: milliseconds
    description: Transition duration shared by every effect.
    default: '480'
  - name: easing
    type: String
    values: CSS timing function
    description: Transition interpolation function.
    default: cubic-bezier(.22, .72, 0, 1)
  - name: deck-scale
    type: Number
    values: 0 - 1
    description: Scale of the first inactive layer in deck mode.
    default: '0.86'
  - name: deck-visible
    type: Number
    values: 1 - 4
    description: Maximum inactive card layers visible on each side in deck mode.
    default: '2'
  - name: deck-blur
    type: Boolean
    values: true / false
    description: Blur inactive deck cards progressively by distance.
    default: 'false'
  - name: perspective / depth
    type: Number / Number
    values: pixels
    description: 3D camera perspective and Z-axis distance.
    default: '1200 / 150'
  - name: orbit-angle
    type: Number
    values: 0 / 12 - 120
    description: Angular spacing in orbit mode; 0 distributes rendered items evenly around the full circle.
    default: '0'
  - name: orbit-max-visible
    type: Number
    values: integer, ≥ 4
    description: Base visible card count. Auto spacing may take one extra real card to make an even window odd; larger data sets use hidden edge buffers.
    default: '10'
  - name: motion-blur
    type: Boolean
    values: true / false
    description: Adds a short motion blur during transitions.
    default: 'false'
  - name: draggable / touchable
    type: Boolean / Boolean
    values: true / false
    description: Enable mouse dragging and touch swiping.
    default: 'false / true'
  - name: keyboard
    type: Boolean
    values: true / false
    description: Enable arrow, Home, and End keyboard navigation.
    default: 'true'
EVENTS:
  - name: before-change
    description: Fired with next and previous indexes before state changes.
  - name: change
    description: Fired with current and previous indexes when state changes.
  - name: after-change
    description: Fired after the configured transition duration.
EXPOSES:
  - name: activeIndex
    description: Readonly active slide index ref.
  - name: setActiveItem(index | name)
    description: Switch to a slide by index or item name.
  - name: prev / next
    description: Switch to the previous or next enabled slide.
  - name: play / pause
    description: Resume or pause autoplay imperatively.
SLOTS:
  - name: item
    description: Custom slide content. Receives item, index, active, and relative offset.
  - name: prev / next
    description: Custom arrow content. Receives disabled.
  - name: indicator
    description: Custom indicator content. Receives item, index, and active.
description: 'Carousel with controlled state, deck layouts, spatial 3D effects, and accessible navigation.'
---

# Carousel

<card>

## Default

Controlled index, autoplay, arrows, and line indicators use stable defaults.

<template #example><carousel-default /></template>

<template #template>

@[code{35-45}](../.vuepress/components/carousel/default.vue)

</template>

<template #script>

@[code{1-33}](../.vuepress/components/carousel/default.vue)

</template>

<template #style>

@[code{47-77}](../.vuepress/components/carousel/default.vue)

</template>

</card>

<card>

## Card deck

`deck` owns the centered card and the inactive layers on both sides. Use `deck-visible` for the visible layer count and `deck-blur` for optional depth blur instead of maintaining several nearly identical effect types.

<template #example><carousel-deck /></template>

<template #template>

@[code{60-99}](../.vuepress/components/carousel/deck.vue)

</template>

<template #script>

@[code{1-58}](../.vuepress/components/carousel/deck.vue)

</template>

<template #style>

@[code{101-148}](../.vuepress/components/carousel/deck.vue)

</template>

</card>

<card>

## Orbit stage

`orbit` uses a continuous phase to move a lower ring of compact cards smoothly around the Y axis. A separate, larger active card sits above the ring and changes with a short GPU-friendly crossfade. `orbit-max-visible` defaults to 10. When a larger data set would produce an even base window, the orbit takes one additional real card to form an odd ring. Every looping orbit keeps one hidden clone buffer at each edge: the outgoing card moves into the back and fades out while the matching buffer fades in from the other side, preventing a wrap teleport. Only when every real item already fits and no extra item is available does it render a decorative placeholder with a transparent interior and visible outline as that back-side portal. Fewer than four source items are cloned to fill the ring. Set a non-zero `orbit-angle` to override automatic spacing.

<template #example><carousel-orbit /></template>

<template #template>

@[code{40-92}](../.vuepress/components/carousel/orbit.vue)

</template>

<template #script>

@[code{1-38}](../.vuepress/components/carousel/orbit.vue)

</template>

<template #style>

@[code{94-145}](../.vuepress/components/carousel/orbit.vue)

</template>

</card>

<card>

## Mirror prism

`prism` arranges three cards around one shared axis. Every face keeps a continuous rotation phase, so side cards move like one rigid prism instead of flipping independently. `radius` is shared by the viewport and every card; pass `false` for crisp prism faces.

<template #example><carousel-prism /></template>

<template #template>

@[code{47-83}](../.vuepress/components/carousel/prism.vue)

</template>

<template #script>

@[code{1-45}](../.vuepress/components/carousel/prism.vue)

</template>

<template #style>

@[code{85-129}](../.vuepress/components/carousel/prism.vue)

</template>

</card>

<card>

## Fade

`fade` only transitions opacity. Enable `motion-blur` for a brief directional softening and compare both parameter states in the same example.

<template #example><carousel-fade /></template>

<template #template>

@[code{23-60}](../.vuepress/components/carousel/fade.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/carousel/fade.vue)

</template>

<template #style>

@[code{62-100}](../.vuepress/components/carousel/fade.vue)

</template>

</card>

<card>

## External control

The exposed API supports named navigation and explicit playback control. Disabled items are skipped by arrows, autoplay, keyboard, and drag navigation.

<template #example><carousel-controls /></template>

<template #template>

@[code{22-52}](../.vuepress/components/carousel/controls.vue)

</template>

<template #script>

@[code{1-20}](../.vuepress/components/carousel/controls.vue)

</template>

<template #style>

@[code{54-85}](../.vuepress/components/carousel/controls.vue)

</template>

</card>
