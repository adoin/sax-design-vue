---
description: 'Present focused modal content and require a user decision.'
PROPS:
  - name: before-confirm
    type: DialogBeforeConfirmFn
    default: null
    description: Validate before confirming, synchronously or asynchronously. Returning false keeps the dialog open; success emits confirm and follows confirm-closable. Errors emit confirm-error and keep it open.
    usage: '#before-confirm'
  - name: confirm-disabled
    type: Boolean
    default: false
    description: Disable the built-in confirmation action.
    usage: '#before-confirm'
  - name: minimizable
    type: Boolean
    default: null
    description: Show the minimize action. Defaults to enabled for full-screen dialogs and disabled otherwise.
    usage: '#full-screen'
  - name: global
    type: Boolean
    default: false
    description: Set at creation time to retain an opened dialog and its bubble after the owner unmounts; closing releases the retained instance.
    usage: '#global-lifetime'
  - name: minimized-label
    type: String
    default: null
    description: Bubble label. Falls back to title, then a localized generic label.
    usage: '#full-screen'
  - name: before-close
    type: DialogBeforeCloseFn
    values: "() => Promise<void>"
    description: Async close approval with no arguments. Only Promise resolution permits closing. Rejection or an exception keeps it open and displays the string or Error.message in a Notification. A non-Promise return blocks closing.
    default: null
    usage: '#before-close'
  - name: color
    type: String
    values: "theme color | RGB | HEX | HSL"
    description: Set the dialog accent color.
    default: primary
  - name: top
    type: String | Number
    values: "CSS length"
    description: Set the dialog's top offset.
    default: null
  - name: height
    type: String | Number
    values: "CSS length"
    description: Set the dialog height.
    default: null
  - name: min-width
    type: String | Number
    values: "CSS length"
    description: Set the dialog minimum width.
    default: null
  - name: min-height
    type: String | Number
    values: "CSS length"
    description: Set the dialog minimum height.
    default: null
  - name: cancel-closable
    type: Boolean
    values: "true | false"
    description: Close the dialog after the cancel action.
    default: true
  - name: confirm-closable
    type: Boolean
    values: "true | false"
    description: Close the dialog after the confirm action.
    default: true
  - name: cancel-button-text
    type: String
    values: "button label"
    description: Set the built-in cancel button label.
    default: null
  - name: confirm-button-text
    type: String
    values: "button label"
    description: Set the built-in confirm button label.
    default: null
  - name: v-model
    type: Boolean
    values: "true,false"
    description: Determine whether the dialog is visible.
    default: false
    link: null
    usage: '#default'
    code: null

  - name: not-center
    type: Boolean
    values: "true, false"
    description: By default the header centers the elements, with this property the centering is eliminated.
    default: false
    link: null
    usage: '#type'
    code: null

  - name: width
    type: String
    values: "px"
    description: Determine the width of the dialog.
    default: null
    link: null
    usage: '#type'
    code: null

  - name: loading
    type: Boolean
    values: "true, false"
    description: Add a loading animation to the dialog.
    default: false
    link: null
    usage: '#loading'
    code: null

  - name: not-close
    type: Boolean
    values: "true, false"
    description: Remove the close button from the dialog.
    default: false
    link: null
    usage: '#no-close-button'
    code: null

  - name: scroll
    type: Boolean
    values: "true, false"
    description: Makes the content a maximum high and gives the possibility to overflow the content add scroll.
    default: false
    link: null
    usage: '#scroll'
    code: null

  - name: lock-scroll
    type: Boolean
    values: "true, false"
    description: When the dialog is opened, the page scroll is deleted.
    default: false
    link: null
    usage: '#lock-scroll-body'
    code: null

  - name: auto-width
    type: Boolean
    values: "true, false"
    description: It makes the dialog have an automatic width to its content.
    default: false
    link: null
    usage: '#scroll'
    code: null

  - name: not-padding
    type: Boolean
    values: "true, false"
    description: Eliminates the padding of the base elements of the dialog.
    default: false
    link: null
    usage: '#not-padding'
    code: null

  - name: full-screen
    type: Boolean
    values: "true, false"
    description: Makes the dialog the size of the window.
    default: false
    link: null
    usage: '#full-screen'
    code: null

  - name: overlay-blur
    type: Boolean
    values: "true, false"
    description: Makes all elements blur when the dialog opens.
    default: false
    link: null
    usage: '#overlay-blur'
    code: null

  - name: shape
    type: String
    values: "rounded | square"
    description: Set rounded or square dialog geometry.
    default: rounded
    link: null
    usage: '#shape'
    code: null

  - name: prevent-close
    type: Boolean
    values: "true, false"
    description: It makes the dialog cannot be closed by clicking outside or by pressing the esc key.
    default: false
    link: null
    usage: null
    code: null
  - name: title
    type: String | Number
    values: "header text"
    description: Set the built-in title when the header slot is not used.
    default: null
    link: null
    usage: '#publishing-and-draft-protection'
    code: null
  - name: content
    type: String | Number
    values: "content text"
    description: Set built-in content when the default slot is not used.
    default: null
    link: null
    usage: '#imperative'
    code: null
  - name: show-header
    type: Boolean
    values: "true | false"
    description: Render the built-in header area.
    default: true
    link: null
    usage: '#publishing-and-draft-protection'
    code: null
  - name: show-footer
    type: Boolean
    values: "true | false"
    description: Render built-in action footer and modal events.
    default: false
    link: null
    usage: '#publishing-and-draft-protection'
    code: null
  - name: show-cancel-button
    type: Boolean
    values: "true | false"
    description: Render built-in action footer and modal events.
    default: false
    link: null
    usage: '#before-confirm'
    code: null
  - name: show-confirm-button
    type: Boolean
    values: "true | false"
    description: Render built-in action footer and modal events.
    default: false
    link: null
    usage: '#before-confirm'
    code: null
  - name: mask
    type: Boolean
    values: "true | false"
    description: Control overlay and dismissal behavior.
    default: true
    link: null
    usage: '#publishing-and-draft-protection'
    code: null

  - name: mask-closable
    type: Boolean
    values: "true | false"
    description: Control overlay and dismissal behavior.
    default: true
    link: null
    usage: '#publishing-and-draft-protection'
    code: null

  - name: show-close
    type: Boolean
    values: "true | false"
    description: Control overlay and dismissal behavior.
    default: true
    link: null
    usage: '#publishing-and-draft-protection'
    code: null

EVENTS:
  - name: close-error
    type: '(error: unknown) => void'
    description: Emitted when close approval is rejected, throws, or returns no Promise. Dialog also displays the rejection reason.
    usage: '#before-close'
  - name: confirm-error
    type: "(error: unknown) => void"
    description: Emitted when before-confirm throws or rejects.
    usage: '#before-confirm'
  - name: minimize
    description: Emitted after minimizing; does not change v-model.
  - name: restore
    description: Emitted after restoring from the dock.
  - name: close
    type: Function
    values: "null"
    description: triggers when the Dialog closes
    default: null
    link: null
    usage: null
    code: >
      <s-dialog @close="handleClose" v-model="active">
        ...
      </s-dialog>

EXPOSES:
  - name: closePending
    type: Boolean
    description: Whether close approval is pending. Repeated close requests share the same check.
    usage: '#before-close'
  - name: confirm
    type: "() => Promise<void> | undefined"
    description: Run the same validation and confirmation flow as the built-in button.
    usage: '#before-confirm'
  - name: minimize
    type: '() => void'
    description: Minimize an open dialog when minimization is enabled.
    usage: '#full-screen'
  - name: restore
    type: '() => void'
    description: Restore a minimized dialog and its focus.
    usage: '#full-screen'
  - name: open
    type: '() => void'
    description: Open the dialog.
  - name: close
    type: '() => Promise<boolean> | undefined'
    description: Request closing through before-close and return whether closing was approved. Observe closed for animation and disposal completion.
SLOTS:
  - name: default
    type: slot
    values: "null"
    description: slot default of Dialog
    default: null
    link: null
    usage: '#default'
    code: null

  - name: header
    type: slot
    values: "null"
    description: slot header of Dialog
    default: null
    link: null
    usage: '#default'
    code: null

  - name: footer
    type: Slot
    scope: DialogFooterScope
    description: slot footer of Dialog
    default: null
    link: null
    usage: '#publishing-and-draft-protection'
    code: >
      <s-dialog>
        <template #footer>
          <h1>This is slot footer</h1>
        </template>
      </s-dialog>
---

# Dialog



<card>

## Default

<docs-warn />

Use `s-dialog` and its slots to compose a custom interface. Give form inputs the `block` prop to fill the available width.

<template #example>
<dialog-default />
</template>

<template #template>

@[code{1-40}](../.vuepress/components/dialog/default.vue)

</template>

<template #script>

@[code{41-48}](../.vuepress/components/dialog/default.vue)

</template>

<template #style>

@[code{49-102}](../.vuepress/components/dialog/default.vue)

</template>

</card>

<card>

## Type

You can easily create the most common types of dialogs such as **Alert**, **Confirm** or **Prompt** using the different slots for the structure of the `header`,`default`, `footer` dialog

<template #example>
<dialog-type />
</template>

<template #template>

@[code{1-70}](../.vuepress/components/dialog/type.vue)

</template>

<template #script>

@[code{71-78}](../.vuepress/components/dialog/type.vue)

</template>

<template #style>

@[code{80-136}](../.vuepress/components/dialog/type.vue)

</template>

</card>

<card>

## Loading

Add a loading animation to the dialog with the `loading` property

<template #example>
<dialog-loading />
</template>

<template #template>

@[code{1-35}](../.vuepress/components/dialog/loading.vue)

</template>

<template #script>

@[code{36-43}](../.vuepress/components/dialog/loading.vue)

</template>

<template #style>

@[code{45-98}](../.vuepress/components/dialog/loading.vue)

</template>

</card>

<card>

## No close button

Use `not-close` to hide the top-right close button. Other dismissal methods remain controlled by their respective settings.

<template #example>
<dialog-not-close />
</template>

<template #template>

@[code{1-33}](../.vuepress/components/dialog/not-close.vue)

</template>

<template #script>

@[code{34-41}](../.vuepress/components/dialog/not-close.vue)

</template>

<template #style>

@[code{42-95}](../.vuepress/components/dialog/not-close.vue)

</template>

</card>

<card>

## Scroll

There are cases where you need a scroll because there is a lot of information within the dialog for this you can use the `scroll` property

<template #example>
<dialog-scroll />
</template>

<template #template>

@[code{1-80}](../.vuepress/components/dialog/scroll.vue)

</template>

<template #script>

@[code{82-86}](../.vuepress/components/dialog/scroll.vue)

</template>

<template #style>

@[code{88-98}](../.vuepress/components/dialog/scroll.vue)

</template>

</card>

<card>

## Lock scroll Body

If you need to remove the page scroll when opening the dialog you can do it with the `lock-scroll` property

<template #example>
<dialog-lock-scroll />
</template>

<template #template>

@[code{1-35}](../.vuepress/components/dialog/lock-scroll.vue)

</template>

<template #script>

@[code{36-43}](../.vuepress/components/dialog/lock-scroll.vue)

</template>

<template #style>

@[code{44-97}](../.vuepress/components/dialog/lock-scroll.vue)

</template>

</card>

<card>

## Not Padding

If you need to remove the padding from the dialog to make a more personalized interface you can do it with the `not-padding` property

<template #example>
<dialog-not-padding />
</template>

<template #template>

@[code{1-12}](../.vuepress/components/dialog/not-padding.vue)

</template>

<template #script>

@[code{14-18}](../.vuepress/components/dialog/not-padding.vue)

</template>

<template #style>

@[code{20-30}](../.vuepress/components/dialog/not-padding.vue)

</template>

</card>

<card>

## Nested Dialogs

You can nest as many `s-dialog` as you need without problem

<template #example>
<dialog-nested />
</template>

<template #template>

@[code{1-41}](../.vuepress/components/dialog/nested.vue)

</template>

<template #script>

@[code{42-50}](../.vuepress/components/dialog/nested.vue)

</template>

<template #style>

@[code{52-105}](../.vuepress/components/dialog/nested.vue)

</template>

</card>

<card>

## Full Screen

`full-screen` dialogs expose minimization by default; set `:minimizable="false"` to hide it. Minimization preserves content and form state without changing `v-model`, releasing the mask and scroll lock. Dock bubbles can restore or close dialogs, respecting `before-close`; multiple bubbles appear together. Use `minimized-label` to name the bubble.

<template #example>
<dialog-full-screen />
</template>

<template #template>

@[code{9-23}](../.vuepress/components/dialog/full-screen.vue)

</template>

<template #script>

@[code{1-7}](../.vuepress/components/dialog/full-screen.vue)

</template>

</card>

<card>

## Overlay blur

You can add a blur style to all the elements behind the dialog with the `overlay-blur` property, this functionality depends on the css property [backdrop-filter](https://caniuse.com/#feat=css-backdrop-filter)

<template #example>
<dialog-blur />
</template>

<template #template>

@[code{1-33}](../.vuepress/components/dialog/blur.vue)

</template>

<template #script>

@[code{35-42}](../.vuepress/components/dialog/blur.vue)

</template>

<template #style>

@[code{44-97}](../.vuepress/components/dialog/blur.vue)

</template>

</card>

<card>

## Shape

Change the dialog style by removing the border radius and making it rectangular

<template #example>
<dialog-square />
</template>

<template #template>

@[code{1-35}](../.vuepress/components/dialog/square.vue)

</template>

<template #script>

@[code{37-44}](../.vuepress/components/dialog/square.vue)

</template>

<template #style>

@[code{46-99}](../.vuepress/components/dialog/square.vue)

</template>

</card>

<card>

## Prevent Close

With the `prevent-close` property you do not close the dialog by clicking outside or pressing the **esc** key

<template #example>
<dialog-prevent-close />
</template>

<template #template>

@[code{1-33}](../.vuepress/components/dialog/prevent-close.vue)

</template>

<template #script>

@[code{35-42}](../.vuepress/components/dialog/prevent-close.vue)

</template>

<template #style>

@[code{44-97}](../.vuepress/components/dialog/prevent-close.vue)

</template>

</card>

<card>

## Publishing and draft protection

A publishing workflow combines form validation, asynchronous submission, error retry, and close guards. Its custom `footer` uses Dialog's `confirm`, `cancel`, `pending`, and `disabled` scope to keep actions synchronized with the confirmation flow. `before-close` blocks closing during the request and offers a choice before discarding unsaved edits. The request is simulated locally: the first attempt fails and retrying succeeds.

<template #example>
<dialog-advanced />
</template>

<template #template>

@[code{145-214}](../.vuepress/components/dialog/advanced.vue)

</template>

<template #script>

@[code{1-143}](../.vuepress/components/dialog/advanced.vue)

</template>

<template #style>

@[code{216-257}](../.vuepress/components/dialog/advanced.vue)

</template>

</card>

<card>

## Before close

`before-close` is `() => Promise<void>` and takes no callback argument. Return `Promise.resolve()` or fulfill an `async` function to continue closing. `Promise.reject('reason')` or a thrown `Error` blocks closing and displays its reason. Close buttons, overlay clicks, Escape, cancellation, closing after confirmation, dock bubbles, instance `close()`, and controlled `v-model` close requests use the same check. Minimizing does not run it.

While pending, the dialog and overlay stay mounted, close buttons show loading, and repeated requests share one check. Rejecting a controlled close emits `v-model=true` to restore visibility. Use `close-error` for logging; custom footers receive `closePending`. Results from an unmounted or reopened instance cannot close a new instance or display a stale notification. `SDialogBox` also waits for actual closing and disposal before settling its outer Promise. An already-visible default loader completes its starting and stopping motion before the exit begins. Instant checks that never show a loader add no wait; reduced-motion mode and hidden pages finish the visual motion immediately.

<template #example>
<dialog-before-close />
</template>

<template #template>

@[code{27-48}](../.vuepress/components/dialog/before-close.vue)

</template>

<template #script>

@[code{1-25}](../.vuepress/components/dialog/before-close.vue)

</template>

<template #style>

@[code{50-63}](../.vuepress/components/dialog/before-close.vue)

</template>

</card>

<card>

## Global lifetime

By default, dialogs and bubbles are disposed with their owner. Set `global` when creating the instance to retain the same dialog after its owner unmounts, until the user closes it; page reloads do not preserve it. Changing global at runtime does not migrate an instance. Retained dialogs keep their slots, injected context, and callbacks but stop receiving owner prop updates after unmount. Callers own callback references, asynchronous tasks, and subscriptions, and must avoid accessing destroyed page instances.

<template #example>
<dialog-global />
</template>

<template #template>

@[code{42-61}](../.vuepress/components/dialog/global.vue)

</template>

<template #script>

@[code{1-40}](../.vuepress/components/dialog/global.vue)

</template>

<template #style>

@[code{63-77}](../.vuepress/components/dialog/global.vue)

</template>

</card>

<card>

## Imperative

After `app.use(SaxDesignVue)`, `$dialog` is available. Import `SDialogBox` for direct calls, or install it with `app.use(SDialogBox)` to bind the application context.

`SDialogBox` and `$dialog` reuse Dialog rendering and lifecycle without a template. alert() resolves an action; confirm() resolves true on confirmation and rejects with cancel or close otherwise. Calling SDialogBox directly resolves confirm, cancel, or close after the closing animation and disposal. Imperative instances own their lifetime; handle confirmation cancellation explicitly.

<template #example>
<dialog-imperative />
</template>

<template #template>

@[code{23-31}](../.vuepress/components/dialog/imperative.vue)

</template>

<template #script>

@[code{1-21}](../.vuepress/components/dialog/imperative.vue)

</template>

<template #style>

@[code{33-46}](../.vuepress/components/dialog/imperative.vue)

</template>

</card>

<card>

## Before confirm

`before-confirm` can run SForm.validate() and await asynchronous work. Return false to keep the dialog open. The confirm button shows loading and ignores duplicate requests while pending; stale results after cancellation or close cannot confirm. Handle confirm-error to display business errors. Custom footers receive confirm, cancel, pending and disabled to reuse the same flow.

<template #example>
<dialog-validation />
</template>

<template #template>

@[code{32-49}](../.vuepress/components/dialog/validation.vue)

</template>

<template #script>

@[code{1-30}](../.vuepress/components/dialog/validation.vue)

</template>

<template #style>

@[code{51-60}](../.vuepress/components/dialog/validation.vue)

</template>

</card>
