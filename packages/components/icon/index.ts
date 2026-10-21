import { withInstall } from '@vuesax-alpha/utils'

import Icon from './src/icon.vue'
import Arrow from './src/arrow.vue'
import Check from './src/check.vue'
import Close from './src/close.vue'
import Loading from './src/loading.vue'
import ControlLoading from './src/control-loading.vue'
import LogoLoading from './src/logo-loading.vue'
import Plus from './src/plus.vue'
import Star from './src/star.vue'
import StarFilled from './src/star-filled.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SIcon: SFCWithInstall<typeof Icon> = withInstall(Icon)
export default SIcon

export const IconArrow: SFCWithInstall<typeof Arrow> = withInstall(Arrow)
export const IconCheck: SFCWithInstall<typeof Check> = withInstall(Check)
export const IconClose: SFCWithInstall<typeof Close> = withInstall(Close)
export const IconLoading: SFCWithInstall<typeof Loading> = withInstall(Loading)
export const IconControlLoading: SFCWithInstall<typeof ControlLoading> =
  withInstall(ControlLoading)
export const SLogoLoading: SFCWithInstall<typeof LogoLoading> =
  withInstall(LogoLoading)
export const IconPlus: SFCWithInstall<typeof Plus> = withInstall(Plus)
export const IconStar: SFCWithInstall<typeof Star> = withInstall(Star)
export const IconStarFilled: SFCWithInstall<typeof StarFilled> =
  withInstall(StarFilled)

export * from './src/icon'
export * from './src/arrow'
export * from './src/check'
export * from './src/close'
export * from './src/loading'
export * from './src/logo-loading'
export * from './src/plus'
export * from './src/star'
