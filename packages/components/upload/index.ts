import { withInstall } from '@vuesax-alpha/utils'
import Upload from './src/upload.vue'
import { pickUploadFiles } from './src/upload-picker'
import type { SFCWithInstall } from '@vuesax-alpha/utils'

export const SUpload: SFCWithInstall<
  typeof Upload,
  { pick: typeof pickUploadFiles }
> = Object.assign(withInstall(Upload), {
  pick: pickUploadFiles,
})
export default SUpload

export * from './src/upload'
export * from './src/upload-picker'
