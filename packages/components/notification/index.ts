import { withInstallFunction } from '@vuesax-alpha/utils'
import Notification from './src/notify'

export const SNotification = withInstallFunction(Notification, '$notification')
export default SNotification

export * from './src/notification'
