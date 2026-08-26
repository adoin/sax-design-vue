<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useLocale } from '@vuesax-alpha/hooks'
import type {
  ContextMenuItem,
  FormGroupInstance,
  FormGroupItem,
  FormGroupItemContext,
  FormGroupProps,
} from 'sax-design-vue'

interface Project {
  name: string
  owner: string
}

const { lang } = useLocale()
const copy = computed(() =>
  lang.value.startsWith('zh')
    ? {
        initialProjects: [
          { name: '官网改版', owner: 'Ada' },
          { name: '移动应用', owner: 'Lin' },
        ],
        title: '项目',
        description:
          '每个标签对应一份独立表单。右键点击标签可执行由数据驱动的关闭操作。',
        tabLabel: '项目',
        project: '项目',
        projectPlaceholder: '项目名称',
        projectRequired: '请输入项目名称',
        owner: '负责人',
        ownerPlaceholder: '负责人',
        ownerRequired: '请输入负责人',
        validateAll: '校验全部',
        close: '关闭',
        closeOthers: '关闭其他',
        closeLeft: '关闭左侧',
        closeRight: '关闭右侧',
      }
    : {
        initialProjects: [
          { name: 'Website refresh', owner: 'Ada' },
          { name: 'Mobile app', owner: 'Lin' },
        ],
        title: 'Projects',
        description:
          'Each tab owns an independent form. Right-click a tab for data-driven close actions.',
        tabLabel: 'Project',
        project: 'Project',
        projectPlaceholder: 'Project name',
        projectRequired: 'Enter a project name',
        owner: 'Owner',
        ownerPlaceholder: 'Owner',
        ownerRequired: 'Enter an owner',
        validateAll: 'Validate all',
        close: 'Close',
        closeOthers: 'Close others',
        closeLeft: 'Close left',
        closeRight: 'Close right',
      },
)

const projects = ref<FormGroupItem<Project>[]>([...copy.value.initialProjects])
const groupRef = ref<FormGroupInstance>()

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

const createProject = () => ({ name: '', owner: '' })
const validateAll = () => groupRef.value?.validateAll()

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

const handleContextMenu = (
  menuItem: ContextMenuItem,
  { index, key }: FormGroupItemContext<Project>,
) => {
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
</script>

<template>
  <s-form-group
    ref="groupRef"
    v-model="projects"
    :title="copy.title"
    :description="copy.description"
    :tab-label="copy.tabLabel"
    editable
    show-add
    :max="5"
    :create-item="createProject"
    :get-context-menu-items="getContextMenuItems"
    :get-tab-label="
      (project, index) => project.name || `${copy.tabLabel} ${index + 1}`
    "
    :get-form-setting="getFormSetting"
    @context-menu-select="handleContextMenu"
  />
  <div class="form-group-actions">
    <s-button type="border" @click="validateAll">
      {{ copy.validateAll }}
    </s-button>
  </div>
</template>

<style scoped>
.form-group-actions {
  margin-top: 16px;
}
</style>
