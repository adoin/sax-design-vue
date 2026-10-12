import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { ChatInputProps } from './chat-input'
interface SpeechResult {
  isFinal: boolean
  0: { transcript: string }
}
interface SpeechRecognizer {
  lang: string
  interimResults: boolean
  continuous: boolean
  onresult: ((event: { results: ArrayLike<SpeechResult> }) => void) | null
  onerror: ((event: { error: string }) => void) | null
  onend: (() => void) | null
  start(): void
  stop(): void
  abort(): void
}
type SpeechConstructor = new () => SpeechRecognizer
export function useChatVoice(
  props: ChatInputProps,
  update: (text: string) => void,
  notify: (
    event: 'voice-start' | 'voice-end' | 'voice-error',
    error?: unknown,
  ) => void,
) {
  const listening = shallowRef(false)
  const error = shallowRef('')
  let recognizer: SpeechRecognizer | undefined
  let controller: AbortController | undefined
  let version = 0
  const stop = () => {
    const wasListening = listening.value
    version++
    recognizer?.abort()
    controller?.abort()
    listening.value = false
    if (wasListening) notify('voice-end')
  }
  const start = async () => {
    if (listening.value) {
      stop()
      return
    }
    if (props.disabled || props.loading) return
    const current = ++version
    error.value = ''
    const prefix = props.modelValue
    const publish = (text: string) =>
      update(
        props.maxLength == null
          ? prefix + text
          : (prefix + text).slice(0, Math.max(0, props.maxLength)),
      )
    const done = () => {
      if (current === version) {
        listening.value = false
        notify('voice-end')
      }
    }
    const fail = (reason: unknown) => {
      if (current === version) {
        error.value = String(reason)
        notify('voice-error', reason)
        done()
        version++
        recognizer?.abort()
      }
    }
    if (props.transcribe) {
      controller = new AbortController()
      listening.value = true
      notify('voice-start')
      try {
        const text = await props.transcribe(controller.signal)
        if (!controller.signal.aborted && current === version) publish(text)
      } catch (reason) {
        if (!controller.signal.aborted) fail(reason)
      } finally {
        done()
      }
      return
    }
    const browser = window as Window & {
      SpeechRecognition?: SpeechConstructor
      webkitSpeechRecognition?: SpeechConstructor
    }
    const Recognition =
      browser.SpeechRecognition ?? browser.webkitSpeechRecognition
    if (!Recognition) {
      fail('unsupported')
      return
    }
    recognizer = new Recognition()
    recognizer.lang =
      props.speechLanguage ||
      document.documentElement.lang ||
      navigator.language
    recognizer.interimResults = true
    recognizer.continuous = false
    recognizer.onresult = (event) => {
      if (current !== version) return
      publish(
        Array.from(event.results)
          .map((result) => result[0].transcript)
          .join(''),
      )
    }
    recognizer.onerror = (event) => fail(event.error)
    recognizer.onend = done
    try {
      recognizer.start()
      listening.value = true
      notify('voice-start')
    } catch (reason) {
      fail(reason)
    }
  }
  watch(
    () => props.disabled || props.loading || !props.voiceInput,
    (blocked) => {
      if (blocked) stop()
    },
  )
  onBeforeUnmount(() => {
    version++
    controller?.abort()
    if (recognizer) {
      recognizer.onresult = null
      recognizer.onerror = null
      recognizer.onend = null
      recognizer.abort()
    }
  })
  return { listening, error, start, stop }
}
