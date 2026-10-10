<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue'
import { SIcon } from '@vuesax-alpha/components/icon'
import { useLocale, useNamespace, useShape } from '@vuesax-alpha/hooks'

import { SPopper } from '@vuesax-alpha/components/popper'
import { safeAgentHref } from '../../ai-editor/src/agent-shared/utils'

import { inlineCitationsEmits, inlineCitationsProps } from './inline-citations'
defineOptions({ name: 'SInlineCitations' })
const props = defineProps(inlineCitationsProps)
const emit = defineEmits(inlineCitationsEmits)
const ns = useNamespace('inline-citations')
const shape = useShape()
const { t } = useLocale()
const activeIndex = shallowRef(0)
const activeSource = computed(() => props.sources[activeIndex.value])
watch(
  () => props.sources,
  () => {
    activeIndex.value = Math.min(
      activeIndex.value,
      Math.max(0, props.sources.length - 1),
    )
  },
)
</script>

<template>
  <span :class="[ns.b(), `is-${shape}`]"
    ><SPopper
      trigger="click"
      placement="bottom-start"
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
          ><SIcon
            :name="sources[0]?.icon || 'cb:document'"
            aria-hidden="true"
          />{{ label || sources[0]?.title || t('vs.agent.sources')
          }}<span v-if="sources.length > 1">
            +{{ sources.length - 1 }}</span
          ></slot
        ></button
      ><template #content
        ><div v-if="sources.length > 1" class="s-agent-source-navigation">
          <button
            type="button"
            class="s-agent-control s-agent-icon-action"
            :disabled="activeIndex === 0"
            :aria-label="t('vs.agent.previous')"
            @click="activeIndex--"
          >
            <SIcon name="cb:arrow-left" />
          </button>
          <button
            type="button"
            class="s-agent-control s-agent-icon-action"
            :disabled="activeIndex === sources.length - 1"
            :aria-label="t('vs.agent.next')"
            @click="activeIndex++"
          >
            <SIcon name="cb:arrow-right" />
          </button>
          <span class="s-agent-muted"
            >{{ activeIndex + 1 }}/{{ sources.length }}</span
          >
        </div>
        <Transition name="s-agent-reveal" mode="out-in"
          ><ul v-if="activeSource" :key="activeSource.id" class="s-agent-list">
            <li
              v-for="source in [activeSource]"
              :key="source.id"
              class="s-agent-source"
            >
              <slot name="source" :source="source"
                ><div class="s-agent-source-publisher">
                  <img
                    v-if="source.iconSrc"
                    :src="source.iconSrc"
                    alt=""
                  /><SIcon
                    v-else
                    :name="source.icon || 'cb:document'"
                    aria-hidden="true"
                  /><span>{{ source.publisher || source.title }}</span>
                </div>
                <a
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
              ><time v-if="source.date" class="s-agent-muted">{{
                source.date
              }}</time>
            </li>
          </ul></Transition
        ></template
      ></SPopper
    ></span
  >
</template>
