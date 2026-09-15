import { computed } from 'vue'
import { defineTableRenderer, renderer } from 'sax-design-vue'
import type {
  FormItemRenderOptions,
  RendererOptions,
  SaxGridSetting,
  TableColumn,
  TableEmitFn,
  TableInstance,
} from 'sax-design-vue'

interface User {
  id: number
  name: string
  age: number
  status: 'active' | 'paused'
  children?: User[]
  profile?: {
    city: string
    address: { postalCode: string }
  }
}

interface UserQueryForm {
  keyword: string
  minimumAge?: number
}

const queryForm: UserQueryForm = { keyword: '' }
const rendererOptions: RendererOptions<User> = { name: '$input' }
const legacyRendererOptions: FormItemRenderOptions<User> = rendererOptions

export const tableOptions = computed<SaxGridSetting<User, UserQueryForm>>(
  () => ({
    data: [{ id: 1, name: 'Ada', age: 36, status: 'active' }],
    rowKey: (row) => row.id,
    columns: [
      {
        field: 'name',
        title: 'Name',
        cell: ({ row }) => row.name.toUpperCase(),
        slots: {
          default: ({ row }) => row.status,
        },
        editor: {
          editableMethod: ({ row }) => row.id > 0,
        },
        renderer: {
          name: '$input',
          events: {
            change: (params) => ('row' in params ? params.row.name : ''),
          },
        },
        filterMethod: ({ row }) => row.status === 'active',
      },
    ],
    renderers: {
      $user: {
        cell: ({ row }) => row.name,
        edit: ({ draftRow }) => draftRow.age,
      },
    },
    rowClass: ({ row }) => (row.status === 'active' ? 'is-active' : ''),
    selectionConfig: {
      selectableMethod: ({ row }) => row.age >= 18,
    },
    detailConfig: {
      expandableMethod: ({ row }) => row.status === 'active',
    },
    editConfig: {
      editableMethod: ({ row }) => row.age >= 18,
    },
    rowDragConfig: {
      draggableMethod: ({ row }) => row.status !== 'paused',
    },
    clipboardConfig: {
      writableMethod: ({ row }) => row.age >= 18,
    },
    findConfig: {
      replaceableMethod: ({ row }) => row.status === 'active',
    },
    treeConfig: {
      children: 'children',
      hasChildren: (row) => Boolean(row.children?.length),
      load: async ({ row }) => row.children ?? [],
    },
    groupConfig: {
      fields: [
        {
          field: 'status',
          value: (row) => row.status,
        },
      ],
      aggregates: [
        {
          key: 'age',
          field: 'age',
          method: (cells) => cells.reduce((sum, cell) => sum + cell.row.age, 0),
        },
      ],
    },
    footerConfig: {
      rows: [
        {
          aggregates: [
            {
              key: 'age',
              field: 'age',
              method: (cells) => {
                cells[0]?.row.name.toUpperCase()
                // @ts-expect-error Footer aggregate rows retain the User contract.
                return cells[0]?.row.missingField ?? ''
              },
            },
          ],
        },
      ],
    },
    queryConfig: {
      model: queryForm,
      items: [
        {
          field: 'keyword',
          title: 'Keyword',
          visibleMethod: ({ model }) => model.minimumAge !== 0,
          itemRender: {
            name: '$input',
            events: {
              change: (params) => params.model.keyword,
            },
          },
        },
      ],
    },
    proxyConfig: {
      query: async ({ form }) => {
        form.keyword.toUpperCase()
        return { data: [], total: 0 }
      },
      save: async ({ form, changes }) => {
        form.minimumAge?.toFixed()
        changes.updated[0]?.row.name.toUpperCase()
      },
      delete: async ({ form, rows }) => {
        form.keyword.toUpperCase()
        rows[0]?.name.toUpperCase()
      },
    },
    toolbarConfig: {
      left: [
        {
          itemRender: 'button',
          content: ({ table, context }) =>
            `${table.getSelectedRows()[0]?.name ?? ''}${context.form.keyword}`,
        },
      ],
    },
    onRowClick: (row) => row.name.toUpperCase(),
    onCellClick: ({ row }) => row.age.toFixed(),
    onEditCommit: ({ updatedRow }) => updatedRow.status,
    onSelectionChange: (rows) => rows.map((row) => row.id),
    onQuery: ({ form }) => form.keyword.toUpperCase(),
    onToolbarClick: (_code, { form }) => form.minimumAge?.toFixed(),
    'onUpdate:data': (rows) => rows.map((row) => row.name),
  }),
)

const column: TableColumn<User> = {
  field: 'status',
  cell: ({ row }) => row.status,
}

const nestedColumns: TableColumn<User>[] = [
  { field: 'profile.city' },
  { field: 'profile.address.postalCode' },
]

// @ts-expect-error User rows require a numeric id.
const invalidData: SaxGridSetting<User> = { data: [{ id: '1' }] }

const invalidColumn: TableColumn<User> = {
  // @ts-expect-error Cell callbacks receive User, not an untyped record.
  cell: ({ row }) => row.unknownField,
}

const invalidField: TableColumn<User> = {
  // @ts-expect-error Column fields are constrained by User, including nested paths.
  field: 'unknownField',
}

const invalidQueryField: SaxGridSetting<User, UserQueryForm> = {
  queryConfig: {
    model: queryForm,
    items: [
      {
        // @ts-expect-error Query item fields are constrained by UserQueryForm.
        field: 'missingQueryField',
      },
    ],
  },
}

const invalidSortField: SaxGridSetting<User> = {
  sortBy: [
    {
      // @ts-expect-error Sort fields are constrained by User.
      field: 'missingSortField',
      order: 'asc',
    },
  ],
}

const recordableFallback: SaxGridSetting = {
  columns: [
    {
      field: 'runtimeField',
      cell: ({ row }) => row.runtimeField,
    },
  ],
}

renderer.add(
  '$typedUser',
  defineTableRenderer<User, UserQueryForm>({
    renderDefault: (_options, params) => params.row.name,
    renderEdit: (_options, params) => params.draftRow.status,
    renderFormItem: (_options, params) => params.model.keyword,
    renderFilter: (_options, params) => params.column.field,
    renderToolbar: (_options, params) =>
      params.source.table.getSelectedRows()[0]?.age,
  }),
)

declare const table: TableInstance<User, UserQueryForm>
declare const emit: TableEmitFn<User, UserQueryForm>
table.getSelectedRows()[0]?.name.toUpperCase()
table.getQueryContext().form.keyword.toUpperCase()
table.commitProxy('delete', [{ id: 2, name: 'Lin', age: 28, status: 'paused' }])
emit('rowClick', table.getSelectedRows()[0]!, new MouseEvent('click'))
emit('query', table.getQueryContext())

// @ts-expect-error Table methods retain the User row contract.
table.setSelectedRows([{ id: 'wrong' }])

export {
  column,
  invalidColumn,
  invalidData,
  invalidField,
  invalidQueryField,
  invalidSortField,
  legacyRendererOptions,
  nestedColumns,
  recordableFallback,
  rendererOptions,
}
