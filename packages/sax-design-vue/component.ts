import { SAlert } from '@vuesax-alpha/components/alert'
import { SAffix } from '@vuesax-alpha/components/affix'
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
import { SCol } from '@vuesax-alpha/components/col'
import { SColorPicker } from '@vuesax-alpha/components/color-picker'
import { SConfigProvider } from '@vuesax-alpha/components/config-provider'
import { SContextMenu } from '@vuesax-alpha/components/context-menu'
import { SControlGroup } from '@vuesax-alpha/components/control-group'
import { SCollapse, SCollapseItem } from '@vuesax-alpha/components/collapse'
import { SCollapseTransition } from '@vuesax-alpha/components/collapse-transition'
import { SCountdown } from '@vuesax-alpha/components/countdown'
import { SDatePanel, SDatePicker } from '@vuesax-alpha/components/date-picker'
import { SDialog } from '@vuesax-alpha/components/dialog'
import { SDrawer } from '@vuesax-alpha/components/drawer'
import { SDivider } from '@vuesax-alpha/components/divider'
import { SEmpty } from '@vuesax-alpha/components/empty'
import { SForm, SFormGroup, SFormItem } from '@vuesax-alpha/components/form'
import { SIcon } from '@vuesax-alpha/components/icon'
import { SImage, SImages } from '@vuesax-alpha/components/images'
import { SImagePreview } from '@vuesax-alpha/components/image-preview'
import { SInput } from '@vuesax-alpha/components/input'
import { SInputNumber } from '@vuesax-alpha/components/input-number'
import { SLink } from '@vuesax-alpha/components/link'
import {
  SLayout,
  SLayoutAside,
  SLayoutBody,
  SLayoutContainer,
  SLayoutFooter,
  SLayoutHeader,
} from '@vuesax-alpha/components/layout'
import { SList, SListHeader, SListItem } from '@vuesax-alpha/components/list'
import { SMenu } from '@vuesax-alpha/components/menu'
import {
  SNavbar,
  SNavbarGroup,
  SNavbarItem,
} from '@vuesax-alpha/components/navbar'
import { SNoticeBar } from '@vuesax-alpha/components/notice-bar'
import { SPagination } from '@vuesax-alpha/components/pagination'
import { SPopconfirm } from '@vuesax-alpha/components/popconfirm'
import { SPopper } from '@vuesax-alpha/components/popper'
import { SProgress } from '@vuesax-alpha/components/progress'
import { SPrint } from '@vuesax-alpha/components/print'
import { SPrintPageBreak } from '@vuesax-alpha/components/print-page-break'
import { SPrompt } from '@vuesax-alpha/components/prompt'
import { SRadio, SRadioGroup } from '@vuesax-alpha/components/radio'
import { SRadioButton } from '@vuesax-alpha/components/radio-button'
import { SRate } from '@vuesax-alpha/components/rate'
import { SResult } from '@vuesax-alpha/components/result'
import { SRow } from '@vuesax-alpha/components/row'
import { SScrollbar } from '@vuesax-alpha/components/scrollbar'
import { SOption, SOptionGroup, SSelect } from '@vuesax-alpha/components/select'
import {
  SSidebar,
  SSidebarGroup,
  SSidebarItem,
} from '@vuesax-alpha/components/sidebar'
import { SSlider } from '@vuesax-alpha/components/slider'
import { SSpacer } from '@vuesax-alpha/components/spacer'
import { SSplitter, SSplitterItem } from '@vuesax-alpha/components/splitter'
import { SSteps } from '@vuesax-alpha/components/steps'
import { SSwitch } from '@vuesax-alpha/components/switch'
import { STable, STableColumn } from '@vuesax-alpha/components/table'
import { STableGrid } from '@vuesax-alpha/components/table-grid'
import { STableSelect } from '@vuesax-alpha/components/table-select'
import { STab, STabs } from '@vuesax-alpha/components/tabs'
import { STag, STagGroup } from '@vuesax-alpha/components/tag'
import { SText } from '@vuesax-alpha/components/text'
import { STextEllipsis } from '@vuesax-alpha/components/text-ellipsis'
import { STextarea } from '@vuesax-alpha/components/textarea'
import { STimePicker } from '@vuesax-alpha/components/time-picker'
import { STimeSelect } from '@vuesax-alpha/components/time-select'
import { STooltip } from '@vuesax-alpha/components/tooltip'
import { SUpload } from '@vuesax-alpha/components/upload'
import { SVirtualList } from '@vuesax-alpha/components/virtual-list'
import { SWatermark } from '@vuesax-alpha/components/watermark'
import { SVerificationCode } from '@vuesax-alpha/components/verification-code'

import type { Plugin } from 'vue'

export default [
  SAlert,
  SAffix,
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
  SCol,
  SColorPicker,
  SConfigProvider,
  SContextMenu,
  SControlGroup,
  SCollapse,
  SCollapseItem,
  SCollapseTransition,
  SCountdown,
  SDatePicker,
  SDatePanel,
  SDialog,
  SDrawer,
  SDivider,
  SEmpty,
  SForm,
  SFormItem,
  SFormGroup,
  SIcon,
  SImage,
  SImages,
  SImagePreview,
  SInput,
  SInputNumber,
  SLink,
  SLayout,
  SLayoutContainer,
  SLayoutHeader,
  SLayoutAside,
  SLayoutBody,
  SLayoutFooter,
  SList,
  SListHeader,
  SListItem,
  SMenu,
  SOptionGroup,
  SOption,
  SNavbar,
  SNavbarGroup,
  SNavbarItem,
  SNoticeBar,
  SPagination,
  SPopconfirm,
  SPopper,
  SProgress,
  SPrint,
  SPrintPageBreak,
  SPrompt,
  SRadio,
  SRadioGroup,
  SRadioButton,
  SRate,
  SResult,
  SRow,
  SScrollbar,
  SSelect,
  SSwitch,
  SSidebar,
  SSidebarGroup,
  SSidebarItem,
  SSlider,
  SSpacer,
  SSplitter,
  SSplitterItem,
  SSteps,
  STable,
  STableColumn,
  STableGrid,
  STableSelect,
  STab,
  STabs,
  STag,
  STagGroup,
  SText,
  STextEllipsis,
  STextarea,
  STimePicker,
  STimeSelect,
  STooltip,
  SUpload,
  SVirtualList,
  SWatermark,
  SVerificationCode,
] as Plugin[]
