export interface TableDocumentationSection {
  slug: string
  title: string
  titleZh: string
}

export const tableDocumentationSections: TableDocumentationSection[] = [
  {
    slug: 'data-and-column-definitions',
    title: 'Data and column definitions',
    titleZh: '数据与列定义',
  },
  { slug: 'row-selection', title: 'Row selection', titleZh: '行选择' },
  {
    slug: 'sorting-and-filtering',
    title: 'Sorting and filtering',
    titleZh: '排序与筛选',
  },
  {
    slug: 'trees-and-groups',
    title: 'Trees and groups',
    titleZh: '树形与分组',
  },
  {
    slug: 'header-structures',
    title: 'Header structures',
    titleZh: '表头结构',
  },
  {
    slug: 'footers-and-summaries',
    title: 'Footers and summaries',
    titleZh: '表尾与汇总',
  },
  { slug: 'row-expansion', title: 'Row expansion', titleZh: '行展开' },
  {
    slug: 'editing-validation-and-changes',
    title: 'Editing, validation, and changes',
    titleZh: '编辑、校验与变更',
  },
  {
    slug: 'spreadsheet-interactions',
    title: 'Spreadsheet interactions',
    titleZh: '表格式交互',
  },
  {
    slug: 'column-layout-and-management',
    title: 'Column layout and management',
    titleZh: '列布局与管理',
  },
  { slug: 'merged-cells', title: 'Merged cells', titleZh: '单元格合并' },
  {
    slug: 'large-data-and-visualization',
    title: 'Large data and visualization',
    titleZh: '大数据与可视化',
  },
  {
    slug: 'query-forms-and-request-proxy',
    title: 'Query forms and request proxy',
    titleZh: '查询表单与请求代理',
  },
]

export const tableDocumentationPath = (locale: 'en' | 'zh') =>
  `${locale === 'zh' ? '/zh' : ''}/components/table.html`

export const tableDocumentationSectionPath = (
  locale: 'en' | 'zh',
  slug: string,
) => `${locale === 'zh' ? '/zh' : ''}/components/table/${slug}.html`

export const tableDocumentationLandingPath = (locale: 'en' | 'zh') =>
  tableDocumentationSectionPath(locale, tableDocumentationSections[0].slug)

export const resolveTableDocumentationOverviewRedirect = (
  path: string,
  hash = '',
) => {
  if (hash) return
  if (path === '/components/table' || path === '/components/table.html')
    return tableDocumentationLandingPath('en')
  if (path === '/zh/components/table' || path === '/zh/components/table.html')
    return tableDocumentationLandingPath('zh')
}

export const shouldPreserveTableDocumentationApiHash = (
  to: { path: string; hash?: string },
  from: { path: string; hash?: string },
  activeHeaderScroll: boolean,
) =>
  activeHeaderScroll &&
  !to.hash &&
  from.hash === '#api' &&
  to.path === from.path &&
  (to.path === '/components/table' ||
    to.path === '/components/table.html' ||
    to.path === '/zh/components/table' ||
    to.path === '/zh/components/table.html')

export const tableDocumentationSectionSlug = (path: string) =>
  path.match(/\/components\/table\/([^/]+)\.html$/)?.[1]

export const isTableDocumentationPath = (path: string) =>
  /\/components\/table(?:\.html|\/[^/]+\.html)$/.test(path)
