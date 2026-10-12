<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps<{ text: string; query: string }>()
const parts = computed(() => {
  const terms = props.query
    .trim()
    .toLocaleLowerCase()
    .split(/\s+/)
    .filter(Boolean)
  const lower = props.text.toLocaleLowerCase()
  const result: { text: string; match: boolean }[] = []
  let cursor = 0
  while (cursor < props.text.length) {
    const next = terms
      .map((term) => ({ term, index: lower.indexOf(term, cursor) }))
      .filter((match) => match.index >= 0)
      .sort((a, b) => a.index - b.index || b.term.length - a.term.length)[0]
    if (!next) {
      result.push({ text: props.text.slice(cursor), match: false })
      break
    }
    if (next.index > cursor)
      result.push({ text: props.text.slice(cursor, next.index), match: false })
    result.push({
      text: props.text.slice(next.index, next.index + next.term.length),
      match: true,
    })
    cursor = next.index + next.term.length
  }
  return result
})
</script>
<template>
  <span
    ><template v-for="(part, index) in parts" :key="index"
      ><mark v-if="part.match" class="search-match">{{ part.text }}</mark
      ><template v-else>{{ part.text }}</template></template
    ></span
  >
</template>
<style scoped>
.search-match {
  color: var(--sax-css-primary);
  background: transparent;
  font-weight: 600;
}
</style>
