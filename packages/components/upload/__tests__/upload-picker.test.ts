import { afterEach, describe, expect, it } from 'vitest'
import { SUpload } from '..'
import { pickUploadFiles } from '../src/upload-picker'
import type { UploadPickError } from '../src/upload-picker'

const pickerInput = () =>
  document.querySelector<HTMLInputElement>(
    'input[type="file"][aria-hidden="true"]',
  )!

const selectFiles = (input: HTMLInputElement, files: File[]) => {
  Object.defineProperty(input, 'files', {
    configurable: true,
    value: files,
  })
  input.dispatchEvent(new Event('change'))
}

afterEach(() => {
  document
    .querySelectorAll('input[type="file"][aria-hidden="true"]')
    .forEach((input) => input.remove())
})

describe('Upload promise picker', () => {
  it('returns one file by default and removes the temporary input', async () => {
    const result = pickUploadFiles({ accept: '.txt' })
    const file = new File(['hello'], 'hello.txt', { type: 'text/plain' })

    selectFiles(pickerInput(), [file])

    await expect(result).resolves.toBe(file)
    expect(pickerInput()).toBeNull()
  })

  it('returns an array for multiple selection', async () => {
    const result = pickUploadFiles({ multiple: true })
    const files = [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')]

    selectFiles(pickerInput(), files)

    await expect(result).resolves.toEqual(files)
  })

  it('resolves undefined when the native picker is cancelled', async () => {
    const result = pickUploadFiles()
    pickerInput().dispatchEvent(new Event('cancel'))

    await expect(result).resolves.toBeUndefined()
  })

  it('rejects with a typed reason when validation fails', async () => {
    const result = pickUploadFiles({ accept: 'image/*' })
    const file = new File(['notes'], 'notes.txt', { type: 'text/plain' })

    selectFiles(pickerInput(), [file])

    await expect(result).rejects.toMatchObject({
      name: 'UploadPickError',
      reason: 'type',
      file,
    } satisfies Partial<UploadPickError>)
  })

  it('exposes the same picker through SUpload.pick', () => {
    expect(SUpload.pick).toBe(pickUploadFiles)
  })
})
