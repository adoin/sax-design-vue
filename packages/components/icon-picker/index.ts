import { withInstallFunction } from '@vuesax-alpha/utils'
import iconPicker from './src/icon-picker-service'

export const SIconPicker = withInstallFunction(iconPicker, '$iconPicker')
export const openIconPicker = SIconPicker
export default SIconPicker
export * from './src/icon-picker'
export * from './src/icon-picker-service'
