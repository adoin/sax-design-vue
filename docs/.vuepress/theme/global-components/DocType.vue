<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import ApiTypeDetails from '../components/ApiTypeDetails.vue'
import { useDocLocaleUi } from '../composables/docLocale'
import type { ThemeNormalApiFrontmatter } from '../shared/frontmatter/normal'

defineProps<{ type: string }>()
const frontmatter = usePageFrontmatter<ThemeNormalApiFrontmatter>()
const { t } = useDocLocaleUi()
const definitions = computed(() => frontmatter.value.API_TYPE_DETAILS ?? {})
</script>

<template>
  <ApiTypeDetails
    :type="type"
    :definitions="definitions"
    :labels="t.apiColumns"
  />
</template>
