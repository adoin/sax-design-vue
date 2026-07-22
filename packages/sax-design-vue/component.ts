import { SAlert } from '@vuesax-alpha/components/alert'
import { SAnchor } from '@vuesax-alpha/components/anchor'
import { SAvatar, SAvatarGroup } from '@vuesax-alpha/components/avatar'
import { SBacktop } from '@vuesax-alpha/components/backtop'
import { SBadge } from '@vuesax-alpha/components/badge'
import {
  SBreadcrumb,
  SBreadcrumbItem,
} from '@vuesax-alpha/components/breadcrumb'
import { SButton, SButtonGroup } from '@vuesax-alpha/components/button'
import { SCalendar } from '@vuesax-alpha/components/calendar'
import { SCard, SCardGroup } from '@vuesax-alpha/components/card'
import { SCarousel } from '@vuesax-alpha/components/carousel'
import { SCascader } from '@vuesax-alpha/components/cascader'
import { SCheckbox, SCheckboxGroup } from '@vuesax-alpha/components/checkbox'
import { SChip, SChips } from '@vuesax-alpha/components/chip'
import { SCol } from '@vuesax-alpha/components/col'
import { SColorPicker } from '@vuesax-alpha/components/color-picker'
import { SContextMenu } from '@vuesax-alpha/components/context-menu'
import { SCollapse, SCollapseItem } from '@vuesax-alpha/components/collapse'
import { SCollapseTransition } from '@vuesax-alpha/components/collapse-transition'
import { SCountdown } from '@vuesax-alpha/components/countdown'
import { SDatePicker } from '@vuesax-alpha/components/date-picker'
import { SDialog } from '@vuesax-alpha/components/dialog'
import { SDrawer } from '@vuesax-alpha/components/drawer'
import { SDivider } from '@vuesax-alpha/components/divider'
import { SEmpty } from '@vuesax-alpha/components/empty'
import { SForm, SFormItem } from '@vuesax-alpha/components/form'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SIconPicker } from '@vuesax-alpha/components/icon-picker'
import { SImage, SImages } from '@vuesax-alpha/components/images'
import { SImagePreview } from '@vuesax-alpha/components/image-preview'
import { SInput } from '@vuesax-alpha/components/input'
import { SInputNumber } from '@vuesax-alpha/components/input-number'
import { SLink } from '@vuesax-alpha/components/link'
import {
  SLayoutAside,
  SLayoutBody,
  SLayoutContainer,
  SLayoutFooter,
  SLayoutHeader,
} from '@vuesax-alpha/components/layout'
import { SList, SListHeader, SListItem } from '@vuesax-alpha/components/list'
import {
  SNavbar,
  SNavbarGroup,
  SNavbarItem,
} from '@vuesax-alpha/components/navbar'
import { SNoticeBar } from '@vuesax-alpha/components/notice-bar'
import { SPagination } from '@vuesax-alpha/components/pagination'
import { SPasswordInput } from '@vuesax-alpha/components/password-input'
import { SPopconfirm } from '@vuesax-alpha/components/popconfirm'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SProgress } from '@vuesax-alpha/components/progress'
import { SPulldown } from '@vuesax-alpha/components/pulldown'
import { SPrompt } from '@vuesax-alpha/components/prompt'
import { SRadio } from '@vuesax-alpha/components/radio'
import { SRate } from '@vuesax-alpha/components/rate'
import { SResult } from '@vuesax-alpha/components/result'
import { SRow } from '@vuesax-alpha/components/row'
import { SScrollbar } from '@vuesax-alpha/components/scrollbar'
import { SOption, SOptionGroup, SSelect } from '@vuesax-alpha/components/select'
import { SSegmented } from '@vuesax-alpha/components/segmented'
import {
  SSidebar,
  SSidebarGroup,
  SSidebarItem,
} from '@vuesax-alpha/components/sidebar'
import { SSlider } from '@vuesax-alpha/components/slider'
import { SSpacer } from '@vuesax-alpha/components/spacer'
import { SSplitter } from '@vuesax-alpha/components/splitter'
import { SSteps } from '@vuesax-alpha/components/steps'
import { SSwitch } from '@vuesax-alpha/components/switch'
import { STable, STd, STh, STr } from '@vuesax-alpha/components/table'
import { STab, STabs } from '@vuesax-alpha/components/tabs'
import { STag } from '@vuesax-alpha/components/tag'
import { SText } from '@vuesax-alpha/components/text'
import { STextEllipsis } from '@vuesax-alpha/components/text-ellipsis'
import { STextarea } from '@vuesax-alpha/components/textarea'
import { STree } from '@vuesax-alpha/components/tree'
import { STreeSelect } from '@vuesax-alpha/components/tree-select'
import { STimePicker } from '@vuesax-alpha/components/time-picker'
import { STimeSelect } from '@vuesax-alpha/components/time-select'
import { STooltip } from '@vuesax-alpha/components/tooltip'
import { SUpload } from '@vuesax-alpha/components/upload'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { SWatermark } from '@vuesax-alpha/components/watermark'

import type { Plugin } from 'vue'

export default [
  SAlert,
  SAnchor,
  SAvatar,
  SAvatarGroup,
  SBacktop,
  SBadge,
  SBreadcrumb,
  SBreadcrumbItem,
  SButton,
  SButtonGroup,
  SCalendar,
  SCard,
  SCardGroup,
  SCarousel,
  SCascader,
  SCheckbox,
  SCheckboxGroup,
  SChip,
  SChips,
  SCol,
  SColorPicker,
  SContextMenu,
  SCollapse,
  SCollapseItem,
  SCollapseTransition,
  SCountdown,
  SDatePicker,
  SDialog,
  SDrawer,
  SDivider,
  SEmpty,
  SForm,
  SFormItem,
  SIcon,
  SIconPicker,
  SImage,
  SImages,
  SImagePreview,
  SInput,
  SInputNumber,
  SLink,
  SLayoutContainer,
  SLayoutHeader,
  SLayoutAside,
  SLayoutBody,
  SLayoutFooter,
  SList,
  SListHeader,
  SListItem,
  SOptionGroup,
  SOption,
  SNavbar,
  SNavbarGroup,
  SNavbarItem,
  SNoticeBar,
  SPagination,
  SPasswordInput,
  SPopconfirm,
  SPopper,
  SProgress,
  SPulldown,
  SPrompt,
  SRadio,
  SRate,
  SResult,
  SRow,
  SScrollbar,
  SSelect,
  SSegmented,
  SSwitch,
  SSidebar,
  SSidebarGroup,
  SSidebarItem,
  SSlider,
  SSpacer,
  SSplitter,
  SSteps,
  STable,
  STd,
  STh,
  STr,
  STab,
  STabs,
  STag,
  SText,
  STextEllipsis,
  STextarea,
  STree,
  STreeSelect,
  STimePicker,
  STimeSelect,
  STooltip,
  SUpload,
  SVirtualList,
  SWatermark,
] as Plugin[]
