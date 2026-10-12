<template>
  <main class="home-modern" aria-labelledby="home-title">
    <section class="home-modern__hero">
      <div class="home-modern__copy">
        <s-text id="home-title" tag="h1" type="primary" effect="neon">
          {{ copy.title }}
        </s-text>
        <p>{{ copy.description }}</p>
        <div class="home-modern__actions">
          <s-button type="gradient" @click="go('/guide/getting-started.html')">
            {{ copy.start }}
          </s-button>
          <s-button type="border" @click="go('/guide/playground')">
            {{ copy.playground }}
          </s-button>
        </div>
      </div>

      <ClientOnly
        ><HomeFeatureGallery
          :locale="locale"
          :router="router"
          :localize="withLocalePath"
          @navigate="go"
      /></ClientOnly>
    </section>

    <section class="home-modern__paths" :aria-label="copy.paths">
      <article v-for="item in paths" :key="item.title" class="home-path">
        <span>{{ item.index }}</span>
        <div>
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
          <s-button type="transparent" size="small" @click="go(item.link)">
            {{ item.action }} →
          </s-button>
        </div>
      </article>
    </section>

    <Footer />
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ClientOnly, useRouter } from '@vuepress/client'
import { SText } from '@vuesax-alpha/components/text'
import { useDocLocale } from '../composables/docLocale'
import Footer from './Footer.vue'
import HomeFeatureGallery from './HomeFeatureGallery.vue'

const router = useRouter()
const { locale, withLocalePath } = useDocLocale()

const copy = computed(() =>
  locale.value === 'zh'
    ? {
        title: '有亿点点不一样的 Vue3 组件库',
        description:
          '统一的无边框风格与柔和阴影，功能完整的表格，以及常用 Agent 交互组件，为数据应用和智能助手提供界面基础。',
        start: '开始学习',
        playground: '打开 Playground',
        paths: '学习路径',
        learn: '学习',
        explore: '探索',
        test: '测试',
        learnDescription: '从安装、主题到第一个组件。',
        exploreDescription: '浏览完整组件、示例和 API。',
        testDescription: '在 Playground 调整并复制代码。',
        learnAction: '阅读指南',
        exploreAction: '查看组件',
        testAction: '开始测试',
      }
    : {
        title: "A Vue3 UI library that's a little extra",
        description:
          'A consistent borderless style with soft shadows, a feature-rich data table, and ready-to-use Agent components for data apps and intelligent assistants.',
        start: 'Start guide',
        playground: 'Open Playground',
        paths: 'Documentation paths',
        learn: 'Learn',
        explore: 'Explore',
        test: 'Test',
        learnDescription:
          'Start with installation, theming, and your first component.',
        exploreDescription: 'Browse components, examples, and API references.',
        testDescription:
          'Adjust real controls in Playground and copy the code.',
        learnAction: 'Browse documentation',
        exploreAction: 'View components',
        testAction: 'Open Playground',
      },
)

const paths = computed(() => [
  {
    index: '01',
    title: copy.value.learn,
    description: copy.value.learnDescription,
    action: copy.value.learnAction,
    link: '/guide/getting-started.html',
  },
  {
    index: '02',
    title: copy.value.explore,
    description: copy.value.exploreDescription,
    action: copy.value.exploreAction,
    link: '/components/',
  },
  {
    index: '03',
    title: copy.value.test,
    description: copy.value.testDescription,
    action: copy.value.testAction,
    link: '/guide/playground',
  },
])

const go = (path: string) => router.push(withLocalePath(path))
</script>

<style lang="scss" scoped>
.home-modern {
  max-width: 1280px;
  margin: 0 auto;
  padding: 76px 32px 56px;
}

.home-modern__hero {
  display: grid;
  grid-template-columns: minmax(390px, 0.95fr) minmax(620px, 1.45fr);
  gap: clamp(40px, 7vw, 116px);
  align-items: center;
  min-height: 560px;
}

.home-modern__copy {
  h1 {
    max-width: 100%;
    margin: 0 0 18px;
    font-size: clamp(20px, calc(1.3vw + 2px), 24px);
    line-height: 1.35;
    letter-spacing: -0.02em;
    text-wrap: balance;
  }

  > p {
    max-width: 430px;
    margin: 0;
    color: hsl(var(--sax-theme-color) / 0.68);
    font-size: 1.08rem;
    line-height: 1.75;
  }
}

.home-modern__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 30px;
}

.home-modern__paths {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 42px 0 52px;
}

.home-path {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 18px;
  padding: 28px 26px;
  border-radius: 18px;
  background: hsl(var(--sax-theme-layout) / 0.76);
  box-shadow: 0 12px 28px rgba(55, 43, 145, 0.08);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 36px rgba(55, 43, 145, 0.13);
  }

  > span {
    color: hsl(var(--sax-accent-color));
    font-size: 0.78rem;
    font-weight: 700;
  }

  h2 {
    margin: 0 0 6px;
    color: hsl(var(--sax-theme-color));
    font-size: 1.05rem;
  }

  p {
    min-height: 45px;
    margin: 0 0 10px;
    color: hsl(var(--sax-theme-color) / 0.66);
    font-size: 0.88rem;
    line-height: 1.6;
  }
}

@media (max-width: 1100px) {
  .home-modern__hero {
    grid-template-columns: 1fr;
    gap: 38px;
  }

  .home-modern__copy {
    text-align: center;

    h1,
    > p {
      margin-right: auto;
      margin-left: auto;
    }
  }

  .home-modern__actions {
    justify-content: center;
  }
}

@media (max-width: 720px) {
  .home-modern {
    padding: 42px 18px 30px;
  }

  .home-modern__paths {
    grid-template-columns: 1fr;
  }

  .home-path {
    min-height: 0;
  }
}
</style>
