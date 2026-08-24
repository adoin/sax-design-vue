---
PROPS:
  - name: active
    type: Number
    values: index
    description: 当前步骤下标，支持 v-model:active。
    default: '0'
  - name: items
    type: StepItem[]
    values: '{ key?, title, description?, meta?, status?, statusLabel?, disabled?, clickable?, icon? }[]'
    description: 步骤数据。
    default: '[]'
  - name: variant
    type: String
    values: rail / timeline
    description: 聚焦轨道或上下文时间线。
    default: rail
  - name: direction
    type: String
    values: horizontal / vertical
    description: 排列方向；timeline 默认纵向。
    default: 按 variant 推导
  - name: size
    type: String
    values: small / default / large
    description: 步骤尺寸。
    default: default
  - name: finish-status
    type: StepStatus
    values: wait / process / finish / success / error / loading / disabled
    description: 已经过的步骤状态。
    default: finish
  - name: process-status
    type: StepStatus
    values: wait / process / finish / success / error / loading / disabled
    description: 当前步骤状态。
    default: process
  - name: status-labels
    type: Partial<Record<StepStatus, string>>
    values: object
    description: 覆盖各状态的内置国际化文案。
    default: '{}'
  - name: clickable
    type: Boolean
    values: true / false
    description: 是否允许点击切换步骤。
    default: 'true'
  - name: show-progress
    type: Boolean
    values: true / false
    description: 是否显示步骤连接轨道。
    default: 'true'
  - name: show-step-index
    type: Boolean
    values: true / false
    description: 是否在当前步骤显示进度序号。
    default: 'true'
  - name: responsive
    type: Boolean
    values: true / false
    description: 小屏时将横向轨道转为纵向。
    default: 'true'
  - name: simple
    type: Boolean
    values: true / false
    description: 移除轨道，适合完整 item 插槽布局。
    default: 'false'
  - name: aria-label
    type: String
    values: text
    description: 步骤导航的无障碍名称。
    default: —
EVENTS:
  - name: update:active
    description: 激活步骤变化时触发，可用于 v-model:active。
  - name: change
    description: 步骤变化时触发，返回下标和步骤项。
  - name: click
    description: 点击可用步骤时触发，返回下标和步骤项。
SLOTS:
  - name: item
    description: 完整替换单个步骤内容，参数为 item、index、status、statusLabel、icon、active、disabled、interactive。
  - name: icon
    description: 自定义标记图标，参数同 item。
  - name: title / description / meta
    description: 自定义对应文本，参数同 item。
  - name: content
    description: 时间线当前步骤的上下文内容，参数同 item。
  - name: actions
    description: 时间线当前步骤的操作区，参数同 item。
description: '支持聚焦轨道、上下文时间线、完整状态与可组合内容的步骤组件。'
---

# Steps 步骤条

## 聚焦轨道

适合注册、配置等线性流程，当前步骤具有更强的视觉焦点。

<card><template #example><steps-default /></template><template #template>

@[code](../../.vuepress/components/steps/default.vue)

</template></card>

## 上下文时间线

当前步骤可展开说明和操作，适合部署、审核等长流程。

<card><template #example><steps-timeline /></template><template #template>

@[code](../../.vuepress/components/steps/timeline.vue)

</template></card>

## 自定义步骤内容

使用 `item` 插槽完整替换步骤内容，可实现卡片式步骤。

<card><template #example><steps-custom-item /></template><template #template>

@[code](../../.vuepress/components/steps/custom-item.vue)

</template></card>

## 状态

内置等待、进行、加载、完成、成功、错误和禁用状态。

<card><template #example><steps-states /></template><template #template>

@[code](../../.vuepress/components/steps/states.vue)

</template></card>
