<script lang="ts" setup>
import { computed, ref, shallowRef } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import type {
  ContextMenuItem,
  FormGroupErrors,
  FormGroupInstance,
  FormGroupItem,
  FormGroupItemContext,
  FormGroupProps,
} from 'sax-design-vue'

interface Project {
  name: string
  owner: string
}

const itemCount = 25
const invalidItemNumber = 20
const { lang } = useLocale()
const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        project: '项目',
        owner: '负责人',
        projectPlaceholder: '项目名称',
        ownerPlaceholder: '负责人',
        projectRequired: '请输入项目名称',
        ownerRequired: '请输入负责人',
        lazyForms: '个懒渲染表单',
        initialHint:
          '初始绑定数据中仅第 20 项的项目名称为空。渲染阈值为 5，未打开的非激活表单不会挂载。',
        batchTitle: '项目批量表单',
        batchDescription: '校验所有数据，包括从未渲染过的标签内容。',
        indexTrace: '索引追踪',
        stableIndexNote: '标签名称使用稳定索引，删除后不会复用编号。',
        validateAll: '校验全部',
        items: '项',
        validationPassed: '校验通过',
        validationFailed: '校验失败',
        invalidItem: '未通过项',
        invalidDescription:
          'FormGroup 已激活第一个错误标签，并标记了对应的输入框。',
        allPassed: '全部数据均已通过校验。',
        close: '关闭',
        closeOthers: '关闭其他',
        closeLeft: '关闭左侧',
        closeRight: '关闭右侧',
        arrayIndex: '数组下标',
        zeroBased: '从 0 开始',
        stableIndex: '稳定 __index',
        addedAt: '新增位置',
        labelSeparator: '：',
        sentenceSeparator: '。',
      }
    : {
        project: 'Project',
        owner: 'Owner',
        projectPlaceholder: 'Project name',
        ownerPlaceholder: 'Owner',
        projectRequired: 'Enter a project name',
        ownerRequired: 'Enter an owner',
        lazyForms: 'lazy forms',
        initialHint:
          'Initially, all bound values are valid except the project name in item 20. With a render threshold of 5, inactive forms are not mounted before they are opened.',
        batchTitle: 'Project batch',
        batchDescription:
          'Validate every item, including tabs that have never rendered.',
        indexTrace: 'Index trace',
        stableIndexNote:
          'Tab labels use the stable index, so removed numbers are not reused.',
        validateAll: 'Validate all',
        items: 'items',
        validationPassed: 'Validation passed',
        validationFailed: 'Validation failed',
        invalidItem: 'Invalid item',
        invalidDescription:
          'FormGroup has activated the first invalid tab and marked its input field.',
        allPassed: 'All data passed validation.',
        close: 'Close',
        closeOthers: 'Close others',
        closeLeft: 'Close left',
        closeRight: 'Close right',
        arrayIndex: 'array index',
        zeroBased: 'zero-based',
        stableIndex: 'stable __index',
        addedAt: 'Added at',
        labelSeparator: ': ',
        sentenceSeparator: '. ',
      },
)
const projects = ref<FormGroupItem<Project>[]>(
  Array.from({ length: itemCount }, (_, index) => ({
    name:
      index === invalidItemNumber - 1
        ? ''
        : `${copy.value.project} ${index + 1}`,
    owner: `${copy.value.owner} ${index + 1}`,
  })),
)
const groupRef = ref<FormGroupInstance>()
const validating = ref(false)
const validationState = shallowRef<'idle' | 'valid' | 'invalid'>('idle')
const errors = shallowRef<FormGroupErrors>({})
const actionMessage = shallowRef('')
let nextProjectNumber = itemCount + 1

const invalidItems = computed(() =>
  Object.keys(errors.value)
    .map((index) => Number(index) + 1)
    .join(', '),
)

const getFormSetting: FormGroupProps<Project>['getFormSetting'] = () => ({
  labelWidth: 88,
  items: [
    {
      field: 'name',
      title: copy.value.project,
      rules: { required: true, message: copy.value.projectRequired },
      itemRender: {
        name: 'SInput',
        props: { placeholder: copy.value.projectPlaceholder },
      },
    },
    {
      field: 'owner',
      title: copy.value.owner,
      rules: { required: true, message: copy.value.ownerRequired },
      itemRender: {
        name: 'SInput',
        props: { placeholder: copy.value.ownerPlaceholder },
      },
    },
  ],
})

const createProject = () => {
  const number = nextProjectNumber++
  return {
    name: `${copy.value.project} ${number}`,
    owner: `${copy.value.owner} ${number}`,
  }
}

const getContextMenuItems: FormGroupProps<Project>['getContextMenuItems'] = ({
  index,
  list,
}) => [
  { label: copy.value.close, value: 'close' },
  {
    label: copy.value.closeOthers,
    value: 'others',
    divided: true,
    disabled: list.length <= 1,
  },
  {
    label: copy.value.closeLeft,
    value: 'left',
    disabled: index === 0,
  },
  {
    label: copy.value.closeRight,
    value: 'right',
    disabled: index === list.length - 1,
  },
]

const describeContext = ({ index, key }: FormGroupItemContext<Project>) =>
  lang.value.startsWith('zh')
    ? `${copy.value.arrayIndex} ${index}（${copy.value.zeroBased}），${copy.value.stableIndex} ${key}`
    : `${copy.value.arrayIndex} ${index} (${copy.value.zeroBased}), ${copy.value.stableIndex} ${key}`

const handleContextMenu = (
  menuItem: ContextMenuItem,
  context: FormGroupItemContext<Project>,
) => {
  const { index, key } = context
  actionMessage.value = `${menuItem.label}${copy.value.labelSeparator}${describeContext(context)}`
  if (menuItem.value === 'close')
    projects.value = projects.value.filter(
      (_, itemIndex) => itemIndex !== index,
    )
  if (menuItem.value === 'others')
    projects.value = projects.value.filter((item) => item.__index === key)
  if (menuItem.value === 'left') projects.value = projects.value.slice(index)
  if (menuItem.value === 'right')
    projects.value = projects.value.slice(0, index + 1)
}

const handleAdd = (item: FormGroupItem<Project>, index: number) => {
  actionMessage.value = lang.value.startsWith('zh')
    ? `${copy.value.addedAt}：${copy.value.arrayIndex} ${index}（${copy.value.zeroBased}），${copy.value.stableIndex} ${item.__index}`
    : `${copy.value.addedAt} ${copy.value.arrayIndex} ${index} (${copy.value.zeroBased}), ${copy.value.stableIndex} ${item.__index}`
}

const validateAll = async () => {
  validating.value = true
  const valid = (await groupRef.value?.validateAll()) ?? false
  errors.value = groupRef.value?.getErrors() ?? {}
  validationState.value = valid ? 'valid' : 'invalid'
  validating.value = false
}
</script>

<template>
  <div class="large-data-example">
    <s-alert type="flat">
      <template #title>{{ projects.length }} {{ copy.lazyForms }}</template>
      {{ copy.initialHint }}
    </s-alert>

    <s-form-group
      ref="groupRef"
      v-model="projects"
      :title="copy.batchTitle"
      :description="copy.batchDescription"
      :tab-label="copy.project"
      show-add
      :max="50"
      :create-item="createProject"
      :render-threshold="5"
      :get-context-menu-items="getContextMenuItems"
      :get-form-setting="getFormSetting"
      @add="handleAdd"
      @context-menu-select="handleContextMenu"
    />

    <s-alert v-if="actionMessage" type="flat">
      <template #title>{{ copy.indexTrace }}</template>
      {{ actionMessage }}{{ copy.sentenceSeparator }}{{ copy.stableIndexNote }}
    </s-alert>

    <div class="large-data-actions">
      <s-button type="border" :loading="validating" @click="validateAll">
        {{ copy.validateAll }} {{ projects.length }} {{ copy.items }}
      </s-button>

      <s-alert
        v-if="validationState !== 'idle'"
        class="large-data-result"
        type="flat"
        :color="validationState === 'valid' ? 'success' : 'danger'"
      >
        <template #title>
          {{
            validationState === 'valid'
              ? copy.validationPassed
              : copy.validationFailed
          }}
        </template>
        <template v-if="validationState === 'invalid'">
          {{ copy.invalidItem }}{{ copy.labelSeparator }}{{ invalidItems
          }}{{ copy.sentenceSeparator }}{{ copy.invalidDescription }}
        </template>
        <template v-else>{{ copy.allPassed }}</template>
      </s-alert>
    </div>
  </div>
</template>

<style scoped>
.large-data-example,
.large-data-actions {
  display: grid;
  gap: 16px;
}

.large-data-actions {
  justify-items: start;
}

.large-data-result {
  width: 100%;
}
</style>
