# Table 弹层与形状验收（第一批）

日期：2026-09-05。

## 实现核对

| 交互 | 共享实现 |
| --- | --- |
| 列管理 | `SPopper` + `SFocusTrap`，内部 `SCheckbox`、`SSelect`、`SButton`、`SVirtualList` |
| 表头筛选 | `SPopper`，内部 `SCheckbox`、`SButton` |
| 上下文菜单 | `SContextMenu` 内部的 `SPopper` 和焦点约束 |
| 单元格溢出 | 一个委托的共享 Tooltip，内部 `SPopper` |
| 内置编辑器 | `SInput`、`SSelect`、`SDatePicker`、`SSwitch` |
| 查找 | 页内面板，内部 `SInput`、`SSelect`、`SCheckbox`、`SButton`；无额外浮层定位实现 |
| 图表 | 共享模态 `SDialog`、焦点约束、`SButton` 和 `STable` 数据替代视图 |
| Grid 查询/工具栏 | `SForm`、`SButton` 和业务插槽 |

本轮没有添加第二套定位、全局点击监听或修改文档卡片的 overflow。

## 修复

1. 列管理在嵌套固定列下拉关闭后，再按 Escape，会先聚焦触发按钮、随后被尚未退出的焦点约束拉回面板；面板卸载后焦点落到 `body`。现在由共享 Popper 的 `hide` 生命周期完成显式关闭后的焦点恢复，避免退出过渡期间争夺焦点。
2. 外部指针点击允许焦点保留在被点击控件上，关闭时不拉回面板。键盘焦点仍在面板内循环；嵌套下拉的首次 Escape 只关闭下拉。
3. 查找面板与右键菜单原先忽略全局方形配置，仍保留 12px 圆角；现在通过共享 `useShape` 读取配置。列管理中的行背景也同步使用方角。默认圆角保持不变，没有新增公共 Boolean 形状属性。

## 可复现验证

保持文档开发服务运行，执行 `pnpm run audit:table-overlays`。脚本加载 `play/table-overlay-audit` 隔离页面，外层故意使用 `overflow: hidden` 和 transform；页面使用实际源码组件与主题样式。该 fixture 已纳入 `typecheck:play`。

输出为 [浏览器测量数据](table-overlays-browser.json)。覆盖 1100px / 375px、明/暗、圆角/方角共八个组合，开启 reduced motion：

- 列管理、内部固定列下拉、右键菜单、行编辑器下拉及图表均通过共享弹层显示，不落在裁剪祖先中。
- 逐个记录实际表面圆角、文字/背景颜色、阴影、边框与矩形；校验方形表面为 0px，默认圆角仍存在，列管理及图表不越出水平视口。
- 检查 Tab 留在列管理面板、嵌套 Escape 的顺序、关闭后恢复触发按钮、外部点击保留外部焦点。
- 检查禁用菜单项、加载时列管理按钮禁用且弹层移除、卸载后无残留弹层。行编辑器下拉关闭不取消整行编辑。
- 375px 方形的明暗截图写入系统临时目录 `sax-table-overlay-light.png` / `sax-table-overlay-dark.png`，已人工查看：下拉与面板完整显示、没有容器裁剪，背景/文本随主题变化。

相关组件回归 7 个文件、67 项通过；最后的焦点处理调整另复跑列管理 8 项。`typecheck:web`、`typecheck:play`、`typecheck:vitest` 通过。单测环境的过渡动画由 Vue Test Utils stub 掉，因此测试显式完成 Popper 的 hide 阶段；真实退出与焦点恢复由上述浏览器流程覆盖。

## 未完成范围

公共弹层/样式约束暂不勾选：表头筛选面板仍未接入全局方形配置，Grid 查询/工具栏的完整样式与禁用组合尚待浏览器核对。双语文档全部 Code/Playground 和每项功能与固定列/虚拟窗口组合，继续按独立阶段清单验收，不能用本次隔离页面代替。
