---
PROPS:
  - name: button-accept
    type: Boolean
    values: "action visibility and labels"
    description: Configure prompt action buttons and their text.
    default: null
  - name: button-cancel
    type: Boolean
    values: "action visibility and labels"
    description: Configure prompt action buttons and their text.
    default: null
  - name: accept-text
    type: String
    values: "action visibility and labels"
    description: Configure prompt action buttons and their text.
    default: null
  - name: cancel-text
    type: String
    values: "action visibility and labels"
    description: Configure prompt action buttons and their text.
    default: null
  - name: close-icon
    type: String
    values: "Iconify icon name"
    description: Customize the close control icon.
    default: null
  - name: v-model
    type: Boolean
    values: "true, false"
    description: Dialog visibility.
    default: false
    link: null
    usage: '#default'

  - name: title
    type: String
    values: "String"
    description: Dialog title.
    default: Dialog
    link: null
    usage: '#default'

  - name: text
    type: String
    values: "String"
    description: Dialog body text when the default slot is empty.
    default: null
    link: null
    usage: '#default'

  - name: type
    type: String
    values: "alert, confirm"
    description: Alert shows a header close button and closes on overlay click. Confirm shakes on overlay click.
    default: alert
    link: null
    usage: '#alert'

  - name: color
    type: String
    values: "primary, success, danger, warning, dark"
    description: Accent color for the title and accept button.
    default: primary
    link: null
    usage: '#validation'

  - name: is-valid
    type: Boolean | String
    values: "true, false, none"
    description: When false, the accept button stays disabled. Use none to skip validation.
    default: none
    link: null
    usage: '#validation'

  - name: accept-text
    type: String
    values: "String"
    description: Accept button label.
    default: Accept
    link: null
    usage: '#default'

  - name: cancel-text
    type: String
    values: "String"
    description: Cancel button label.
    default: Cancel
    link: null
    usage: '#default'

  - name: buttons-hidden
    type: Boolean
    values: "true, false"
    description: Hide action buttons.
    default: false
    link: null
    usage: '#default'
EVENTS:
  - name: update:modelValue
    params: boolean
    description: Visibility change.

  - name: accept
    params: null
    description: Accept button clicked.

  - name: cancel
    params: null
    description: Cancel button clicked.

  - name: close
    params: null
    description: Dialog closed.
EXPOSES: []
description: 'Confirmation and alert dialogs with built-in Accept/Cancel actions. Use Dialog for fully custom modal layouts.'
NEWS:
  - default
  - alert
  - validation
  - programmatic
---

# Prompt

<card>

**Prompt is the confirmation / alert dialog** — not a duplicate of [Dialog](/components/dialog).

|                   | **Prompt** (`s-prompt`)                                      | **Dialog** (`s-dialog`)                          |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------ |
| Purpose           | Quick **confirm**, **alert**, or short forms with validation | **General-purpose** modal shell                  |
| Layout            | Fixed: title bar + body + **Accept / Cancel** footer         | Fully custom `#header`, default, `#footer` slots |
| Typical use       | “Delete this item?”, security code, name validation          | Login panel, nested modals, fullscreen content   |
| Overlay (confirm) | Shakes to hint “use a button”                                | Closes or uses `prevent-close`                   |

In Vuesax 3.x both come from the Dialogs family (`vs-prompt` is a preset on the same dialog primitive). **Popup** (`vs-popup`) is yet another component — a titled content panel, not yet migrated here.

**Rule of thumb:** need built-in OK/Cancel → **Prompt**. Need to own the whole layout → **Dialog**.

</card>

<card>

## Default

Use the default slot to place inputs, selects, or any custom content inside the prompt.

<template #example>
<prompt-default />
</template>

<template #template>

@[code{1-57}](../.vuepress/components/prompt/default.vue)

</template>

<template #script>

@[code{59-76}](../.vuepress/components/prompt/default.vue)

</template>

<template #style>

@[code{78-108}](../.vuepress/components/prompt/default.vue)

</template>

</card>

<card>

## Alert

`type="alert"` adds a header close button and closes when the overlay is clicked.

<template #example>
<prompt-alert />
</template>

<template #template>

@[code{1-13}](../.vuepress/components/prompt/alert.vue)

</template>

<template #script>

@[code{15-19}](../.vuepress/components/prompt/alert.vue)

</template>

<template #style>

@[code{21-27}](../.vuepress/components/prompt/alert.vue)

</template>

</card>

<card>

## Validation

Use `is-valid` to disable the accept button until the form inside the slot is valid.

<template #example>
<prompt-validation />
</template>

<template #template>

@[code{1-26}](../.vuepress/components/prompt/validation.vue)

</template>

<template #script>

@[code{28-43}](../.vuepress/components/prompt/validation.vue)

</template>

<template #style>

@[code{45-64}](../.vuepress/components/prompt/validation.vue)

</template>

</card>

<card>

## Programmatic

After `app.use(SaxDesignVue)`, call **`$prompt`** (Options API) or import **`SPromptBox`** — no template required. This matches the official `$vs.dialog()` helper.

<template #example>
<prompt-programmatic />
</template>

<template #template>

@[code{1-7}](../.vuepress/components/prompt/programmatic.vue)

</template>

<template #script>

@[code{9-28}](../.vuepress/components/prompt/programmatic.vue)

</template>

<template #style>

@[code{30-44}](../.vuepress/components/prompt/programmatic.vue)

</template>

```ts
import { SPromptBox } from 'sax-design-vue'

// Alert — resolves when dismissed
await SPromptBox.alert('Saved successfully.', 'Notice')

// Confirm — resolves on Accept, rejects on Cancel / close
try {
  await SPromptBox.confirm('Delete this item?', 'Confirm')
  // user accepted
} catch {
  // user cancelled
}

// Full options + action result
const action = await SPromptBox({
  title: 'Confirm',
  text: 'Continue?',
  type: 'confirm',
  color: 'danger',
})
// action: 'accept' | 'cancel' | 'close'
```

</card>
