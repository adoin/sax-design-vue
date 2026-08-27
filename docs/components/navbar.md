---
description: 'Build top-level navigation with grouped actions and responsive states.'
PROPS:
  - name: variant
    type: String
    values: surface, floating, transparent
    description: Surface treatment of the navigation shell.
    default: surface
  - name: position
    type: String
    values: static, sticky, fixed
    description: Positioning strategy for the navigation shell.
    default: static
  - name: size
    type: String
    values: compact, default, spacious
    description: Navigation height and internal density.
    default: default
  - name: blurred
    type: Boolean
    values: true, false
    description: Use a blurred glass surface.
    default: false
  - name: content-width
    type: Number, String
    values: CSS length
    description: Maximum width of the inner content.
    default: 100%
  - name: gap
    type: Number, String
    values: CSS length
    description: Gap between brand, navigation, and action regions.
    default: 12
  - name: collapse-at
    type: Number
    values: pixels
    description: Container width where opted-in collapsed regions are hidden.
    default: 560
  - name: fixed
    type: Boolean
    values: true, false
    description: Defines if the component is fixed on the screen.
    default: false
    link: null
    usage: null
    code: >
      <s-navbar fixed>
        ...
      </s-navbar>
  - name: shadow
    type: Boolean
    values: true, false
    description: Add a shadow to the component.
    default: primary
    link: null
    usage: null
    code: >
      <s-navbar shadow>
        ...
      </s-navbar>
  - name: shadow-scroll
    type: Boolean
    values: true, false
    description: Add functionality to add shadow to component when scrollTop is more than 0.
    default: false
    link: null
    usage: null
    code: >
      <s-navbar shadow-scroll>
        ...
      </s-navbar>
  - name: hide-scroll
    type: Boolean
    values: true, false
    description: Add the functionality to hide and show the component based on whether the scroll is lowered or raised.
    default: false
    link: null
    usage: '#hide-scroll'
    code: >
      <s-navbar hide-scroll>
        ...
      </s-navbar>
  - name: textWhite
    type: Boolean
    values: true, false
    description: Change the text color of items to white.
    default: false
    link: null
    usage: '#color'
    code: >
      <s-navbar text-white>
        ...
      </s-navbar>
  - name: square
    type: Boolean
    values: true, false
    description: Change the border radius to 0 by making the component square.
    default: false
    link: null
    usage: '#square'
    code: >
      <s-navbar square>
        ...
      </s-navbar>
  - name: padding-scroll
    type: Boolean
    values: true, false
    description: Determines if the component has padding and the user scrolling is removed making an effect.
    default: false
    link: null
    usage: '#padding-scroll'
    code: >
      <s-navbar padding-scroll>
        ...
      </s-navbar>
  - name: not-line
    type: Boolean
    values: true, false
    description: Delete the active line in the component.
    default: false
    link: null
    usage: '#not-line'
    code: >
      <s-navbar not-line>
        ...
      </s-navbar>
  - name: left-collapsed
    type: Boolean
    values: true, false
    description: Add the functionality that when the elements of this slot cannot be correctly they are visually removed.
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar left-collapsed>
        ...
      </s-navbar>
  - name: center-collapsed
    type: Boolean
    values: true, false
    description: Add the functionality that when the elements of this slot cannot be correctly they are visually removed.
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar center-collapsed>
        ...
      </s-navbar>
  - name: right-collapsed
    type: Boolean
    values: true, false
    description: Add the functionality that when the elements of this slot cannot be correctly they are visually removed.
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar right-collapsed>
        ...
      </s-navbar>
  - name: target-scroll
    type: Boolean
    values: true, false
    description: Determines the element to which the scroll event will be requested.
    default: document
    link: null
    usage: '#target-scroll'
    code: >
      <s-navbar target-scroll="#my-element">
        ...
      </s-navbar>
  - name: item:disabled
    type: Boolean
    values: true, false
    description: Disable selection and navigation.
    default: false
  - name: item:icon
    type: String
    values: icon name
    description: Render a repository icon before the label.
    default: null
  - name: item:badge
    type: String, Number
    values: null
    description: Render compact status after the label.
    default: null
  - name: item:active
    type: Boolean
    values: true, false
    description: Determines if the component is in active status.
    default: false
    link: null
    usage: '#default'
    code: >
      <s-navbar-item active>
        ...
      </s-navbar-item>
  - name: item:to
    type: String, Object
    values: vue-router RouteLocationRaw
    description: Use vue-router to generate a new view based on the supplied string.
    default: false
    link: null
    usage: null
    code: >
      <s-navbar-item to="/">
        ...
      </s-navbar-item>
  - name: item:to
    type: String, Object
    values: vue-router RouteLocationRaw
    description: Use vue-router to generate a new view based on the supplied string.
    default: false
    link: null
    usage: null
    code: >
      <s-navbar-item to="/">
        ...
      </s-navbar-item>
  - name: item:link
    type: Object
    values: NavLink
    description: Use to navigate the site
    default: false
    link: null
    usage: null
    code: >
      <s-navbar-item :link="{ path: '/docs', text: 'Documents' }">
        ...
      </s-navbar-item>

EVENTS:
  - name: update:modelValue
    type: String
    description: Fires when the active navigation item changes.
  - name: collapsed
    type: Boolean
    description: Fires when the responsive collapsed state changes.
SLOTS:
  - name: brand
    type: slot
    values: collapsed, scrolled
    description: Brand region; takes priority over the legacy left slot.
    default: null
  - name: navigation
    type: slot
    values: collapsed, scrolled
    description: Primary navigation region; takes priority over the default slot.
    default: null
  - name: actions
    type: slot
    values: collapsed, scrolled
    description: Action region; takes priority over the legacy right slot.
    default: null
  - name: default
    type: slot
    values: null
    description: Add the elements in the center of the component.
    default: null
    link: null
    usage: '#default'
    code: >
      <s-navbar v-model="active">
        <s-navbar-item :active="active == 'guide'" id="guide">
          Guide
        </s-navbar-item>
      </s-navbar>
  - name: left
    type: slot
    values: null
    description: Add the elements on the left side of the component.
    default: null
    link: null
    usage: '#default'
    code: >
      <template #left>
        <img src="/sax-logo-mark.svg" alt="">
      </template>
  - name: right
    type: slot
    values: null
    description: Add the elements on the right side of the component.
    default: null
    link: null
    usage: '#default'
    code: >
      <template #right>
        <s-button flat> Login </s-button>
        <s-button> Get Started </s-button>
      </template>
---

# Navbar

<card>

## Interactive playground

<docs-warn />

`s-navbar` is a composable top-navigation shell. Color, surface, size, groups, scroll behavior, and detail treatments can all be adjusted in this single example.

<template #example>
<navbar-default />
</template>

<template #template>

@[code](../.vuepress/components/navbar/default.vue)

</template>

</card>

<card>

## Types

```ts
interface NavItem {
  text?: string
  ariaLabel?: string
}

interface NavLink extends NavItem {
  path: string
  target?: string
}

type NavbarItem = NavLink
```

</card>
