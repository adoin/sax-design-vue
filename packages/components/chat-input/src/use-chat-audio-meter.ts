import { onBeforeUnmount, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'

/** Local microphone spectrum only; never sends or stores audio. */
export function useChatAudioMeter(active: Ref<boolean>) {
  const levels = shallowRef([0, 0, 0, 0, 0])
  let stream: MediaStream | undefined
  let context: AudioContext | undefined
  let source: MediaStreamAudioSourceNode | undefined
  let frame: number | undefined
  let version = 0
  const stop = () => {
    version++
    if (frame !== undefined) cancelAnimationFrame(frame)
    frame = undefined
    source?.disconnect()
    source = undefined
    stream?.getTracks().forEach((track) => track.stop())
    stream = undefined
    context?.close().catch(() => {})
    context = undefined
    levels.value = [0, 0, 0, 0, 0]
  }
  const start = async () => {
    stop()
    const current = version
    const Audio =
      (window as Window & { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext ?? window.AudioContext
    if (!Audio || !navigator.mediaDevices?.getUserMedia) return
    try {
      const audio = new Audio()
      context = audio
      await audio.resume()
      if (current !== version || !active.value) return
      const microphone = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
        video: false,
      })
      if (current !== version || !active.value) {
        microphone.getTracks().forEach((track) => track.stop())
        return
      }
      stream = microphone
      source = audio.createMediaStreamSource(microphone)
      const analyser = audio.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.55
      source.connect(analyser)
      const bins = new Uint8Array(analyser.frequencyBinCount)
      const bands = [
        [1, 3],
        [3, 6],
        [6, 11],
        [11, 18],
        [18, 30],
      ]
      let previous = 0
      const sample = (timestamp: number) => {
        if (current !== version || !active.value) return
        if (timestamp - previous >= 32) {
          analyser.getByteFrequencyData(bins)
          levels.value = bands.map(([start, end]) => {
            let energy = 0
            for (let i = start; i < end; i++) energy += bins[i]
            return Math.min(1, energy / (end - start) / 190)
          })
          previous = timestamp
        }
        frame = requestAnimationFrame(sample)
      }
      frame = requestAnimationFrame(sample)
    } catch {
      if (current === version) stop()
    }
  }
  watch(active, (enabled) => {
    if (enabled) start()
    else stop()
  })
  onBeforeUnmount(stop)
  return levels
}
