---
status: implemented
kind: project-specification
updated_at: 2026-09-22
completed_at: 2026-09-16
modules:
  - docs/.vuepress/theme/components
  - docs/.vuepress/theme/node
  - packages/components/popper
  - docs
supersedes: []
---

# API 类型引用的递归查看能力

## 项目目标

让生成式文档中的 API 类型表达式成为可阅读、可追踪的类型引用图。使用者可以从一个复合类型中的具体自定义类型开始，逐层查看其声明和继续引用的类型，同时保留已经打开的上层内容，以便对照和复制。

## 用户原始需求

> 这不是我要的这种多类型互相引用却没有统一交互太蠢了。
> 首先改成点击，其次比如这种Boolean|&#x20;**&#xA0;TableClipboardConfig**  那么只&#x5728;**&#xA0;TableClipboardConfig**  上点击有用，并且弹出的一层&#x662F;**&#xA0;TableClipboardConfig**  的声明，这里就需要第一层的highlight，目前也没做。然后其中你会看&#x5230;**&#xA0;TableClipboardConfig**  还引用了其他的类型，那么这些类型还可以二次点击继续弹出更高一层的弹出层，并且旧的一层不会关闭，然后以此类推，永远可以叠加到最原始类型。 然后所有的这些共享一套clickoutside判断，不点在这些弹出层上才算关闭

## 已确认的项目规格

- 类型详情由点击触发，不以悬停作为主要交互。
- 对 `Boolean | TableClipboardConfig` 这类复合表达式，只允许可解析的自定义类型 `TableClipboardConfig` 点击；基础类型、运算符、标点和无法解析的标识符只负责高亮显示。
- 公共 API 中具名导出的类型别名（包括组件包之外的共享类型，如 `ComponentSize`）必须进入同一类型注册表并保持逐层点击能力；不得为了绕过未解析声明而把类型元数据降级成 `String` 或无交互纯文字。
- 点击一个类型只打开该类型自己的声明，不能把所有可达声明聚合到同一个扁平面板中。
- 根类型表达式和每一层声明从第一层开始就必须有语法高亮。
- 声明中引用的其他可解析类型可以继续点击，并在更高一层打开；已经打开的祖先层保持可见。
- 递归查看可以持续到基础类型或无法继续解析的标识符。递归或互相递归的类型必须防止无限展开。
- 所有触发器和所有弹层共享同一个外部点击边界；点击任意触发器或弹层内部都不能关闭，只有点击整组之外才关闭完整栈。
- 声明内容必须可选择、可复制，并保留键盘操作、可见焦点、Escape 关闭以及 `SPopper` 的定位和视口适配能力。

## 架构约束

- `docs/.vuepress/theme/node/apiTypeDetails.ts` 负责生成声明、来源路径和直接引用关系；递归交互应复用这份类型注册表，而不是再实现一套扫描器。
- 类型注册表同时扫描组件本地类型与显式配置的共享公共类型根；共享声明仍通过唯一名称解析，不能在页面或组件层为某个别名写专用映射。
- `docs/.vuepress/theme/components/ApiTable.vue` 负责把非空类型交给类型详情渲染，不应恢复依赖整段表达式的单按钮交互。
- `docs/.vuepress/theme/components/ApiTypeDetails.vue` 及其拆分组件负责类型 token 渲染和层级栈状态。
- 浮层继续复用共享 `SPopper` 的 Teleport、定位、翻转、偏移、层级和滚动跟踪能力；如果共享 clickoutside 需要扩展，应在共享浮层能力上完成，不能新建平行的绝对定位系统。
- 中英文文档页面必须提供一致的行为；新增的可见提示需要通过现有文档本地化能力提供对应语言。

## 项目级待办

- [x] 将根类型表达式和声明拆成带语法角色的 token，只让可解析的引用 token 具备点击能力。
- [x] 实现可递归叠加的单路径弹层栈，并明确循环引用与从祖先层切换分支时的稳定行为。
- [x] 实现覆盖全部 Teleport 弹层和触发器的共享 clickoutside 边界，以及 Escape、键盘激活、焦点和文本选择行为。
- [x] 补齐组件测试：基础类型不可点击、指定引用点击、多层打开、祖先保留、分支替换、循环引用、共享外部点击、Escape、键盘访问和代码选择复制。
- [x] 更新 `play/__tests__/doc-api-metadata.test.ts` 的契约，并在 Date Picker、Table 的中英文 API 页面完成实际验证。
- [x] 通过相关 ESLint、Web/Vitest 类型检查、文档测试和完整文档构建后，才能把本规格移入 `implemented/`。

## 已实现方案

- `ApiTypeTokens.vue` 保留表达式原始空白并按关键字、基础类型、标识符、字符串、数字、运算符、标点和注释渲染语法角色；只有注册表中存在且属于当前直接引用集合的标识符使用原生按钮。根代码和引用按钮保持透明、无边框、无阴影、无下划线的纯行内文本外观；单个类型名不在内部断行，联合与交叉运算符和后续类型共同换行，避免标签化外观、跨行底色和孤立运算符。
- `ApiTypeDetails.vue` 使用一条可替换分支的层级路径记录声明、精确 token 位置、虚拟锚点和逐层递增的 z-index。点击祖先层中的另一引用只替换其上方分支；活动路径中已经出现的类型保持可见但禁止再次展开，防止递归环无限增长。
- 每层声明继续使用 `SPopper` 的 Teleport、虚拟锚点、翻转、偏移和视口移动能力。根层拥有外部点击监听，子层把关闭所有权交给根层；同一实例的根表达式和所有 Teleport 面板共享忽略选择器，所以内部点击不会关闭祖先，整组之外的点击一次关闭完整栈。
- Escape 关闭完整栈并把焦点还给根引用；原生按钮提供键盘激活和可见焦点。声明面板保持 `user-select: text`，行内代码复制增强通过既有 `data-no-inline-code-copy` 豁免，避免把包含引用按钮的根代码再包装成按钮语义。
- `SPopper` 新增 `closeOnClickOutside` 和 `outsideClickIgnore`，使多个 Teleport 面板可以明确共享一个外部点击所有者；外部监听随打开状态建立，不依赖进入动画完成后才开始工作。

## 验证

- `pnpm exec vitest run docs/.vuepress/theme/components/__tests__/api-type-details.test.ts packages/components/popper/__tests__/virtual-trigger.test.ts play/__tests__/doc-api-metadata.test.ts --maxWorkers=1`：3 个文件、19 项测试通过。
- 相关 Vue/TypeScript 文件 ESLint 通过，`git diff --check` 通过。
- `pnpm run typecheck:web` 与 `pnpm run typecheck:vitest` 通过。
- `pnpm run test:docs-examples`：4 个文件、14 项测试通过。
- `pnpm run docs:build`：完整渲染 201 页；既有插件耗时和大块体积提示仍为非阻断警告。
- 浏览器实际验证英文和中文 Date Picker API：本地化触发器与面板标签正确，声明语法高亮、文本选择、Escape 关闭和根触发器焦点恢复正常。
- 浏览器实际验证英文 Table API：`Boolean | TableClipboardConfig` 只有 `TableClipboardConfig` 可点击；连续打开 `TableClipboardConfig`、`TableEditContext`、`TableCellRenderParams` 三层后祖先保持可见，层级 z-index 递增，点击整组之外一次关闭完整栈。
- 浏览器实际验证中文 Table API：两层声明、本地化来源标签、精确 `aria-expanded`、Escape 关闭和焦点恢复正常。
- 浏览器实际验证中文 Table API 的窄类型列：根代码与引用按钮的计算样式均为透明背景、无边框、无阴影和无下划线；引用行盒与代码行高一致，长类型名不在内部拆行，联合运算符不单独占行。

## 禁止方案

- [整段类型表达式的扁平弹层](../prohibited/flat-api-type-details-popover.md)：不得保留“整段表达式一个按钮、一个面板聚合所有声明、悬停主导”的实现。
- [公共 API 类型别名退化为纯文字](../prohibited/plain-text-public-api-type-alias.md)：不得用基础类型或不可交互文本掩盖类型注册表遗漏。
- [公共文档写入对话过程](../prohibited/conversation-history-in-public-docs.md)：公共文档只描述最终交付能力，不写本次对话或迁移过程。
