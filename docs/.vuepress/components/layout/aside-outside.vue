<script setup lang="ts">
import { shallowRef } from 'vue'

const activeTool = shallowRef('settings')

const selectTool = (tool: string) => {
  activeTool.value = tool
}
</script>

<template>
  <s-layout
    class="aside-outside-demo"
    min-height="300px"
    aside-width="190px"
    :gap="18"
    :padding="12"
  >
    <template #aside>
      <div class="aside-outside-demo__brand">
        <span>S</span>
        <strong>Workspace</strong>
      </div>

      <nav class="aside-outside-demo__nav" aria-label="Workspace navigation">
        <a class="is-active" href="#aside-outside-overview">Overview</a>
        <a href="#aside-outside-projects">Projects</a>
        <a href="#aside-outside-team">Team</a>
      </nav>
    </template>

    <template #aside-outside>
      <div class="aside-outside-demo__tools" aria-label="Aside tools">
        <button
          type="button"
          aria-label="Settings"
          :aria-pressed="activeTool === 'settings'"
          :class="{ 'is-active': activeTool === 'settings' }"
          @click="selectTool('settings')"
        >
          <s-icon name="bx:cog" />
        </button>
        <button
          type="button"
          aria-label="Language"
          :aria-pressed="activeTool === 'language'"
          :class="{ 'is-active': activeTool === 'language' }"
          @click="selectTool('language')"
        >
          <s-icon name="bx:globe" />
        </button>
        <button
          type="button"
          aria-label="Theme"
          :aria-pressed="activeTool === 'theme'"
          :class="{ 'is-active': activeTool === 'theme' }"
          @click="selectTool('theme')"
        >
          <s-icon name="bxs:moon" />
        </button>
      </div>
    </template>

    <section class="aside-outside-demo__main">
      <span class="aside-outside-demo__eyebrow">Aside outside slot</span>
      <h3>Navigation and tools stay one surface</h3>
      <p>
        The aside owns the connected curve, placement, shadow, and responsive
        fallback. Slot content only provides the controls.
      </p>

      <div class="aside-outside-demo__cards">
        <article><strong>12</strong><span>Projects</span></article>
        <article><strong>4</strong><span>Teams</span></article>
      </div>
    </section>
  </s-layout>
</template>

<style scoped>
.aside-outside-demo {
  color: hsl(var(--sax-theme-color));
  font-size: 12px;
}

.aside-outside-demo__brand {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 24px;
}

.aside-outside-demo__brand > span {
  display: inline-flex;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: hsl(var(--sax-primary) / 0.13);
  color: hsl(var(--sax-primary));
  font-weight: 800;
}

.aside-outside-demo__nav {
  display: grid;
  gap: 5px;
}

.aside-outside-demo__nav > a {
  padding: 9px 11px;
  border-radius: 10px;
  color: hsl(var(--sax-theme-color) / 0.64);
  font-weight: 600;
  text-decoration: none;
}

.aside-outside-demo__nav > a.is-active {
  background: hsl(var(--sax-primary) / 0.12);
  color: hsl(var(--sax-primary));
  box-shadow: 0 8px 18px -14px hsl(var(--sax-primary) / 0.8);
}

.aside-outside-demo__tools {
  display: flex;
  align-items: center;
}

.aside-outside-demo__tools > button {
  display: inline-flex;
  width: 40px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: hsl(var(--sax-theme-color) / 0.62);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.aside-outside-demo__tools > button:hover,
.aside-outside-demo__tools > button:focus-visible,
.aside-outside-demo__tools > button.is-active {
  background: hsl(var(--sax-primary) / 0.12);
  color: hsl(var(--sax-primary));
  box-shadow: 0 7px 16px -13px hsl(var(--sax-primary) / 0.9);
  outline: none;
}

.aside-outside-demo__main {
  display: grid;
  min-height: 250px;
  align-content: center;
  gap: 9px;
  padding-bottom: 52px;
}

.aside-outside-demo__eyebrow {
  color: hsl(var(--sax-primary));
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.aside-outside-demo__main > h3,
.aside-outside-demo__main > p {
  margin: 0;
}

.aside-outside-demo__main > h3 {
  font-size: 20px;
}

.aside-outside-demo__main > p {
  max-width: 520px;
  color: hsl(var(--sax-theme-color) / 0.66);
  line-height: 1.65;
}

.aside-outside-demo__cards {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 130px));
  gap: 10px;
  margin-top: 8px;
}

.aside-outside-demo__cards > article {
  display: grid;
  gap: 2px;
  padding: 12px;
  border-radius: 13px;
  background: hsl(var(--sax-primary) / 0.06);
  box-shadow: 0 12px 24px -22px hsl(var(--sax-primary) / 0.8);
}

.aside-outside-demo__cards strong {
  font-size: 18px;
}

.aside-outside-demo__cards span {
  color: hsl(var(--sax-theme-color) / 0.58);
}

@media (max-width: 767px) {
  .aside-outside-demo__main {
    min-height: 190px;
    padding-bottom: 0;
  }
}
</style>
