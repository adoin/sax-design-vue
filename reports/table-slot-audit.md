# Table 动态插槽与参数验收（2026-09-05）

基线为 `8bd66db`。本次核对 Table、Grid 与 TableSelect 的插槽边界和作用域参数，修复实际复现的问题；全部公开方法参数语义仍需独立核对，不把插槽检查视为整个 API 验收完成。

## 已修复

- TableSelect 用 computed 缓存 slots 的键和前后缀存在性。Vue 的 slots 对象不是响应式依赖，父组件挂载后添加命名单元格、表头或前后缀插槽时，这些计算可能保留旧值。改为在渲染时读取，保留配置图标和文字的回退；同时补上 prefixConfig.icon / suffixConfig.icon 的存在性判断。
- 普通表体会收到新的插槽快照，虚拟表体的稳定默认插槽却可能跳过父更新。浏览器已复现表头更新、现有数据行仍显示原值。Table 现在在更新前按键和函数引用同步 shallowRef 插槽快照，让虚拟行读取该依赖；无需重建虚拟列表或改变行列数据。
- Grid 的 query-* / 表格插槽路由原本正确。新增测试验证挂载后添加、替换、移除，表单 setValue 与 query 方法仍操作原模型，移除后恢复表单默认按钮和 Table 原始字段。

## 作用域与命名核对

- cell / cell-[key] / columns.slots.default 接收 TableCellRenderParams，包含 row、column、value、rowIndex、columnIndex、树状态和 toggleExpand；header-cell / header-[key] / columns.slots.header 接收 TableHeaderRenderParams。中英文 API 表已用具体类型替换泛称 Scoped slot。
- Table 的普通行、虚拟行、详情和分组通过 TableBodyBlock 传递同一快照，合并内容通过 TableMergedCell 传递；编辑槽仍使用 TableEditSlotParams，表尾仍使用独立的 TableFooterCellRenderParams，没有混用数据与表头参数。
- Grid 的 query 槽额外接收 model；query-actions 与 toolbar 额外接收 busy；proxy-error 额外接收 state，四者均带 Grid 暴露方法。query-[name] 经 GridQueryForm / Form 传递字段 model、item、field、prop、value、disabled、readonly、setValue，并不承诺 FormRenderer 的 validate 方法。query-* 前缀和 Grid 自有名称不能同时用作 Table 列插槽名。
- TableSelect 的 selected 是触发器本地插槽，接收 row / label；suffix 接收 open / selectedRow。prefix、suffix、clear-icon、selected、empty、popup-header、popup-footer 保留在选择器，其余列插槽转发给内部 Table。文档不再把 selected 描述为 Table 列转发。

## 实际验证

- 三个初始反例在修复前失败：迟到命名槽、迟到前后缀、配置对象图标。新增普通/虚拟两种命名槽测试后，虚拟用例补充真实的模拟视口尺寸，先断言两行已挂载，再检查内容和参数，避免以未渲染的空表体作验证。
- `pnpm audit:table-slots` 使用 `play/table-audit/slots.html` 的真实 TableSelect / Grid、共享 Popper 和项目主题，不用 Popper 替身。8 种模式/屏宽/主题组合，每种包含初始与三次插槽变更；先滚离顶部，再确认表格和滚动容器未重建、scrollTop 不变、窗口有界、数据与表头内容替换、前后缀移除、图标回退和保留操作。结果见 `table-slots-browser.json`。
- 中英文 TableSelect 自定义渲染示例在页面、完整 Code 与 Playground 均检查。弹层展示各自语言的三个服务，选中后触发器显示对应服务与负责人；Code 包含完整 template/script/style、cell-name 和 selected 槽。见 `table-slot-docs-browser.json`。打开前需将触发器滚入视口并等待可见性观察；第一次在引用尚不可见时点击未打开，不计为通过。
- `audit:table-docs` 再次检查双语普通树、懒树、百万行十万列、明暗主题及两种 Playground 入口，末行和固定列几何均通过。`audit:table-api-browser` 的六页 API 名称、锚点、用法链接与类型详情通过。
- `normalize:doc-examples` 检查 144 页，0 修改、0 跳过；文档示例/API 7 项通过，静态 API 核对通过。此次没有修改示例 SFC、源码 include 或共享 Code/Playground 编译管线。

最终组件回归为 66 个文件、624 项全部通过。Web、Play 与 Vitest 类型检查通过。浏览器插槽切换期间最多挂载 17 行，滚动位置保持为 500px。
