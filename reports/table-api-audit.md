# Table API 文档核对

本轮核对 Table、TableGrid、TableSelect 的中英文 API 元数据与当前源码，并修复实际发现的遗漏。此记录是公共验收的一部分，不代表 `todos.md` 的全部组合验收完成。

## 修订

- Table 补齐旧模型 `row` / `modelValue` 及更新事件的迁移说明，继续以 `v-model:highlight` 为推荐模型；补齐列 `key`、`className`、`cell`、`header`，以及声明式列的 default/header 插槽。
- Grid 单列 `data`：默认未提供，才使用代理内部数据；显式传入的数组优先。其他 Table 属性、事件和插槽沿用已有继承链接，公开方法通过 `getTable()` 访问。
- TableSelect 补齐 emptyText、placeholder、disabled、模型更新和前后缀事件，以及全部六个实例方法。将合并说明拆成各条目的用途、参数和默认值，补充可展开的本地类型。
- API 行锚点加入章节前缀，避免 `slots` 属性与插槽章节、`open` 属性与方法等名称冲突。章节锚点保持原值；原来的单项 `#api-名称` 地址改为 `#api-章节-名称`。
- 中文剪贴板 API 的六个用法链接修正为真实章节 `#复制、剪切与粘贴`。

## 可重复验证

- `pnpm run audit:table-api reports/table-api-coverage.json`：从 TypeScript AST 提取运行时 props、emits、defineExpose 和声明式列配置，对照六页元数据。Vue 支持的驼峰/短横线事件写法视为同一项。
- 每种语言覆盖 Table 的 51 个属性、53 个事件、73 个方法和 31 个列配置；Grid 的 4 个自有或覆写属性、6 个自有事件、9 个方法；TableSelect 的 36 个属性、15 个事件、6 个方法。文档中的 `v-model` 是 modelValue 的使用别名，不计为独立运行时属性。
- 静态默认值每种语言核对 78 项；无法静态确定的导入属性、主题钩子及无显式默认值条目会列在 JSON 的 unresolved 中，不用推测值消除报告。
- 静态插槽从模板、defineSlots 和声明式列读取；动态转发名称不由此检查穷举。Table / Grid 的声明式 Exposes 接口与 defineExpose 方法名一并比对。此检查不宣称逐一证明所有函数参数的语义等价。
- 元数据回归包含反例：删除属性行、重复事件别名、修改已知 Boolean 默认值，均能被检测。全部本地 `Table*` 类型仍需通过类型详情解析测试。
- 本地文档服务运行时执行 `pnpm run audit:table-api-browser`。六页逐项检查实际渲染的 API 名称、章节/行锚点唯一性、所有已提供的页内用法链接，以及每页一项类型详情展开。结果为 `table-api-browser.json`。
- `pnpm run test:docs-examples`：7 项通过，覆盖完整文档示例源和 API 元数据。`pnpm run typecheck` 的五项检查通过。
- `pnpm run normalize:doc-examples` 首次消除六页的行尾格式差异，审阅 diff 确认示例 include 内容和行号未变；第二次 144 页、0 修改、0 跳过。
- `pnpm run docs:build --temp .vuepress/.temp-api-audit` 完成 175 页构建；独立临时目录避免改写运行中的开发服务数据。没有执行发布。

## 验证边界

本轮浏览器核对覆盖 API 表格与类型详情，不替代各功能的 Code/Playground、暗色、键盘和固定列/虚拟滚动组合检查。后续 [动态插槽验收](table-slot-audit.md) 已补充插槽路由和作用域参数核对；[方法参数核对](table-method-contract-audit.md) 修复行对象身份与 measure 类型；[方法选项验收](table-options-audit.md) 完成 88 个方法的双语签名、TableSelect 独立接口和 options 语义核对。API 清单现已完成，剩余全功能组合与示例浏览器总验收继续按 `todos.md` 跟踪。
