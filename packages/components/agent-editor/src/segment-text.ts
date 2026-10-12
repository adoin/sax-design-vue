type SegmenterConstructor = new (
  locale: undefined,
  options: { granularity: 'word' | 'grapheme' },
) => { segment: (text: string) => Iterable<{ segment: string }> }

export const segmentEditorText = (
  text: string,
  granularity: 'word' | 'grapheme',
) => {
  const Segmenter = (Intl as typeof Intl & { Segmenter?: SegmenterConstructor })
    .Segmenter
  if (Segmenter)
    return [...new Segmenter(undefined, { granularity }).segment(text)].map(
      (item) => item.segment,
    )
  return granularity === 'grapheme' || /[\u3400-\u9FFF]/.test(text)
    ? Array.from(text)
    : text.split(/(\s+)/).filter(Boolean)
}
