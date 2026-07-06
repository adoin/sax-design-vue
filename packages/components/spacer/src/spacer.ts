import { buildProps } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Spacer from './spacer.vue'

export const spacerProps = buildProps({} as const)

export type SpacerProps = ExtractPropTypes<typeof spacerProps>
export type SpacerInstance = InstanceType<typeof Spacer>
