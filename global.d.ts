// GlobalComponents for Volar
declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    SAlert: typeof import('sax-design-vue')['SAlert']
    SAvatar: typeof import('sax-design-vue')['SAvatar']
    SAvatarGroup: typeof import('sax-design-vue')['SAvatarGroup']
    // SBadge             : typeof import('sax-design-vue')['SBadge']
    SButton: typeof import('sax-design-vue')['SButton']
    SButtonGroup: typeof import('sax-design-vue')['SButtonGroup']
    SCard: typeof import('sax-design-vue')['SCard']
    SCardGroup: typeof import('sax-design-vue')['SCardGroup']
    SCheckbox: typeof import('sax-design-vue')['SCheckbox']
    SCheckboxGroup: typeof import('sax-design-vue')['SCheckboxGroup']
    SCol: typeof import('sax-design-vue')['SCol']
    SCollapseTransition: typeof import('sax-design-vue')['SCollapseTransition']
    SDialog: typeof import('sax-design-vue')['SDialog']
    SIcon: typeof import('sax-design-vue')['SIcon']
    SInput: typeof import('sax-design-vue')['SInput']
    SInputNumber: typeof import('sax-design-vue')['SInputNumber']
    SNavbar: typeof import('sax-design-vue')['SNavbar']
    SNavbarItem: typeof import('sax-design-vue')['SNavbarItem']
    SNavbarGroup: typeof import('sax-design-vue')['SNavbarGroup']
    SOption: typeof import('sax-design-vue')['SOption']
    SOptionGroup: typeof import('sax-design-vue')['SOptionGroup']
    SPagination: typeof import('sax-design-vue')['SPagination']
    SPopconfirm: typeof import('sax-design-vue')['SPopconfirm']
    SPopper: typeof import('sax-design-vue')['SPopper']
    SRate: typeof import('sax-design-vue')['SRate']
    SRadio: typeof import('sax-design-vue')['SRadio']
    SRow: typeof import('sax-design-vue')['SRow']
    SSelect: typeof import('sax-design-vue')['SSelect']
    SScrollbar: typeof import('sax-design-vue')['SScrollbar']
    SSwitch: typeof import('sax-design-vue')['SSwitch']
    SSidebar: typeof import('sax-design-vue')['SSidebar']
    SSidebarGroup: typeof import('sax-design-vue')['SSidebarGroup']
    SSidebarItem: typeof import('sax-design-vue')['SSidebarItem']
    STable: typeof import('sax-design-vue')['STable']
    STh: typeof import('sax-design-vue')['STh']
    STd: typeof import('sax-design-vue')['STd']
    STr: typeof import('sax-design-vue')['STr']
    STimeSelect: typeof import('sax-design-vue')['STimeSelect']
    STooltip: typeof import('sax-design-vue')['STooltip']
  }

  interface ComponentCustomProperties {
    $notification: typeof import('sax-design-vue')['SNotification']
    $prompt: typeof import('sax-design-vue')['SPromptBox']
    $loading: typeof import('sax-design-vue')['SLoadingFn']
  }
}

export {}
