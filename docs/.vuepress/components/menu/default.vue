<script lang="ts" setup>
import { shallowRef } from 'vue'

const active = shallowRef('weekly')
const openKeys = shallowRef(['workspace', 'reports'])
const preservedOpenKeys = shallowRef([...openKeys.value])
const collapsed = shallowRef(false)
const items = [
  { key: 'overview', label: 'Overview', icon: 'cb:home' },
  {
    key: 'workspace',
    label: 'Workspace',
    icon: 'cb:workspace',
    children: [
      { key: 'projects', label: 'Projects', badge: 8 },
      {
        key: 'reports',
        label: 'Reports',
        children: [
          { key: 'weekly', label: 'Weekly report' },
          { key: 'quarterly', label: 'Quarterly report' },
        ],
      },
    ],
  },
  { key: 'team', label: 'Team', icon: 'cb:group' },
]

const toggleCollapsed = () => {
  if (collapsed.value) {
    collapsed.value = false
    openKeys.value = [...preservedOpenKeys.value]
    return
  }

  preservedOpenKeys.value = [...openKeys.value]
  openKeys.value = []
  collapsed.value = true
}
</script>

<template>
  <s-layout
    class="menu-demo"
    :aside-width="collapsed ? 82 : 276"
    :gap="12"
    :padding="12"
    min-height="430px"
    :responsive="false"
  >
    <template #aside>
      <div :class="['menu-demo__sidebar', { 'is-collapsed': collapsed }]">
        <div class="menu-demo__brand">
          <span class="menu-demo__brand-mark" aria-hidden="true">
            <s-icon name="cb:workspace" />
          </span>
          <span class="menu-demo__brand-name">Sax Workspace</span>
        </div>

        <s-menu
          id="menu-demo-navigation"
          v-model="active"
          v-model:open-keys="openKeys"
          class="menu-demo__navigation"
          :options="items"
          :collapse="collapsed"
          variant="plain"
          unique-open
        />

        <div class="menu-demo__footer">
          <s-button
            class="menu-demo__toggle"
            type="transparent"
            size="small"
            :block="!collapsed"
            :icon="collapsed"
            :aria-label="
              collapsed ? 'Expand navigation' : 'Collapse navigation'
            "
            :aria-expanded="!collapsed"
            aria-controls="menu-demo-navigation"
            @click="toggleCollapsed"
          >
            <s-icon
              :name="collapsed ? 'cb:chevron-right' : 'cb:chevron-left'"
            />
            <span v-if="!collapsed">Collapse navigation</span>
          </s-button>
        </div>
      </div>
    </template>

    <section class="menu-demo__workspace" aria-label="Workspace overview">
      <div class="menu-demo__workspace-header">
        <div>
          <p class="menu-demo__eyebrow">Workspace overview</p>
          <h3>Good morning, Lina</h3>
        </div>
        <s-button size="small">New project</s-button>
      </div>

      <div class="menu-demo__metrics">
        <article>
          <span>Active projects</span>
          <strong>24</strong>
          <small>4 this week</small>
        </article>
        <article>
          <span>Completion</span>
          <strong>86%</strong>
          <small>Above target</small>
        </article>
        <article>
          <span>Team focus</span>
          <strong>92</strong>
          <small>Healthy pace</small>
        </article>
      </div>

      <div class="menu-demo__activity">
        <div>
          <strong>Website redesign</strong>
          <span>Design system · 8 tasks</span>
        </div>
        <s-tag color="primary">In progress</s-tag>
      </div>
      <div class="menu-demo__activity">
        <div>
          <strong>Mobile onboarding</strong>
          <span>Product design · 5 tasks</span>
        </div>
        <s-tag color="warn">Review</s-tag>
      </div>
    </section>
  </s-layout>
</template>

<style scoped>
.menu-demo {
  width: 100%;
}

.menu-demo__sidebar {
  box-sizing: border-box;
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  gap: 10px;
}

.menu-demo__brand {
  display: flex;
  min-height: 44px;
  align-items: center;
  gap: 10px;
  padding-inline: 4px;
  overflow: hidden;
}

.menu-demo__brand-mark {
  display: inline-flex;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: hsl(var(--sax-primary) / 0.12);
  color: hsl(var(--sax-primary));
  box-shadow: 0 8px 20px hsl(var(--sax-primary) / 0.14);
}

.menu-demo__brand-name {
  max-width: 180px;
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  opacity: 1;
  white-space: nowrap;
  transition:
    max-width var(--sax-motion-duration) var(--sax-motion-easing-standard),
    opacity var(--sax-motion-duration-fast) var(--sax-motion-easing-standard),
    transform var(--sax-motion-duration) var(--sax-motion-easing-standard);
}

.is-collapsed .menu-demo__brand {
  justify-content: center;
  gap: 0;
  padding-inline: 0;
}

.is-collapsed .menu-demo__brand-name {
  max-width: 0;
  opacity: 0;
  transform: translateX(-8px);
}

.menu-demo__navigation {
  width: 100%;
  flex: 1;
}

.menu-demo__footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
}

.is-collapsed .menu-demo__footer {
  justify-content: center;
}

.menu-demo__toggle {
  min-height: 44px;
  justify-content: flex-start;
  gap: 8px;
  margin-left: 0;
  opacity: 0.72;
}

.menu-demo__toggle:hover {
  background: hsl(var(--sax-primary) / 0.09);
  color: hsl(var(--sax-primary));
  opacity: 1;
  box-shadow: 0 8px 20px hsl(var(--sax-primary) / 0.12);
}

.is-collapsed .menu-demo__toggle {
  width: 44px;
  justify-content: center;
}

.menu-demo :deep(.s-layout-aside) {
  min-width: 0;
  padding: 10px;
  transition: width var(--sax-motion-duration) var(--sax-motion-easing-standard);
}

.menu-demo :deep(.s-layout-body) {
  padding: 22px;
}

.menu-demo__workspace {
  display: flex;
  min-width: 0;
  height: 100%;
  flex-direction: column;
  gap: 12px;
}

.menu-demo__workspace-header,
.menu-demo__activity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.menu-demo__workspace-header h3 {
  margin: 3px 0 0;
  font-size: 18px;
}

.menu-demo__eyebrow {
  margin: 0;
  color: hsl(var(--sax-text-color) / 0.86);
  font-size: 10px;
  font-weight: 750;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.menu-demo__metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.menu-demo__metrics article,
.menu-demo__activity {
  border-radius: var(--sax-radius-lg);
  background: hsl(var(--sax-background) / 0.72);
  box-shadow:
    0 12px 30px -24px rgba(0, 0, 0, 0.72),
    inset 0 1px 0 hsl(var(--sax-theme-color) / 0.06);
}

.menu-demo__metrics article {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  padding: 14px;
}

.menu-demo__metrics span,
.menu-demo__activity span {
  color: hsl(var(--sax-theme-color) / 0.62);
  font-size: 11px;
}

.menu-demo__metrics strong {
  font-size: 22px;
}

.menu-demo__metrics small {
  color: hsl(var(--sax-success) / 0.9);
  font-size: 10px;
}

.menu-demo__activity {
  padding: 12px 14px;
}

.menu-demo__activity > div {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

@media (max-width: 680px) {
  .menu-demo__metrics {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .menu-demo__sidebar,
  .menu-demo__brand-name {
    transition-duration: 0.01ms;
  }
}
</style>
