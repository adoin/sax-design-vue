# Table 最终浏览器验收（2026-09-05）

## 覆盖方法

`pnpm audit:table-final` 使用真实 Chrome 依次打开英文与中文的 Table、TableGrid 文档，从每项新增能力的代表示例开始检查，不以源码静态存在替代浏览器行为。23 项能力共形成 46 条语言/能力路径，每条路径都完成以下步骤：

- 确认卡片中的真实 `STable` 已渲染，并记录固定列和虚拟窗口状态；
- 读取浅色主题下的真实单元格背景，切换暗色主题后再次读取，确认两者不同；
- 打开 Code 弹窗并选择完整源码，确认包含可运行的 template、script 和对应语言文案；
- 从 Code 弹窗进入共享 Playground，确认预览重新渲染真实 `STable` 且无编译或运行错误；
- 关闭 Playground 和 Code 弹窗，继续下一项，避免用独立路由或第二套预览实现代替共享流程。

本轮结果为 46/46 条路径通过：46 个渲染示例与 46 个 Playground 均包含固定列，46 个示例都通过明暗主题实测，预览错误为 0。19/23 项能力的代表文档卡片直接启用虚拟滚动，Playground 中为 18/23；普通合并、历史、编辑生命周期、查询工具栏没有在说明卡中重复增加虚拟开关，它们与虚拟窗口的组合由 `table-merge-integration.test.ts`、`table-history-api.test.ts`、`table-edit-lifecycle.test.ts` 和 `table-grid.test.ts` 的真实 `STable` 集成用例验证。23 项能力与固定列、双向虚拟滚动的完整对应关系见 `reports/table-combination-audit.md`。

浏览器原始结果保存在 `reports/table-final-browser.json`。运行环境为 Chrome 150.0.7871.24。

## 键盘与焦点

`pnpm audit:table-keyboard-final` 在英文文档中执行 10 条原生键盘路径，全部通过：

1. 分组按钮使用 Enter 展开并保留焦点；
2. 详情按钮使用 Enter 收起并保留焦点；
3. 列边界分隔符使用 ArrowRight 调整宽度并保留焦点；
4. 活动单元格使用 ArrowDown 跨行导航；
5. 单元格使用 Shift+F10 打开右键菜单，Escape 关闭后恢复到原单元格；
6. 区域选择使用 Shift+ArrowRight 扩展并保留单元格焦点；
7. 行拖拽使用 Space、ArrowDown、Escape 取消并恢复手柄焦点；
8. 双击进入编辑后编辑器获得焦点，Escape 关闭并恢复单元格焦点；
9. Ctrl+F 打开查找并聚焦输入框，Escape 关闭并恢复查找触发器焦点；
10. 列管理按钮使用 Enter 打开，Escape 关闭并恢复触发器焦点。

原始结果保存在 `reports/table-final-keyboard.json`。

## 验收中修复的问题

真实浏览器检查发现两个仅靠持久挂载的单元测试替身未能暴露的问题：

- 右键菜单在 Escape 后立即把焦点还给原单元格，但离场中的 `SFocusTrap` 会再次把焦点拉回菜单；菜单移除后焦点最终落到 body。现在由 `SPopper` 的 `hide` 事件确认离场完成后再恢复焦点，并用打开序号阻止旧弹层恢复到过期目标。
- 列管理触发器的鼠标点击可用，但原生 Enter 产生的合成 click 没有切换 `SPopper`。列管理按钮现在显式处理 Enter 和 Space，仍由同一个受控 `open` 状态和共享弹层负责打开、关闭及焦点恢复。

相关 ContextMenu 与 Table 测试同步模拟真实 `hide` 生命周期，防止测试再次把“开始关闭”误当成“已经完成离场”。

## 最终回归

- 相关 ContextMenu、Table、TableGrid、TableSelect、VirtualList：67 个测试文件、639 项测试全部通过；
- 中英文示例与 API：2 个测试文件、9 项测试全部通过；
- `typecheck:web`、`typecheck:play`、`typecheck:node`、`typecheck:vite-config`、`typecheck:vitest` 全部通过；
- 变更文件 ESLint 和 `git diff --check` 通过；
- 既有布局审计的 32 种示例/宽度/主题组合、136 个状态全部通过，单次最多挂载 18 个普通数据行。

以上结果与单元覆盖、功能组合、运行时、双语示例和 API 验收共同完成 `todos.md` 的全部公共验收项。
