---
status: implemented
kind: project-specification
updated_at: 2026-09-23
completed_at: 2026-09-23
modules:
  - docs/components/pagination.md
  - docs/zh/components/pagination.md
  - docs/.vuepress/components/pagination
  - docs/.vuepress/components/pagination-zh
supersedes: []
---

# Pagination 文档示例结构

## 用户原始需求

> 怎么这里有个 这个样式，而且默认里面是没东西的啊，光有一个布局，这个文档结构也是乱七八糟

## 项目契约

- Pagination 的每张示例卡片只用一个二级标题，不在“默认”卡片内嵌“布局”三级标题，也不让圆形和方形跨卡片形成不完整的目录层级。
- “默认”卡片先展示实际可操作、使用组件默认 `layout` 的分页；布局选项在独立的“布局”卡片中说明并展示精简、含总数/每页条数、自定义插槽三种组合。
- “形状”卡片并列比较 `shape="circle"` 与 `shape="square"`，不使用不存在的 `circle` / `square` 布尔 API。
- 中英文卡片顺序和英文 heading slug 一致；含示例文案的布局、形状和颜色示例分别提供本地化 SFC 源码，使页面、Code 和 Playground 一致。
- API 用法链接指向现存示例锚点；类型、默认值和插槽作用域与组件实现保持一致。删除无示例的旧页面说明和孤立示例文件。

## 验证

- 文档示例测试 4 个文件、18 项通过，文档类型检查通过。
- 浏览器核对默认分页可见且无横向溢出、每卡片单个 H2、右侧目录为平级示例、双语 Code 完整 SFC 与 Playground 正常渲染。
- 文档生产构建通过。
