# Table 默认行为与公开类型验收

日期：2026-09-05。

## 开启条件

核对 `tableProps`、`tableGridProps` 与对应 composable 的实际开关，新增编辑、校验、变更、历史、行拖拽、键盘、区域、剪贴板、查找、图表、菜单、合并、分组、列管理和列宽调整默认关闭。Grid 查询表单、工具栏和请求代理也默认关闭。受控状态通过类型化 prop 和对应 `update:*` 事件传递，关闭交互不擅自重写消费者状态。

以下属于显式配置入口，不统一改成额外的 Boolean 开关：

- 配置展开列可以开启详情；`detailConfig: false` 或 `{ enabled: false }` 可以禁止它。
- 非空 `footerData` 与嵌套列分别开启表尾与分组表头。
- `virtualSource` 表示按需生成的数据，直接启用虚拟布局，不能因省略 `virtualConfig` 而枚举整个数据源。
- `columnState`、`columnWidths` 可独立于管理面板和拖动手柄应用；持久化只由显式 `storageKey` 开启。
- 区域、剪贴板和查找复用键盘定位基础；`keyboardConfig: { enabled: false }` 可关闭键盘交互。
- 历史需要同时启用变更追踪。校验配置以 `onCommit` 控制自动提交校验，显式调用校验 API 仍可独立使用。

## 本次修复

`useTable` 原先通过 `virtualConfig !== false` 生成 `is-virtual`，与实际布局开关不一致。`{ enabled: false }` 会残留该类，只传 `virtualSource` 又会遗漏该类。现直接使用表格已经计算的 `virtualEnabled`，不维护第二套判断。

`table-opt-in.test.ts` 的 7 项检查覆盖省略配置、Boolean false、对象禁用、按需生成数据、响应式关闭虚拟布局，以及 Grid 禁用后的本地数据与零请求行为。旧实现出现 3 项失败，修复后全部通过。普通表格没有编辑器、菜单、额外工具或快捷键拦截，冻结的输入行保持不变。

## 类型与现有行为证据

- Table 的 73 个暴露方法现在通过 `satisfies TableExposes` 校验实现签名，同时保留实现自身的推断类型；Grid 已通过 `TableGridExposes` 约束其 API 对象。
- 公开 prop 与事件由 `definePropType`、`tableEmits`、`tableGridEmits` 提供类型，API 名称和静态默认值由现有文档元数据测试对实际源码核对。
- 列管理测试核对受控拒绝/接受及显式持久化；详情测试核对拒绝展开不加载，以及关闭/卸载后忽略异步结果；区域测试核对禁用不查询、不选择并在重新开启后恢复几何。
- 分组测试核对关闭后恢复原始行；合并集成测试核对关闭后撤销合并层并恢复单元格；变更与图表测试核对默认禁用 API 不应用修改或提取数据。上述用例均包含在本轮相关组件回归中。

## 本轮命令结果

- `pnpm exec vitest run packages/components/table/__tests__ packages/components/table-grid/__tests__ packages/components/table-select/__tests__ packages/components/virtual-list/__tests__`：65 个文件、609 项通过，包括 7 项新增开关测试。
- `pnpm run test:docs-examples`：2 个文件、7 项通过，API 审计能够继续解析新增的 `satisfies` 表达式。
- `typecheck:web`、`typecheck:play`、`typecheck:node`、`typecheck:vite-config`、`typecheck:vitest` 均通过。首次检查发现新增测试的生成行回调参数缺少类型，补充 `number` 后重新执行确认；没有放宽类型配置。
- 修改的三个组件/测试文件通过 ESLint，`git diff --check` 通过。

此项验收不替代其他未完成的弹层、主题、虚拟布局组合及双语完整浏览器验收。
