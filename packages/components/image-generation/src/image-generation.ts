import { buildProps, definePropType } from '@vuesax-alpha/utils'
import { useShapeProp } from '@vuesax-alpha/hooks'
import type { ExtractPropTypes } from 'vue'
import type ImageGeneration from './image-generation.vue'
import type { AgentStatus } from '../../ai-editor/src/agent-shared/types'

export const imageGenerationProps = buildProps({
  shape: useShapeProp,
  status: { type: definePropType<AgentStatus>(String), default: 'pending' },
  progress: { type: Number, default: 0 },
  src: String,
  alt: String,
  resolution: { type: String, default: '1024 × 768' },
  error: String,
  disabled: Boolean,
} as const)
export const imageGenerationEmits = {
  cancel: () => true,
  retry: () => true,
  download: (src: string) => typeof src === 'string',
  load: () => true,
  'image-error': () => true,
}
export type ImageGenerationProps = ExtractPropTypes<typeof imageGenerationProps>
export type ImageGenerationInstance = InstanceType<typeof ImageGeneration>
