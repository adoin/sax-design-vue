import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import type {
  TableCellRenderParams,
  TableCellRenderer,
  TableHeaderRenderParams,
  TableHeaderRenderer,
} from './table'

export default defineComponent({
  name: 'STableRendererOutlet',
  props: {
    renderer: {
      type: Function as PropType<TableCellRenderer | TableHeaderRenderer>,
      default: undefined,
    },
    params: {
      type: Object as PropType<TableCellRenderParams | TableHeaderRenderParams>,
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
