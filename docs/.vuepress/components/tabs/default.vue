<script lang="ts" setup>
import { computed, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import type {
  TabsPosition,
  TabsSize,
  TabsType,
} from '@vuesax-alpha/components/tabs'

const active = shallowRef('overview')
const type = shallowRef<TabsType>('pill')
const position = shallowRef<TabsPosition>('top')
const size = shallowRef<TabsSize>('default')
const animated = shallowRef(true)
const { lang } = useLocale()

const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        type: '外观',
        position: '位置',
        size: '尺寸',
        animated: '内容动效',
        typeOptions: [
          { label: '轨道', value: 'line' },
          { label: '胶囊', value: 'pill' },
          { label: '卡片', value: 'card' },
          { label: '连体卡片', value: 'connected-card' },
        ],
        positionOptions: [
          { label: '顶部', value: 'top' },
          { label: '底部', value: 'bottom' },
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ],
        sizeOptions: [
          { label: '小', value: 'small' },
          { label: '默认', value: 'default' },
          { label: '大', value: 'large' },
        ],
        tabs: [
          {
            name: 'overview',
            label: '概览',
            icon: 'cb:dashboard',
            title: '项目概览',
            description: '集中查看项目状态与近期活动。',
          },
          {
            name: 'activity',
            label: '活动',
            icon: 'cb:activity',
            title: '活动记录',
            description: '追踪团队最近完成的操作。',
          },
          {
            name: 'settings',
            label: '设置',
            icon: 'cb:settings',
            title: '项目设置',
            description: '管理成员、通知与工作区偏好。',
          },
        ],
      }
    : {
        type: 'Style',
        position: 'Position',
        size: 'Size',
        animated: 'Content motion',
        typeOptions: [
          { label: 'Line', value: 'line' },
          { label: 'Pill', value: 'pill' },
          { label: 'Card', value: 'card' },
          { label: 'Connected card', value: 'connected-card' },
        ],
        positionOptions: [
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
        ],
        sizeOptions: [
          { label: 'Small', value: 'small' },
          { label: 'Default', value: 'default' },
          { label: 'Large', value: 'large' },
        ],
        tabs: [
          {
            name: 'overview',
            label: 'Overview',
            icon: 'cb:dashboard',
            title: 'Project overview',
            description:
              'Review project health and recent activity in one place.',
          },
          {
            name: 'activity',
            label: 'Activity',
            icon: 'cb:activity',
            title: 'Activity log',
            description: 'Track the latest actions completed by your team.',
          },
          {
            name: 'settings',
            label: 'Settings',
            icon: 'cb:settings',
            title: 'Project settings',
            description:
              'Manage members, notifications, and workspace preferences.',
          },
        ],
      },
)
</script>

<template>
  <div class="tabs-lab">
    <div class="tabs-lab__controls">
      <label class="tabs-lab__row">
        <span class="tabs-lab__label">{{ copy.type }}</span>
        <s-radio-group
          v-model="type"
          type="button"
          :options="copy.typeOptions"
        />
      </label>
      <label class="tabs-lab__row">
        <span class="tabs-lab__label">{{ copy.position }}</span>
        <s-radio-group
          v-model="position"
          type="button"
          :options="copy.positionOptions"
        />
      </label>
      <div class="tabs-lab__row">
        <span class="tabs-lab__label">{{ copy.size }}</span>
        <div class="tabs-lab__row-content">
          <s-radio-group
            v-model="size"
            type="button"
            :options="copy.sizeOptions"
          />
          <label class="tabs-lab__switch">
            <span>{{ copy.animated }}</span>
            <s-switch v-model="animated" />
          </label>
        </div>
      </div>
    </div>

    <s-tabs
      v-model="active"
      :type="type"
      :position="position"
      :size="size"
      :animated="animated"
    >
      <s-tab
        v-for="tab in copy.tabs"
        :key="tab.name"
        :name="tab.name"
        :label="tab.label"
        :icon="tab.icon"
      >
        <section
          :class="[
            'tabs-lab__panel',
            { 'tabs-lab__panel--connected': type === 'connected-card' },
          ]"
        >
          <strong>{{ tab.title }}</strong>
          <span>{{ tab.description }}</span>
        </section>
      </s-tab>
    </s-tabs>
  </div>
</template>

<style scoped>
.tabs-lab {
  display: grid;
  gap: 22px;
}

.tabs-lab__controls {
  display: grid;
  gap: 10px;
  padding: 14px;
  border-radius: 18px;
  background: hsl(var(--sax-background) / 0.72);
  box-shadow: 0 18px 42px -30px hsl(var(--sax-primary) / 0.48);
}

.tabs-lab__row {
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  align-items: center;
  gap: 14px;
  min-width: 0;
  padding: 8px 10px;
  border-radius: 14px;
  background: hsl(var(--sax-background) / 0.48);
  box-shadow: 0 10px 24px -22px hsl(var(--sax-text) / 0.32);
}

.tabs-lab__label,
.tabs-lab__switch > span {
  color: hsl(var(--sax-text) / 0.58);
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}

.tabs-lab__row-content {
  display: grid;
  width: fit-content;
  max-width: 100%;
  min-width: 0;
  grid-template-columns: max-content max-content;
  align-items: center;
  justify-content: start;
  gap: 28px;
}

.tabs-lab__switch {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 10px;
}

.tabs-lab__panel {
  display: grid;
  min-height: 138px;
  place-content: center;
  gap: 8px;
  padding: 18px;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    hsl(var(--sax-primary) / 0.075),
    transparent
  );
  box-shadow: 0 20px 44px -32px hsl(var(--sax-primary) / 0.45);
  text-align: center;
}

.tabs-lab__panel span {
  max-width: 420px;
  color: hsl(var(--sax-text) / 0.58);
}

.tabs-lab__panel--connected {
  min-height: 150px;
  padding-top: 26px;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

@media (max-width: 760px) {
  .tabs-lab__row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .tabs-lab__row-content {
    width: 100%;
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .tabs-lab__switch {
    justify-self: start;
  }
}
</style>
