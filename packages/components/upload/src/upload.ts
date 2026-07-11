import { buildProps, definePropType } from '@vuesax-alpha/utils'

import type { ExtractPropTypes } from 'vue'
import type Upload from './upload.vue'

export interface UploadFileItem {
  uid: number
  raw: File
  name: string
  preview?: string
  percent: number
  uploading: boolean
  error: boolean
}

export const uploadProps = buildProps({
  fileName: {
    type: String,
    default: 'file',
  },
  text: {
    type: String,
    default: 'Upload File',
  },
  textMax: {
    type: String,
    default: 'Maximum of files reached',
  },
  limit: {
    type: [Number, String],
    default: null,
  },
  action: {
    type: String,
    default: null,
  },
  headers: {
    type: definePropType<Record<string, string>>(Object),
    default: null,
  },
  data: {
    type: definePropType<Record<string, string>>(Object),
    default: null,
  },
  automatic: Boolean,
  showUploadButton: {
    type: Boolean,
    default: true,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  singleUpload: Boolean,
  accept: String,
  disabled: Boolean,
} as const)

export const uploadEmits = {
  change: (value: File[], files: File[]) => Array.isArray(value),
  'on-delete': (file: File) => file instanceof File,
  'on-success': (response: unknown) => true,
  'on-error': (error: unknown) => true,
}

export type UploadProps = ExtractPropTypes<typeof uploadProps>
export type UploadInstance = InstanceType<typeof Upload>
