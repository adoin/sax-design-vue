import { withInstall, withInstallFunction } from '@vuesax-alpha/utils'
import Dialog from './src/dialog.vue'
import dialogBox from './src/dialog-box'

export const SDialogBox = withInstallFunction(dialogBox, '$dialog')
export * from './src/dialog-box'

export const SDialog = withInstall(Dialog)
export default SDialog

export * from './src/dialog'
