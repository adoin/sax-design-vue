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
      { id: 'default', title: 'Default', demo: `<template>\n  <div class="center">\n    <p>Content above the divider.</p>\n    <vs-divider />\n    <p>Content below the divider.</p>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'text', title: 'Text', demo: `<template>\n  <div class="center">\n    <vs-divider>My Text</vs-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'position', title: 'Text Position', demo: `<template>\n  <div class="center">\n    <vs-divider position="left">left</vs-divider>\n    <vs-divider position="left-center">left-center</vs-divider>\n    <vs-divider position="center">center</vs-divider>\n    <vs-divider position="right-center">right-center</vs-divider>\n    <vs-divider position="right">right</vs-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'color', title: 'Color', demo: `<template>\n  <div class="center">\n    <vs-divider>Default</vs-divider>\n    <vs-divider color="primary">Primary</vs-divider>\n    <vs-divider color="success">Success</vs-divider>\n    <vs-divider color="danger">Danger</vs-divider>\n    <vs-divider color="warning">Warning</vs-divider>\n    <vs-divider color="dark">Dark</vs-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'background', title: 'Background', demo: `<template>\n  <div class="center">\n    <vs-divider background="primary" color="#ade6d4">Primary</vs-divider>\n    <vs-divider background="success" color="#0a540a">Success</vs-divider>\n    <vs-divider background="danger" color="lightcoral">Danger</vs-divider>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'icons', title: 'Icons', demo: `<template>\n  <div class="center">\n    <vs-divider icon="arrow_downward" />\n    <vs-divider color="primary" icon="star" />\n    <vs-divider color="success" icon="check" />\n    <vs-divider color="danger" icon="delete_forever" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'style', title: 'Style', demo: `<template>\n  <div class="center">\n    <vs-divider border-style="dotted" color="dark">dotted</vs-divider>\n    <vs-divider border-style="dashed" color="dark">dashed</vs-divider>\n    <vs-divider border-style="solid" color="dark">solid</vs-divider>\n  </div>\n</template>\n\n${centerStyle}` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <div class="center">\n    <vs-progress :percent="62" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'color', title: 'Colors', demo: `<template>\n  <div class="center">\n    <vs-progress :percent="70" color="primary" />\n    <vs-progress :percent="70" color="success" />\n    <vs-progress :percent="70" color="danger" />\n    <vs-progress :percent="70" color="warning" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'indeterminate', title: 'Indeterminate', demo: `<template>\n  <div class="center">\n    <vs-progress indeterminate color="primary" />\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'height', title: 'Height', demo: `<template>\n  <div class="center">\n    <vs-progress :percent="55" :height="6" />\n    <vs-progress :percent="55" :height="12" color="success" />\n  </div>\n</template>\n\n${centerStyle}` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <vs-chip>Basic Chip</vs-chip>\n    <vs-chip closable>Closable</vs-chip>\n  </div>\n</template>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <vs-chip color="primary">Primary</vs-chip>\n    <vs-chip color="success">Success</vs-chip>\n    <vs-chip color="danger">Danger</vs-chip>\n    <vs-chip color="warning">Warning</vs-chip>\n  </div>\n</template>` },
      { id: 'transparent', title: 'Transparent', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <vs-chip transparent color="primary">Primary</vs-chip>\n    <vs-chip transparent color="success">Success</vs-chip>\n  </div>\n</template>` },
      { id: 'icon', title: 'Icon', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <vs-chip icon="send" color="primary">Send</vs-chip>\n    <vs-chip icon="check" color="success">Check</vs-chip>\n  </div>\n</template>` },
      { id: 'closable', title: 'Closable', demo: `<template>\n  <div class="center" style="flex-direction:row;flex-wrap:wrap;gap:8px;">\n    <vs-chip v-for="item in chips" :key="item" closable @close="remove(item)">{{ item }}</vs-chip>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst chips = ref(['Vuejs', 'Vuesax', 'Sax Design'])\nconst remove = (item: string) => {\n  chips.value = chips.value.filter((c) => c !== item)\n}\n</script>` },
      { id: 'chips', title: 'Add and Remove Items', demo: `<template>\n  <div class="center">\n    <p>{{ chips }}</p>\n    <vs-chips v-model="chips" placeholder="New element">\n      <vs-chip v-for="chip in chips" :key="chip" closable>{{ chip }}</vs-chip>\n    </vs-chips>\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst chips = ref(['Vuejs', 'Node', 'Vuesax'])\n</script>\n\n${centerStyle}` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-breadcrumb :items="items" />\n</template>\n\n<script setup lang="ts">\nconst items = [\n  { title: 'Home', url: '/' },\n  { title: 'Components', url: '/components/' },\n  { title: 'Breadcrumb', active: true },\n]\n</script>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <vs-breadcrumb color="success" :items="items" />\n</template>\n\n<script setup lang="ts">\nconst items = [{ title: 'Home' }, { title: 'Active', active: true }]\n</script>` },
      { id: 'separator', title: 'Separator', demo: `<template>\n  <vs-breadcrumb separator=">" :items="items" />\n</template>\n\n<script setup lang="ts">\nconst items = [{ title: 'Home' }, { title: 'Docs' }, { title: 'Breadcrumb', active: true }]\n</script>` },
      { id: 'slot', title: 'Slot', demo: `<template>\n  <vs-breadcrumb>\n    <vs-breadcrumb-item to="/">Home</vs-breadcrumb-item>\n    <vs-breadcrumb-item>Library</vs-breadcrumb-item>\n    <vs-breadcrumb-item active>Data</vs-breadcrumb-item>\n  </vs-breadcrumb>\n</template>` },
      { id: 'align', title: 'Alignment', demo: `<template>\n  <div class="center">\n    <vs-breadcrumb align="center" :items="items" />\n    <vs-breadcrumb align="right" :items="items" />\n  </div>\n</template>\n\n<script setup lang="ts">\nconst items = [{ title: 'Home' }, { title: 'Active', active: true }]\n</script>\n\n${centerStyle}` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-textarea v-model="text" placeholder="Write something" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
      { id: 'label', title: 'Label', demo: `<template>\n  <vs-textarea v-model="text" label="Description" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
      { id: 'counter', title: 'Counter', demo: `<template>\n  <vs-textarea v-model="text" :counter="25" counter-danger />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('Hello world')\n</script>` },
      { id: 'width', title: 'Width', demo: `<template>\n  <vs-textarea v-model="text" width="300px" label="Fixed width" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
      { id: 'height', title: 'Height', demo: `<template>\n  <vs-textarea v-model="text" height="120px" label="Taller area" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst text = ref('')\n</script>` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-collapse>\n    <vs-collapse-item>\n      <template #header>Accordion 1</template>\n      Content for panel one.\n    </vs-collapse-item>\n    <vs-collapse-item>\n      <template #header>Accordion 2</template>\n      Content for panel two.\n    </vs-collapse-item>\n  </vs-collapse>\n</template>` },
      { id: 'accordion', title: 'Accordion', demo: `<template>\n  <vs-collapse accordion>\n    <vs-collapse-item open>\n      <template #header>Only one open</template>\n      First panel\n    </vs-collapse-item>\n    <vs-collapse-item>\n      <template #header>Second</template>\n      Second panel\n    </vs-collapse-item>\n  </vs-collapse>\n</template>` },
      { id: 'type', title: 'Type', demo: `<template>\n  <div class="center">\n    <vs-collapse type="border">\n      <vs-collapse-item open><template #header>Border</template>Border style</vs-collapse-item>\n    </vs-collapse>\n    <vs-collapse type="shadow">\n      <vs-collapse-item open><template #header>Shadow</template>Shadow style</vs-collapse-item>\n    </vs-collapse>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'open-hover', title: 'Open Hover', demo: `<template>\n  <vs-collapse open-hover>\n    <vs-collapse-item><template #header>Hover me</template>Opens on hover</vs-collapse-item>\n  </vs-collapse>\n</template>` },
      { id: 'icon-arrow', title: 'Change Arrow Icon', demo: `<template>\n  <vs-collapse>\n    <vs-collapse-item icon-arrow="expand_more">\n      <template #header>Custom arrow</template>\n      Custom icon arrow\n    </vs-collapse-item>\n  </vs-collapse>\n</template>` },
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
      { id: 'default', title: 'Basic', demo: `<template>\n  <vs-list>\n    <vs-list-item title="User 1" subtitle="Developer" />\n    <vs-list-item title="User 2" subtitle="Designer" />\n  </vs-list>\n</template>` },
      { id: 'header', title: 'Header', demo: `<template>\n  <vs-list>\n    <vs-list-header title="Users" subtitle="Team members" color="primary" />\n    <vs-list-item title="Jane" subtitle="Frontend" />\n    <vs-list-item title="John" subtitle="Backend" />\n  </vs-list>\n</template>` },
      { id: 'icon', title: 'Icon', demo: `<template>\n  <vs-list>\n    <vs-list-item icon="home" title="Home" subtitle="Dashboard" />\n    <vs-list-item icon="settings" title="Settings" />\n  </vs-list>\n</template>` },
      { id: 'content', title: 'Content', demo: `<template>\n  <vs-list>\n    <vs-list-item title="Downloads">\n      <vs-button size="small">Open</vs-button>\n    </vs-list-item>\n  </vs-list>\n</template>` },
      { id: 'avatar', title: 'Avatar', demo: `<template>\n  <vs-list>\n    <vs-list-item title="Luis" subtitle="Admin">\n      <template #avatar>\n        <vs-avatar text="LD" />\n      </template>\n    </vs-list-item>\n  </vs-list>\n</template>` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-images>\n    <vs-image src="https://picsum.photos/seed/vs1/300" />\n    <vs-image src="https://picsum.photos/seed/vs2/300" />\n    <vs-image src="https://picsum.photos/seed/vs3/300" />\n    <vs-image src="https://picsum.photos/seed/vs4/300" />\n  </vs-images>\n</template>` },
      { id: 'hover', title: 'Hover', demo: `<template>\n  <div class="center">\n    <vs-images hover="zoom">\n      <vs-image src="https://picsum.photos/seed/z1/300" />\n      <vs-image src="https://picsum.photos/seed/z2/300" />\n    </vs-images>\n    <vs-images hover="blur">\n      <vs-image src="https://picsum.photos/seed/b1/300" />\n      <vs-image src="https://picsum.photos/seed/b2/300" />\n    </vs-images>\n  </div>\n</template>\n\n${centerStyle}` },
      { id: 'more', title: 'More Options', demo: `<template>\n  <vs-images alternating not-margin>\n    <vs-image src="https://picsum.photos/seed/m1/300" />\n    <vs-image src="https://picsum.photos/seed/m2/300" />\n    <vs-image src="https://picsum.photos/seed/m3/300" />\n    <vs-image src="https://picsum.photos/seed/m4/300" />\n  </vs-images>\n</template>` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-button @click="active = true">Open prompt</vs-button>\n  <vs-prompt v-model="active" title="Confirm action" text="Do you want to continue?" type="confirm" @accept="active = false" @cancel="active = false" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(false)\n</script>` },
      { id: 'alert', title: 'Alert', demo: `<template>\n  <vs-button @click="active = true">Alert</vs-button>\n  <vs-prompt v-model="active" type="alert" title="Notice" text="Saved successfully." @accept="active = false" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(false)\n</script>` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-tabs v-model="active">\n    <vs-tab label="Home">Home panel</vs-tab>\n    <vs-tab label="Profile">Profile panel</vs-tab>\n  </vs-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <vs-tabs v-model="active" color="success">\n    <vs-tab label="One">One</vs-tab>\n    <vs-tab label="Two">Two</vs-tab>\n  </vs-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'alignments', title: 'Alignments', demo: `<template>\n  <vs-tabs v-model="active" alignment="center">\n    <vs-tab label="A">A</vs-tab>\n    <vs-tab label="B">B</vs-tab>\n  </vs-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'position', title: 'Position', demo: `<template>\n  <vs-tabs v-model="active" position="bottom">\n    <vs-tab label="Top content">Content</vs-tab>\n    <vs-tab label="More">More</vs-tab>\n  </vs-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
      { id: 'icons', title: 'Icons', demo: `<template>\n  <vs-tabs v-model="active">\n    <vs-tab label="Inbox" icon="inbox">Inbox</vs-tab>\n    <vs-tab label="Settings" icon="settings">Settings</vs-tab>\n  </vs-tabs>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst active = ref(0)\n</script>` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-slider v-model="val" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst val = ref(30)\n</script>` },
      { id: 'color', title: 'Color', demo: `<template>\n  <div class="center">\n    <vs-slider v-model="a" color="primary" />\n    <vs-slider v-model="b" color="success" />\n    <vs-slider v-model="c" color="danger" />\n  </div>\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst a = ref(20)\nconst b = ref(40)\nconst c = ref(60)\n</script>\n\n${centerStyle}` },
      { id: 'ticks', title: 'Ticks', demo: `<template>\n  <vs-slider v-model="val" ticks :step="10" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst val = ref(50)\n</script>` },
      { id: 'text-fixed', title: 'Text Fixed', demo: `<template>\n  <vs-slider v-model="val" text-fixed="%" />\n</template>\n\n<script setup lang="ts">\nimport { ref } from 'vue'\nconst val = ref(25)\n</script>` },
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
      { id: 'default', title: 'Default', demo: `<template>\n  <vs-upload text="Select file" :multiple="false" />\n</template>` },
      { id: 'multiple', title: 'Multiple', demo: `<template>\n  <vs-upload multiple :limit="4" text="Upload images" accept="image/*" />\n</template>` },
      { id: 'automatic', title: 'Automatic', demo: `<template>\n  <vs-upload automatic action="https://httpbin.org/post" text="Auto upload" :multiple="false" />\n</template>` },
    ],
  },
  spacer: {
    props: [],
    events: [],
    sections: [
      {
        id: 'default',
        title: 'Default',
        demo: `<template>\n  <div style="display:flex;align-items:center;width:100%;">\n    <vs-button>Left</vs-button>\n    <vs-spacer />\n    <vs-button color="success">Right</vs-button>\n  </div>\n</template>`,
      },
    ],
  },
}

function yamlProp([name, type, values, description, def, usage]) {
  return `  - name: ${name}
    type: ${type}
    values: ${values}
    description: ${description}
    default: ${def === null ? 'null' : def}
    link: null
    usage: '${usage}'`
}

function yamlEvent([name, params, description]) {
  return `  - name: ${name}
    params: ${params || 'null'}
    description: ${description}`
}

function buildMd(name, cfg) {
  const title = name.charAt(0).toUpperCase() + name.slice(1)
  const propsYaml = cfg.props.length
    ? `PROPS:\n${cfg.props.map(yamlProp).join('\n\n')}`
    : 'PROPS: []'
  const eventsYaml = cfg.events?.length
    ? `EVENTS:\n${cfg.events.map(yamlEvent).join('\n\n')}`
    : 'EVENTS: []'

  const sections = cfg.sections
    .map(
      (s) => `<card>

## ${s.title}

<template #example>
<${name}-${s.id} />
</template>

<template #template>

@[code vue](../.vuepress/components/${name}/${s.id}.vue)

</template>

</card>`
    )
    .join('\n\n')

  return `---
${propsYaml}
${eventsYaml}
EXPOSES: []
NEWS:
${cfg.sections.map((s) => `  - ${s.id}`).join('\n')}
---

# ${title}

${sections}

<card>

## API

</card>
`
}

const written = []

for (const [name, cfg] of Object.entries(components)) {
  const mdPath = path.join(docsDir, `${name}.md`)
  fs.writeFileSync(mdPath, buildMd(name, cfg))
  written.push(mdPath)

  const compDemoDir = path.join(demoDir, name)
  fs.mkdirSync(compDemoDir, { recursive: true })
  for (const section of cfg.sections) {
    const demoPath = path.join(compDemoDir, `${section.id}.vue`)
    fs.writeFileSync(demoPath, section.demo.trim() + '\n')
    written.push(demoPath)
  }
}

console.log(`Generated ${written.length} files`)
