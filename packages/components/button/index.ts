import { withInstall, withNoopInstall } from '@vuesax-alpha/utils'
import ButtonGroup from './src/button-group.vue'
import Button from './src/button.vue'
export { default as RendererButtons } from './src/renderer-buttons.vue'

export const SButton = withInstall(Button, {
  ButtonGroup,
})
export default SButton

export const SButtonGroup = withNoopInstall(ButtonGroup)

export * from './src/button-group'
export * from './src/button'
export * from './src/renderer-buttons'
