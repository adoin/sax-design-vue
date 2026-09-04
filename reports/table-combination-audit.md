# Table 功能组合验收（2026-09-05）

## 验收方法

本验收把数据形态与布局形态分开核对，避免把“能渲染一个虚拟示例”误当成全部组合通过：

- 数据形态：普通数组、分页与跨页保留选择、树形与懒加载。
- 布局形态：左右固定列、横纵双向虚拟窗口、动态行高。
- 组合原则：每项新增能力至少在普通模型和一个复杂数据/布局模型中运行；与某能力没有语义关系的轴（例如列设置与跨页选中）由共享 Table 管线测试覆盖，不制造无意义的笛卡尔积。
- 几何验证：真实浏览器检查固定表头/表体/表尾、详情、分组、合并层的坐标、命中区域、挂载窗口与卸载残留；功能结果由组件集成测试断言。

## 共享数据与布局管线

| 组合 | 证据 | 验证结果 |
| --- | --- | --- |
| 普通数据 + 纵向虚拟 + 过滤/排序/全选 | `table-features.test.ts`：`queries normal data before virtualization and selects beyond the viewport` | 500 行只挂载窗口；查询先于虚拟化；全选包含全部 250 个过滤结果。 |
| 分页 + 跨页选择 | `table-pagination.test.ts`：`selects only eligible current-page rows and retains reserved selections`、`prunes selections outside the current page when not reserved` | reserve 开启时稳定行键保留跨页选择，关闭时只保留当前页。 |
| 懒加载树 + 分页 + 固定列 + 双轴动态虚拟 | `table-grouped-header.test.ts`：`shares leaf selection and lazy-tree behavior with grouped headers and pagination` | 懒加载子项进入同一扁平模型和当前页；固定分组叶、全选、动态虚拟共同工作，原数据保持冻结。 |
| 分页 + 双轴动态虚拟 | `table-pagination.test.ts`：`virtualizes within the page instead of the full local data`、`reads generated sources only within the page using global row indices` | 虚拟窗口只接收当前页；生成源仍使用全局行索引且不枚举页外行。 |
| 巨量生成源 + 左右固定列 + 双轴虚拟 | `table.test.ts`：`keeps a 100k by 100k generated source bounded with fixed columns`，以及布局浏览器检查 | 行列解析和 DOM 挂载保持窗口级；末端固定列仍可见、可命中。 |
| 动态行高 + 横向换窗 | `table-footer.test.ts`：`retains row height across windows, resets for changed data/layout and disconnects observers`；`table-merge-heights.test.ts` | 同一布局保留测得最大高度；真实数据/列布局改变后允许缩短；观察器按节点和卸载清理。 |

## 新能力组合核对

| 新能力 | 复杂组合证据 | 结果 |
| --- | --- | --- |
| 拖动调整列宽 | `table-resize.test.ts`：`keeps trees, pagination, fixed cells and virtual rows in the same layout`、巨量生成列用例 | 树、页、固定列、双轴动态窗口共享更新后宽度；生成列只保留改动项。 |
| 列管理面板 | `table-column-manager.test.ts`：树形列重排后的 resize/fixed 对齐、巨量生成列用例 | 隐藏、重排、固定和恢复都按列键进入共享列模型，不枚举生成列。 |
| 多级表头 | `table-grouped-header.test.ts`：懒加载树/分页/选择用例及末端生成列路径用例 | 分组只影响表头投影；叶列继续参与树、页、选择、固定和虚拟管线。 |
| 表尾数据行 | `table-footer.test.ts`：过滤分页与列状态用例、空表体横向生成窗口、动态高度重置用例 | 表尾不进入普通数据行；固定/滚动列与主体坐标一致，空数据仍保留横向窗口。 |
| 详情展开行 | `table-details.test.ts`：树/高亮/footer 索引隔离、组合虚拟行测量、生成源离屏操作 | 详情与树展开各自维护键；强制动态测量；固定列只显示一个跨列详情主体。 |
| 单元格与整行编辑 | `table-edit.test.ts`：查询/翻页策略、百万行有界编辑窗口、固定列双轴虚拟编辑 | 草稿按稳定行列键保留；视图变化依策略提交/取消；离屏编辑不扩展窗口。 |
| 编辑生命周期 | `table-edit-lifecycle.test.ts`：懒加载兄弟变化、分页/排序/筛选、虚拟视口离开 | 坐标随同一记录变化，隐藏后取消或提交；迟到结果不写入替换后的数据。 |
| 数据校验 | `table-validation-integration.test.ts`：折叠树子项、分页定位、受控页拒绝、远端生成格 | 校验目标可展开祖先并切页；被所有者拒绝时明确返回定位失败；巨量源读取有界。 |
| 变更追踪 | `table-change-api.test.ts`：懒加载子项、树分支恢复、生成源增删改往返 | 已加载树分支和生成源都按稳定键记录，不复制完整源；普通所有者更新保持不可变。 |
| 撤销与重做 | `table-history-api.test.ts`：懒加载分支恢复、生成源重放及分支历史 | 历史操作复用同一提交管线；重放不会枚举生成源或丢失树子项。 |
| Grid 集成层 | `table-grid.test.ts`：固定列双轴动态虚拟配置转发；动态 Table 插槽用例 | Grid 只编排查询和工具栏，真实数据/列/插槽由同一个 STable 处理。 |
| 数据请求代理 | `grid-proxy.test.ts`：远程页排序筛选、加载树页虚拟窗口、稀疏生成源保存 | 远程返回不再本地二次排序/筛选；树页只挂载窗口；稀疏更新不枚举源。 |
| 查询表单与工具栏 | `table-grid.test.ts`：查询校验、受控翻页、动态具名操作、原生 Enter | 查询快照与当前页一次提交；工具栏状态和请求 loading 同步，Table 布局不被复制。 |
| 行拖拽排序 | `table-row-drag.test.ts`：过滤/分页、懒加载同级、双轴动态生成源及键盘拖动 | 显示索引正确映射源索引；树只允许同级；边缘滚动和键盘路径共享受控提案。 |
| 基础键盘导航 | `table-keyboard.test.ts`：固定列视觉顺序、声明式树、双轴生成源、虚拟单元格卸载 | 导航按视觉列和稳定行键，不扫描中间源；焦点不会恢复到已卸载或外部目标之上。 |
| 右键菜单 | `table-context-menu.test.ts`：分组表头、嵌套详情表、双轴生成源和表尾边界 | 命中返回真实逻辑行列/分组；固定和虚拟片段不重复打开菜单。 |
| 跨行/跨列合并 | `table-merge-integration.test.ts`：排序/分页、固定片段、懒加载树、折叠组 | 合并按当前视图重投影；续接片段统一路由到一个所有者，源数据不变。 |
| 虚拟合并 | 同文件的页外所有者、末端生成源及 `table-merge-measurement.test.ts` | 起点不在窗口仍渲染可见片段；跨固定边界只有一个内容所有者；动态测量不透出下一行。 |
| 行分组与聚合 | `table-group-integration.test.ts`：懒加载树、当前页分组、稀疏生成源折叠区间 | 分组、树、分页的层级职责分离；聚合范围明确；折叠生成组不扫描成员。 |
| 单元格区域选择 | `table-range-integration.test.ts`：固定列视觉坐标、合并闭包、分组折叠、巨量离屏区域 | 区域使用逻辑坐标；固定片段、合并续接和双轴窗口得到同一个选区模型。 |
| 复制、剪切与粘贴 | `table-clipboard.test.ts`：分页/固定列、树父子批次、分组字段、离屏合并生成源 | 文本顺序按视觉窗口，写入按稳定源键；整批校验、所有者接受和一步历史保持原子。 |
| 查找与替换 | `table-find.test.ts`：跨页定位、折叠树/组、固定列范围、末端合并生成源 | 搜索范围与视图范围分离；定位可展开/翻页；离屏替换不挂载或扫描完整矩阵。 |
| 图表集成 | `table-chart.test.ts`：树后分页、已有聚合、固定区域、末端双轴生成选区 | 取数复用视图/选区/聚合快照；适配器不影响 Table 窗口，取消和刷新保留一致快照。 |

## 真实浏览器几何复验

`pnpm audit:table-layout` 在 960px / 480px、浅色 / 深色下运行 8 组真实文档示例，覆盖普通与百万行详情、普通与百万行表尾、多级表头、分页分组、远程巨量分组、跨双轴窗口合并。脚本检查：

- 固定表头、数据格、表尾和分组小计的列坐标；
- 每个数据格与逻辑行的顶部/高度一致，动态内容收缩不会导致错行或透出；
- 横向窗口切换和末端跳转后左右固定列可见且 `elementFromPoint` 命中真实单元格；
- 合并片段按固定区域裁剪，并且每个区域只有一个内容所有者；
- 各场景只挂载可见与预渲染窗口，卸载后无残留 Table DOM。

复验结果为 32 种示例/宽度/主题组合、136 个状态全部通过，单次最多挂载 18 个普通数据行。浏览器 JSON 记录保存在 `reports/table-layout-browser.json`。

## 结论

组件组合测试和浏览器几何测试共同满足“普通数据、分页/跨页选择、树形/懒加载、固定列、双向虚拟滚动、动态行高”的阶段验收。该结论只覆盖功能与布局组合；中英文 Code/Playground 的逐例内容、主题与键盘操作另有独立验收项，不在这里提前勾选。
