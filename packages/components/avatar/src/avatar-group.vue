<script lang="ts" setup>
import {
  Comment,
  Fragment,
  cloneVNode,
  defineComponent,
  h,
  isVNode,
  useSlots,
} from 'vue'
import { useNamespace } from '@vuesax-alpha/hooks'
import Avatar from './avatar.vue'
import { avatarGroupProps } from './avatar-group'
import type { VNode, VNodeChild } from 'vue'

defineOptions({ name: 'SAvatarGroup' })
const props = defineProps(avatarGroupProps)
const slots = useSlots()
const ns = useNamespace('avatar')

function avatarNodes(nodes: VNodeChild[]): VNode[] {
  const result: VNode[] = []
  for (const node of nodes) {
    if (Array.isArray(node)) result.push(...avatarNodes(node))
    else if (isVNode(node) && node.type !== Comment) {
      if (node.type === Fragment)
        result.push(...avatarNodes(node.children as VNodeChild[]))
      else result.push(node)
    }
  }
  return result
}

// Resolve slots inside render so v-for, conditional children and max stay reactive.
const GroupContent = defineComponent({
  setup() {
    return () => {
      const nodes = avatarNodes(slots.default?.() ?? [])
      const requested = Number(props.max)
      const limit =
        props.max === undefined || !Number.isFinite(requested)
          ? nodes.length
          : Math.max(0, Math.floor(requested))
      const visible = nodes.slice(0, limit)
      const count = nodes.length - visible.length
      const rendered = visible.map((node) =>
        props.size === undefined || node.props?.size !== undefined
          ? node
          : cloneVNode(node, { size: props.size }),
      )
      if (count > 0) {
        const last = visible[visible.length - 1] ?? nodes[0]
        rendered.push(
          h(
            Avatar,
            {
              key: 'avatar-group-overflow',
              class: ns.em('group', 'overflow'),
              size: props.size ?? last?.props?.size,
              shape: last?.props?.shape,
              'aria-label': `+${count}`,
            },
            { default: () => slots.overflow?.({ count }) ?? `+${count}` },
          ),
        )
      }
      return rendered
    }
  },
})
</script>

<template>
  <div
    :class="[ns.e('group'), { float }]"
    :style="{ '--sax-avatar-group-overlap': `${Math.max(0, overlap)}px` }"
    role="group"
  >
    <group-content />
  </div>
</template>
