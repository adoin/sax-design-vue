# Using Components

<card>

## Documentation layout

Every component page follows the same structure:

1. **Live example** — rendered with the same API you use in apps
2. **Code tabs** — template / script / style snippets you can copy
3. **API table** — props, events, slots, and exposed methods

</card>

<card>

## Basic usage pattern

<command>

```vue
<template>
  <s-button color="primary" type="flat">Save</s-button>
</template>
```

</command>

Import styles once in your entry file (see [Getting Started](/guide/getting-started.html)).

</card>

<card>

## Configure with props

Most visual changes are prop-driven — no extra CSS required:

<command>

```vue
<s-alert color="success" closable v-model="open">
  Saved successfully.
</s-alert>
```

</command>

Open the component doc, find the prop in the API section, and use the linked example anchor (e.g. `#color`).

</card>

<card>

## Preview in Playground

Before integrating a component into your app, open the [Playground](/guide/playground) and select its demo. The preview uses the same component APIs shown in the documentation.

</card>

<card>

## Design note

Visual language is inherited from [Vuesax](https://github.com/lusaxweb/vuesax). Sax Design Vue keeps that expressive look while providing APIs and tooling for Vue 3 applications.

</card>
