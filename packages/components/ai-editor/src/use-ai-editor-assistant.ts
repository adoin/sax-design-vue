import { computed, onBeforeUnmount, ref, shallowRef } from 'vue'
import { segmentEditorText } from './segment-text'
import type {
  AiEditorProps,
  AiEditorRequest,
  AiEditorResult,
  AiEditorSelection,
  AiEditorSource,
  AiEditorStatus,
} from './ai-editor'

type AssistantEmit = {
  (event: 'request', request: AiEditorRequest): void
  (event: 'response', result: AiEditorResult): void
  (event: 'error', error: unknown): void
  (event: 'cancel'): void
}

export function useAiEditorAssistant(
  props: AiEditorProps,
  emit: AssistantEmit,
  getDocument: () => string,
) {
  const status = ref<AiEditorStatus>('idle')
  const response = ref('')
  const error = ref('')
  const statusLabel = ref('')
  const sources = shallowRef<AiEditorSource[]>([])
  const busy = computed(() =>
    ['thinking', 'researching', 'streaming'].includes(status.value),
  )
  let generation = 0
  let controller: AbortController | undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  let finishDelay: (() => void) | undefined
  const cancel = (notify = true) => {
    const pending = busy.value
    generation++
    controller?.abort()
    controller = undefined
    clearTimeout(timer)
    finishDelay?.()
    finishDelay = undefined
    status.value = 'idle'
    response.value = ''
    error.value = ''
    sources.value = []
    statusLabel.value = ''
    if (notify && pending) emit('cancel')
  }
  const delay = () =>
    new Promise<void>((resolve) => {
      finishDelay = resolve
      timer = setTimeout(
        () => {
          timer = undefined
          finishDelay = undefined
          resolve()
        },
        Math.max(0, props.streamInterval),
      )
    })
  const ask = async (prompt: string, selection: AiEditorSelection) => {
    if (
      !prompt.trim() ||
      !selection.text ||
      props.disabled ||
      (!props.request && props.answer === undefined) ||
      busy.value
    )
      return false
    cancel(false)
    const id = generation
    const currentController = new AbortController()
    controller = currentController
    const active = () =>
      id === generation &&
      controller === currentController &&
      !currentController.signal.aborted
    const awaitActive = <T>(work: T | PromiseLike<T>) =>
      new Promise<T>((resolve, reject) => {
        const signal = currentController.signal
        const abort = () => reject(new Error('Aborted'))
        if (signal.aborted) {
          abort()
          return
        }
        signal.addEventListener('abort', abort, { once: true })
        Promise.resolve(work).then(
          (value) => {
            signal.removeEventListener('abort', abort)
            resolve(value)
          },
          (reason) => {
            signal.removeEventListener('abort', abort)
            reject(reason)
          },
        )
      })
    status.value = 'thinking'
    const request: AiEditorRequest = {
      prompt: prompt.trim(),
      selection: { ...selection },
      document: getDocument(),
      signal: currentController.signal,
      report: (progress) => {
        if (!active()) return
        if (progress.status) status.value = progress.status
        if (progress.label !== undefined) statusLabel.value = progress.label
        if (progress.sources) sources.value = progress.sources
      },
    }
    emit('request', request)
    try {
      const result = await awaitActive(
        props.request ? props.request(request) : props.answer || '',
      )
      if (!active()) return false
      status.value = 'streaming'
      if (
        typeof result === 'object' &&
        result !== null &&
        Symbol.asyncIterator in result
      ) {
        const iterator = result[Symbol.asyncIterator]()
        try {
          while (active()) {
            const chunk = await awaitActive(iterator.next())
            if (!active()) return false
            if (chunk.done) break
            response.value += String(chunk.value)
          }
        } finally {
          if (!active()) Promise.resolve(iterator.return?.()).catch(() => {})
        }
      } else {
        const text = typeof result === 'string' ? result : result.text
        if (typeof text !== 'string')
          throw new Error(
            'AI Editor request must return text or an async text stream.',
          )
        if (typeof result === 'object' && result.sources)
          sources.value = result.sources
        const animate =
          props.animate &&
          props.streamInterval > 0 &&
          !(
            typeof window !== 'undefined' &&
            window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
          )
        if (animate) {
          const characters = segmentEditorText(text, 'grapheme')
          // Long complete answers reveal in bounded batches instead of
          // scheduling a timer and rebuilding word segments for every character.
          const batchSize = Math.max(1, Math.ceil(characters.length / 180))
          for (let index = 0; index < characters.length; index += batchSize) {
            if (!active()) return false
            response.value += characters
              .slice(index, index + batchSize)
              .join('')
            await delay()
          }
        } else response.value = text
      }
      if (!active()) return false
      status.value = 'complete'
      controller = undefined
      emit('response', { text: response.value, sources: sources.value })
      return true
    } catch (reason) {
      if (!active()) return false
      error.value = reason instanceof Error ? reason.message : String(reason)
      status.value = 'error'
      controller = undefined
      emit('error', reason)
      return false
    }
  }
  onBeforeUnmount(() => cancel(false))
  return { status, statusLabel, response, error, sources, busy, ask, cancel }
}
