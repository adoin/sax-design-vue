<template>
  <main class="home-modern" aria-labelledby="home-title">
    <div class="home-modern__bg" aria-hidden="true">
      <span class="home-modern__orb home-modern__orb--1" />
      <span class="home-modern__orb home-modern__orb--2" />
      <span class="home-modern__orb home-modern__orb--3" />
    </div>

    <section class="home-modern__hero">
      <p class="home-modern__eyebrow">Vue 3 · TypeScript · Vite 8</p>
      <h1 id="home-title">{{ heroTitle }}</h1>
      <p class="home-modern__lead" v-html="heroDescription" />

      <div class="home-modern__cta">
        <router-link
          class="home-modern__btn home-modern__btn--primary"
          :to="withLocalePath('/guide/getting-started/')"
        >
          {{ t.homeGetStarted }}
        </router-link>
        <router-link
          class="home-modern__btn"
          :to="withLocalePath('/components/')"
        >
          {{ t.homeComponents }}
        </router-link>
        <router-link
          class="home-modern__btn"
          :to="withLocalePath('/guide/playground')"
        >
          {{ t.homePlayground }}
        </router-link>
      </div>
    </section>

    <section class="home-modern__grid">
      <article
        v-for="item in highlights"
        :key="item.title"
        class="home-modern__card"
      >
        <h2>{{ item.title }}</h2>
        <p>{{ item.description }}</p>
        <router-link
          v-if="item.link"
          :to="item.link"
          class="home-modern__card-link"
        >
          {{ item.action }} →
        </router-link>
      </article>
    </section>

    <section class="home-modern__tribute">
      <div>
        <p class="home-modern__tribute-label">{{ t.homeTributeLabel }}</p>
        <h2>{{ t.homeTributeTitle }}</h2>
        <p>
          <template v-if="locale === 'zh'">
            Sax Design Vue 延续了
            <a
              href="https://github.com/lusaxweb/vuesax"
              target="_blank"
              rel="noopener"
              >lusaxweb/vuesax</a
            >
            开创的视觉语言。我们感谢这套富有表现力、与众不同、不拘泥于僵化设计体系的理念。
          </template>
          <template v-else>
            Sax Design Vue continues the visual language pioneered by
            <a
              href="https://github.com/lusaxweb/vuesax"
              target="_blank"
              rel="noopener"
              >lusaxweb/vuesax</a
            >. We are grateful for the original design philosophy — expressive,
            distinctive, and free from rigid design systems.
          </template>
        </p>
      </div>
      <router-link
        class="home-modern__btn"
        :to="withLocalePath('/guide/tribute')"
      >
        {{ t.homeReadTribute }}
      </router-link>
    </section>

    <Footer />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePageFrontmatter } from '@vuepress/client'
import { useDocLocaleUi } from '../composables/docLocale'
import Footer from './Footer.vue'
import type { SThemeProjectHomePageFrontmatter } from '../shared/frontmatter/home'

const pageFrontmatter = usePageFrontmatter<SThemeProjectHomePageFrontmatter>()
const { t, withLocalePath, locale } = useDocLocaleUi()

const heroTitle = computed(
  () =>
    pageFrontmatter.value.heroText?.replace(/<[^>]+>/g, '') || 'Sax Design Vue'
)
const heroDescription = computed(
  () =>
    pageFrontmatter.value.description ||
    (locale.value === 'zh'
      ? '现代化 Vue 3 组件库，聚焦实用指南、清晰配置与在线示例。'
      : 'A modern Vue 3 component library focused on practical usage, clear configuration, and live examples.')
)

const highlights = computed(() => [
  {
    title: t.value.highlightUsageTitle,
    description: t.value.highlightUsageDesc,
    action: t.value.highlightUsageAction,
    link: withLocalePath('/guide/getting-started/'),
  },
  {
    title: t.value.highlightComponentsTitle,
    description: t.value.highlightComponentsDesc,
    action: t.value.highlightComponentsAction,
    link: withLocalePath('/components/'),
  },
  {
    title: t.value.highlightPlaygroundTitle,
    description: t.value.highlightPlaygroundDesc,
    action: t.value.highlightPlaygroundAction,
    link: withLocalePath('/guide/playground'),
  },
])
</script>

<style lang="scss" scoped>
.home-modern {
  position: relative;
  max-width: 1080px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  overflow: hidden;
}

.home-modern__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.home-modern__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.55;

  &--1 {
    width: 320px;
    height: 320px;
    top: -80px;
    left: -60px;
    background: rgba(var(--s-accent-color), 0.35);
  }

  &--2 {
    width: 280px;
    height: 280px;
    top: 40px;
    right: -40px;
    background: rgba(var(--s-accent-secondary), 0.28);
  }

  &--3 {
    width: 360px;
    height: 360px;
    bottom: 120px;
    left: 30%;
    background: rgba(var(--s-accent-color), 0.18);
  }
}

.home-modern__hero,
.home-modern__grid,
.home-modern__tribute {
  position: relative;
  z-index: 1;
}

.home-modern__hero {
  text-align: center;
  padding: 48px 0 56px;
}

.home-modern__eyebrow {
  margin: 0 0 12px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(var(--s-accent-color));
}

.home-modern__hero h1 {
  margin: 0 0 16px;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  line-height: 1.1;
  font-weight: 700;
  color: rgb(var(--s-theme-color));
}

.home-modern__lead {
  max-width: 720px;
  margin: 0 auto 28px;
  font-size: 1.1rem;
  line-height: 1.7;
  color: rgba(var(--s-theme-color), 0.72);
}

.home-modern__cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

.home-modern__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid rgba(var(--s-theme-color), 0.12);
  background: rgba(var(--s-theme-layout), 0.9);
  color: rgb(var(--s-theme-color));
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: rgba(var(--s-accent-color), 0.35);
    color: rgb(var(--s-accent-color));
  }

  &--primary {
    border-color: transparent;
    background: rgb(var(--s-accent-color));
    color: #fff;

    &:hover {
      color: #fff;
      filter: brightness(1.05);
    }
  }
}

.home-modern__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.home-modern__card {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid rgba(var(--s-accent-color), 0.14);
  background: linear-gradient(
    155deg,
    rgba(var(--s-theme-layout), 0.92),
    rgba(var(--s-accent-color), 0.08)
  );
  box-shadow: 0 16px 40px rgba(30, 27, 75, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 20px 48px rgba(30, 27, 75, 0.12);
  }

  h2 {
    margin: 0 0 10px;
    font-size: 1.15rem;
    color: rgb(var(--s-theme-color));
  }

  p {
    margin: 0 0 16px;
    line-height: 1.6;
    color: rgba(var(--s-theme-color), 0.7);
  }
}

.home-modern__card-link {
  font-weight: 600;
  color: rgb(var(--s-accent-color));
  text-decoration: none;
}

.home-modern__tribute {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 28px;
  margin-bottom: 48px;
  border-radius: 18px;
  background: linear-gradient(
    135deg,
    rgba(var(--s-accent-color), 0.12),
    rgba(var(--s-theme-layout), 0.95)
  );
  border: 1px solid rgba(var(--s-accent-color), 0.15);

  h2 {
    margin: 0 0 8px;
    font-size: 1.35rem;
    color: rgb(var(--s-theme-color));
  }

  p {
    margin: 0;
    max-width: 640px;
    line-height: 1.7;
    color: rgba(var(--s-theme-color), 0.75);

    a {
      color: rgb(var(--s-accent-color));
      font-weight: 600;
    }
  }
}

.home-modern__tribute-label {
  margin: 0 0 6px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgb(var(--s-accent-color));
}

@media (max-width: 720px) {
  .home-modern {
    padding-top: 24px;
  }

  .home-modern__tribute {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
