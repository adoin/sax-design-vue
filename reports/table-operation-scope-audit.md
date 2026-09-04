# Table 巨量操作范围与成本验收（2026-09-05）

本记录核对 `todos.md` 的本地/远程范围、内存成本与取消约束。它不证明所有功能组合、设备容量或长时间运行表现。基线为 `00650b3`；本次补充中英文公开文档，没有更改组件运行逻辑。

## 范围、保留数据和取消

| 操作 | 实际范围与内存成本 | 取消边界 / 实现证据 |
| --- | --- | --- |
| 普通数组查询、分页、树 | 索引与树展开模型针对已提供/已加载行；本地排序复制排序数组，筛选遍历相关树分支。窗口虚拟化不减少这些成本。 | `use-table-query.ts`、`use-table-tree.ts`、`use-table-pagination.ts`；同步计算没有单独的 AbortSignal 接口。 |
| 生成源查询 | 排序、筛选由数据所有者提供结果；本地分页按源索引范围定位，不为查询枚举生成行。远程分页只处理提供的页。 | `use-table-query.ts` 对 virtualSource/remote 跳过本地算法；Grid `grid-proxy.test.ts` 验证服务页不会二次排序、筛选或切片。 |
| 本地分组/聚合 | 按当前页及配置的 filtered 汇总范围处理已加载行；分组树、叶组成员引用和输出行引用随数据/分组规模增长。没有为每个祖先复制完整成员数组。 | `buildTableGroupModel`、`useTableGroups` 的 computed 同步计算；大型结果应由应用计算后走 remote 元数据。 |
| 远程分组 | 校验组范围、键、嵌套及聚合记录，不读取源成员行。生成源要求 remote 模式。成本随组元数据规模增长。 | `resolveRemoteTableGroups`、`table-group-model.test.ts`、`table-groups-state.test.ts`、`table-group-integration.test.ts`；网络由 Grid 或应用负责取消。 |
| 校验 | 默认 all 是已提供/已加载范围，view 是当前页范围，生成源可显式限定数字行列索引。不主动加载未提供页或懒节点。逐字段扫描并复制校验值；错误保留行引用、值和定位闭包。 | `use-table-data-scope.ts`、`use-table-validation.ts`；每 100 个位置或约 8ms 让出执行，支持 signal、cancelValidation、新请求与卸载。maxErrors 默认 100，仅限制一次操作收集的错误，不限制成功扫描量或所有历史错误占用。 |
| 查找/替换 | view、selection、data 使用共同数据范围。默认最多 100000 个位置、1000 个匹配、2000000 字符；匹配与字段快照有独立内存成本。未完成结果禁止 replaceAll，允许显式单项替换。 | `find-data.ts`、`table-find-scope.ts`、`use-table-find.ts`；检查点、signal、cancelFind、数据/视图失效及卸载会终止，非合作异步等待也能结束。 |
| 剪贴板 | 按当前视图矩形范围处理，含只读格及合并续接位置。默认 10000 格、2000000 字符；结果矩阵、文本和更新草稿均占内存，复杂对象不受字符数限制。超出面积先拒绝，不读取完整源。 | `clipboard-text.ts`、`clipboard-data.ts`、`use-table-clipboard.ts`；支持 signal/cancelClipboard。系统写入已发起但结果未定时 clipboardWritten 为 null，取消不能撤回已完成的 OS 写入。 |
| 图表 | 从选区、已提供的分页前筛选结果、组/总计中取数；聚合范围不枚举成员。默认 1000 点、32 系列、10000 个类别/数值位置、2000000 元数据/类别字符，先预留完整点预算再解析行。 | `chart-data.ts`、`table-chart-scope.ts`、`use-table-chart.ts`；signal/cancelChart、上下文变化与卸载取消取数。快照冻结且不保留源行，但转换时的复杂对象克隆仍有成本；openChart 拒绝截断结果。 |
| 变更/历史/批量接受 | 生成源通过稳定键 indexOf 和 apply 接受稀疏操作，不枚举整个行对象。普通数组结构编辑要构建对应数据结构；删除树分支和历史引用会保留受影响分支。历史默认最近 100 步，不是字节预算。 | `use-table-changes.ts`、`change-batch.ts`、`use-table-history.ts`、`history-data.ts`；signal/cancelDataChange、重置、数据基线变化及卸载终止待接受提案，拒绝/取消不推进历史。 |
| 行拖拽 | 普通数据重排对应数组/树结构；生成源由 apply 更新顺序。示例只存变更位置，但远距离移动仍与跨越行数成正比，临时 updates 数组也按该区间增长。 | `use-table-row-reorder.ts`、`use-table-row-drag.ts`、双语 `row-drag-source.vue`；示例每 500 个位置让出执行并检查 signal，提交前再次检查。cancelRowDrag/卸载不等待非合作适配器。 |
| 详情与懒数据 | 已加载详情可在离开虚拟视口后保留；树懒数据也有自己的已加载缓存。这些成本不受渲染窗口限制。 | `use-table-details.ts` 的 records/requests：收起清理，数据/加载器变化、禁用和卸载取消过期请求；`table-details-state.test.ts`、`table-details.test.ts`。 |
| 动态测量与列窗口 | DOM/ref 限制在窗口，行高历史随访问范围增长。非均匀动态行高使用按源数量分配的 Float64Array 增量索引；百万行约 8MB，不含行高 Map、DOM、业务数据或渲染内容。 | `use-sparse-virtualizer.ts`；分配、缓存和有限卸载循环实测见 `table-runtime-audit.md`，布局失效规则见 `table-measurement-audit.md`。这些记录不能推导通用最大可用行数。 |

JavaScript 的取消是协作式的：检查点或异步等待可以结束操作，但无法抢占已经运行的同步格式化器、验证回调、聚合函数或适配器提交循环。应用适配器必须在外部写入前检查 signal；组件不能撤回已经完成的远程或系统写入。

## 验证覆盖与公开说明

专项复跑涵盖 clipboard/find/chart/validation/history/change、分组模型与接入、详情、行拖拽，以及 Grid proxy。断言直接检查惰性读取计数、超限拒绝、当前页/已加载树范围、源对象禁止枚举、失败批次原子性、迟到请求、非合作 Promise 取消及卸载，不以测试标题或窗口数量替代成本证据。

代表性边界包括：百万行校验 maxErrors=3 只读取三个目标；有效百万行扫描由外部取消在约一个调度批次内停止；百万行十万列源的末行更新/undo/redo 读取少于 100 次且禁止 ownKeys；图表超限在取行前预留预算；远程组元数据不调用成员解析器；Grid 过期请求不能替换已接受的新页。

中英文 Table「虚拟滚动与动态行高」卡片已补充本地同步工作、各类缓存、扫描范围、处理预算与取消边界，保持与原有逐功能说明一致。没有改动示例 SFC 或 Code/Playground 的源码插槽。文档没有把浏览器 Map 容量作为可用行数保证。

本次专项复跑 25 个文件、292 项测试通过；文档示例/API 的 2 个文件、7 项测试通过。真实浏览器检查中英文新增段落、同卡片的 STable 示例及三个示例操作按钮均已渲染。第一次在示例尚未挂载时检查失败；滚动到卡片并等待 `.virtual-demo .s-table` 后两种语言均通过，没有跳过示例存在性断言。

上述证据完成巨量操作的范围/成本/取消说明约束。公共虚拟布局、所有功能组合、完整双语示例与 API 参数语义等其他条目继续独立验收，不因本项通过而勾选。
