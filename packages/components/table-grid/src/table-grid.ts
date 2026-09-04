import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { tableEmits, tableProps } from '@vuesax-alpha/components/table'
import type { EmitFn, ExtractPropTypes } from 'vue'
import type { ButtonProps } from '@vuesax-alpha/components/button'
import type {
  FormInstance,
  FormModel,
  FormProps,
} from '@vuesax-alpha/components/form'
import type {
  TableExposes,
  TableFilters,
  TablePagerConfig,
  TableSort,
} from '@vuesax-alpha/components/table'
import type TableGrid from './table-grid.vue'

export interface TableGridQueryConfig extends Partial<FormProps> {
  enabled?: boolean
  showActions?: boolean
  submitText?: string
  resetText?: string
}

export interface TableGridToolbarButton {
  code: string
  text: string
  visible?: boolean
  disabled?: boolean
  loading?: boolean
  props?: Partial<ButtonProps>
}

export interface TableGridToolbarConfig {
  enabled?: boolean
  title?: string
  refresh?: boolean
  refreshText?: string
  buttons?: TableGridToolbarButton[]
}

export interface TableGridQueryContext {
  reason: 'submit' | 'reset' | 'refresh'
  form: FormModel
  pager: TablePagerConfig | false
  sortBy: TableSort[]
  filters: TableFilters
}

export const tableGridProps = buildProps({
  ...tableProps,
  queryConfig: {
    type: definePropType<boolean | TableGridQueryConfig>([Boolean, Object]),
    default: false,
  },
  toolbarConfig: {
    type: definePropType<boolean | TableGridToolbarConfig>([Boolean, Object]),
    default: false,
  },
} as const)

export const tableGridEmits = {
  ...tableEmits,
  query: (context: TableGridQueryContext) => Boolean(context),
  queryError: (() => true) as (error: unknown) => boolean,
  toolbarClick: (
    code: string,
    context: TableGridQueryContext,
    event: MouseEvent,
  ) => typeof code === 'string' && Boolean(context) && Boolean(event),
}
export type TableGridProps = ExtractPropTypes<typeof tableGridProps>
export type TableGridEmitFn = EmitFn<typeof tableGridEmits>
export interface TableGridExposes {
  query: () => Promise<boolean>
  resetQuery: () => Promise<boolean>
  refresh: () => Promise<boolean>
  getQueryContext: () => TableGridQueryContext
  getTable: () => TableExposes | undefined
  getForm: () => FormInstance | undefined
}
export type TableGridInstance = InstanceType<typeof TableGrid>
