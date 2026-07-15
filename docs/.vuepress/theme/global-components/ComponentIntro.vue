<template>
  <section v-if="description" class="component-intro">
    <p class="component-intro__lead">{{ description }}</p>
    <div v-if="isNewComponent" class="component-intro__meta">
      <span class="component-intro__badge">{{ t.newComponentBadge }}</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import { useRoute } from 'vue-router'
import { newComponentNavItems } from '../../app/new-components'
import { newComponentNavItemsZh } from '../../app/new-components.zh'
import { useDocLocaleUi } from '../composables/docLocale'
import type { ThemeNormalApiFrontmatter } from '../shared/frontmatter/normal'

const route = useRoute()
const { t, locale } = useDocLocaleUi()
const frontmatter = usePageFrontmatter<
  ThemeNormalApiFrontmatter & { description?: string }
>()

const description = computed(() => frontmatter.value.description || '')

const isNewComponent = computed(() => {
  const items =
    locale.value === 'zh' ? newComponentNavItemsZh : newComponentNavItems
  return items.some((item) => item.link === route.path)
})
</script>

<style lang="scss" scoped>
.component-intro {
  margin: 0 0 28px;
  padding: 20px 22px;
  border-radius: 16px;
  border: 1px solid rgba(var(--s-accent-color), 0.14);
  background: linear-gradient(
    135deg,
    rgba(var(--s-theme-layout), 0.96),
    rgba(var(--s-accent-color), 0.06)
  );
}

.component-intro__lead {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.75;
  color: rgba(var(--s-theme-color), 0.78);
}

.component-intro__meta {
  margin-top: 12px;
}

.component-intro__badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgb(var(--s-accent-color));
  background: rgba(var(--s-accent-color), 0.1);
}
</style>
