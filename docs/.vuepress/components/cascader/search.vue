<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { CascaderOption } from '@vuesax-alpha/components/cascader'

const route = useRoute()
const isZh = computed(() => route.path.startsWith('/zh/'))
const value = ref<Array<string | number>>([])
const customValue = ref<Array<string | number>>([])
const departments = [
  {
    id: 'engineering',
    name: 'Engineering',
    items: [
      { id: 'frontend', name: 'Frontend platform' },
      { id: 'quality', name: 'Quality assurance' },
    ],
  },
  {
    id: 'product',
    name: 'Product',
    items: [
      { id: 'design', name: 'Experience design' },
      { id: 'research', name: 'User research' },
    ],
  },
]

const matchLastLevel = (query: string, path: CascaderOption[]) =>
  String(path[path.length - 1]?.name ?? '')
    .toLowerCase()
    .includes(query.toLowerCase())
</script>

<template>
  <div class="demo-row">
    <div class="search-example">
      <span class="search-example__label">
        {{ isZh ? '完整路径匹配' : 'Full path search' }}
      </span>
      <s-cascader
        v-model="value"
        :options="departments"
        :field-names="{ value: 'id', label: 'name', children: 'items' }"
        show-search
        placeholder="Engineering"
      />
      <span class="search-example__hint">
        {{
          isZh
            ? '输入 Engineering：匹配两个子项'
            : 'Try Engineering: matches two children'
        }}
      </span>
    </div>

    <div class="search-example">
      <span class="search-example__label">
        {{ isZh ? '仅末级匹配' : 'Final level only' }}
      </span>
      <s-cascader
        v-model="customValue"
        :options="departments"
        :field-names="{ value: 'id', label: 'name', children: 'items' }"
        :show-search="{ filter: matchLastLevel }"
        placeholder="Engineering"
      />
      <span class="search-example__hint">
        {{
          isZh
            ? '输入 Engineering：不匹配任何末级项'
            : 'Try Engineering: no final-level match'
        }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.demo-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 18px;
}

.search-example {
  display: flex;
  width: 220px;
  flex-direction: column;
  gap: 6px;
}

.search-example__label {
  color: var(--sax-text-color);
  font-size: 0.75rem;
  font-weight: 600;
}

.search-example__hint {
  color: rgba(var(--sax-text), 0.58);
  font-size: 0.7rem;
  line-height: 1.4;
}
</style>
