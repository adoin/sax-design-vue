import { withInstall } from '@vuesax-alpha/utils'
import FileManager from './src/file-manager.vue'
import type { SFCWithInstall } from '@vuesax-alpha/utils'
import type { FileManagerComponent } from './src/types'
export const SFileManager: SFCWithInstall<FileManagerComponent> = withInstall(
  FileManager,
) as unknown as SFCWithInstall<FileManagerComponent>
export default SFileManager
export type * from './src/types'
export { fileManagerProps } from './src/file-manager'
export type FileManagerInstance = InstanceType<FileManagerComponent>
