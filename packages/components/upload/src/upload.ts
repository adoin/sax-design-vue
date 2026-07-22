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
  success?: boolean
  response?: unknown
}

export interface UploadMethodParams {
  file: File
  option: UploadFileItem
  updateProgress: (percent: number) => void
}

export const uploadProps = buildProps({
  modelValue: {
    type: definePropType<File | File[] | null>([Object, Array]),
  },
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
  /** VXE-compatible alias of `automatic`. */
  autoSubmit: Boolean,
  readonly: Boolean,
  showList: {
    type: Boolean,
    default: true,
  },
  mode: {
    type: String,
    values: ['all', 'image'] as const,
    default: 'all',
  },
  fileTypes: {
    type: definePropType<string[]>(Array),
    default: () => [],
  },
  limitSize: {
    type: [Number, String],
  },
  /** VXE-compatible alias of `limit`. */
  limitCount: {
    type: [Number, String],
  },
  showTip: Boolean,
  tipText: String,
  buttonText: String,
  showButtonText: {
    type: Boolean,
    default: true,
  },
  showButtonIcon: {
    type: Boolean,
    default: true,
  },
  showRemoveButton: {
    type: Boolean,
    default: true,
  },
  showPreview: {
    type: Boolean,
    default: true,
  },
  showProgress: {
    type: Boolean,
    default: true,
  },
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  beforeSelectMethod: {
    type: definePropType<
      (params: { file: File }) => boolean | Promise<boolean>
    >(Function),
  },
  beforeRemoveMethod: {
    type: definePropType<
      (params: { option: UploadFileItem }) => boolean | Promise<boolean>
    >(Function),
  },
  uploadMethod: {
    type: definePropType<
      (params: UploadMethodParams) => unknown | Promise<unknown>
    >(Function),
  },
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
  'update:modelValue': (value: File | File[] | null) =>
    value === null || value instanceof File || Array.isArray(value),
  change: (value: File[], files: File[]) =>
    Array.isArray(value) && Array.isArray(files),
  add: (file: UploadFileItem, files: UploadFileItem[]) =>
    file instanceof Object && Array.isArray(files),
  remove: (file: UploadFileItem, files: UploadFileItem[]) =>
    file instanceof Object && Array.isArray(files),
  'on-delete': (file: File) => file instanceof File,
  'on-success': (response: unknown) => Object.is(response, response),
  'on-error': (error: unknown) => Object.is(error, error),
  'upload-start': (file: UploadFileItem) => file instanceof Object,
  'upload-success': (file: UploadFileItem, response: unknown) =>
    file instanceof Object && Object.is(response, response),
  'upload-error': (file: UploadFileItem, error: unknown) =>
    file instanceof Object && Object.is(error, error),
  'upload-end': (file: UploadFileItem) => file instanceof Object,
  'upload-queue-start': (files: UploadFileItem[]) => Array.isArray(files),
  'upload-queue-end': (files: UploadFileItem[]) => Array.isArray(files),
}

export type UploadProps = ExtractPropTypes<typeof uploadProps>
export type UploadInstance = InstanceType<typeof Upload>
