import { SUpload } from 'sax-design-vue'
import type {
  SAgentEditor,
  SButton,
  SFileManager,
  SWindow,
  pickUploadFiles,
} from 'sax-design-vue'

export const uploadPicker: typeof pickUploadFiles = SUpload.pick
export function inspectUploadResults() {
  const multiple: Promise<File[] | undefined> = SUpload.pick({ multiple: true })
  const single: Promise<File | undefined> = SUpload.pick()
  return { multiple, single }
}

type Props<Component> = Component extends new (...args: never[]) => {
  $props: infer Value
}
  ? Value
  : never
type IsAny<Value> = 0 extends 1 & Value ? true : false
type MustBeFalse<Value extends false> = Value
export type WindowPropsAreTyped = MustBeFalse<IsAny<Props<typeof SWindow>>>
export type FileManagerViewIsTyped = MustBeFalse<
  IsAny<Props<typeof SFileManager>['view']>
>
export const windowProps: Props<typeof SWindow> = { shape: 'square' }
export const fileManagerProps: Props<typeof SFileManager> = {
  view: 'list',
  behavior: { dragDrop: false },
}
// @ts-expect-error Unknown shapes must not become valid when declarations are compacted.
export const invalidWindow: Props<typeof SWindow> = { shape: 'triangle' }
// @ts-expect-error Unknown views must not become valid at the public export boundary.
export const invalidManager: Props<typeof SFileManager> = { view: 'cards' }
declare const window: InstanceType<typeof SWindow>
window.$emit('update:rect', { x: 1, y: 2, width: 300, height: 200 })
// @ts-expect-error Event payloads retain their exact structure.
window.$emit('update:rect', { x: 1 })
// @ts-expect-error Private setup state is not part of the public instance.
export const privateSetup = window.props
type EditorToolbar = Parameters<
  NonNullable<InstanceType<typeof SAgentEditor>['$slots']['toolbar']>
>[0]
export type ToolbarSelectionIsTyped = MustBeFalse<
  IsAny<EditorToolbar['selection']>
>
// @ts-expect-error Slot payloads must retain concrete selection types.
export const invalidSelection: EditorToolbar['selection'] = {
  start: 'wrong',
  end: 0,
  text: '',
}
export type ButtonGroupProps = Props<typeof SButton.ButtonGroup>

type FileToolbar = Parameters<
  NonNullable<InstanceType<typeof SFileManager>['$slots']['toolbar']>
>[0]
export type FileToolbarSearchIsTyped = MustBeFalse<IsAny<FileToolbar['search']>>
export function useFileToolbar(tools: FileToolbar) {
  tools.setSearch('folder')
  tools.setView('list')
  tools.toggleView()
  tools.setShowHidden(true)
  tools.setSort({ key: 'name', order: 'descending' })
  // @ts-expect-error Sort directions remain concrete.
  tools.setSort({ key: 'name', order: 'backward' })
}
