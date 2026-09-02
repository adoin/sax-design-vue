<template>
  <main class="home-modern" aria-labelledby="home-title">
    <section class="home-modern__hero">
      <div class="home-modern__copy">
        <s-tag type="primary" round :border="false">
          {{ copy.kicker }}
        </s-tag>
        <h1 id="home-title">{{ copy.title }}</h1>
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

      <ClientOnly>
        <section class="component-gallery" :aria-label="copy.gallery">
          <s-tabs v-model="activeGalleryTab" alignment="fixed">
            <s-tab :label="copy.all" />
            <s-tab :label="copy.dataEntry" />
            <s-tab :label="copy.feedback" />
            <s-tab :label="copy.navigation" />
          </s-tabs>

          <div
            :key="galleryMode"
            class="component-gallery__grid"
            :class="`component-gallery__grid--${galleryMode}`"
          >
            <template
              v-if="galleryMode === 'all' || galleryMode === 'data-entry'"
            >
              <div class="gallery-control gallery-control--select">
                <label>{{ copy.select }}</label>
                <s-select v-model="selectedFramework" :options="frameworks" />
              </div>

              <div class="gallery-control gallery-control--date">
                <label>{{ copy.datePicker }}</label>
                <s-date-picker v-model="demoDate" />
              </div>

              <div class="gallery-control gallery-control--slider">
                <label>{{ copy.slider }}</label>
                <div class="slider-row">
                  <s-slider v-model="sliderValue" />
                  <span>{{ sliderValue }}</span>
                </div>
              </div>

              <div class="gallery-control gallery-control--switch">
                <label>{{ copy.switch }}</label>
                <s-switch v-model="demoSwitch" />
              </div>
            </template>

            <template
              v-if="galleryMode === 'all' || galleryMode === 'feedback'"
            >
              <div class="gallery-control gallery-control--actions">
                <label>{{ copy.button }}</label>
                <div class="gallery-buttons">
                  <s-button size="small">{{ copy.primary }}</s-button>
                  <s-button size="small" type="border">{{
                    copy.secondary
                  }}</s-button>
                </div>
              </div>
            </template>

            <template
              v-if="galleryMode === 'all' || galleryMode === 'feedback'"
            >
              <div class="gallery-control gallery-control--tags">
                <label>{{ copy.tags }}</label>
                <div class="gallery-tags">
                  <s-tag color="warning" tag-style="mark" round icon="bookmark">
                    {{ copy.tagRelease }}
                  </s-tag>
                  <s-tag
                    color="primary"
                    tag-style="arrow"
                    round
                    icon="play_arrow"
                  >
                    {{ copy.tagForward }}
                  </s-tag>
                  <s-tag
                    color="success"
                    tag-style="dashed"
                    round
                    icon="verified"
                  >
                    {{ copy.tagVerified }}
                  </s-tag>
                </div>
              </div>
            </template>

            <template v-if="galleryMode === 'navigation'">
              <div class="gallery-control gallery-control--navigation">
                <label>{{ copy.navigation }}</label>
                <div class="gallery-buttons">
                  <s-button
                    size="small"
                    @click="go('/guide/getting-started.html')"
                  >
                    {{ copy.docs }}
                  </s-button>
                  <s-button
                    size="small"
                    type="border"
                    @click="go('/components/')"
                  >
                    {{ copy.components }}
                  </s-button>
                </div>
              </div>

              <div class="gallery-control gallery-control--navigation">
                <label>{{ copy.playground }}</label>
                <s-button
                  size="small"
                  type="border"
                  @click="go('/guide/playground')"
                >
                  {{ copy.open }}
                </s-button>
              </div>
            </template>

            <div class="gallery-control gallery-control--code">
              <label>{{ copy.code }}</label>
              <pre><code>{{ galleryCode }}</code></pre>
            </div>
          </div>
        </section>
      </ClientOnly>
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
import { computed, ref } from 'vue'
import { ClientOnly, useRouter } from '@vuepress/client'
import { useDocLocale } from '../composables/docLocale'
import Footer from './Footer.vue'

const router = useRouter()
const { locale, withLocalePath } = useDocLocale()

const activeGalleryTab = ref(0)
const selectedFramework = ref('Sax Design Vue')
const demoDate = ref('2026-07-24')
const sliderValue = ref(60)
const demoSwitch = ref(true)
const frameworks = ['Sax Design Vue', 'Vue 3', 'TypeScript'].map((label) => ({
  label,
  value: label,
}))

const galleryModes = ['all', 'data-entry', 'feedback', 'navigation'] as const
const galleryMode = computed(
  () => galleryModes[activeGalleryTab.value] ?? 'all',
)

const copy = computed(() =>
  locale.value === 'zh'
    ? {
        kicker: '组件画廊',
        title: '感受得到的组件系统',
        description:
          '在真实示例中理解 Sax Design Vue：统一 API、可控样式，以及顺滑的开发体验。',
        start: '开始学习',
        playground: '打开 Playground',
        gallery: '组件画廊示例',
        all: '全部',
        dataEntry: '数据输入',
        feedback: '反馈',
        navigation: '导航',
        select: '选择器',
        datePicker: '日期选择器',
        tags: '特色 Tag',
        tagRelease: '候选版本',
        tagForward: '继续',
        tagVerified: '已验证',
        slider: '滑块',
        switch: '开关',
        code: '代码预览',
        button: '按钮',
        docs: '文档',
        components: '组件',
        open: '打开',
        primary: '主操作',
        secondary: '次操作',
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
        kicker: 'Component gallery',
        title: 'A component system you can feel',
        description:
          'Meet Sax Design Vue through real examples: consistent APIs, thoughtful defaults, and a smooth developer experience.',
        start: 'Start guide',
        playground: 'Open Playground',
        gallery: 'Component gallery preview',
        all: 'All',
        dataEntry: 'Data entry',
        feedback: 'Feedback',
        navigation: 'Navigation',
        select: 'Select',
        datePicker: 'Date picker',
        tags: 'Featured tags',
        tagRelease: 'Release candidate',
        tagForward: 'Continue',
        tagVerified: 'Verified',
        slider: 'Slider',
        switch: 'Switch',
        code: 'Code preview',
        button: 'Button',
        docs: 'Docs',
        components: 'Components',
        open: 'Open',
        primary: 'Primary',
        secondary: 'Secondary',
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

const galleryCode = computed(() => {
  if (galleryMode.value === 'all') {
    return '<s-tag tag-style="mark" round>Release candidate</s-tag>\n<s-tag tag-style="arrow" round>Continue</s-tag>'
  }

  if (galleryMode.value === 'feedback') {
    return '<s-tag tag-style="dashed" round>Verified</s-tag>\n<s-button>Save</s-button>'
  }

  if (galleryMode.value === 'navigation') {
    return '<s-button>Docs</s-button>\n<s-button>Playground</s-button>'
  }

  return '<s-select v-model="value" />\n<s-date-picker v-model="date" />'
})

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
    max-width: 440px;
    margin: 18px 0;
    font-size: clamp(2.7rem, 4vw, 3.9rem);
    line-height: 1.02;
    letter-spacing: -0.06em;
    color: hsl(var(--sax-theme-color));
  }

  > p {
    max-width: 430px;
    margin: 0;
    color: hsl(var(--sax-theme-color) / 0.68);
    font-size: 1.08rem;
    line-height: 1.75;
  }
}

.home-modern__actions,
.gallery-buttons,
.gallery-tags,
.slider-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.home-modern__actions {
  margin-top: 30px;
}

.component-gallery {
  padding: 26px 28px 28px;
  border: 1px solid hsl(var(--sax-accent-color) / 0.16);
  border-radius: 24px;
  background: hsl(var(--sax-theme-layout) / 0.94);
  box-shadow: 0 24px 70px rgba(55, 43, 145, 0.13);
}

.component-gallery__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px 20px;
  margin-top: 28px;

  &--data-entry,
  &--feedback,
  &--navigation {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  &--feedback {
    .gallery-control--code {
      align-self: end;
    }
  }

  &--all {
    .gallery-control--tags {
      grid-column: span 2;
      align-self: end;
    }

    .gallery-control--code {
      align-self: end;
    }
  }

  &--navigation {
    .gallery-control--code {
      grid-column: span 2;
    }
  }
}

.gallery-control {
  min-width: 0;

  label {
    display: block;
    margin-bottom: 9px;
    color: hsl(var(--sax-theme-color) / 0.72);
    font-size: 0.78rem;
    font-weight: 600;
  }

  :deep(.s-select),
  :deep(.s-date-picker) {
    width: 100%;
  }
}

.gallery-control--slider,
.gallery-control--switch,
.gallery-control--actions {
  align-self: end;
}

.gallery-tags {
  flex-wrap: wrap;
  min-height: 34px;
}

.slider-row {
  :deep(.s-slider) {
    flex: 1;
    min-width: 0;
  }

  span {
    min-width: 32px;
    color: hsl(var(--sax-accent-color));
    font-weight: 600;
    text-align: right;
  }
}

.gallery-control--code {
  pre {
    min-height: 62px;
    margin: 0;
    padding: 12px 14px;
    overflow: hidden;
    border-radius: 12px;
    background: hsl(var(--sax-theme-bg) / 0.86);
    color: hsl(var(--sax-accent-color));
    font-size: 0.73rem;
    line-height: 1.65;
    white-space: pre-wrap;
  }
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

@media (max-width: 1000px) {
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

  .component-gallery {
    padding: 18px;
  }

  .component-gallery__grid {
    grid-template-columns: 1fr;

    &--all .gallery-control--tags,
    &--navigation .gallery-control--code {
      grid-column: auto;
    }
  }

  .home-modern__paths {
    grid-template-columns: 1fr;
  }

  .home-path {
    min-height: 0;
  }
}
</style>
