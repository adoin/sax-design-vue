import { h } from 'vue'
import { defineTableRenderer, renderer } from 'sax-design-vue'
import type {
  FormRendererParams,
  RendererOptions,
  TableDefaultRendererParams,
  TableGlobalEditRendererParams,
  TableGlobalFilterRendererParams,
  TableGlobalToolbarRendererParams,
} from 'sax-design-vue'
import type { VNodeChild } from 'vue'

interface User {
  id: number
  name: string
  status: 'active' | 'paused'
}

interface UserQueryForm {
  status?: User['status']
}

interface StatusOption {
  label: string
  value: User['status']
}

const defaultOptions: StatusOption[] = [
  { label: '启用', value: 'active' },
  { label: '暂停', value: 'paused' },
]

const renderStatusControl = <Model extends object>(
  options: RendererOptions<Model>,
  params: Pick<FormRendererParams<Model>, 'value' | 'disabled' | 'setValue'>,
): VNodeChild => {
  const choices =
    (options.options as StatusOption[] | undefined) ?? defaultOptions
  return h(
    'select',
    {
      value: String(params.value ?? ''),
      disabled: params.disabled,
      onChange: (event: Event) =>
        params.setValue((event.target as HTMLSelectElement).value),
    },
    choices.map((option) => h('option', { value: option.value }, option.label)),
  )
}

renderer.add(
  '$userStatus',
  defineTableRenderer<User, UserQueryForm>({
    renderDefault: (
      _options: RendererOptions<User>,
      params: TableDefaultRendererParams<User>,
    ): VNodeChild =>
      h('span', { 'data-status': params.row.status }, String(params.value)),

    renderEdit: (
      options: RendererOptions<User>,
      params: TableGlobalEditRendererParams<User>,
    ): VNodeChild => renderStatusControl(options, params),

    renderFormItem: (
      options: RendererOptions<UserQueryForm>,
      params: FormRendererParams<UserQueryForm>,
    ): VNodeChild => renderStatusControl(options, params),

    renderFilter: (
      options: RendererOptions,
      params: TableGlobalFilterRendererParams<User>,
    ): VNodeChild => renderStatusControl(options, params),

    renderToolbar: (
      _options: RendererOptions,
      params: TableGlobalToolbarRendererParams<User, UserQueryForm>,
    ): VNodeChild =>
      h(
        'span',
        `已选择：${params.source.table.getSelectedRows()[0]?.name ?? '无'}`,
      ),
  }),
)
