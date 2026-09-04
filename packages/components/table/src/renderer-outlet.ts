import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableEditRenderer,
  TableEditSlotParams,
  TableFooterCellRenderParams,
  TableFooterRenderer,
  TableHeaderRenderParams,
  TableHeaderRenderer,
} from './table'

export default defineComponent({
  name: 'STableRendererOutlet',
  props: {
    renderer: {
      type: Function as PropType<
        | TableCellRenderer
        | TableHeaderRenderer
        | TableFooterRenderer
        | TableEditRenderer
      >,
      default: undefined,
    },
    params: {
      type: Object as PropType<
        | TableCellRenderParams
        | TableHeaderRenderParams
        | TableFooterCellRenderParams
        | TableEditSlotParams
      >,
      required: true,
    },
    fallback: {
      type: null,
      default: undefined,
    },
  },
  setup(props) {
    return () =>
      props.renderer
        ? props.renderer(props.params as never)
        : String(props.fallback ?? '')
  },
})
