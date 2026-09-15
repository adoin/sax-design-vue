---
description: 'Table 的表尾与汇总功能、配置方式与可运行示例。'
---

# 表尾与汇总指南

<card class="table-doc-section-start">

## 表尾与汇总

表尾用于展示汇总数据或补充内容。本节覆盖普通表尾、嵌套表尾以及虚拟列下的表尾渲染。

### 表尾数据行

使用 `footer-config.rows` 生成一行或多行表尾。每行通过 `values` 提供标签、状态等固定单元格，通过 `aggregates` 定义聚合单元格。聚合项以 `key` 指定输出列字段，以 `field` 指定源字段；`method` 支持 `count`、`sum`、`average`、`min`、`max`，也可传入自定义函数。表尾与正文共享列宽、固定位置及横向滚动，也会跟随列设置的显隐和顺序变化。`footer-row-key` 可指定稳定行键。

在 `SaxGridSetting<Row>` 中配置表尾时，`Row` 会沿着 `footerConfig.rows[].aggregates[].method` 自动传入 `cells`，无需再声明 `TableRow` 或手动标注回调参数：

```ts
import { computed } from 'vue'
import type { SaxGridSetting } from 'sax-design-vue'

interface OrderRow {
  amount: string
  state: '就绪' | '取消'
}

const tableOptions = computed<SaxGridSetting<OrderRow>>(() => ({
  footerConfig: {
    rows: [
      {
        aggregates: [
          {
            key: 'amount',
            field: 'amount',
            method: (cells) =>
              cells.filter(({ row }) => row.state === '就绪').length,
          },
        ],
      },
    ],
  },
}))
```

此时 `cells` 的类型自动推导为 `readonly TableAggregateCell<OrderRow>[]`。它按本次聚合范围中的源数据顺序排列；`value` 是从 `field` 读取的值，未配置 `field` 时为 `undefined`；`row` 是完整的 `OrderRow`；`rowIndex` 是该行在本次聚合输入中的零基索引。独立声明聚合函数时，也可从 `sax-design-vue` 导入 `TableAggregateFunction` 并写成 `TableAggregateFunction<OrderRow>`。未提供 `Row` 泛型时才会使用开放的 `Recordable` 兜底类型。

内置数值聚合使用十进制精确计算。`'0.1'` 这类十进制字符串在求和与求平均时不会发生 JavaScript 浮点精度流失，十进制聚合结果以字符串返回（`count` 仍为数字）。如果源值此前已经经过原生浮点计算并产生误差，汇总无法恢复原值，因此金额等精度敏感数据应使用十进制字符串。`scope` 可选 `data`（默认，全部传入数据）、`filtered`（筛选后）或 `page`（当前页）。自定义函数会先收集单元格数组；本地数据量很大时，可使用高级的 `{ initial, step, finish }` 归并器形式，将额外内存保持为常量。两种自定义形式均自行决定精度策略。

`footer-config` 与 `footer-data` 只负责不同的表尾值来源，之后都会使用相同的叶子列与渲染优先级：列专属表尾插槽、通用 `footer-cell` 插槽、`column.footer`、具名局部表尾渲染器、`footerFormatter`，最后是字段原值。服务端返回汇总、表尾无法由本地数据推导，或所有表尾值均由应用定义时，使用 `footer-data`。非空的 `footer-data` 优先于 `footer-config`；`virtual-source` 的完整逻辑数据可能不在本地内存中，因此也必须通过 `footer-data` 提供汇总结果。

<template #example><table-zh-footer-data /></template>

<template #template>

@[code{99-123}](../../../.vuepress/components/table-zh/footer-data.vue)

</template>

<template #script>

@[code{1-97}](../../../.vuepress/components/table-zh/footer-data.vue)

</template>

<template #style>

@[code{125-133}](../../../.vuepress/components/table-zh/footer-data.vue)

</template>

</card>

<card>

### 嵌套表尾与底部插槽

嵌套 `STableColumn` 与配置列同样支持 `footer-config`，聚合项的 `field` 对应叶子列字段。在某个叶子列上使用 `#footer` 可单独处理其计算结果，`#default` 继续处理正文。表格本身的 `#footer` 插槽用于底部工具栏或说明，并可与列对齐的表尾行同时存在。

<template #example><table-zh-footer-declarations /></template>

<template #template>

@[code{23-50}](../../../.vuepress/components/table-zh/footer-declarations.vue)

</template>

<template #script>

@[code{1-21}](../../../.vuepress/components/table-zh/footer-declarations.vue)

</template>

</card>

<card>

### 虚拟列与表尾

开启横向虚拟滚动后，表尾仍会与正文的可见列、固定列、列宽及滚动位置保持同步，并在列布局、容器尺寸或表尾数据变化后自动适配。

`virtual-source` 表示的行可能并不存在于本地内存中，因此本例通过 `footer-data` 显式提供 `id: 'total'` 与 `id: 'average'` 两条表尾记录。这两个值只是普通的表尾行键，与聚合方法名无关。每个动态生成的叶子列再使用自己的 `footer` 渲染函数计算或展示该列结果，不需要遍历数据源。可以定位末端、调整列宽，并切换为空正文，检查表尾的横向滚动；实际业务可通过同一路径传入服务端汇总记录。

<template #example><table-zh-footer-source /></template>

<template #template>

@[code{46-68}](../../../.vuepress/components/table-zh/footer-source.vue)

</template>

<template #script>

@[code{1-44}](../../../.vuepress/components/table-zh/footer-source.vue)

</template>

<template #style>

@[code{70-74}](../../../.vuepress/components/table-zh/footer-source.vue)

</template>

</card>
