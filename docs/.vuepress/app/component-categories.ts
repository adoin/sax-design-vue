import type { SidebarItem } from '~/shared/client/nav'

export type ComponentCategoryKey =
  | 'general'
  | 'layout'
  | 'navigation'
  | 'data-entry'
  | 'data-display'
  | 'feedback'
  | 'other'

interface ComponentItem extends SidebarItem {
  meaning: string
}

export interface ComponentCategory {
  key: ComponentCategoryKey
  text: string
  textZh: string
  children: ComponentItem[]
}

const component = (
  text: string,
  meaning: string,
  link: string,
): ComponentItem => ({ text, meaning, link })

/**
 * Component information architecture shared by the navbar and both sidebars.
 * Keep entries alphabetical inside each category so the list remains scannable.
 */
export const componentCategories: ComponentCategory[] = [
  {
    key: 'general',
    text: 'General',
    textZh: '通用',
    children: [
      component('Button', '按钮', '/components/'),
      component('Link', '链接', '/components/link'),
      component('Text', '文本', '/components/text'),
      component('Text ellipsis', '文本省略', '/components/text-ellipsis'),
    ],
  },
  {
    key: 'layout',
    text: 'Layout',
    textZh: '布局',
    children: [
      component('Divider', '分割线', '/components/divider'),
      component('Grid', '栅格', '/layout/'),
      component('Layout', '布局', '/components/layout'),
      component('Spacer', '间隔', '/components/spacer'),
      component('Splitter', '分割面板', '/components/splitter'),
    ],
  },
  {
    key: 'navigation',
    text: 'Navigation',
    textZh: '导航',
    children: [
      component('Affix', '固钉', '/components/affix'),
      component('Anchor', '锚点', '/components/anchor'),
      component('Backtop', '回到顶部', '/components/backtop'),
      component('Breadcrumb', '面包屑', '/components/breadcrumb'),
      component('Menu', '菜单', '/components/menu'),
      component('Navbar', '导航栏', '/components/navbar'),
      component('Pagination', '分页', '/components/pagination'),
      component('Sidebar', '侧边栏', '/components/sidebar'),
      component('Steps', '步骤条', '/components/steps'),
      component('Tabs', '标签页', '/components/tabs'),
    ],
  },
  {
    key: 'data-entry',
    text: 'Data Entry',
    textZh: '数据录入',
    children: [
      component('Cascader', '级联选择器', '/components/cascader'),
      component('Checkbox', '复选框', '/components/checkbox'),
      component('Color picker', '颜色选择器', '/components/color-picker'),
      component('Control group', '连续控件', '/components/control-group'),
      component('Date picker', '日期选择器', '/components/date-picker'),
      component('Form', '表单', '/components/form'),
      component('Form group', '表单分组', '/components/form-group'),
      component('Icon picker', '图标选择器', '/components/icon-picker'),
      component('Input', '输入框', '/components/input'),
      component('Radio', '单选框', '/components/radio'),
      component('Rate', '评分', '/components/rate'),
      component('Segmented', '分段控制', '/components/segmented'),
      component('Select', '选择器', '/components/select'),
      component('Slider', '滑块', '/components/slider'),
      component('Switch', '开关', '/components/switch'),
      component('Textarea', '文本域', '/components/textarea'),
      component('Time picker', '时间选择器', '/components/time-picker'),
      component('Time select', '时间选择', '/components/time-select'),
      component('Tree select', '树形选择器', '/components/tree-select'),
      component('Upload', '上传', '/components/upload'),
      component(
        'Verification code',
        '验证码输入',
        '/components/verification-code',
      ),
    ],
  },
  {
    key: 'data-display',
    text: 'Data Display',
    textZh: '数据展示',
    children: [
      component('Avatar', '头像', '/components/avatar'),
      component('Badge', '徽标', '/components/badge'),
      component('Calendar', '日历', '/components/calendar'),
      component('Card', '卡片', '/components/card'),
      component('Carousel', '轮播图', '/components/carousel'),
      component('Chip', '标签块', '/components/chip'),
      component('Collapse', '折叠面板', '/components/collapse'),
      component('Countdown', '倒计时', '/components/countdown'),
      component('Date panel', '日期面板', '/components/date-panel'),
      component('Image preview', '图片预览', '/components/image-preview'),
      component('Images', '图片', '/components/images'),
      component('List', '列表', '/components/list'),
      component('Table', '表格', '/components/table'),
      component('Tag', '标签', '/components/tag'),
      component('Tree', '树形控件', '/components/tree'),
      component('Virtual list', '虚拟列表', '/components/virtual-list'),
    ],
  },
  {
    key: 'feedback',
    text: 'Feedback',
    textZh: '反馈',
    children: [
      component('Alert', '警告提示', '/components/alert'),
      component('Dialog', '对话框', '/components/dialog'),
      component('Drawer', '抽屉', '/components/drawer'),
      component('Empty', '空状态', '/components/empty'),
      component('Loading', '加载', '/components/loading'),
      component('Notice bar', '公告栏', '/components/notice-bar'),
      component('Notification', '通知', '/components/notification'),
      component('Progress', '进度条', '/components/progress'),
      component('Prompt', '提示框', '/components/prompt'),
      component('Result', '结果', '/components/result'),
      component('Tooltip', '文字提示', '/components/tooltip'),
    ],
  },
  {
    key: 'other',
    text: 'Other',
    textZh: '其他',
    children: [
      component('Context menu', '右键菜单', '/components/context-menu'),
      component('Popper', '浮层', '/components/popper'),
      component('Print', '打印', '/components/print'),
      component('Print page break', '打印分页', '/components/print-page-break'),
      component('Pulldown', '下拉容器', '/components/pulldown'),
      component('Scrollbar', '滚动条', '/components/scrollbar'),
      component('Watermark', '水印', '/components/watermark'),
    ],
  },
]

export const enComponentCategories = componentCategories.map((category) => ({
  text: category.text,
  children: category.children.map(({ text, link }) => ({ text, link })),
}))

export const zhComponentCategories = componentCategories.map((category) => ({
  text: category.textZh,
  children: category.children.map(({ text, meaning, link }) => ({
    text: `${text}（${meaning}）`,
    link: `/zh${link}`,
  })),
}))
