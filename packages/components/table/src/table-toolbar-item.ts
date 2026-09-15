import { defineComponent } from 'vue'
import { resolveGlobalToolbarRenderer } from './table-renderer'
import type { PropType } from 'vue'
import type {
  TableToolbarRendererOptions,
  TableToolbarRendererParams,
} from './table-business'

export default defineComponent({
  name: 'STableToolbarRenderer',
  props: {
    options: {
      type: Object as PropType<TableToolbarRendererOptions>,
      required: true,
    },
    params: {
      type: Object as PropType<TableToolbarRendererParams>,
      required: true,
    },
    action: {
      type: Function as PropType<(code: string, event: MouseEvent) => unknown>,
      required: true,
    },
  },
  setup(props) {
    return () =>
      resolveGlobalToolbarRenderer(props.options, props.params, props.action)
  },
})
