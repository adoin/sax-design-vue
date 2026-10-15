<script lang="ts" setup>
import { shallowRef } from 'vue'

type NavbarVariant = 'surface' | 'floating' | 'transparent'
type NavbarSize = 'compact' | 'comfortable' | 'spacious'

const active = shallowRef('overview')
const variant = shallowRef<NavbarVariant>('floating')
const size = shallowRef<NavbarSize>('comfortable')
const color = shallowRef('#6366F1')
const gap = shallowRef(12)
const shadow = shallowRef(false)
const shadowScroll = shallowRef(false)
const blurred = shallowRef(false)
const textWhite = shallowRef(false)
const grouped = shallowRef(true)
const square = shallowRef(false)
const hideScroll = shallowRef(false)
const paddingScroll = shallowRef(false)
const notLine = shallowRef(false)

const surfaceOptions = [
  { label: '表面', value: 'surface' },
  { label: '悬浮', value: 'floating' },
  { label: '透明', value: 'transparent' },
]
const sizeOptions = [
  { label: '紧凑', value: 'compact' },
  { label: '舒适（默认）', value: 'comfortable' },
  { label: '宽松', value: 'spacious' },
]
const colors = ['#6366F1', '#A855F7', '#2DD4BF', '#F97316']
</script>

<template>
  <div class="navbar-lab">
    <div id="navbar-lab-scroll" class="navbar-lab__scroll">
      <s-navbar
        v-model="active"
        :variant="variant"
        position="sticky"
        :size="size"
        :color="color"
        :gap="gap"
        :shadow="shadow"
        :shadow-scroll="shadowScroll"
        :blurred="blurred"
        :text-white="textWhite"
        :square="square"
        :hide-scroll="hideScroll"
        :padding-scroll="paddingScroll"
        :not-line="notLine"
        target-scroll="#navbar-lab-scroll"
        center-collapsed
        content-width="1100px"
      >
        <template #brand>
          <a
            class="navbar-lab__brand"
            href="#navbar-playground"
            aria-label="Sax 首页"
          >
            <img src="/sax-logo-mark.svg" alt="" />
            <strong>Sax</strong>
          </a>
        </template>

        <s-navbar-item id="overview" icon="bx:home-alt">
          概览
        </s-navbar-item>
        <s-navbar-group v-if="grouped">
          产品
          <template #items>
            <s-navbar-item id="components">组件</s-navbar-item>
            <s-navbar-item id="templates" badge="12">模板</s-navbar-item>
            <s-navbar-item id="changelog">更新日志</s-navbar-item>
          </template>
        </s-navbar-group>
        <s-navbar-item v-else id="product">产品</s-navbar-item>
        <s-navbar-item id="docs">文档</s-navbar-item>

        <template #actions>
          <s-button type="flat">登录</s-button>
          <s-button>开始使用</s-button>
        </template>
      </s-navbar>

      <div id="navbar-playground" class="navbar-lab__stage">
        <section class="navbar-lab__panel navbar-lab__panel--controls">
          <div class="navbar-lab__heading">
            <span>导航栏配置</span>
            <strong>配置导航栏状态</strong>
            <small>滚动面板，观察导航栏的滚动行为。</small>
          </div>

          <div class="navbar-lab__controls">
            <label class="navbar-lab__field">
              <span>表面</span>
              <s-radio-group
                v-model="variant"
                type="button"
                :options="surfaceOptions"
              />
            </label>

            <label class="navbar-lab__field">
              <span>尺寸</span>
              <s-radio-group
                v-model="size"
                type="button"
                :options="sizeOptions"
              />
            </label>

            <label class="navbar-lab__field">
              <span>强调色</span>
              <s-color-picker v-model="color" :predefine="colors" />
            </label>

            <label class="navbar-lab__field navbar-lab__field--slider">
              <span>区域间距 · {{ gap }}px</span>
              <s-slider v-model="gap" :min="4" :max="32" :step="2" />
            </label>
          </div>

          <div class="navbar-lab__toggles">
            <label class="navbar-lab__toggle">
              <span>阴影</span>
              <s-switch v-model="shadow" />
            </label>
            <label class="navbar-lab__toggle">
              <span>滚动时显示阴影</span>
              <s-switch v-model="shadowScroll" />
            </label>
            <label class="navbar-lab__toggle">
              <span>玻璃模糊</span>
              <s-switch v-model="blurred" />
            </label>
            <label class="navbar-lab__toggle">
              <span>白色文字</span>
              <s-switch v-model="textWhite" />
            </label>
            <label class="navbar-lab__toggle">
              <span>分组菜单</span>
              <s-switch v-model="grouped" />
            </label>
            <label class="navbar-lab__toggle">
              <span>方角</span>
              <s-switch v-model="square" />
            </label>
            <label class="navbar-lab__toggle">
              <span>滚动时隐藏</span>
              <s-switch v-model="hideScroll" />
            </label>
            <label class="navbar-lab__toggle">
              <span>滚动间距</span>
              <s-switch v-model="paddingScroll" />
            </label>
            <label class="navbar-lab__toggle">
              <span>隐藏激活线</span>
              <s-switch v-model="notLine" />
            </label>
          </div>
        </section>

        <section class="navbar-lab__panel">
          <span>导航内容</span>
          <strong>通过插槽组合内容</strong>
        </section>
        <section class="navbar-lab__panel">
          <span>滚动预览</span>
          <strong>继续滚动</strong>
        </section>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.navbar-lab {
  overflow: hidden;
  background:
    radial-gradient(
      circle at 12% 8%,
      hsl(280deg 72% 58% / 0.12),
      transparent 32%
    ),
    radial-gradient(
      circle at 88% 4%,
      hsl(173deg 68% 50% / 0.12),
      transparent 28%
    ),
    hsl(220deg 35% 95%);

  &__scroll {
    position: relative;
    max-height: 620px;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  &__brand {
    display: inline-flex;
    min-height: 44px;
    align-items: center;
    gap: 8px;
    color: inherit;
    text-decoration: none;

    img {
      width: 34px;
      height: 30px;
    }

    strong {
      font-size: 1rem;
      letter-spacing: -0.02em;
    }
  }

  &__stage {
    display: grid;
    gap: 18px;
    padding: 26px;
  }

  &__panel {
    display: flex;
    min-height: 220px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 24px;
    background: hsl(0deg 0% 100% / 0.74);
    box-shadow: 0 16px 40px hsl(231deg 40% 26% / 0.09);
    color: hsl(236deg 38% 15%);

    > span {
      color: hsl(233deg 14% 52%);
      font-size: 0.78rem;
      text-transform: uppercase;
    }
  }

  &__panel--controls {
    min-height: auto;
    align-items: stretch;
    justify-content: flex-start;
    gap: 20px;
    padding: 22px;
  }

  &__heading {
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
      color: hsl(233deg 14% 48%);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    strong {
      font-size: 1.2rem;
    }

    small {
      color: hsl(233deg 12% 48%);
    }
  }

  &__controls {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: end;
  }

  &__field,
  &__toggle {
    display: flex;
    gap: 8px;
    color: hsl(233deg 17% 40%);
    font-size: 0.75rem;
    font-weight: 600;
  }

  &__field {
    min-width: 0;
    flex-direction: column;
  }

  &__field--slider {
    padding-bottom: 8px;
  }

  &__toggles {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 10px;
  }

  &__toggle {
    min-height: 52px;
    align-items: center;
    justify-content: space-between;
    padding: 0 13px;
    border-radius: 15px;
    background: hsl(var(--sax-primary) / 0.055);
    box-shadow: inset 0 2px 7px hsl(var(--sax-primary) / 0.055);
  }
}

@media (max-width: 720px) {
  .navbar-lab {
    &__stage {
      padding: 14px;
    }

    &__controls,
    &__toggles {
      grid-template-columns: 1fr;
    }

    &__panel--controls {
      padding: 16px;
    }
  }
}
</style>
