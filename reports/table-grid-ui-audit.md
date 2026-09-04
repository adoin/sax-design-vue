# Table 筛选与 Grid 界面验收

日期：2026-09-05。此记录补齐 [第一批弹层与形状验收](table-overlay-audit.md) 中的表头筛选和 Grid 查询/工具栏检查。

## 发现与修复

1. 表头筛选在靠左的列使用 `bottom-end` 对齐时，面板左缘为 -18px，部分文字和选项超出视口。启用共享 `SPopper` 的 shift 后，左缘为 8px；没有增加独立定位代码或放开容器裁剪。
2. 筛选面板原先在全局方形配置下仍为 16px 圆角。现在经共享 `useShape` 读取配置，方形为 0px，默认圆角保持 16px，颜色与阴影继续使用项目主题变量。
3. Table 的 loading 原先没有传到表头交互：打开的筛选面板仍存在，排序和筛选按钮未禁用。现在加载时关闭筛选，禁用原生排序/筛选按钮和内置筛选操作；即使消费者保留了旧的自定义筛选 apply/reset 回调，也不会在加载中提交变更。恢复后重新打开只取已确认的筛选值。
4. Grid 已正确向表单传递禁用状态，但共享 Select 的主 input 未绑定原生 disabled。现在补齐原生属性和键盘入口判断，禁用时同步关闭下拉，恢复后不复活旧的打开状态。这是共享控件修复，没有在 Grid 中复制选择框逻辑。

## 浏览器证据

运行文档开发服务后执行 `pnpm run audit:table-grid-ui`。脚本使用已有的隔离 fixture 的 `?grid` 模式，实际挂载 `STableGrid`、`SForm`、`SInput`、`SSelect` 和 `SButton`，外层保留 overflow/transform，以检验 Teleport。

[测量数据](table-grid-ui-browser.json) 覆盖 1100px / 375px、明/暗主题、方形/圆形共八种组合：

- 筛选与查询选择框下拉均在裁剪容器外，筛选不越出水平视口；记录实际颜色、背景、阴影、圆角和边界。
- 原生 disabled 选项保持禁用，Escape 关闭筛选后焦点回到触发按钮。
- 查询控件及工具栏不越出视口；方形/圆角跟随全局配置。375px 下表单按响应式列配置纵向排列，工具栏换行。
- 普通工具栏操作触发一次；显式 disabled 的业务按钮保持禁用。
- 外部 loading 同时禁用查询表单、查询/重置按钮、工具栏和表头操作，已有筛选弹层被移除。
- 实际代理请求在受控 Promise 完成之前保持 busy，所有查询与工具栏控件禁用；完成后恢复，只发出一次请求。

临时目录中的 `sax-grid-filter-*.png`、`sax-grid-ui-*.png` 是对应截图；已查看窄屏明暗图，确认表单/工具栏及筛选内容完整显示。最终完整八种组合通过。

## 自动化检查

- 新增 Select 禁用回归先失败（原生 input.disabled 为 false），修复后通过；覆盖禁用键盘入口、禁用时关闭、重新开启组件后不自动打开及模型不变。
- 新增 Table 加载态测试覆盖已打开面板关闭、原生表头按钮禁用、拒绝旧自定义回调、恢复后以已确认值重新开始草稿。
- Table / Grid / TableSelect / VirtualList / Select 共 68 个测试文件、628 项通过。
- `typecheck:web`、`typecheck:play`、`typecheck:vitest` 通过；ESLint 和 `git diff --check` 通过。
- `pnpm run test:docs-examples`：7 项通过；本轮未修改共享 Code/Playground 管线。
- 共享 Select 修复后重新运行 `pnpm run audit:table-overlays`，第一批八种组合仍全部通过，包含列管理嵌套下拉、行编辑下拉、图表及焦点恢复。

这组证据与第一批弹层检查共同覆盖公共组件复用、形状、主题和禁用态约束。双语文档的全部 Code/Playground 和功能/固定列/虚拟窗口组合仍属于独立阶段验收，不由此记录替代。
