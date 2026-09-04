# Table 模块与列管线验收

## 模块职责

`table.vue` 负责连接公开属性、事件、各模块的状态与视图，不再另建配置式、声明式、普通行、虚拟行或合并所有者的单元格渲染流程。

| 职责 | 当前实现 |
| --- | --- |
| 声明式列注册、嵌套列及顺序 | `use-table-column-registry.ts`；根表格和 `table-column.vue` 使用同一注册器 |
| 列树与叶子、分组祖先 | `table-column-tree.ts` 的 `flattenTableColumns` |
| 宽度、固定分区及窗口 | `column-layout.ts`、`sparse-column-metrics.ts`、`use-table-column-resize.ts`、`use-table-column-manager.ts`、`use-table-column-virtualization.ts` |
| 分组表头 | `table-header-layout.ts`、`table-header-rows.vue`、`table-header-cell.vue` |
| 表尾 | `table-footer-rows.vue` 与 `use-table-footer-heights.ts`；独立维护表尾渲染和测量 |
| 详情 | `use-table-details.ts` 管理状态与异步结果，`table-row-block.vue` 提供展示和测量边界 |
| 编辑与生命周期 | `use-table-edit.ts`、`use-table-edit-lifecycle.ts`、`table-cell-editor.vue` |
| 校验 | `use-table-validation.ts`、`use-table-validation-api.ts`、`validation-utils.ts` |
| 变更与历史 | `use-table-changes.ts` / `change-*`、`use-table-history.ts` / `history-*`；业务接受与快照存储分开 |
| 区域选择 | `use-table-cell-range.ts`、`use-table-range-controller.ts`、`use-table-range-interaction.ts`，另有坐标和合并范围模块 |
| 请求代理 | TableGrid 的 `use-grid-proxy.ts`；查询表单、工具栏分别由 `use-grid-query.ts`、`grid-query-form.vue`、`grid-toolbar.vue` 负责 |

表格模块位于 `packages/components/table/src`，composable 位于其 `composables` 子目录；Grid 模块位于 `packages/components/table-grid/src`。本次抽取同时去掉根表格与分组列内重复的注册器实现。

## 列与单元格管线

配置式列和注册后的声明式列均进入 `flattenTableColumns`，随后共享宽度、显隐/列序、查询和窗口处理。现有非空 `columns` 覆盖声明式列的规则保留；撤去配置后使用当前声明顺序，宽度按稳定列键恢复。

普通行和虚拟行使用 `createTableBodyBlock` / `createTableBodyRow`；跨窗口合并的所有者也使用同一个 `TableBodyRow`。数据单元格优先级仍为列专属插槽、通用 cell 插槽、列函数/具名渲染器、字段原值。表头、表尾和编辑器保留各自的渲染链，不将数据单元格渲染器当成它们的默认渲染器。

## 发现并修复的问题

1. 声明式列原先只按挂载先后登记。带稳定 key 的 `v-for` 重排不会重新挂载，导致列顺序停在初始状态；根列和嵌套组均能复现。现在注册器在挂载/更新后按 Vue 的 DOM 锚点同步顺序，仅在顺序变化时发布新结果，不读取布局尺寸。
2. 动态新增/移除列插槽没有触发注册信息更新。现在跟踪 default/header/footer/edit/columns 插槽是否存在，变化时更新列定义；插槽函数内容仍通过当前 slots 读取，不反复注册等价的内联回调。
3. 表格级插槽变化时，稳定的声明式列没有使已有行重绘。现在把当前 slots 的快照显式传给共享行/分组块及合并所有者，保留原来的回退顺序，避免继续显示已移除的专属插槽。

## 验证

- 新增 `table-column-contract.test.ts`，共 8 项。最初的 5 项有 3 项失败；增加全部回退链后又复现 1 项缓存失败，均在修复后通过。覆盖配置式与声明式列重排/插入/删除、嵌套分组、动态 cell/header/footer 插槽、专属/通用/函数/具名/原值回退，以及配置覆盖后恢复声明式顺序和宽度。
- Table、TableGrid、TableSelect、VirtualList 完整相关回归：64 文件、602 项通过。已有分组、表尾、编辑、合并、分页、树形、懒加载、固定列和虚拟窗口测试包含在该范围中。
- 五项完整类型检查通过；7 项文档示例与 API 测试通过；相关 ESLint 与 diff 检查通过。
- 中英文声明式列示例加入列顺序切换和自定义状态插槽切换。`pnpm run normalize:doc-examples` 更新对应两页、两个示例的完整源区间并补入 style；复跑 144 页、0 修改、0 跳过。
- `node scripts/audit-table-columns.mjs` 检查两种语言的正常页面、切换主题、Code 转入 Playground、直接 Playground，均能重排、移除标签渲染并恢复；完整脚本/模板/样式存在。结果保存为 `table-columns-browser.json`。
- `pnpm run audit:table-docs` 复核中英文树形/懒加载，以及百万行十万列的页面、切换主题、Code 转入和直接 Playground。末端均仅挂载 7 行，左右固定列与主体顶部偏差为 0，末行与视口底部偏差为 0；记录更新到 `table-docs-runtime.json`。这次复核没有重跑完整堆内存基准。

默认开启规则、全部受控 API 语义和其他公共验收项继续单独审核；以上结果不替代 `todos.md` 剩余的全阶段组合验收，也不涉及发布。
