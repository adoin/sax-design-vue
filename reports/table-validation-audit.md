# Table 类型与测试验收（2026-09-04）

## 类型检查

本轮以 `e6970c3` 为基线重新运行 `pnpm run typecheck:vitest`，确认 86 处错误。修复集中在测试夹具与断言：

- 为生成源的行列回调、受控事件、变更请求和校验结果补全实际接口类型。
- Select、Tabs 测试辅助函数使用 `ComponentMountingOptions` 获取组件插槽契约，避免把含字符串和操作函数的 slot scope 误写成纯数字字典。
- 存在性判断使用 `find()` / `findComponent()`；`get()` 保留用于要求元素一定存在的访问。
- 为可修改的行副本、懒加载子节点、滚动方法重载和虚拟器 mock 补全正确类型；Carousel 保留缺失 style 属性时失败的行为。
- 属性工具的类型断言先展开顶层交叉类型，再比较完整对象结构。字段、字面量、只读和可选性预期保留；工厂默认值与普通默认值仍分别校验。更新用于测试原生 Function / 空对象类型的旧 lint 规则名称。

完整命令 `pnpm run typecheck` 已退出 0：

| 子命令 | 结果 |
| --- | --- |
| `typecheck:web` | 通过 |
| `typecheck:play` | 通过 |
| `typecheck:node` | 通过 |
| `typecheck:vite-config` | 通过 |
| `typecheck:vitest` | 通过 |

TypeScript 配置、检查范围及组件公共类型保持原有契约，未以排除文件或 `@ts-ignore` 处理错误。

## 运行测试

在 PowerShell 7 中，对本轮修改的 26 个组件/工具测试文件以及全部 Table、TableGrid、TableSelect、VirtualList 测试运行：

```powershell
$changedTests = git diff --name-only -- '*.ts'
pnpm exec vitest run $changedTests packages/components/table/__tests__ packages/components/table-grid/__tests__ packages/components/table-select/__tests__ packages/components/virtual-list/__tests__
```

结果：74 个文件、720 项测试通过。提交后的改动文件列表可用 `git diff --name-only e6970c3..HEAD -- packages/` 重建；文档测试另按下述命令运行。

## 文档校验

- 源码扫描原来对空源码直接 `return`，现在缺少 Code/Playground 源码会明确失败。
- API 类型解析从少量预选类型扩展到中英文 Table、TableGrid、TableSelect 的 PROPS、CHILD_PROPS、EVENTS、SLOTS、EXPOSES 中声明的所有 `Table*` 类型，并要求每页实际发现类型后再验证。
- `pnpm run test:docs-examples`：2 个文件、5 项测试通过，包括全部组件示例的 SFC 重建、编译和挂载，以及逐行 API 元数据检查。
- `pnpm run normalize:doc-examples`：144 页，0 页改动、0 示例改动、0 跳过。
- 本轮变更文件 lint 与 `git diff --check` 通过。

本轮未变更共享文档编译、Code 或 Playground 运行管线。基线 `6db6956` 至本轮的 `docs/.vuepress/theme` 也没有改动，因此相关条件式构建验收未触发。

## 验收边界

本记录关闭 `todos.md` 的“运行相关组件测试、文档测试和类型检查”条目。它不证明每项公共 API 都已经写进文档，也不以静态源码编译替代全部交互组合的浏览器验证。模块边界、API 完整性、默认行为及其余公共约束仍按待办逐项审核。
