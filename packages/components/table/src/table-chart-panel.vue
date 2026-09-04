<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { SDialog } from '@vuesax-alpha/components/dialog'
import { SButton } from '@vuesax-alpha/components/button'
import { SFocusTrap } from '@vuesax-alpha/components/focus-trap'
import { useId, useLocale, useNamespace } from '@vuesax-alpha/hooks'
import Table from './table.vue'
import { createTableChartRenderer } from './chart-renderer'
import type { useTableChart } from './composables/use-table-chart'
import type { TableChartTheme } from './table-chart'
import type { TableColumn, TableRow } from './table'

const props = defineProps<{ chart: ReturnType<typeof useTableChart> }>()
const emit = defineEmits<{ error: [error: unknown] }>()
const ns = useNamespace('table')
const { t } = useLocale()
const id = useId()
const panel = shallowRef<HTMLElement>()
const canvas = shallowRef<HTMLElement>()
const probe = shallowRef<HTMLElement>()
const error = shallowRef(false)
const rendering = shallowRef(false)
const showData = shallowRef(false)
const theme = shallowRef<TableChartTheme>()
let returnFocus: HTMLElement | undefined
watch(
  () => props.chart.state.value.visible,
  (visible) => {
    if (
      visible &&
      typeof document !== 'undefined' &&
      document.activeElement instanceof HTMLElement
    )
      returnFocus = document.activeElement
  },
  { flush: 'sync' },
)
const restoreFocus = () => {
  const target = returnFocus
  returnFocus = undefined
  nextTick(() => {
    if (target?.isConnected) target.focus({ preventScroll: true })
  })
}
const state = computed(() => props.chart.state.value)
const data = computed(() => state.value.scan?.data)
const title = computed(() => state.value.title || t('vs.table.chartTitle'))
const onKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || event.isComposing) return
  event.preventDefault()
  event.stopPropagation()
  props.chart.closeChart()
}
const renderer = createTableChartRenderer((reason) => {
  error.value = true
  emit('error', reason)
})
const columns = computed<TableColumn[]>(() => [
  {
    field: 'category',
    title: t('vs.table.chartCategory'),
    minWidth: 150,
    fixed: 'left',
  },
  ...(data.value?.series.map((series, index) => ({
    field: `s${index}`,
    title: series.name,
    minWidth: 130,
  })) ?? []),
])
const rows = computed(
  () =>
    data.value?.categories.map((category, index) => {
      const row: TableRow = { id: index, category }
      data.value!.series.forEach((series, seriesIndex) => {
        row[`s${seriesIndex}`] = series.values[index]
      })
      return row
    }) ?? [],
)

watch(
  [probe, () => state.value.visible],
  ([element, visible], _, cleanup) => {
    if (!element || !visible) return
    const read = () => {
      const styles = getComputedStyle(element)
      const next = {
        primary: styles.color,
        text: styles.borderTopColor,
        background: styles.backgroundColor,
      }
      if (JSON.stringify(next) !== JSON.stringify(theme.value))
        theme.value = next
    }
    read()
    const observer = new MutationObserver(read)
    for (
      let parent: HTMLElement | null = element;
      parent;
      parent = parent.parentElement
    )
      observer.observe(parent, {
        attributes: true,
        attributeFilter: ['style', 'class', 'data-theme'],
      })
    cleanup(() => observer.disconnect())
  },
  { flush: 'post' },
)
let revision = 0
watch(
  [
    canvas,
    data,
    theme,
    () => state.value.type,
    () => state.value.visible,
    () => props.chart.config.value.adapter,
  ],
  async () => {
    const version = ++revision
    renderer.clear()
    rendering.value = false
    error.value = false
    if (
      !canvas.value ||
      !data.value ||
      !theme.value ||
      !state.value.visible ||
      !props.chart.config.value.adapter
    )
      return
    rendering.value = true
    await renderer.render(canvas.value, props.chart.config.value.adapter, {
      data: data.value,
      theme: theme.value,
      type: state.value.type,
    })
    if (version === revision) rendering.value = false
  },
  { flush: 'post' },
)
watch(
  () => state.value.visible,
  () => {
    showData.value = false
  },
)
onBeforeUnmount(() => {
  revision++
  renderer.clear()
  restoreFocus()
})
</script>

<template>
  <span ref="probe" :class="ns.e('chart-theme')" aria-hidden="true" />
  <SDialog
    :model-value="state.visible"
    width="min(920px, calc(100vw - 32px))"
    :show-header="false"
    :show-close="false"
    :show-footer="false"
    @update:model-value="!$event && chart.closeChart()"
    @close="chart.closeChart()"
    @closed="restoreFocus"
  >
    <SFocusTrap
      :trapped="state.visible"
      loop
      :focus-trap-el="panel"
      @release-requested="chart.closeChart()"
      @focus-after-released.prevent
    >
      <section
        ref="panel"
        :class="ns.e('chart-panel')"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="id"
        tabindex="-1"
        @keydown="onKeydown"
      >
        <div :class="ns.e('chart-toolbar')">
          <h2 :id="id">{{ title }}</h2>
          <SButton size="small" flat @click="chart.closeChart()">{{
            t('vs.table.chartClose')
          }}</SButton>
        </div>
        <div :class="ns.e('chart-toolbar')">
          <SButton
            v-for="type in ['bar', 'line'] as const"
            :key="type"
            size="small"
            :flat="state.type !== type"
            :aria-pressed="state.type === type"
            @click="chart.setType(type)"
            >{{ t(`vs.table.chartType_${type}`) }}</SButton
          >
          <SButton
            size="small"
            flat
            :aria-expanded="showData"
            @click="showData = !showData"
            >{{ t('vs.table.chartData') }}</SButton
          >
        </div>
        <p v-if="rendering || state.pending" role="status">
          {{ t('vs.table.chartRendering') }}
        </p>
        <p v-if="error" role="alert">{{ t('vs.table.chartError') }}</p>
        <p v-if="!data?.points.length" role="status">
          {{ t('vs.table.chartEmpty') }}
        </p>
        <div
          ref="canvas"
          :class="ns.e('chart-canvas')"
          role="img"
          :aria-label="`${title}. ${t('vs.table.chartAlternative')}`"
          :aria-busy="rendering || state.pending"
        />
        <ul
          :class="ns.e('chart-legend')"
          :aria-label="t('vs.table.chartSeries')"
        >
          <li v-for="(series, index) in data?.series" :key="series.key">
            <i
              aria-hidden="true"
              :style="{
                backgroundColor: theme?.primary,
                filter: `hue-rotate(${index * 47}deg)`,
              }"
            />{{ series.name }}
          </li>
        </ul>
        <Table
          v-if="showData"
          :data="rows"
          :columns="columns"
          row-key="id"
          height="280px"
          :virtual-config="{ enabled: true, rowHeight: 44 }"
        />
      </section>
    </SFocusTrap>
  </SDialog>
</template>
