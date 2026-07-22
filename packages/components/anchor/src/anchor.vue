<template>
  <nav :class="[ns.b(), ns.m(direction)]" aria-label="Anchor navigation">
    <button
      v-for="item in items"
      :key="item.href"
      :class="[
        ns.e('item'),
        ns.is('active', current === item.href),
        ns.is('disabled', item.disabled),
      ]"
      type="button"
      :disabled="item.disabled"
      @click="navigate(item)"
    >
      {{ item.title }}
    </button>
  </nav>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { anchorEmits, anchorProps } from './anchor'
import type { AnchorItem } from './anchor'

defineOptions({ name: 'SAnchor' })

const props = defineProps(anchorProps)
const emit = defineEmits(anchorEmits)
const ns = useNamespace('anchor')
const current = ref('')

const setCurrent = (value: string) => {
  if (value === current.value) return
  current.value = value
  emit('update:modelValue', value)
  emit('change', value)
}
const navigate = (item: AnchorItem) => {
  if (item.disabled) return
  const target = document.querySelector(item.href)
  if (target)
    target.scrollIntoView({ behavior: props.scrollBehavior, block: 'start' })
  setCurrent(item.href)
}
const updateCurrent = () => {
  const active = props.items.reduce<AnchorItem | undefined>(
    (candidate, item) => {
      const target = document.querySelector(item.href)
      return target && target.getBoundingClientRect().top <= props.offset
        ? item
        : candidate
    },
    undefined,
  )
  if (active) setCurrent(active.href)
}

watch(
  () => props.modelValue,
  (value) => {
    current.value = value
  },
  { immediate: true },
)
onMounted(() => {
  updateCurrent()
  window.addEventListener('scroll', updateCurrent, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', updateCurrent))
</script>
