import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import type { Ref } from 'vue'
import type {
  AiEditorFormat,
  AiEditorMark,
  AiEditorProps,
  AiEditorSelection,
} from './ai-editor'

type DocumentEmit = {
  (event: 'update:modelValue', text: string): void
  (event: 'update:marks', marks: AiEditorMark[]): void
  (event: 'selection-change', selection: AiEditorSelection | null): void
  (event: 'format-change', format: AiEditorFormat, marks: AiEditorMark[]): void
}
const tags: Record<AiEditorFormat, string> = {
  bold: 'strong',
  italic: 'em',
  underline: 'u',
  strike: 's',
  code: 'code',
}

export function useAiEditorDocument(
  props: AiEditorProps,
  emit: DocumentEmit,
  root: Ref<HTMLElement | undefined>,
) {
  const text = ref(props.modelValue)
  const marks = shallowRef<AiEditorMark[]>(props.marks)
  const selection = shallowRef<AiEditorSelection | null>(null)
  const highlighted = ref(false)
  let composing = false
  let changedDuringComposition = false
  const history: { text: string; marks: AiEditorMark[] }[] = []
  const redoHistory: typeof history = []
  const flatMapMarks = (map: (mark: AiEditorMark) => AiEditorMark[]) => {
    const result: AiEditorMark[] = []
    for (const mark of marks.value) result.push(...map(mark))
    return result
  }

  const normalizeMarks = (
    entries: AiEditorMark[],
    length = text.value.length,
  ) =>
    entries
      .filter(
        (mark) =>
          Object.prototype.hasOwnProperty.call(tags, mark.format) &&
          Number.isFinite(mark.start) &&
          Number.isFinite(mark.end) &&
          mark.end > mark.start,
      )
      .map((mark) => ({
        ...mark,
        start: Math.max(0, Math.min(length, Math.floor(mark.start))),
        end: Math.max(0, Math.min(length, Math.floor(mark.end))),
      }))
      .filter((mark) => mark.start < mark.end)

  const readSelection = () => {
    const element = root.value
    const native = element?.ownerDocument.getSelection()
    if (!element || !native?.rangeCount) return null
    const range = native.getRangeAt(0)
    if (
      !element.contains(range.startContainer) ||
      !element.contains(range.endContainer)
    )
      return null
    const before = range.cloneRange()
    before.selectNodeContents(element)
    before.setEnd(range.startContainer, range.startOffset)
    const start = before.toString().length
    const end = start + range.toString().length
    return { start, end, text: text.value.slice(start, end) }
  }
  const rangeFor = (start: number, end = start) => {
    const element = root.value
    if (!element) return
    const doc = element.ownerDocument
    const walker = doc.createTreeWalker(element, 4)
    const nodes: Text[] = []
    while (walker.nextNode()) nodes.push(walker.currentNode as Text)
    if (!nodes.length) element.append(doc.createTextNode(''))
    if (!nodes.length) nodes.push(element.firstChild as Text)
    const locate = (offset: number): [Text, number] => {
      let remaining = Math.max(0, Math.min(text.value.length, offset))
      for (const node of nodes) {
        if (remaining <= node.length) return [node, remaining]
        remaining -= node.length
      }
      const node = nodes[nodes.length - 1]
      return [node, node.length]
    }
    const range = doc.createRange()
    range.setStart(...locate(start))
    range.setEnd(...locate(end))
    return range
  }
  const restore = (start: number, end = start) => {
    const range = rangeFor(start, end)
    if (!range) return
    const native = root.value?.ownerDocument.getSelection()
    native?.removeAllRanges()
    native?.addRange(range)
  }
  const render = (animatedFormat?: AiEditorFormat) => {
    const element = root.value
    if (!element || composing) return
    const doc = element.ownerDocument
    const boundaries = new Set([0, text.value.length])
    for (const mark of normalizeMarks(marks.value)) {
      boundaries.add(mark.start)
      boundaries.add(mark.end)
    }
    if (highlighted.value && selection.value) {
      boundaries.add(selection.value.start)
      boundaries.add(selection.value.end)
    }
    const positions = [...boundaries].sort((a, b) => a - b)
    const fragment = doc.createDocumentFragment()
    for (let index = 0; index < positions.length - 1; index++) {
      const start = positions[index]
      const end = positions[index + 1]
      let node: Node = doc.createTextNode(text.value.slice(start, end))
      for (const format of Object.keys(tags) as AiEditorFormat[]) {
        if (
          marks.value.some(
            (mark) =>
              mark.format === format && mark.start <= start && mark.end >= end,
          )
        ) {
          const wrapper = doc.createElement(tags[format])
          if (
            format === animatedFormat &&
            selection.value &&
            start >= selection.value.start &&
            end <= selection.value.end
          )
            wrapper.className = 's-ai-editor__format-enter'
          wrapper.append(node)
          node = wrapper
        }
      }
      if (
        highlighted.value &&
        selection.value &&
        start >= selection.value.start &&
        end <= selection.value.end
      ) {
        const wrapper = doc.createElement('span')
        wrapper.className = 's-ai-editor__selection'
        wrapper.append(node)
        node = wrapper
      }
      fragment.append(node)
    }
    element.replaceChildren(fragment)
  }
  const publishMarks = () =>
    emit(
      'update:marks',
      marks.value.map((mark) => ({ ...mark })),
    )
  const publish = () => {
    emit('update:modelValue', text.value)
    publishMarks()
  }
  const save = () => {
    history.push({
      text: text.value,
      marks: marks.value.map((mark) => ({ ...mark })),
    })
    if (history.length > 100) history.shift()
    redoHistory.length = 0
  }
  const setSelection = (start: number, end: number) => {
    const from = Math.max(0, Math.min(Math.floor(start), text.value.length))
    const to = Math.max(from, Math.min(Math.floor(end), text.value.length))
    selection.value =
      from === to
        ? null
        : { start: from, end: to, text: text.value.slice(from, to) }
    emit('selection-change', selection.value)
    return selection.value
  }
  const captureSelection = () => {
    const current = readSelection()
    if (current) setSelection(current.start, current.end)
    else {
      selection.value = null
      emit('selection-change', null)
    }
    return current
  }
  const replaceRange = (
    start: number,
    end: number,
    value: string,
    inherit = false,
  ) => {
    save()
    const inherited = inherit
      ? marks.value
          .filter((mark) => mark.start <= start && mark.end > start)
          .map((mark) => ({
            format: mark.format,
            start,
            end: start + value.length,
          }))
      : []
    const removed = end - start
    const delta = value.length - removed
    text.value = text.value.slice(0, start) + value + text.value.slice(end)
    marks.value = normalizeMarks([
      ...flatMapMarks((mark) => {
        if (mark.end <= start) return [mark]
        if (mark.start >= end)
          return [{ ...mark, start: mark.start + delta, end: mark.end + delta }]
        return [
          ...(mark.start < start ? [{ ...mark, end: start }] : []),
          ...(mark.end > end
            ? [{ ...mark, start: start + value.length, end: mark.end + delta }]
            : []),
        ]
      }),
      ...inherited,
    ])
    highlighted.value = false
    selection.value = null
    render()
    root.value?.focus({ preventScroll: true })
    restore(start + value.length)
    publish()
  }
  const insert = (value: string) => {
    const range = readSelection() ?? {
      start: text.value.length,
      end: text.value.length,
    }
    replaceRange(range.start, range.end, value, true)
  }
  const handleInput = () => {
    if (composing || !root.value) return
    if (props.disabled || props.readonly) {
      render()
      return
    }
    const value = root.value.textContent || ''
    if (value === text.value) return
    const caret = readSelection()
    let start = 0
    while (
      start < text.value.length &&
      start < value.length &&
      text.value[start] === value[start]
    )
      start++
    let oldEnd = text.value.length
    let newEnd = value.length
    while (
      oldEnd > start &&
      newEnd > start &&
      text.value[oldEnd - 1] === value[newEnd - 1]
    ) {
      oldEnd--
      newEnd--
    }
    replaceRange(start, oldEnd, value.slice(start, newEnd), true)
    if (caret) restore(caret.end)
  }
  const isFormatted = (format: AiEditorFormat) => {
    const range = selection.value
    if (!range) return false
    const intervals = marks.value
      .filter((mark) => mark.format === format)
      .sort((a, b) => a.start - b.start)
    let end = range.start
    for (const mark of intervals) {
      if (mark.start > end) break
      if (mark.end > end) end = mark.end
      if (end >= range.end) return true
    }
    return false
  }
  const activeFormats = computed(() => props.formats.filter(isFormatted))
  const format = (value: AiEditorFormat) => {
    const range = selection.value
    if (
      !range ||
      props.disabled ||
      props.readonly ||
      !props.formats.includes(value)
    )
      return
    save()
    if (isFormatted(value)) {
      marks.value = normalizeMarks(
        flatMapMarks((mark) => {
          if (
            mark.format !== value ||
            mark.end <= range.start ||
            mark.start >= range.end
          )
            return [mark]
          return [
            ...(mark.start < range.start
              ? [{ ...mark, end: range.start }]
              : []),
            ...(mark.end > range.end ? [{ ...mark, start: range.end }] : []),
          ]
        }),
      )
    } else
      marks.value = normalizeMarks([
        ...marks.value,
        { start: range.start, end: range.end, format: value },
      ])
    render(value)
    root.value?.focus({ preventScroll: true })
    restore(range.start, range.end)
    publishMarks()
    emit('format-change', value, marks.value)
  }
  const undo = (redo = false) => {
    const source = redo ? redoHistory : history
    const target = redo ? history : redoHistory
    const snapshot = source.pop()
    if (!snapshot) return
    target.push({ text: text.value, marks: marks.value })
    text.value = snapshot.text
    marks.value = snapshot.marks
    selection.value = null
    render()
    restore(text.value.length)
    publish()
  }
  watch(
    () => props.modelValue,
    (value) => {
      if (value === text.value) return
      if (composing) changedDuringComposition = true
      text.value = value
      marks.value = normalizeMarks(props.marks)
      selection.value = null
      highlighted.value = false
      history.length = 0
      redoHistory.length = 0
      render()
    },
  )
  watch(
    () => props.marks,
    (value) => {
      const caret = readSelection()
      marks.value = normalizeMarks(value)
      render()
      if (caret) restore(caret.start, caret.end)
    },
    { deep: true },
  )
  onMounted(() => {
    marks.value = normalizeMarks(marks.value)
    render()
  })
  return {
    text,
    marks,
    selection,
    highlighted,
    activeFormats,
    render,
    restore,
    rangeFor,
    setSelection,
    captureSelection,
    readSelection,
    format,
    insert,
    replaceRange,
    handleInput,
    undo,
    startComposition: () => {
      composing = true
      changedDuringComposition = false
    },
    endComposition: () => {
      composing = false
      if (changedDuringComposition) {
        changedDuringComposition = false
        render()
        return
      }
      handleInput()
    },
  }
}
