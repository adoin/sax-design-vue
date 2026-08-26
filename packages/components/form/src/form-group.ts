import { buildProps, definePropType } from '@vuesax-alpha/utils'
import type { ExtractPropTypes } from 'vue'
import type { ContextMenuItem } from '@vuesax-alpha/components/context-menu'
import type { TabsProps } from '@vuesax-alpha/components/tabs'
import type FormGroup from './form-group.vue'
import type { FormInstance, FormModel, FormProps } from './form'

export type FormGroupItem<F extends object = FormModel> = F & {
  /** Stable identity used by tabs and validation state. Added automatically. */
  __index?: number
}

export type FormGroupFormSetting = Partial<Omit<FormProps, 'model'>>

export interface FormGroupItemContext<F extends object = FormModel> {
  item: FormGroupItem<F>
  /** Current zero-based position in `modelValue`. */
  index: number
  /** Stable identity stored in `item.__index`. */
  key: number
  list: FormGroupItem<F>[]
}

export interface FormGroupProps<F extends object = FormModel> {
  modelValue?: FormGroupItem<F>[]
  getFormSetting: (
    data: FormGroupItem<F>,
    index: number,
  ) => FormGroupFormSetting
  title?: string
  description?: string
  tabLabel?: string
  getTabLabel?: (data: FormGroupItem<F>, index: number) => string
  getContextMenuItems?: (context: FormGroupItemContext<F>) => ContextMenuItem[]
  tabsType?: TabsProps['type']
  editable?: boolean
  /** @deprecated Use `editable` instead. */
  editAble?: boolean
  showAdd?: boolean
  keepSerial?: boolean
  lazyErrorMark?: boolean
  forceRender?: boolean
  /** Item count above which tab contents are mounted lazily. */
  renderThreshold?: number
  loading?: boolean
  max?: number
  createItem?: (context: {
    list: FormGroupItem<F>[]
  }) => FormGroupItem<F> | Promise<FormGroupItem<F>>
  ariaLabel?: string
  loadingText?: string
  emptyText?: string
  errorLabel?: string
}

export const formGroupProps = buildProps({
  getFormSetting: {
    type: definePropType<FormGroupProps['getFormSetting']>(Function),
    required: true,
  },
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  tabLabel: { type: String, default: 'Item' },
  getTabLabel: {
    type: definePropType<FormGroupProps['getTabLabel']>(Function),
  },
  getContextMenuItems: {
    type: definePropType<FormGroupProps['getContextMenuItems']>(Function),
  },
  tabsType: {
    type: definePropType<TabsProps['type']>(String),
    values: ['line', 'pill', 'card', 'connected-card', 'editable-card'],
    default: 'connected-card',
  },
  editable: Boolean,
  editAble: Boolean,
  showAdd: Boolean,
  keepSerial: Boolean,
  lazyErrorMark: Boolean,
  forceRender: Boolean,
  renderThreshold: {
    type: Number,
    default: 5,
    validator: (value: number) => Number.isInteger(value) && value >= 0,
  },
  loading: Boolean,
  max: { type: Number, default: Number.POSITIVE_INFINITY },
  createItem: {
    type: definePropType<FormGroupProps['createItem']>(Function),
  },
  ariaLabel: String,
  loadingText: { type: String, default: 'Loading…' },
  emptyText: { type: String, default: 'No items' },
  errorLabel: { type: String, default: 'Validation error' },
} as const)

export type FormGroupRuntimeProps = ExtractPropTypes<typeof formGroupProps>

export interface FormGroupInstance {
  readonly activeKey: number
  readonly errorIndexes: number[]
  setActiveKey: (activeKey: number) => void
  addItem: () => Promise<FormGroupItem | undefined>
  removeItem: (index: number) => FormGroupItem | undefined
  validateAll: () => Promise<boolean>
  validate: (index: number, ignoreTabError?: boolean) => Promise<boolean>
  validateFields: (
    index: number,
    fields: string[],
    ignoreTabError?: boolean,
  ) => Promise<boolean>
  clearValidate: (index?: number, fields?: string | string[]) => void
  resetFields: (index?: number) => void
  getForm: (index: number) => FormInstance | undefined
  getErrors: {
    (): FormGroupErrors
    (index: number): Record<string, string>
  }
}

export type FormGroupErrors = Record<number, Record<string, string>>

export type FormGroupComponentInstance = InstanceType<typeof FormGroup>
