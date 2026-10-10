<script setup lang="ts">
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'

import { SPopper } from '@vuesax-alpha/components/popper'
import { safeAgentHref } from '../../ai-editor/src/agent-shared/utils'

import { inlineCitationsEmits, inlineCitationsProps } from './inline-citations'
defineOptions({ name: 'SInlineCitations' })
defineProps(inlineCitationsProps)
const emit = defineEmits(inlineCitationsEmits)
const ns = useNamespace('inline-citations')
const shape = useShape()
const { t } = useLocale()
</script>

<template>
  <span :class="[ns.b(), `is-${shape}`]"
    ><SPopper
      trigger="click"
      placement="top"
      :disabled="disabled || !sources.length"
      :show-arrow="false"
      :popper-class="['s-agent-popper', `is-${shape}`].join(' ')"
      @show="emit('open')"
      ><button
        type="button"
        class="s-agent-citation s-agent-control"
        :disabled="disabled || !sources.length"
        :aria-label="label || t('vs.agent.sources')"
      >
        <slot name="trigger" :sources="sources"
          >{{ label || sources[0]?.title || t('vs.agent.sources')
          }}<span v-if="sources.length > 1">
            +{{ sources.length - 1 }}</span
          ></slot
        ></button
      ><template #content
        ><ul class="s-agent-list">
          <li v-for="source in sources" :key="source.id" class="s-agent-source">
            <slot name="source" :source="source"
              ><a
                v-if="safeAgentHref(source.href)"
                :href="safeAgentHref(source.href)"
                target="_blank"
                rel="noopener noreferrer"
                @click="emit('source-click', source)"
                >{{ source.title }} ↗</a
              ><span v-else>{{ source.title }}</span>
              <p v-if="source.description" class="s-agent-muted">
                {{ source.description }}
              </p></slot
            >
          </li>
        </ul></template
      ></SPopper
    ></span
  >
</template>
