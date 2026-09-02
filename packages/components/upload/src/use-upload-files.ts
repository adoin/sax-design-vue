import { computed, ref, watch } from 'vue'
import { matchesUploadAccept } from './upload-utils'
import type { UploadFileItem, UploadProps, UploadRejectReason } from './upload'

interface UseUploadFilesOptions {
  props: UploadProps
  onModelChange: (files: File[]) => void
  onAdd: (item: UploadFileItem, files: UploadFileItem[]) => void
  onRemove: (item: UploadFileItem, files: UploadFileItem[]) => void
  onReject: (file: File, reason: UploadRejectReason, error: Error) => void
  onExceed: (files: File[], currentFiles: UploadFileItem[]) => void
}

const readPreview = (file: File) =>
  new Promise<string | undefined>((resolve) => {
    if (!file.type.startsWith('image/')) {
      resolve(undefined)
      return
    }

    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => resolve(undefined)
    reader.readAsDataURL(file)
  })

export const useUploadFiles = (options: UseUploadFilesOptions) => {
  const { props } = options
  const fileList = ref<UploadFileItem[]>([])
  let uid = 0

  const limitCount = computed(() =>
    Number(props.limitCount ?? props.limit ?? 0),
  )
  const effectiveAccept = computed(() => {
    if (props.accept) return props.accept
    if (props.mode === 'image') return 'image/*'
    return props.fileTypes.join(',')
  })
  const isLimitReached = computed(
    () => limitCount.value > 0 && fileList.value.length >= limitCount.value,
  )

  const createItem = async (
    raw: File,
    status: UploadFileItem['status'] = 'ready',
  ): Promise<UploadFileItem> => ({
    uid: ++uid,
    raw,
    name: raw.name,
    preview: await readPreview(raw),
    percent: status === 'success' ? 100 : 0,
    uploading: false,
    error: false,
    success: status === 'success',
    status,
  })

  const reject = (file: File, reason: UploadRejectReason, message: string) => {
    options.onReject(file, reason, new Error(message))
  }

  const validate = async (file: File) => {
    if (!matchesUploadAccept(file, effectiveAccept.value)) {
      reject(file, 'type', `File type is not accepted: ${file.name}`)
      return false
    }

    if (props.limitSize && file.size > Number(props.limitSize) * 1024 * 1024) {
      reject(file, 'size', `File exceeds ${props.limitSize} MB limit`)
      return false
    }

    if (props.beforeSelectMethod) {
      try {
        const allowed = await props.beforeSelectMethod({ file })
        if (allowed) return true
        reject(file, 'guard', `File selection was rejected: ${file.name}`)
      } catch (error) {
        options.onReject(
          file,
          'guard',
          error instanceof Error ? error : new Error(String(error)),
        )
      }
      return false
    }

    return true
  }

  const emitModel = () => {
    options.onModelChange(fileList.value.map((item) => item.raw))
  }

  const addFiles = async (files: File[]) => {
    if (!files.length) return []

    const added: UploadFileItem[] = []
    const replace = props.singleUpload || !props.multiple

    for (const file of files) {
      const baseCount = replace && !added.length ? 0 : fileList.value.length
      if (limitCount.value && baseCount + added.length >= limitCount.value) {
        options.onExceed(files.slice(files.indexOf(file)), fileList.value)
        reject(file, 'limit', `Maximum of ${limitCount.value} files reached`)
        break
      }
      if (!(await validate(file))) continue
      added.push(await createItem(file))
      if (replace) break
    }

    if (!added.length) return added
    if (replace) fileList.value = []

    for (const item of added) {
      fileList.value.push(item)
      options.onAdd(item, fileList.value)
    }
    emitModel()
    return added
  }

  const removeFile = async (target: number | UploadFileItem) => {
    const index =
      typeof target === 'number' ? target : fileList.value.indexOf(target)
    const current = fileList.value[index]
    if (!current) return undefined

    if (props.beforeRemoveMethod) {
      const allowed = await props.beforeRemoveMethod({ option: current })
      if (!allowed) return undefined
    }

    const [removed] = fileList.value.splice(index, 1)
    if (!removed) return undefined
    options.onRemove(removed, fileList.value)
    emitModel()
    return removed
  }

  const clear = () => {
    fileList.value = []
    emitModel()
  }

  const sameRawFiles = (files: File[]) =>
    files.length === fileList.value.length &&
    files.every((file, index) => fileList.value[index]?.raw === file)

  watch(
    () => props.modelValue,
    async (value) => {
      const files = (
        Array.isArray(value) ? value : value ? [value] : []
      ) as File[]
      if (sameRawFiles(files)) return
      fileList.value = await Promise.all(
        files.map((file) => createItem(file, 'success')),
      )
    },
    { immediate: true },
  )

  return {
    fileList,
    limitCount,
    effectiveAccept,
    isLimitReached,
    addFiles,
    removeFile,
    clear,
  }
}
