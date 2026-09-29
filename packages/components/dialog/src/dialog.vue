<script lang="ts">
import {
  computed,
  createVNode,
  defineComponent,
  getCurrentInstance,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  onUpdated,
  proxyRefs,
  render,
  shallowRef,
} from 'vue'
import { useGlobalComponentProps, useShape } from '@vuesax-alpha/hooks'
import DialogSurface from './dialog-surface.vue'
import { dialogEmits, dialogProps } from './dialog'
import type { AppContext } from 'vue'

type Surface = InstanceType<typeof DialogSurface>

export default defineComponent({
  name: 'SDialog',
  inheritAttrs: false,
  props: dialogProps,
  emits: dialogEmits,
  setup(rawProps, { attrs, slots, emit, expose }) {
    const props = useGlobalComponentProps('dialog', rawProps)
    const shape = useShape()
    const owner = getCurrentInstance()!
    const globalMode = props.global
    const surface = shallowRef<Surface>()
    let host: HTMLElement | undefined
    let orphaned = false
    let disposed = false
    const dispose = () => {
      if (disposed) return
      disposed = true
      if (host) {
        render(null, host)
        host.remove()
        host = undefined
      }
      surface.value = undefined
    }
    const listeners: Record<string, (...args: unknown[]) => void> = {}
    for (const event of Object.keys(dialogEmits)) {
      const handler = `on${event[0].toUpperCase()}${event.slice(1)}`
      listeners[handler] = (...args) => {
        if (event === 'closed' && orphaned) nextTick(dispose)
        if (orphaned) {
          // These callbacks deliberately outlive their declaring component.
          const callback = owner.vnode.props?.[handler]
          for (const fn of Array.isArray(callback) ? callback : [callback])
            if (typeof fn === 'function') fn(...args)
        } else {
          // Vue's emit overload is a union of all event signatures.
          ;(emit as (name: string, ...payload: unknown[]) => void)(
            event,
            ...args,
          )
        }
      }
    }
    const updateGlobal = () => {
      if (!host || disposed || orphaned) return
      const vnode = createVNode(
        DialogSurface,
        { ...attrs, ...props, shape: shape.value, ...listeners },
        slots,
      )
      vnode.appContext = {
        ...owner.appContext,
        provides: (owner as typeof owner & { provides: AppContext['provides'] })
          .provides,
      }
      render(vnode, host)
      if (vnode.component?.exposed)
        surface.value = proxyRefs(vnode.component.exposed) as Surface
    }
    onMounted(() => {
      if (!globalMode) return
      host = document.createElement('div')
      host.dataset.sDialogHost = ''
      document.body.appendChild(host)
      updateGlobal()
    })
    onUpdated(updateGlobal)
    onBeforeUnmount(() => {
      if (globalMode && surface.value?.visible) orphaned = true
      else dispose()
    })
    expose({
      visible: computed(() => surface.value?.visible ?? false),
      minimized: computed(() => surface.value?.minimized ?? false),
      open: () => surface.value?.open(),
      close: () => surface.value?.close(),
      confirm: () => surface.value?.confirm(),
      minimize: () => surface.value?.minimize(),
      restore: () => surface.value?.restore(),
    })
    return () => {
      // Track props/attrs even for the independently mounted global surface.
      const input = { ...attrs, ...props, shape: shape.value, ...listeners }
      return globalMode
        ? null
        : h(DialogSurface, { ...input, ref: surface }, slots)
    }
  },
})
</script>
