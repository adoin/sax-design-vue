// For this project development
import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  // GlobalComponents for Volar
  export interface GlobalComponents {
    SAlert: typeof import('../packages/sax-design-vue')['SAlert']
    SAvatar: typeof import('../packages/sax-design-vue')['SAvatar']
    SAvatarGroup: typeof import('../packages/sax-design-vue')['SAvatarGroup']
    SBadge: typeof import('../packages/sax-design-vue')['SBadge']
    SButton: typeof import('../packages/sax-design-vue')['SButton']
    SButtonGroup: typeof import('../packages/sax-design-vue')['SButtonGroup']
    SCard: typeof import('../packages/sax-design-vue')['SCard']
    SCardGroup: typeof import('../packages/sax-design-vue')['SCardGroup']
    SCheckbox: typeof import('../packages/sax-design-vue')['SCheckbox']
    SCheckboxGroup: typeof import('../packages/sax-design-vue')['SCheckboxGroup']
    SCol: typeof import('../packages/sax-design-vue')['SCol']
    SCollapseTransition: typeof import('../packages/sax-design-vue')['SCollapseTransition']
    SDialog: typeof import('../packages/sax-design-vue')['SDialog']
    SIcon: typeof import('../packages/sax-design-vue')['SIcon']
    SInput: typeof import('../packages/sax-design-vue')['SInput']
    SInputNumber: typeof import('../packages/sax-design-vue')['SInputNumber']
    SNavbar: typeof import('../packages/sax-design-vue')['SNavbar']
    SNavbarItem: typeof import('../packages/sax-design-vue')['SNavbarItem']
    SNavbarGroup: typeof import('../packages/sax-design-vue')['SNavbarGroup']
    SOption: typeof import('../packages/sax-design-vue')['SOption']
    SOptionGroup: typeof import('../packages/sax-design-vue')['SOptionGroup']
    SPagination: typeof import('../packages/sax-design-vue')['SPagination']
    SPopconfirm: typeof import('../packages/sax-design-vue')['SPopconfirm']
    SPopper: typeof import('../packages/sax-design-vue')['SPopper']
    SRate: typeof import('../packages/sax-design-vue')['SRate']
    SRadio: typeof import('../packages/sax-design-vue')['SRadio']
    SRow: typeof import('../packages/sax-design-vue')['SRow']
    SScrollbar: typeof import('../packages/sax-design-vue')['SScrollbar']
    SSelect: typeof import('../packages/sax-design-vue')['SSelect']
    SSidebarGroup: typeof import('../packages/sax-design-vue')['SSidebarGroup']
    SSidebarItem: typeof import('../packages/sax-design-vue')['SSidebarItem']
    SSidebar: typeof import('../packages/sax-design-vue')['SSidebar']
    SSwitch: typeof import('../packages/sax-design-vue')['SSwitch']
    STable: typeof import('../packages/sax-design-vue')['STable']
    STh: typeof import('../packages/sax-design-vue')['STh']
    STd: typeof import('../packages/sax-design-vue')['STd']
    STr: typeof import('../packages/sax-design-vue')['STr']
    STimeSelect: typeof import('../packages/sax-design-vue')['STimeSelect']
    STooltip: typeof import('../packages/sax-design-vue')['STooltip']
  }

  interface ComponentCustomProperties {
    $notification: typeof import('../packages/sax-design-vue')['SNotification']
    $prompt: typeof import('../packages/sax-design-vue')['SPromptBox']
    $loading: typeof import('../packages/sax-design-vue')['SLoadingFn']
  }
}

export {}
