import { enSearchData } from './search'
import type { SearchDataOption } from '~/saxDesignVueTheme'

const titleZh: Record<string, string> = {
  'Time select': 'Time select',
  Playground: 'Playground',
  'Using Components': '使用组件',
  Configuration: '配置',
  'Tribute to Vuesax': '致敬 Vuesax',
}

const headerZh: Record<string, string> = {
  Default: '默认',
  Solid: '实心',
  Border: '边框',
  Shadow: '阴影',
  Gradient: '渐变',
  Relief: '浮雕',
  Animate: '动画',
  Color: '颜色',
  Icon: '图标',
  Title: '标题',
  'Hidden Content': '隐藏内容',
  Pagination: '分页',
  Footer: '页脚',
  'Progress Bar': '进度条',
  Closable: '可关闭',
  'Time Close': '定时关闭',
  Flat: '扁平',
  Transparent: '透明',
  'Icon with text': '图标与文字',
  Circle: '圆形',
  Square: '方形',
  Size: '尺寸',
  Loading: '加载',
  Block: '块级',
  Social: '社交',
  Floating: '浮动',
  Group: '分组',
  Ripple: '涟漪',
  'Fixed time ranges': '固定时间范围',
  'Time format': '时间格式',
  Disabled: '禁用',
  'Interactive demos': '交互示例',
  'Documentation layout': '文档结构',
  'Global registration': '全局注册',
  'Design lineage': '设计渊源',
}

export const zhSearchData: SearchDataOption[] = enSearchData.map((page) => ({
  ...page,
  path: `zh/${page.path}`,
  title: titleZh[page.title] || page.title,
  headers: page.headers?.map((h) => ({
    ...h,
    title: headerZh[h.title] || h.title,
  })),
}))
