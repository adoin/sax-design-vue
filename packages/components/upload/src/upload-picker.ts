import { isClient } from '@vuesax-alpha/utils'
import { matchesUploadAccept, normalizeUploadAccept } from './upload-utils'
import type { UploadRejectReason } from './upload'

export type UploadPickErrorReason = UploadRejectReason | 'unsupported'

export interface UploadPickOptions {
  accept?: string | string[]
  multiple?: boolean
  directory?: boolean
  capture?: boolean | 'user' | 'environment'
  limit?: number
  limitSize?: number
  signal?: AbortSignal
  beforeSelectMethod?: (params: { file: File }) => boolean | Promise<boolean>
}

export class UploadPickError extends Error {
  readonly reason: UploadPickErrorReason
  readonly file?: File
  readonly files: File[]

  constructor(
    reason: UploadPickErrorReason,
    message: string,
    options: { file?: File; files?: File[] } = {},
  ) {
    super(message)
    this.name = 'UploadPickError'
    this.reason = reason
    this.file = options.file
    this.files = options.files || []
  }
}

export interface PickUploadFiles {
  (
    options: UploadPickOptions & ({ multiple: true } | { directory: true }),
  ): Promise<File[] | undefined>
  (
    options?: UploadPickOptions & { multiple?: false; directory?: false },
  ): Promise<File | undefined>
  (options?: UploadPickOptions): Promise<File | File[] | undefined>
}

const validatePickedFiles = async (
  files: File[],
  options: UploadPickOptions,
) => {
  if (options.limit && files.length > options.limit) {
    throw new UploadPickError(
      'limit',
      `Maximum of ${options.limit} files reached`,
      { files },
    )
  }

  for (const file of files) {
    if (!matchesUploadAccept(file, options.accept)) {
      throw new UploadPickError(
        'type',
        `File type is not accepted: ${file.name}`,
        { file, files },
      )
    }
    if (options.limitSize && file.size > options.limitSize * 1024 * 1024) {
      throw new UploadPickError(
        'size',
        `File exceeds ${options.limitSize} MB limit`,
        { file, files },
      )
    }
    if (options.beforeSelectMethod) {
      let allowed = false
      try {
        allowed = await options.beforeSelectMethod({ file })
      } catch (error) {
        throw new UploadPickError(
          'guard',
          error instanceof Error
            ? error.message
            : `File selection was rejected: ${file.name}`,
          { file, files },
        )
      }
      if (!allowed) {
        throw new UploadPickError(
          'guard',
          `File selection was rejected: ${file.name}`,
          { file, files },
        )
      }
    }
  }

  return files
}

export const pickUploadFiles = (async (options: UploadPickOptions = {}) => {
  if (!isClient) {
    throw new UploadPickError(
      'unsupported',
      'File selection is only available in a browser',
    )
  }
  if (options.signal?.aborted) {
    throw new DOMException('File selection was aborted', 'AbortError')
  }

  const input = document.createElement('input')
  input.type = 'file'
  input.tabIndex = -1
  input.setAttribute('aria-hidden', 'true')
  input.style.position = 'fixed'
  input.style.left = '-9999px'
  input.style.width = '1px'
  input.style.height = '1px'
  input.style.opacity = '0'

  const accept = normalizeUploadAccept(options.accept).join(',')
  if (accept) input.accept = accept
  input.multiple = Boolean(options.multiple || options.directory)
  if (options.directory) input.setAttribute('webkitdirectory', '')
  if (options.capture) {
    input.setAttribute(
      'capture',
      options.capture === true ? '' : options.capture,
    )
  }
  ;(document.body || document.documentElement).appendChild(input)

  return new Promise<File | File[] | undefined>((resolve, reject) => {
    let settled = false
    let selectionPending = false
    let focusTimer: ReturnType<typeof setTimeout> | undefined

    const cleanup = () => {
      if (focusTimer) clearTimeout(focusTimer)
      window.removeEventListener('focus', handleWindowFocus)
      options.signal?.removeEventListener('abort', handleAbort)
      input.removeEventListener('change', handleChange)
      input.removeEventListener('cancel', handleCancel)
      input.remove()
    }
    const finish = (value?: File | File[]) => {
      if (settled) return
      settled = true
      cleanup()
      resolve(value)
    }
    const fail = (error: unknown) => {
      if (settled) return
      settled = true
      cleanup()
      reject(error)
    }
    const handleChange = async () => {
      selectionPending = true
      const files = Array.from(input.files || [])
      if (!files.length) {
        finish(undefined)
        return
      }
      try {
        const validated = await validatePickedFiles(files, options)
        finish(options.multiple || options.directory ? validated : validated[0])
      } catch (error) {
        fail(error)
      }
    }
    const handleCancel = () => finish(undefined)
    const handleAbort = () =>
      fail(new DOMException('File selection was aborted', 'AbortError'))
    const handleWindowFocus = () => {
      focusTimer = setTimeout(() => {
        if (!selectionPending && !input.files?.length) finish(undefined)
      }, 200)
    }

    input.addEventListener('change', handleChange)
    input.addEventListener('cancel', handleCancel)
    window.addEventListener('focus', handleWindowFocus, { once: true })
    options.signal?.addEventListener('abort', handleAbort, { once: true })
    try {
      input.click()
    } catch (error) {
      fail(error)
    }
  })
}) as PickUploadFiles
