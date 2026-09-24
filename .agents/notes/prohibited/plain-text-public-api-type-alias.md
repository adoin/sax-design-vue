---
status: prohibited
kind: prohibited-approach
recorded_at: 2026-09-22
scope:
  - docs/.vuepress/theme/node/apiTypeDetails.ts
  - docs/.vuepress/theme/components/ApiTypeDetails.vue
  - docs/components
  - docs/zh/components
reopen_only_if: 用户明确要求某个公共类型不公开声明，且该类型被正式标记为不透明类型。
---

# 禁止把公共 API 类型别名退化为纯文字

## 用户原始要求

> Size类型怎么变纯文字了，我要的是逐层点击这个交互，难道项目规格里面没声明吗？ 修复完补一下声明以免后续再犯

## 失败方式

组件文档把 `ComponentSize` 写入类型列，但类型注册表只扫描组件目录，没有扫描该别名所在的共享 constants 包。渲染层因此只能把它显示为不可交互的普通标识符，丢失已经实现的逐层点击声明交互。

## 禁止原因

- 同一个 API 表中，局部类型可以点击而共享公共别名不能点击，交互契约不一致。
- 把元数据改写成 `String` 或保留无交互文字会隐藏索引缺口，并使读者无法继续查看真实联合类型。
- 在页面层给单个类型写映射会形成第二套类型解析来源，后续共享类型仍会重复失效。

## 必须采用的方向

扩展统一类型注册表的扫描根，让组件本地声明和共享公共声明都通过同一名称解析、token 高亮和递归弹层栈呈现。公共具名类型无法解析时应由文档契约测试失败，不能静默降级为基础类型或普通文本。
