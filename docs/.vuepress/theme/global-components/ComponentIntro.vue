<template>
  <section v-if="description" class="component-intro">
    <p class="component-intro__lead">{{ description }}</p>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import type { ThemeNormalApiFrontmatter } from '../shared/frontmatter/normal'

const frontmatter = usePageFrontmatter<
  ThemeNormalApiFrontmatter & { description?: string }
>()

const description = computed(() => frontmatter.value.description || '')
</script>

<style lang="scss" scoped>
.component-intro {
  margin: 0 0 28px;
  padding: 20px 22px;
  border-radius: 16px;
  border: 1px solid hsl(var(--sax-accent-color) / 0.14);
  background: linear-gradient(
    135deg,
    hsl(var(--sax-theme-layout) / 0.96),
    hsl(var(--sax-accent-color) / 0.06)
  );
}

.component-intro__lead {
  margin: 0;
  font-size: 1.02rem;
  line-height: 1.75;
  color: hsl(var(--sax-theme-color) / 0.78);
}
</style>
