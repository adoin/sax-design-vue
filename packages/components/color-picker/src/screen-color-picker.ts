export type ScreenColorPickerSource = 'eyedropper' | 'native'

export type ScreenColorPickerResult =
  | { status: 'selected'; color: string; source: ScreenColorPickerSource }
  | { status: 'cancelled' }
  | { status: 'failed' }

interface EyeDropperResult {
  sRGBHex: string
}

interface EyeDropperInstance {
  open: () => Promise<EyeDropperResult>
}

interface EyeDropperConstructor {
  new (): EyeDropperInstance
}

const isCancellation = (error: unknown) =>
  error instanceof DOMException
    ? error.name === 'AbortError'
    : (error as { name?: string } | undefined)?.name === 'AbortError'

const pickWithNativeColorInput = (
  initialColor: string,
): Promise<ScreenColorPickerResult> =>
  new Promise((resolve) => {
    if (!document.body) {
      resolve({ status: 'failed' })
      return
    }

    const input = document.createElement('input')
    input.type = 'color'
    input.value = initialColor
    input.tabIndex = -1
    input.setAttribute('aria-hidden', 'true')
    input.dataset.sColorPickerFallback = ''
    input.style.cssText =
      'position:fixed;width:1px;height:1px;left:-9999px;opacity:0;pointer-events:none;'

    let settled = false
    let windowBlurred = false
    let cleanupTimer: ReturnType<typeof setTimeout> | undefined

    const finish = (result: ScreenColorPickerResult) => {
      if (settled) return
      settled = true
      if (cleanupTimer) clearTimeout(cleanupTimer)
      window.removeEventListener('blur', handleWindowBlur)
      window.removeEventListener('focus', handleWindowFocus)
      input.removeEventListener('input', handleInput)
      input.removeEventListener('change', handleInput)
      input.removeEventListener('cancel', handleCancel)
      input.remove()
      resolve(result)
    }
    const handleInput = () =>
      finish({ status: 'selected', color: input.value, source: 'native' })
    const handleCancel = () => finish({ status: 'cancelled' })
    const handleWindowBlur = () => (windowBlurred = true)
    const handleWindowFocus = () => {
      if (windowBlurred) setTimeout(() => finish({ status: 'cancelled' }), 0)
    }

    input.addEventListener('input', handleInput, { once: true })
    input.addEventListener('change', handleInput, { once: true })
    input.addEventListener('cancel', handleCancel, { once: true })
    window.addEventListener('blur', handleWindowBlur)
    window.addEventListener('focus', handleWindowFocus)
    document.body.append(input)

    const scheduleCleanup = () => {
      if (!settled)
        cleanupTimer = setTimeout(
          () => finish({ status: 'cancelled' }),
          120_000,
        )
    }

    try {
      input.click()
      scheduleCleanup()
    } catch {
      try {
        const showPicker = (input as { showPicker?: () => void }).showPicker
        if (typeof showPicker !== 'function')
          throw new Error('No compatible native color picker is available')
        showPicker.call(input)
        scheduleCleanup()
      } catch {
        finish({ status: 'failed' })
      }
    }
  })

export const pickColorFromScreen = async (
  initialColor: string,
): Promise<ScreenColorPickerResult> => {
  const EyeDropper = (
    window as typeof window & { EyeDropper?: EyeDropperConstructor }
  ).EyeDropper

  if (EyeDropper) {
    try {
      const result = await new EyeDropper().open()
      return {
        status: 'selected',
        color: result.sRGBHex,
        source: 'eyedropper',
      }
    } catch (error) {
      if (isCancellation(error)) return { status: 'cancelled' }
    }
  }

  return pickWithNativeColorInput(initialColor)
}
