<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import SPopper from '@vuesax-alpha/components/popper'
import { useNamespace } from '@vuesax-alpha/hooks'
import type { InputAutocompleteOption, InputAutocompleteScope } from './input'
import type { StyleValue } from 'vue'

const props = defineProps<{
  reference: HTMLElement | null
  visible: boolean
  id: string
  keyword: string
  options: InputAutocompleteOption[]
  activeIndex: number
  shape: string
  size: string
  themeStyle: StyleValue
}>()
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:activeIndex': [value: number]
  select: [option: InputAutocompleteOption]
}>()
defineSlots<{ option?: (scope: InputAutocompleteScope) => unknown }>()
const ns = useNamespace('input')
const list = useTemplateRef<HTMLElement>('list')
const highlight = (text: string) => {
  const query = props.keyword.trim().toLocaleLowerCase()
  if (!query) return [{ text, matched: false }]
  const lower = text.toLocaleLowerCase()
  const parts: { text: string; matched: boolean }[] = []
  let start = 0
  let match = lower.indexOf(query)
  while (match >= 0) {
    if (match > start)
      parts.push({ text: text.slice(start, match), matched: false })
    parts.push({ text: text.slice(match, match + query.length), matched: true })
    start = match + query.length
    match = lower.indexOf(query, start)
  }
  if (start < text.length)
    parts.push({ text: text.slice(start), matched: false })
  return parts
}
watch(
  () => props.activeIndex,
  async () => {
    await nextTick()
    const container = list.value
    const active = container?.children[props.activeIndex] as
      HTMLElement | undefined
    if (!container || !active) return
    if (active.offsetTop < container.scrollTop)
      container.scrollTop = active.offsetTop
    else if (
      active.offsetTop + active.offsetHeight >
      container.scrollTop + container.clientHeight
    )
      container.scrollTop =
        active.offsetTop + active.offsetHeight - container.clientHeight
  },
)
</script>

<template>
  <SPopper
    :visible="visible"
    :trigger="[]"
    virtual-triggering
    :virtual-ref="reference ?? undefined"
    placement="bottom-start"
    strategy="fixed"
    fit
    :offset="6"
    :show-arrow="false"
    :popper-class="[ns.e('autocomplete'), ns.is(shape), ns.m(size)]"
    :popper-style="themeStyle"
    @update:visible="emit('update:visible', $event)"
  >
    <template #content>
      <ul
        :id="id"
        ref="list"
        :class="ns.e('suggestions')"
        role="listbox"
        @pointerdown.prevent
      >
        <li
          v-for="(option, index) in options"
          :id="`${id}-${index}`"
          :key="`${index}-${option.value}`"
          role="option"
          :aria-selected="index === activeIndex"
          :aria-disabled="option.disabled || undefined"
          :class="[
            ns.e('suggestion'),
            ns.is('active', index === activeIndex),
            ns.is('disabled', !!option.disabled),
          ]"
          @pointermove="!option.disabled && emit('update:activeIndex', index)"
          @click="!option.disabled && emit('select', option)"
        >
          <slot
            name="option"
            :option="option"
            :keyword="keyword"
            :active="index === activeIndex"
          >
            <span :class="ns.e('suggestion-label')">
              <template
                v-for="(part, partIndex) in highlight(
                  option.label ?? option.value,
                )"
                :key="partIndex"
              >
                <mark
                  v-if="part.matched"
                  :class="ns.e('suggestion-highlight')"
                  >{{ part.text }}</mark
                >
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
            <span
              v-if="option.description"
              :class="ns.e('suggestion-description')"
            >
              <template
                v-for="(part, partIndex) in highlight(option.description)"
                :key="partIndex"
              >
                <mark
                  v-if="part.matched"
                  :class="ns.e('suggestion-highlight')"
                  >{{ part.text }}</mark
                >
                <template v-else>{{ part.text }}</template>
              </template>
            </span>
          </slot>
        </li>
      </ul>
    </template>
  </SPopper>
</template>
