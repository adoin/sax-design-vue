<script setup lang="ts">
import { computed } from 'vue'

import type { ThemeApiTypeDefinition } from '../shared/frontmatter/normal'

type ApiTypeTokenKind =
  | 'comment'
  | 'identifier'
  | 'keyword'
  | 'number'
  | 'operator'
  | 'primitive'
  | 'punctuation'
  | 'space'
  | 'string'

interface ApiTypeToken {
  kind: ApiTypeTokenKind
  value: string
}

interface Props {
  expression: string
  definitions: Record<string, ThemeApiTypeDefinition>
  references?: string[]
  disabledReferences?: string[]
  activeReference?: string
  activeReferenceIndex?: number
  openLabel: string
  closeLabel: string
}

interface Emits {
  openReference: [name: string, tokenIndex: number, event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  references: undefined,
  disabledReferences: () => [],
  activeReference: undefined,
  activeReferenceIndex: undefined,
})
const emit = defineEmits<Emits>()

const keywords = new Set([
  'as',
  'const',
  'declare',
  'enum',
  'export',
  'extends',
  'from',
  'import',
  'in',
  'infer',
  'interface',
  'keyof',
  'new',
  'readonly',
  'satisfies',
  'type',
  'typeof',
])
const primitives = new Set([
  'any',
  'bigint',
  'boolean',
  'false',
  'Function',
  'never',
  'null',
  'number',
  'Number',
  'object',
  'Object',
  'String',
  'string',
  'symbol',
  'true',
  'undefined',
  'unknown',
  'void',
  'Boolean',
])
const tokenPattern =
  /\s+|\/\*[\s\S]*?\*\/|\/\/[^\n]*|(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(?:\d+(?:\.\d+)?)|(?:[A-Za-z_$][\w$]*)|(?:=>|\.\.\.|\?\?|\?\.|===|!==|==|!=|<=|>=|&&|\|\||[|&=+\-*/%!~<>?:])|[{}\u005B\u005D(),;.]|./g

const referenceNames = computed(() =>
  props.references ? new Set(props.references) : undefined,
)
const disabledNames = computed(() => new Set(props.disabledReferences))
const tokens = computed<ApiTypeToken[]>(() =>
  Array.from(props.expression.matchAll(tokenPattern), ([value]) => ({
    value,
    kind: getTokenKind(value),
  })),
)

function getTokenKind(value: string): ApiTypeTokenKind {
  if (/^\s+$/.test(value)) return 'space'
  if (value.startsWith('//') || value.startsWith('/*')) return 'comment'
  if (/^["'`]/.test(value)) return 'string'
  if (/^\d/.test(value)) return 'number'
  if (/^[A-Za-z_$]/.test(value)) {
    if (keywords.has(value)) return 'keyword'
    if (primitives.has(value)) return 'primitive'
    return 'identifier'
  }
  if (/^[{}\u005B\u005D(),;.]$/.test(value)) return 'punctuation'
  return 'operator'
}

const isReference = (token: ApiTypeToken) =>
  token.kind === 'identifier' &&
  !!props.definitions[token.value] &&
  (!referenceNames.value || referenceNames.value.has(token.value))
const isDisabled = (name: string) => disabledNames.value.has(name)
const isExpanded = (name: string, tokenIndex: number) =>
  props.activeReference === name && props.activeReferenceIndex === tokenIndex
const referenceLabel = (name: string, tokenIndex: number) =>
  `${isExpanded(name, tokenIndex) ? props.closeLabel : props.openLabel}: ${name}`
const tokenText = (token: ApiTypeToken, index: number) => {
  const previous = tokens.value[index - 1]
  if (
    token.kind === 'space' &&
    !token.value.includes('\n') &&
    (previous?.value === '|' || previous?.value === '&')
  ) {
    return token.value.replace(/[^\S\r\n]/g, '\u00A0')
  }
  return token.value
}
</script>

<template>
  <code class="api-type-code" data-no-inline-code-copy>
    <template v-for="(token, index) in tokens" :key="`${index}:${token.value}`">
      <button
        v-if="isReference(token)"
        class="api-type-token api-type-reference"
        :class="{
          'is-active': isExpanded(token.value, index),
          'is-cycle': isDisabled(token.value),
        }"
        type="button"
        :disabled="isDisabled(token.value)"
        :aria-expanded="isExpanded(token.value, index)"
        :aria-label="referenceLabel(token.value, index)"
        @click="emit('openReference', token.value, index, $event)"
      >
        {{ token.value }}
      </button>
      <span v-else class="api-type-token" :class="`is-${token.kind}`">{{
        tokenText(token, index)
      }}</span>
    </template>
  </code>
</template>

<style scoped lang="scss">
.api-type-code {
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
  color: hsl(var(--sax-theme-color));
  font: inherit;
  text-shadow: none;
  white-space: pre-wrap;
}

.api-type-token.is-keyword {
  color: hsl(var(--sax-primary));
  font-weight: 650;
}

.api-type-token.is-primitive {
  color: hsl(var(--sax-accent-secondary));
}

.api-type-token.is-string,
.api-type-token.is-number {
  color: hsl(var(--sax-badge-tip-color));
}

.api-type-token.is-comment {
  color: hsl(var(--sax-theme-color) / 0.56);
  font-style: italic;
}

.api-type-token.is-operator,
.api-type-token.is-punctuation {
  color: hsl(var(--sax-theme-color) / 0.72);
}

.api-type-reference {
  display: inline;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 2px;
  appearance: none;
  background: transparent;
  box-shadow: none;
  color: hsl(var(--sax-accent-secondary));
  cursor: pointer;
  font: inherit;
  font-weight: 650;
  line-height: inherit;
  text-decoration: none;
  vertical-align: baseline;
  white-space: nowrap;
  transition: color 160ms ease;
}

.api-type-reference:hover,
.api-type-reference.is-active {
  background: transparent;
  color: hsl(var(--sax-primary));
}

.api-type-reference:focus-visible {
  outline: none;
  color: hsl(var(--sax-primary));
}

.api-type-reference.is-cycle {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (prefers-reduced-motion: reduce) {
  .api-type-reference {
    transition: none;
  }
}
</style>
