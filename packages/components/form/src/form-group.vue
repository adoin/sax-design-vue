<template>
  <section
    :class="[ns.b(), ns.is('border', border), ns.is('collapsed', isCollapsed)]"
  >
    <button
      v-if="title || description || collapsible"
      :class="ns.e('header')"
      type="button"
      :disabled="!collapsible"
      @click="toggle"
    >
      <span
        ><strong v-if="title">{{ title }}</strong
        ><small v-if="description">{{ description }}</small></span
      >
      <SIcon v-if="collapsible" icon="expand_more" icon-pack="material-icons" />
    </button>
    <div v-else-if="$slots.header" :class="ns.e('header')">
      <slot name="header" />
    </div>
    <div v-show="!isCollapsed" :class="ns.e('content')"><slot /></div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useNamespace } from '@vuesax-alpha/hooks'
import { formGroupEmits, formGroupProps } from './form-group'

defineOptions({ name: 'SFormGroup' })

const props = defineProps(formGroupProps)
const emit = defineEmits(formGroupEmits)
const ns = useNamespace('form-group')
const localCollapsed = ref(props.collapsed)
const isCollapsed = computed(() => localCollapsed.value)
const toggle = () => {
  if (!props.collapsible) return
  localCollapsed.value = !localCollapsed.value
  emit('update:collapsed', localCollapsed.value)
}
watch(
  () => props.collapsed,
  (value) => {
    localCollapsed.value = value
  },
)
</script>
