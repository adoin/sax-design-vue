<script setup lang="ts">
import { defineComponent, h, ref } from 'vue'
import { SDialog, STextarea } from 'sax-design-vue'
const mounted = ref(false)
const persistent = ref(false)
const Owner = defineComponent({
  props: { survive: Boolean },
  setup(props) {
    const visible = ref(true)
    const draft = ref(
      'Edit this draft, minimize the dialog, then destroy its owner using the page button.',
    )
    return () =>
      h(
        SDialog,
        {
          modelValue: visible.value,
          'onUpdate:modelValue': (value: boolean) => {
            visible.value = value
          },
          global: props.survive,
          fullScreen: true,
          lockScroll: true,
          title: props.survive ? 'Global draft' : 'Local draft',
        },
        {
          default: () =>
            h(STextarea, {
              modelValue: draft.value,
              'onUpdate:modelValue': (value: string) => {
                draft.value = value
              },
              rows: 6,
              'aria-label': 'Draft content',
            }),
        },
      )
  },
})
</script>

<template>
  <div class="dialog-owner-demo">
    <div class="dialog-owner-demo__controls">
      <s-switch v-model="persistent" :disabled="mounted" aria-label="global" />
      <span>global</span>
      <s-button :disabled="mounted" @click="mounted = true"
        >Create and open</s-button
      >
      <s-button :disabled="!mounted" @click="mounted = false"
        >Destroy owner</s-button
      >
    </div>
    <p>
      Minimize the dialog before destroying its owner. Local bubbles disappear;
      with global enabled, restore the bubble and continue editing. Close the
      bubble or dialog to dispose of the global instance.
    </p>
    <Owner v-if="mounted" :survive="persistent" />
  </div>
</template>

<style scoped>
.dialog-owner-demo {
  display: grid;
  gap: 16px;
}
.dialog-owner-demo__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}
.dialog-owner-demo p {
  margin: 0;
}
</style>
