#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const docsDir = path.join(root, 'docs/components')
const demoDir = path.join(root, 'docs/.vuepress/components')

const centerStyle = `<style scoped lang="scss">
.center {
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>`

const components = {
  divider: {
    props: [
      ['position', 'String', 'left, left-center, center, right-center, right', 'Text/icon position along the line.', 'center', '#position'],
      ['color', 'String', 'primary, success, danger, warning, dark, RGB, HEX', 'Line and text color.', 'rgba(0,0,0,.1)', '#color'],
      ['background', 'String', 'primary, success, danger, warning, dark, RGB, HEX', 'Background behind divider text.', 'transparent', '#background'],
      ['icon', 'String', 'Material icon name', 'Show an icon instead of slot text.', null, '#icons'],
      ['icon-pack', 'String', 'Icon pack class', 'Icon font class (e.g. material-icons).', 'material-icons', '#icons'],
      ['border-style', 'String', 'solid, dashed, dotted', 'CSS border style for the line.', 'solid', '#style'],
      ['border-height', 'String', 'CSS size', 'Border width of the divider line.', '1px', '#style'],
    ],
    events: [],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <div class="center">\n    <p>Content above the divider.</p>\n    <s-divider />\n    <p>Content below the divider.</p>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'text', title: 'Text', demo: `<template>\n  <div class="center">\n    <s-divider>My Text</s-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'position', title: 'Text Position', demo: `<template>\n  <div class="center">\n    <s-divider position="left">left</s-divider>\n    <s-divider position="left-center">left-center</s-divider>\n    <s-divider position="center">center</s-divider>\n    <s-divider position="right-center">right-center</s-divider>\n    <s-divider position="right">right</s-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'color', title: 'Color', demo: `<template>\n  <div class="center">\n    <s-divider>Default</s-divider>\n    <s-divider color="primary">Primary</s-divider>\n    <s-divider color="success">Success</s-divider>\n    <s-divider color="danger">Danger</s-divider>\n    <s-divider color="warning">Warning</s-divider>\n    <s-divider color="dark">Dark</s-divider>\n    <s-divider color="rgb(29, 222, 194)">RGB</s-divider>\n    <s-divider color="#ad289f">HEX</s-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'background', title: 'Background', demo: `<template>\n  <div class="center">\n    <s-divider>Default</s-divider>\n    <s-divider background="primary" color="#ade6d4">Primary</s-divider>\n    <s-divider background="success" color="#0a540a">Success</s-divider>\n    <s-divider background="danger" color="lightcoral">Danger</s-divider>\n    <s-divider background="warning" color="grey">Warning</s-divider>\n    <s-divider background="dark" color="lightgrey">Dark</s-divider>\n    <s-divider background="rgb(252, 243, 192)" color="rgb(29, 222, 194)">RGB</s-divider>\n    <s-divider background="#fffaaa" color="#ad289f">HEX</s-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'icons', title: 'Icons', demo: `<template>\n  <div class="center">\n    <s-divider icon="arrow_downward" />\n    <s-divider color="primary" icon="star" />\n    <s-divider color="success" icon="check" />\n    <s-divider color="danger" icon="delete_forever" />\n    <s-divider color="warning" icon="report_problem" />\n    <s-divider color="dark" icon="watch_later" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'style', title: 'Style', demo: `<template>\n  <div class="center">\n    <s-divider border-style="dotted" color="dark">dotted</s-divider>\n    <s-divider border-style="dashed" color="dark">dashed</s-divider>\n    <s-divider border-style="solid" color="dark">solid</s-divider>\n  </div>\n</template>\n\n${centerStyle}` },
    ],
  },
  progress: {
    props: [
      ['height', 'Number, String', 'CSS height', 'Progress bar height in pixels.', '5', '#height'],
      ['indeterminate', 'Boolean', 'true, false', 'Animated indeterminate progress.', 'false', '#indeterminate'],
      ['percent', 'Number', '0 - 100', 'Determinate progress percentage.', '0', '#default'],
      ['color', 'String', 'primary, success, danger, warning, dark', 'Progress color.', 'primary', '#color'],
    ],
    events: [],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <div class="center">\n    <s-progress :percent="62" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'color', title: 'Colors', demo: `<template>\n  <div class="center">\n    <s-progress :percent="70" color="primary" />\n    <s-progress :percent="70" color="success" />\n    <s-progress :percent="70" color="danger" />\n    <s-progress :percent="70" color="warning" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'indeterminate', title: 'Indeterminate', demo: `<template>\n  <div class="center">\n    <s-progress indeterminate color="primary" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'height', title: 'Height', demo: `<template>\n  <div class="center">\n    <s-progress :percent="55" :height="6" />\n    <s-progress :percent="55" :height="12" color="success" />\n  </div>\n</template>\n\n${centerStyle}` },
    ],
  },
  chip: {
    props: [
      ['v-model', 'Boolean', 'true, false', 'Visibility when closable.', 'true', '#closable'],
      ['text', 'String', 'String', 'Chip label text.', null, '#default'],
      ['closable', 'Boolean, String', 'true, false', 'Show close button.', 'false', '#closable'],
      ['color', 'String', 'primary, success, danger, warning, dark, RGB, HEX', 'Chip color.', null, '#color'],
      ['transparent', 'Boolean', 'true, false', 'Transparent background style.', 'false', '#transparent'],
      ['icon', 'String', 'Material icon name', 'Leading icon inside chip.', null, '#icon'],
      ['icon-pack', 'String', 'Icon pack class', 'Icon font class.', 'material-icons', '#icon'],
      ['close-icon', 'String', 'Material icon name', 'Close button icon.', 'clear', '#closable'],
    ],
    events: [
      ['update:modelValue', 'boolean', 'Emitted when visibility changes (closable).'],
      ['click', null, 'Emitted on chip click.'],
      ['close', null, 'Emitted when chip is closed.'],
      ['vs-remove', 'boolean', 'Emitted when chip removed in chips group.'],
    ],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <s-chip>Basic Chip</s-chip>\n    <s-chip closable>Closable</s-chip>\n  </div>\n</template>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <s-chip color="primary">Primary</s-chip>\n    <s-chip color="success">Success</s-chip>\n    <s-chip color="danger">Danger</s-chip>\n    <s-chip color="warning">Warning</s-chip>\n  </div>\n</template>` },
      { id: 'transparent', title: 'Transparent', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <s-chip transparent color="primary">Primary</s-chip>\n    <s-chip transparent color="success">Success</s-chip>\n  </div>\n</template>` },
      { id: 'icon', title: 'Icon', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <s-chip icon="send" color="primary">Send</s-chip>\n    <s-chip icon="check" color="success">Check</s-chip>\n  </div>\n</template>` },
      { id: 'closable', title: 'Closable', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <s-chip v-for="item in chips" :key="item" closable @close="remove(item)">{{ item }}</s-chip>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst chips = ref(['Vuejs', 'Vuesax', 'Sax Design'])\nconst remove = (item: string) => {\n  chips.value = chips.value.filter((c) => c !== item)\n}\n</script>` },
      { id: 'chips', title: 'Add and Remove Items', demo: `<template>\n  <div class="center">\n    <p>{{ chips }}</p>\n    <s-chips v-model="chips" placeholder="New element">\n      <s-chip v-for="chip in chips" :key="chip" closable>{{ chip }}</s-chip>\n    </s-chips>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst chips = ref(['Vuejs', 'Node', 'Vuesax'])\n</script>\n\n${centerStyle}` },
    ],
  },
  breadcrumb: {
    props: [
      ['items', 'Array', 'BreadcrumbItem[]', 'Items rendered when not using slots.', '[]', '#default'],
      ['separator', 'String', 'String', 'Separator between items.', '/', '#separator'],
      ['color', 'String', 'primary, success, danger, warning, dark', 'Breadcrumb color.', 'primary', '#color'],
      ['align', 'String', 'left, center, right', 'Horizontal alignment.', 'left', '#align'],
    ],
    events: [],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-breadcrumb :items="items" />\n</template>\n\n<script setup lang="ts">\nconst items = [\n  { title: 'Home', url: '/' },\n  { title: 'Components', url: '/components/' },\n  { title: 'Breadcrumb', active: true },\n]\n</script>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <s-breadcrumb color="success" :items="items" />\n</template>\n\n<script setup lang="ts">\nconst items = [{ title: 'Home' }, { title: 'Active', active: true }]\n</script>` },
      { id: 'separator', title: 'Separator', demo: `<template>\n  <s-breadcrumb separator=">" :items="items" />\n</template>\n\n<script setup lang="ts">\nconst items = [{ title: 'Home' }, { title: 'Docs' }, { title: 'Breadcrumb', active: true }]\n</script>` },
      { id: 'slot', title: 'Slot', demo: `<template>\n  <s-breadcrumb>\n    <s-breadcrumb-item to="/">Home</s-breadcrumb-item>\n    <s-breadcrumb-item>Library</s-breadcrumb-item>\n    <s-breadcrumb-item active>Data</s-breadcrumb-item>\n  </s-breadcrumb>\n</template>` },
      { id: 'align', title: 'Alignment', demo: `<template>\n  <div class="center">\n    <s-breadcrumb align="center" :items="items" />\n    <s-breadcrumb align="right" :items="items" />\n  </div>\n</template>\n\n<script setup lang="ts">\nconst items = [{ title: 'Home' }, { title: 'Active', active: true }]\n</script>\n\n${centerStyle}` },
    ],
  },
  textarea: {
    props: [
      ['v-model', 'String', 'String', 'Textarea value.', "''", '#default'],
      ['label', 'String', 'String', 'Floating label text.', null, '#label'],
      ['color', 'String', 'primary, success, danger, warning, dark', 'Component color.', 'primary', '#default'],
      ['counter', 'Number, String', 'Number', 'Max length counter.', null, '#counter'],
      ['counter-danger', 'Boolean', 'true, false', 'Highlight counter when limit exceeded.', 'false', '#counter'],
      ['height', 'String', 'CSS height', 'Textarea height.', null, '#height'],
      ['width', 'String', 'CSS width', 'Textarea width.', null, '#width'],
    ],
    events: [
      ['update:modelValue', 'string', 'Emitted when value changes.'],
      ['input', 'string', 'Native input event.'],
      ['focus', 'FocusEvent', 'Emitted on focus.'],
      ['blur', 'FocusEvent', 'Emitted on blur.'],
    ],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-textarea v-model="text" placeholder="Write something" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
      { id: 'label', title: 'Label', demo: `<template>\n  <s-textarea v-model="text" label="Description" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
      { id: 'counter', title: 'Counter', demo: `<template>\n  <s-textarea v-model="text" :counter="25" counter-danger />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('Hello world')\n</script>` },
      { id: 'width', title: 'Width', demo: `<template>\n  <s-textarea v-model="text" width="300px" label="Fixed width" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
      { id: 'height', title: 'Height', demo: `<template>\n  <s-textarea v-model="text" height="120px" label="Taller area" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
    ],
  },
  collapse: {
    props: [
      ['accordion', 'Boolean', 'true, false', 'Only one panel open at a time.', 'false', '#accordion'],
      ['type', 'String', 'default, border, margin, shadow', 'Visual variant.', 'default', '#type'],
      ['open-hover', 'Boolean', 'true, false', 'Open panel on hover.', 'false', '#open-hover'],
    ],
    events: [['change', null, 'Emitted when open panels change.']],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-collapse>\n    <s-collapse-item>\n      <template #header>Accordion 1</template>\n      Content for panel one.\n    </s-collapse-item>\n    <s-collapse-item>\n      <template #header>Accordion 2</template>\n      Content for panel two.\n    </s-collapse-item>\n  </s-collapse>\n</template>` },
      { id: 'accordion', title: 'Accordion', demo: `<template>\n  <s-collapse accordion>\n    <s-collapse-item open>\n      <template #header>Only one open</template>\n      First panel\n    </s-collapse-item>\n    <s-collapse-item>\n      <template #header>Second</template>\n      Second panel\n    </s-collapse-item>\n  </s-collapse>\n</template>` },
      { id: 'type', title: 'Type', demo: `<template>\n  <div class="center">\n    <s-collapse type="border">\n      <s-collapse-item open><template #header>Border</template>Border style</s-collapse-item>\n    </s-collapse>\n    <s-collapse type="shadow">\n      <s-collapse-item open><template #header>Shadow</template>Shadow style</s-collapse-item>\n    </s-collapse>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'open-hover', title: 'Open Hover', demo: `<template>\n  <s-collapse open-hover>\n    <s-collapse-item><template #header>Hover me</template>Opens on hover</s-collapse-item>\n  </s-collapse>\n</template>` },
      { id: 'icon-arrow', title: 'Change Arrow Icon', demo: `<template>\n  <s-collapse>\n    <s-collapse-item icon-arrow="expand_more">\n      <template #header>Custom arrow</template>\n      Custom icon arrow\n    </s-collapse-item>\n  </s-collapse>\n</template>` },
    ],
  },
  list: {
    props: [
      ['title', 'String', 'String', 'List header title (vs-list-header).', null, '#header'],
      ['subtitle', 'String', 'String', 'List header subtitle.', null, '#header'],
      ['icon', 'String', 'Material icon', 'List item or header icon.', null, '#icon'],
      ['color', 'String', 'primary, success, danger', 'Header color.', 'primary', '#header'],
    ],
    events: [],
    sections: [
      { id: 'default', title: 'Basic', demo: `<template>\n  <s-list>\n    <s-list-item title="User 1" subtitle="Developer" />\n    <s-list-item title="User 2" subtitle="Designer" />\n  </s-list>\n</template>` },
      { id: 'header', title: 'Header', demo: `<template>\n  <s-list>\n    <s-list-header title="Users" subtitle="Team members" color="primary" />\n    <s-list-item title="Jane" subtitle="Frontend" />\n    <s-list-item title="John" subtitle="Backend" />\n  </s-list>\n</template>` },
      { id: 'icon', title: 'Icon', demo: `<template>\n  <s-list>\n    <s-list-item icon="home" title="Home" subtitle="Dashboard" />\n    <s-list-item icon="settings" title="Settings" />\n  </s-list>\n</template>` },
      { id: 'content', title: 'Content', demo: `<template>\n  <s-list>\n    <s-list-item title="Downloads">\n      <s-button size="small">Open</s-button>\n    </s-list-item>\n  </s-list>\n</template>` },
      { id: 'avatar', title: 'Avatar', demo: `<template>\n  <s-list>\n    <s-list-item title="Luis" subtitle="Admin">\n      <template #avatar>\n        <s-avatar text="LD" />\n      </template>\n    </s-list-item>\n  </s-list>\n</template>` },
    ],
  },
  images: {
    props: [
      ['hover', 'String', 'default, blur, zoom, dark, scale, curtain', 'Hover animation style.', 'default', '#hover'],
      ['alternating', 'Boolean', 'true, false', 'Alternate item offsets.', 'false', '#more'],
      ['not-border-radius', 'Boolean', 'true, false', 'Disable rounded corners.', 'false', '#more'],
      ['not-margin', 'Boolean', 'true, false', 'Remove item margins.', 'false', '#more'],
      ['src', 'String', 'URL', 'Image source (vs-image).', null, '#default'],
    ],
    events: [],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-images>\n    <s-image src="https://picsum.photos/seed/vs1/300" />\n    <s-image src="https://picsum.photos/seed/vs2/300" />\n    <s-image src="https://picsum.photos/seed/vs3/300" />\n    <s-image src="https://picsum.photos/seed/vs4/300" />\n  </s-images>\n</template>` },
      { id: 'hover', title: 'Hover', demo: `<template>\n  <div class="center">\n    <s-images hover="zoom">\n      <s-image src="https://picsum.photos/seed/z1/300" />\n      <s-image src="https://picsum.photos/seed/z2/300" />\n    </s-images>\n    <s-images hover="blur">\n      <s-image src="https://picsum.photos/seed/b1/300" />\n      <s-image src="https://picsum.photos/seed/b2/300" />\n    </s-images>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'more', title: 'More Options', demo: `<template>\n  <s-images alternating not-margin>\n    <s-image src="https://picsum.photos/seed/m1/300" />\n    <s-image src="https://picsum.photos/seed/m2/300" />\n    <s-image src="https://picsum.photos/seed/m3/300" />\n    <s-image src="https://picsum.photos/seed/m4/300" />\n  </s-images>\n</template>` },
    ],
  },
  prompt: {
    props: [
      ['v-model', 'Boolean', 'true, false', 'Dialog visibility.', 'false', '#default'],
      ['title', 'String', 'String', 'Dialog title.', 'Dialog', '#default'],
      ['text', 'String', 'String', 'Dialog body text.', null, '#default'],
      ['type', 'String', 'alert, confirm', 'Prompt type.', 'alert', '#default'],
      ['color', 'String', 'primary, success, danger', 'Accent color.', 'primary', '#default'],
      ['accept-text', 'String', 'String', 'Accept button label.', 'Accept', '#default'],
      ['cancel-text', 'String', 'String', 'Cancel button label.', 'Cancel', '#default'],
      ['buttons-hidden', 'Boolean', 'true, false', 'Hide action buttons.', 'false', '#default'],
    ],
    events: [
      ['update:modelValue', 'boolean', 'Visibility change.'],
      ['accept', null, 'Accept button clicked.'],
      ['cancel', null, 'Cancel button clicked.'],
      ['close', null, 'Dialog closed.'],
    ],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-button @click="active = true">Open prompt</s-button>\n  <s-prompt v-model="active" title="Confirm action" text="Do you want to continue?" type="confirm" @accept="active = false" @cancel="active = false" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(false)\n</script>` },
      { id: 'alert', title: 'Alert', demo: `<template>\n  <s-button @click="active = true">Alert</s-button>\n  <s-prompt v-model="active" type="alert" title="Notice" text="Saved successfully." @accept="active = false" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(false)\n</script>` },
    ],
  },
  tabs: {
    props: [
      ['v-model', 'Number, String', 'index or name', 'Active tab index.', '0', '#default'],
      ['color', 'String', 'primary, success, danger', 'Active color.', 'primary', '#color'],
      ['alignment', 'String', 'left, center, right, fixed', 'Tab alignment.', 'left', '#alignments'],
      ['position', 'String', 'top, bottom, left, right', 'Tab bar position.', 'top', '#position'],
      ['label', 'String', 'String', 'Tab label (vs-tab).', 'Label', '#default'],
      ['icon', 'String', 'Material icon', 'Tab icon (vs-tab).', '', '#icons'],
      ['disabled', 'Boolean', 'true, false', 'Disable tab (vs-tab).', 'false', '#default'],
    ],
    events: [
      ['update:modelValue', 'number | string', 'Active tab changed.'],
      ['change', 'number | string', 'Active tab changed.'],
    ],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-tabs v-model="active">\n    <s-tab label="Home">Home panel</s-tab>\n    <s-tab label="Profile">Profile panel</s-tab>\n  </s-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <s-tabs v-model="active" color="success">\n    <s-tab label="One">One</s-tab>\n    <s-tab label="Two">Two</s-tab>\n  </s-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'alignments', title: 'Alignments', demo: `<template>\n  <s-tabs v-model="active" alignment="center">\n    <s-tab label="A">A</s-tab>\n    <s-tab label="B">B</s-tab>\n  </s-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'position', title: 'Position', demo: `<template>\n  <s-tabs v-model="active" position="bottom">\n    <s-tab label="Top content">Content</s-tab>\n    <s-tab label="More">More</s-tab>\n  </s-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'icons', title: 'Icons', demo: `<template>\n  <s-tabs v-model="active">\n    <s-tab label="Inbox" icon="inbox">Inbox</s-tab>\n    <s-tab label="Settings" icon="settings">Settings</s-tab>\n  </s-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
    ],
  },
  slider: {
    props: [
      ['v-model', 'Number', 'Number', 'Current value.', '0', '#default'],
      ['min', 'Number', 'Number', 'Minimum value.', '0', '#default'],
      ['max', 'Number', 'Number', 'Maximum value.', '100', '#default'],
      ['step', 'Number', 'Number', 'Step increment.', '1', '#default'],
      ['disabled', 'Boolean', 'true, false', 'Disable interaction.', 'false', '#default'],
      ['color', 'String', 'primary, success, danger', 'Slider color.', 'primary', '#color'],
      ['text-fixed', 'String', 'String', 'Suffix shown next to value.', '', '#text-fixed'],
      ['ticks', 'Boolean', 'true, false', 'Show tick marks.', 'false', '#ticks'],
    ],
    events: [
      ['update:modelValue', 'number', 'Value changed.'],
      ['change', 'number', 'Value committed.'],
    ],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-slider v-model="val" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst val = ref(30)\n</script>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <div class="center">\n    <s-slider v-model="a" color="primary" />\n    <s-slider v-model="b" color="success" />\n    <s-slider v-model="c" color="danger" />\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst a = ref(20)\nconst b = ref(40)\nconst c = ref(60)\n</script>\n\n${centerStyle}` },
      { id: 'ticks', title: 'Ticks', demo: `<template>\n  <s-slider v-model="val" ticks :step="10" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst val = ref(50)\n</script>` },
      { id: 'text-fixed', title: 'Text Fixed', demo: `<template>\n  <s-slider v-model="val" text-fixed="%" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst val = ref(25)\n</script>` },
    ],
  },
  upload: {
    props: [
      ['text', 'String', 'String', 'Upload area label.', 'Upload File', '#default'],
      ['file-name', 'String', 'String', 'Form field name for upload.', 'file', '#default'],
      ['limit', 'Number, String', 'Number', 'Max number of files.', null, '#multiple'],
      ['multiple', 'Boolean', 'true, false', 'Allow multiple files.', 'false', '#multiple'],
      ['single-upload', 'Boolean', 'true, false', 'Replace file on each selection.', 'false', '#default'],
      ['automatic', 'Boolean', 'true, false', 'Upload immediately after select.', 'false', '#automatic'],
      ['action', 'String', 'URL', 'Upload endpoint URL.', null, '#automatic'],
      ['accept', 'String', 'MIME types', 'Accepted file types.', null, '#default'],
      ['disabled', 'Boolean', 'true, false', 'Disable upload.', 'false', '#default'],
    ],
    events: [
      ['change', 'File[], File[]', 'File list changed.'],
      ['on-delete', 'File', 'File removed.'],
      ['on-success', 'unknown', 'Upload succeeded.'],
      ['on-error', 'unknown', 'Upload failed.'],
    ],
    sections: [
      { id: 'default', title: 'Default', demo: `<template>\n  <s-upload text="Select file" :multiple="false" />\n</template>` },
      { id: 'multiple', title: 'Multiple', demo: `<template>\n  <s-upload multiple :limit="4" text="Upload images" accept="image/*" />\n</template>` },
      { id: 'automatic', title: 'Automatic', demo: `<template>\n  <s-upload automatic action="https://httpbin.org/post" text="Auto upload" :multiple="false" />\n</template>` },
    ],
  },
  spacer: {
    props: [],
    events: [],
    sections: [
      {
        id: 'default',
        title: 'Default',
        demo: `<template>\n  <div style="display:flex;align-items:center;width:100%;">\n    <s-button>Left</s-button>\n    <s-spacer />\n    <s-button color="success">Right</s-button>\n  </div>\n</template>`,
      },
    ],
  },
}

function yamlProp(row, zhDescription) {
  const [name, type, values, description, def, usage] = row
  return `  - name: ${name}
    type: ${type}
    values: ${values}
    description: ${zhDescription || description}
    default: ${def === null ? 'null' : def}
    link: null
    usage: '${usage}'`
}

function yamlEvent(row, zhDescription) {
  const [name, params, description] = row
  return `  - name: ${name}
    params: ${params || 'null'}
    description: ${zhDescription || description}`
}

const componentMeta = {
  divider: {
    description:
      'Divide text or section components with flexible color, icon, and layout options.',
    leads: {
      default: 'Add a horizontal line between blocks of content with `vs-divider`.',
      text: 'Place text inside the divider to label a section break.',
      position:
        'Control text alignment with the `position` prop: left, left-center, center, right-center, or right.',
      color:
        'Change the color of the line and the text using theme colors, RGB, or HEX.',
      background: 'Highlight divider text with a custom `background` color.',
      icons: 'Use Material Icons inside the divider via the `icon` prop.',
      style: 'Switch line appearance with `border-style` (solid, dashed, dotted).',
    },
  },
  progress: {
    description: 'Display determinate or indeterminate progress for loading states.',
    leads: {
      default: 'Bind `percent` from 0 to 100 for a standard progress bar.',
      color: 'Apply theme colors to match your UI context.',
      indeterminate: 'Use `indeterminate` for unknown-duration operations.',
      height: 'Adjust bar thickness with the `height` prop.',
    },
  },
  chip: {
    description:
      'Chips are compact elements that represent an input, attribute, or action.',
    leads: {
      default: 'Render simple chips with optional close behavior.',
      color: 'Color chips using the Vuesax palette or custom values.',
      transparent: 'Use `transparent` for a lighter, outlined appearance.',
      icon: 'Add a leading icon with the `icon` prop.',
      closable: 'Remove chips interactively when `closable` is enabled.',
      chips: 'Combine `vs-chips` with multiple `vs-chip` children to add and remove tags.',
    },
  },
  breadcrumb: {
    description: 'Show the current page location within a navigational hierarchy.',
    leads: {
      default: 'Pass an `items` array or compose with `vs-breadcrumb-item` slots.',
      color: 'Theme breadcrumb links with the `color` prop.',
      separator: 'Customize the divider between items.',
      slot: 'Build breadcrumbs manually with slot-based items.',
      align: 'Align the trail to the left, center, or right.',
    },
  },
  textarea: {
    description: 'Multi-line text input with label, counter, and sizing options.',
    leads: {
      default: 'Bind text with `v-model` for controlled input.',
      label: 'Float a label above the field for clearer forms.',
      counter: 'Show remaining characters and warn when the limit is exceeded.',
      width: 'Set a fixed width for form layouts.',
      height: 'Control the visible height of the textarea.',
    },
  },
  collapse: {
    description: 'Expand and collapse content panels with multiple visual styles.',
    leads: {
      default: 'Wrap sections in `vs-collapse-item` with a header slot.',
      accordion: 'Keep only one panel open at a time with `accordion`.',
      type: 'Switch container style using the `type` prop.',
      'open-hover': 'Open panels on hover instead of click.',
      'icon-arrow': 'Customize the expand arrow per panel.',
    },
  },
  list: {
    description: 'Structured lists with headers, icons, avatars, and custom slots.',
    leads: {
      default: 'Display title and subtitle rows with `vs-list-item`.',
      header: 'Group items under `vs-list-header`.',
      icon: 'Add leading icons to list rows.',
      content: 'Place actions or custom content in the item slot.',
      avatar: 'Use the `avatar` slot for profile images or initials.',
    },
  },
  images: {
    description: 'Responsive image grids with hover effects and layout options.',
    leads: {
      default: 'Place `vs-image` elements inside `vs-images`.',
      hover: 'Pick a hover animation: zoom, blur, dark, scale, or curtain.',
      more: 'Fine-tune spacing and corners with `alternating` and margin props.',
    },
  },
  prompt: {
    description: 'Modal prompts for alerts and confirmations with customizable actions.',
    leads: {
      default: 'Open a confirm dialog bound with `v-model`.',
      alert: 'Show a single-action alert-style prompt.',
    },
  },
  tabs: {
    description: 'Organize content into switchable tab panels.',
    leads: {
      default: 'Control the active tab with `v-model` on `vs-tabs`.',
      color: 'Theme the active indicator and labels.',
      alignments: 'Align tabs to the left, center, right, or fixed width.',
      position: 'Place the tab bar on top, bottom, left, or right.',
      icons: 'Add icons to individual `vs-tab` items.',
    },
  },
  slider: {
    description: 'Select numeric values along a draggable track.',
    leads: {
      default: 'Bind a number with `v-model` between `min` and `max`.',
      color: 'Color the track and thumb to match your theme.',
      ticks: 'Display step ticks along the track.',
      'text-fixed': 'Append a suffix such as `%` next to the current value.',
    },
  },
  upload: {
    description: 'Upload files manually or automatically with preview and limits.',
    leads: {
      default: 'Select a single file with the default upload area.',
      multiple: 'Allow several files and enforce a maximum with `limit`.',
      automatic: 'Upload immediately after selection when `action` is set.',
    },
  },
  spacer: {
    description:
      'Flex spacer utility that pushes items apart in toolbars and action rows.',
    leads: {
      default: 'Place `vs-spacer` between flex children to consume free space.',
    },
  },
}

const pageTitleZh = {
  divider: '分割线', progress: '进度条', chip: '标签', breadcrumb: '面包屑',
  textarea: '多行输入', collapse: '折叠面板', list: '列表', images: '图片',
  prompt: '提示框', tabs: '标签页', slider: '滑块', upload: '上传', spacer: '间距',
}

const componentMetaZh = {
  divider: {
    description: '在文本或区块之间添加分割线，支持颜色、图标与多种布局。',
    sectionTitles: {
      default: '默认', text: '文本', position: '文本位置', color: '颜色',
      background: '背景', icons: '图标', style: '样式',
    },
    leads: {
      default: '使用 `vs-divider` 在内容块之间添加水平分割线。',
      text: '在分割线内放置文本以标注区块分隔。',
      position: '通过 `position` 控制文本对齐：left、left-center、center、right-center、right。',
      color: '使用 Vuesax 色板名、RGB 或 HEX 更改线条与标签颜色。',
      background: '通过 `background` 高亮分割线文本背景。',
      icons: '通过 `icon` 在分割线内使用 Material Icons。',
      style: '使用 `border-style`（solid、dashed、dotted）切换线条样式。',
    },
    props: {
      position: '文本/图标在线条上的位置。',
      color: '线条与文本颜色（主题色、RGB、HEX）。',
      background: '分割线文本背后的背景色。',
      icon: '用图标替代插槽文本。',
      'icon-pack': '图标字体类名（如 material-icons）。',
      'border-style': '线条的 CSS 边框样式。',
      'border-height': '分割线边框宽度。',
    },
  },
  progress: {
    description: '展示确定或不确定的加载进度。',
    sectionTitles: { default: '默认', color: '颜色', indeterminate: '不确定', height: '高度' },
    leads: {
      default: '绑定 0–100 的 `percent` 显示标准进度条。',
      color: '应用主题色以匹配界面上下文。',
      indeterminate: '对未知时长操作使用 `indeterminate`。',
      height: '通过 `height` 调整进度条粗细。',
    },
    props: {
      height: '进度条高度（像素）。', indeterminate: '不确定进度动画。',
      percent: '确定进度百分比（0–100）。', color: '进度条颜色。',
    },
  },
  chip: {
    description: '标签是表示输入、属性或操作的紧凑元素。',
    sectionTitles: {
      default: '默认', color: '颜色', transparent: '透明', icon: '图标',
      closable: '可关闭', chips: '增删条目',
    },
    leads: {
      default: '渲染简单标签，可选关闭行为。',
      color: '使用 Vuesax 色板或自定义值为标签着色。',
      transparent: '使用 `transparent` 获得更轻的描边外观。',
      icon: '通过 `icon` 添加前置图标。',
      closable: '启用 `closable` 后可交互移除标签。',
      chips: '组合 `vs-chips` 与多个 `vs-chip` 子项以增删标签。',
    },
    props: {
      'v-model': '可关闭时的可见性。', text: '标签文本。', closable: '显示关闭按钮。',
      color: '标签颜色。', transparent: '透明背景样式。', icon: '标签内前置图标。',
      'icon-pack': '图标字体类名。', 'close-icon': '关闭按钮图标。',
    },
    events: {
      'update:modelValue': '可见性变化时触发（可关闭）。', click: '点击标签时触发。',
      close: '关闭标签时触发。', 'vs-remove': '在标签组中移除时触发。',
    },
  },
  breadcrumb: {
    description: '展示当前页面在导航层级中的位置。',
    sectionTitles: { default: '默认', color: '颜色', separator: '分隔符', slot: '插槽', align: '对齐' },
    leads: {
      default: '传入 `items` 数组或使用 `vs-breadcrumb-item` 插槽组合。',
      color: '通过 `color` 为主题色面包屑链接着色。',
      separator: '自定义项之间的分隔符。',
      slot: '使用基于插槽的项手动构建面包屑。',
      align: '将路径左对齐、居中或右对齐。',
    },
    props: {
      items: '未使用插槽时渲染的项。', separator: '项之间的分隔符。',
      color: '面包屑颜色。', align: '水平对齐方式。',
    },
  },
  textarea: {
    description: '多行文本输入，支持标签、计数与尺寸配置。',
    sectionTitles: { default: '默认', label: '标签', counter: '计数器', width: '宽度', height: '高度' },
    leads: {
      default: '使用 `v-model` 绑定文本实现受控输入。',
      label: '在字段上方浮动标签，使表单更清晰。',
      counter: '显示剩余字符数，超出限制时警告。',
      width: '为表单布局设置固定宽度。',
      height: '控制多行输入的可见高度。',
    },
    props: {
      'v-model': '多行输入值。', label: '浮动标签文本。', color: '组件颜色。',
      counter: '最大长度计数。', 'counter-danger': '超出限制时高亮计数器。',
      height: '多行输入高度。', width: '多行输入宽度。',
    },
    events: {
      'update:modelValue': '值变化时触发。', input: '原生 input 事件。',
      focus: '获得焦点时触发。', blur: '失去焦点时触发。',
    },
  },
  collapse: {
    description: '可展开/折叠的内容面板，多种视觉样式。',
    sectionTitles: {
      default: '默认', accordion: '手风琴', type: '类型', 'open-hover': '悬停展开', 'icon-arrow': '箭头图标',
    },
    leads: {
      default: '在 `vs-collapse-item` 中包裹区块，并使用 header 插槽。',
      accordion: '使用 `accordion` 保持仅一个面板展开。',
      type: '通过 `type` 切换容器样式。',
      'open-hover': '悬停时展开面板而非点击。',
      'icon-arrow': '为每个面板自定义展开箭头。',
    },
    props: { accordion: '同一时间仅展开一个面板。', type: '视觉变体。', 'open-hover': '悬停时展开面板。' },
    events: { change: '展开面板变化时触发。' },
  },
  list: {
    description: '结构化列表，支持标题、图标、头像与自定义插槽。',
    sectionTitles: { default: '默认', header: '标题行', icon: '图标', content: '内容', avatar: '头像' },
    leads: {
      default: '使用 `vs-list-item` 显示标题与副标题行。',
      header: '在 `vs-list-header` 下分组列表项。',
      icon: '为列表行添加前置图标。',
      content: '在 item 插槽中放置操作或自定义内容。',
      avatar: '使用 `avatar` 插槽放置头像或首字母。',
    },
    props: { header: '列表标题（vs-list-header）。', subtitle: '列表副标题。', icon: '列表项或标题图标。' },
  },
  images: {
    description: '响应式图片网格，支持悬停动效与布局选项。',
    sectionTitles: { default: '默认', hover: '悬停', more: '更多' },
    leads: {
      default: '在 `vs-images` 内放置 `vs-image` 元素。',
      hover: '选择悬停动画：zoom、blur、dark、scale、curtain。',
      more: '通过 `alternating` 与 margin 属性微调间距与圆角。',
    },
    props: { hover: '悬停动画样式。', alternating: '交替项偏移。', radius: '禁用圆角。' },
  },
  prompt: {
    description: '用于提醒与确认的模态提示框，可自定义操作。',
    sectionTitles: { default: '默认', alert: '警告' },
    leads: { default: '使用 `v-model` 打开确认对话框。', alert: '显示单按钮的警告式提示。' },
    props: {
      'v-model': '可见性。', type: '提示类型。', title: '对话框标题。', text: '对话框正文。',
      acceptText: '确认按钮文案。', cancelText: '取消按钮文案。', buttonsHidden: '隐藏操作按钮。',
    },
    events: { accept: '点击确认时触发。', cancel: '点击取消时触发。', close: '对话框关闭时触发。' },
  },
  tabs: {
    description: '将内容组织为可切换的标签面板。',
    sectionTitles: { default: '默认', color: '颜色', alignments: '对齐', position: '位置', icons: '图标' },
    leads: {
      default: '在 `vs-tabs` 上使用 `v-model` 控制当前标签。',
      color: '为主题色活动指示器与标签着色。',
      alignments: '将标签左对齐、居中、右对齐或固定宽度。',
      position: '将标签栏置于顶部、底部、左侧或右侧。',
      icons: '为单个 `vs-tab` 添加图标。',
    },
    props: {
      'v-model': '当前活动标签索引。', color: '标签颜色。',
      position: '标签栏位置。', alignment: '标签对齐方式。',
    },
    events: { change: '活动标签变化时触发。' },
  },
  slider: {
    description: '沿轨道拖动选择数值。',
    sectionTitles: { default: '默认', color: '颜色', ticks: '刻度', 'text-fixed': '固定文本' },
    leads: {
      default: '在 `min` 与 `max` 之间用 `v-model` 绑定数值。',
      color: '为轨道与滑块着色以匹配主题。',
      ticks: '沿轨道显示步进刻度。',
      'text-fixed': '在当前值旁追加后缀，如 `%`。',
    },
    props: {
      'v-model': '当前值。', min: '最小值。', max: '最大值。', step: '步进增量。',
      color: '滑块颜色。', ticks: '显示刻度线。', 'text-fixed': '值旁显示的后缀。',
    },
  },
  upload: {
    description: '手动或自动上传文件，支持预览与数量限制。',
    sectionTitles: { default: '默认', multiple: '多选', automatic: '自动上传' },
    leads: {
      default: '使用默认上传区域选择单个文件。',
      multiple: '允许多文件并通过 `limit` 限制数量。',
      automatic: '设置 `action` 后选择即自动上传。',
    },
    props: {
      text: '上传区域标签。', action: '上传接口 URL。', multiple: '允许多个文件。',
      automatic: '选择后立即上传。', limit: '最大文件数。', accept: '接受的文件类型。',
      name: '上传表单字段名。', disabled: '禁用上传。', 'show-upload': '显示上传状态。',
      'single-upload': '每次选择替换文件。',
    },
    events: {
      change: '文件列表变化时触发。', delete: '移除文件时触发。',
      success: '上传成功时触发。', 'on-error': '上传失败时触发。',
    },
  },
  spacer: {
    description: 'Flex 间距工具，用于工具栏与操作行中推开元素。',
    sectionTitles: { default: '默认' },
    leads: { default: '在 flex 子元素之间放置 `vs-spacer` 以占据剩余空间。' },
    props: {},
  },
}

function analyzeDemo(content) {
  const lines = content.split('\n')
  const templateOpen = lines.findIndex((l) => l.trim().startsWith('<template'))
  const templateClose = lines.findIndex((l) => l.trim() === '</template>')
  const scriptOpen = lines.findIndex((l) => l.trim().startsWith('<script'))
  const scriptClose =
    scriptOpen >= 0
      ? lines.findIndex((l, i) => i > scriptOpen && l.trim() === '</script>')
      : -1
  const styleOpen = lines.findIndex((l) => l.trim().startsWith('<style'))
  const styleClose =
    styleOpen >= 0
      ? lines.findIndex((l, i) => i > styleOpen && l.trim() === '</style>')
      : -1

  const templateRange =
    templateOpen >= 0 && templateClose >= 0
      ? [templateOpen + 1, templateClose + 1]
      : [1, scriptOpen >= 0 ? scriptOpen : lines.length]

  const scriptRange =
    scriptOpen >= 0 && scriptClose >= 0 ? [scriptOpen + 1, scriptClose + 1] : null

  const styleRange =
    styleOpen >= 0 && styleClose >= 0 ? [styleOpen + 1, styleClose + 1] : null

  return { templateRange, scriptRange, styleRange }
}

function codeRef(filePath, [start, end]) {
  return start === end
    ? `@[code{${start}}](${filePath})`
    : `@[code{${start}-${end}}](${filePath})`
}

function buildCodeSlots(name, sectionId, content) {
  const relPath = `../.vuepress/components/${name}/${sectionId}.vue`
  const { templateRange, scriptRange, styleRange } = analyzeDemo(content)
  let slots = `<template #template>\n\n${codeRef(relPath, templateRange)}\n\n</template>`
  if (scriptRange) {
    slots += `\n\n<template #script>\n\n${codeRef(relPath, scriptRange)}\n\n</template>`
  }
  if (styleRange) {
    slots += `\n\n<template #style>\n\n${codeRef(relPath, styleRange)}\n\n</template>`
  }
  return slots
}

function buildMd(name, cfg, meta, locale = 'en') {
  const title =
    locale === 'zh'
      ? pageTitleZh[name] || name
      : name.charAt(0).toUpperCase() + name.slice(1)
  const propsYaml = cfg.props.length
    ? `PROPS:\n${cfg.props
        .map((row) => yamlProp(row, meta?.props?.[row[0]]))
        .join('\n\n')}`
    : 'PROPS: []'
  const eventsYaml = cfg.events?.length
    ? `EVENTS:\n${cfg.events
        .map((row) => yamlEvent(row, meta?.events?.[row[0]]))
        .join('\n\n')}`
    : 'EVENTS: []'

  const descriptionYaml = meta?.description
    ? `description: ${JSON.stringify(meta.description)}`
    : ''

  const sections = cfg.sections
    .map((s) => {
      const sectionTitle =
        locale === 'zh'
          ? meta?.sectionTitles?.[s.id] || s.title
          : s.title
      const lead = meta?.leads?.[s.id]
      const leadBlock = lead ? `\n\n${lead}\n` : '\n'
      return `<card>

## ${sectionTitle}
${leadBlock}
<template #example>
<${name}-${s.id} />
</template>

${buildCodeSlots(name, s.id, s.demoContent)}

</card>`
    })
    .join('\n\n')

  const apiTitle = locale === 'zh' ? 'API' : 'API'

  return `---
${propsYaml}
${eventsYaml}
EXPOSES: []
${descriptionYaml}
NEWS:
${cfg.sections.map((s) => `  - ${s.id}`).join('\n')}
---

# ${title}

${sections}

<card>

## ${apiTitle}

</card>
`
}

const zhDocsDir = path.join(root, 'docs/zh/components')

const written = []

for (const [name, cfg] of Object.entries(components)) {
  const compDemoDir = path.join(demoDir, name)
  fs.mkdirSync(compDemoDir, { recursive: true })

  const sectionsWithContent = cfg.sections.map((section) => {
    const demoContent = section.demo.trim() + '\n'
    const demoPath = path.join(compDemoDir, `${section.id}.vue`)
    fs.writeFileSync(demoPath, demoContent)
    written.push(demoPath)
    return { ...section, demoContent }
  })

  const cfgWithSections = { ...cfg, sections: sectionsWithContent }

  const mdPath = path.join(docsDir, `${name}.md`)
  fs.writeFileSync(mdPath, buildMd(name, cfgWithSections, componentMeta[name], 'en'))
  written.push(mdPath)

  fs.mkdirSync(zhDocsDir, { recursive: true })
  const zhMdPath = path.join(zhDocsDir, `${name}.md`)
  fs.writeFileSync(
    zhMdPath,
    buildMd(name, cfgWithSections, componentMetaZh[name], 'zh')
  )
  written.push(zhMdPath)
}

console.log(`Generated ${written.length} files`)
