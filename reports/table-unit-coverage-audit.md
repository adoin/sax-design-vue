# Table 单元测试覆盖核对（2026-09-05）

## 核对口径

本记录逐项核对 `todos.md` 中 23 项新增能力，而不是用测试总数代替功能覆盖。验收维度为：默认行为、边界、受控更新、异常、卸载清理和键盘操作。纯数据算法没有 DOM 生命周期或键盘入口时标为“不适用”；其公开交互入口仍由 Table 集成测试验证。测试名称描述的是可观察结果，断言同时检查数据所有权、事件、焦点、监听器或渲染窗口，不只检查组件能够挂载。

## 逐功能证据

| 功能 | 默认与边界 | 受控与异常 | 卸载与键盘 | 主要测试证据 |
| --- | --- | --- | --- | --- |
| 拖动调整列宽 | 默认关闭、最小宽度、固定列、巨量列窗口 | 受控拒绝/接受、禁用列、loading、IME | 待执行帧在取消、失焦、loading、卸载时清理；分隔条键盘调整 | `table-opt-in.test.ts`、`table-resize.test.ts` |
| 列管理面板 | 默认关闭、全隐藏、树形重排、巨量列 | 受控拒绝/接受；缓存读取/写入失败及损坏、未来版本 | Escape 关闭并恢复触发器焦点 | `table-column-manager.test.ts` |
| 多级表头 | 配置式/声明式、空组、固定分区、生成列窗口 | 动态声明列挂载/卸载；隐藏和重排投影 | 叶子排序、筛选和调整列宽保持可操作 | `table-grouped-header.test.ts` |
| 表尾数据行 | 默认关闭、空数据、分页/筛选、生成列窗口 | 格式化/渲染优先级、列状态和宽度更新 | ResizeObserver 卸载；表尾上下文菜单键盘入口 | `table-footer.test.ts`、`table-context-menu.test.ts` |
| 详情展开行 | 默认关闭、树键隔离、动态高度、生成源 | 受控拒绝/接受；加载失败、重试、过期响应 | 中止或不合作加载器卸载；焦点恢复和展开按钮键盘操作 | `table-details-state.test.ts`、`table-details.test.ts` |
| 单元格与整行编辑 | 默认关闭、不可编辑条件、嵌套字段、虚拟卸载 | 所有者拒绝/接受；异步提交和失败切换 | Escape/Enter/Tab、IME、编辑器焦点；卸载后迟到结果无效 | `table-edit.test.ts`、`table-edit-state.test.ts`、`table-edit-lifecycle.test.ts` |
| 编辑生命周期 | 分页、排序、筛选、树和视口离开策略 | 外部数据冲突、数据/配置替换、失败校验保留草稿 | 卸载、取消和迟到校验清理；焦点回到逻辑单元格 | `table-edit-lifecycle.test.ts`、`table-focus-settlement.test.ts` |
| 数据校验 | 空规则、同步/异步规则、重复字段、巨量定位 | 受控分页拒绝；抛错/拒绝 validator、过期校验 | 输入/取消/卸载中止；错误目标可键盘聚焦 | `table-validation.test.ts`、`table-validation-integration.test.ts` |
| 变更追踪 | 默认关闭、增删改/树分支/生成行、空还原 | 仅记录接受的所有者提案；拒绝不入账 | 卸载取消异步所有者；公开方法无独立键盘入口 | `table-changes.test.ts`、`table-change-data.test.ts`、`table-change-api.test.ts` |
| 撤销与重做 | 默认关闭、分支历史、批处理、容量上限 | 重放拒绝/接受、基线冲突、无效操作不消耗栈 | 待重放卸载清理；Ctrl/Command+Z、Shift+Z、Y | `table-history.test.ts`、`table-history-api.test.ts`、`table-keyboard.test.ts` |
| Grid 集成层 | 缺省只渲染同一 Table；配置、声明列和插槽转发 | 受控分页/数据接受与拒绝、busy/disabled | pending 输入卸载丢弃；原生 Enter 只提交一次 | `table-grid.test.ts` |
| 数据请求代理 | 本地/远程排序筛选分页边界、畸形响应 | 最新请求胜出；读取/保存/删除异常相互隔离 | Abort、适配器替换和卸载取消 | `grid-proxy.test.ts` |
| 查询表单与工具栏 | 查询/重置/刷新、具名操作、动态插槽 | 校验失败不请求；受控页接受后再提交 | Enter、按钮 disabled/loading；卸载丢弃 pending 输入 | `table-grid.test.ts` |
| 行拖拽排序 | 默认关闭、同级限制、分页/过滤/树/生成源 | 受控拒绝/接受；适配器错误及数据替换 | pointercancel/卸载移除监听和自动滚动；键盘拾取/移动/放下/取消 | `table-row-drag.test.ts`、`row-drag-gesture.test.ts` |
| 基础键盘导航 | 默认关闭、固定列视觉顺序、边界退出、双轴虚拟 | 受控活动格拒绝/接受；行列移除后重定位 | Tab/方向/Home/End/Enter/Escape、IME；虚拟卸载焦点停放及组件卸载 | `table-keyboard.test.ts`、`table-focus-settlement.test.ts` |
| 右键菜单 | 默认保留原生菜单；表头/数据/表尾、嵌套表、巨量源 | 空项、predicate/factory 抛错、动态 disabled | 卸载取消 pending focus；Shift+F10、循环焦点和 Escape | `table-context-menu.test.ts` |
| 跨行/跨列合并 | 默认关闭、越界/重叠拒绝、排序筛选重投影 | 动态规则及受控活动格拒绝；非法区域忽略 | 纯区域算法生命周期不适用；合并导航由键盘测试覆盖 | `table-merge-regions.test.ts`、`table-merge-reactivity.test.ts`、`table-merge-navigation.test.ts` |
| 虚拟合并 | 视口外起点、固定列边界、动态高度、末端巨量源 | 窗口变化重建命中索引；ResizeObserver/帧异常不留下旧层 | observer、动画帧和卸载清理；跨合并区域方向键导航 | `table-merge-measurement.test.ts`、`table-merge-integration.test.ts` |
| 行分组与聚合 | 默认关闭、空/非法配置、嵌套组、分页范围、稀疏源 | 受控展开拒绝/接受；reducer 抛错退回源顺序 | 异步完成后卸载不发消息；展开控件和方向键 | `table-groups-state.test.ts`、`table-group-model.test.ts`、`table-group-navigation.test.ts` |
| 单元格区域选择 | 默认关闭、合并格、固定列、双轴生成源、边缘滚动 | 受控拒绝/接受；调度被新操作取代 | pointercancel/blur/Escape/卸载清理；Shift+方向/Home/End、全选、IME 隔离 | `table-cell-range-state.test.ts`、`table-range-interaction.test.ts`、`table-range-integration.test.ts` |
| 复制、剪切与粘贴 | 默认关闭、只读格、二维文本、合并格、预算边界 | 所有者拒绝、转换/校验/浏览器权限异常保持原数据 | 配置/数据/卸载取消；Ctrl/Command+C/X/V、编辑器隔离 | `table-clipboard.test.ts`、`table-clipboard-data.test.ts`、`table-clipboard-text.test.ts` |
| 查找与替换 | 默认关闭、视图/选区/数据范围、跨页树组、预算边界 | 受控页拒绝；只读、校验、所有者拒绝、扫描异常 | 数据/视图/配置/卸载取消；Ctrl/Command+F/H、F3、Enter、Escape | `table-find.test.ts`、`table-find-data.test.ts` |
| 图表集成 | 默认关闭、无适配器可取数、选区/筛选/聚合、预算边界 | 配置替换、挂载失败/重试、旧适配器迟到结果 | 扫描/挂载/ResizeObserver/卸载释放；对话框 Tab 循环和 Escape | `table-chart.test.ts`、`table-chart-data.test.ts`、`table-chart-renderer.test.ts` |

## 本轮补充与结果

- 列宽测试补充了仍有 `requestAnimationFrame` 排队时的 `pointercancel`、窗口失焦、loading 和卸载。四种路径都要求取消同一个帧，按原函数身份移除五个全局监听器，恢复调用前的 `cursor` / `user-select`，并禁止迟到事件提交宽度。
- 列管理补充损坏 JSON、`null`、未来版本和错误 `columns` 结构。无效缓存不得改变默认列或被初始化过程覆盖；下一次有效编辑仍需写入版本化状态。语法/访问错误发出 `columnStorageError`，可识别但不支持的版本和结构被安全忽略。
- 新增专项共 8 项；与既有专项合并后，两文件 23 项通过。Table、TableGrid、TableSelect、VirtualList 完整回归共 66 个文件、636 项测试通过；`typecheck:web`、`typecheck:play`、`typecheck:node`、`typecheck:vite-config`、`typecheck:vitest` 五项类型检查通过。新增测试 ESLint 与 `git diff --check` 通过。

## 结论边界

上述证据满足“单元测试覆盖默认行为、边界、受控更新、异常、卸载清理及键盘操作”。它不代替真实浏览器中的主题、弹层定位和 Code/Playground 检查，也不单独证明 23 项能力同时叠加时的组合正确性；这些仍由 `todos.md` 后续两个独立验收项跟踪。
