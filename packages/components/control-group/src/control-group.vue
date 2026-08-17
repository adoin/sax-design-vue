<script setup lang="ts">
import {
  Comment,
  Fragment,
  Text,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import { controlGroupProps } from './control-group'
import type { PropType, VNode } from 'vue'

defineOptions({ name: 'SControlGroup' })

const slots = defineSlots<{
  default(): VNode[]
}>()

const props = defineProps(controlGroupProps)
const ns = useNamespace('control-group')

const GRID_COLUMNS = 24

interface RenderedControlGroupItem {
  key: string | number | symbol
  span?: number
  vnode: VNode
}

const normalizeSpan = (value: unknown) => {
  const span = Number(value)

  if (!Number.isFinite(span) || span <= 0) return undefined

  return Math.min(GRID_COLUMNS, Math.floor(span))
}

const flattenControls = (children: unknown[], controls: VNode[] = []) => {
  children.forEach((child) => {
    if (Array.isArray(child)) {
      flattenControls(child, controls)
      return
    }

    if (!isVNode(child)) return

    const vnode = child

    if (vnode.type === Comment) return
    if (vnode.type === Text && !String(vnode.children ?? '').trim()) return

    if (vnode.type === Fragment && Array.isArray(vnode.children)) {
      flattenControls(vnode.children, controls)
      return
    }

    controls.push(vnode)
  })

  return controls
}

const ControlGroupItem = defineComponent({
  name: 'SControlGroupItem',
  props: {
    child: {
      type: Object as PropType<VNode>,
      required: true,
    },
    span: Number,
  },
  setup(itemProps) {
    return () =>
      h(
        'div',
        {
          class: ns.e('item'),
          role: 'presentation',
          style: itemProps.span
            ? {
                flexBasis: `${(itemProps.span / GRID_COLUMNS) * 100}%`,
                flexGrow: 0,
                flexShrink: 0,
              }
            : undefined,
        },
        [itemProps.child],
      )
  },
})

const getGroupItems = (): RenderedControlGroupItem[] =>
  flattenControls(slots.default?.() ?? []).map((vnode, index) => ({
    key: vnode.key ?? index,
    span: normalizeSpan(vnode.props?.span),
    vnode: cloneVNode(vnode, { span: undefined }),
  }))
</script>

<template>
  <div :class="[ns.b(), ns.is('block', props.block)]" role="group">
    <ControlGroupItem
      v-for="item in getGroupItems()"
      :key="item.key"
      :child="item.vnode"
      :span="item.span"
    />
  </div>
</template>
