---
status: implemented
completed_at: 2026-10-14
kind: project-specification
modules:
  - packages/theme-chalk/src/form.scss
  - docs/components/form.md
  - docs/zh/components/form.md
---

# Form 容器响应式布局

- Form 保留 24 单位 span API；项目按父行宽度分配比例，并扣除实际项目之间的 columnGap，不为未渲染的 24 个轨道预留 23 个间隔。
- 配置式 children、声明式 nested 内容和表单根行分别建立 sax-form inline-size 查询容器。断点 480/768/1024/1280px 依据最近的行容器；窄容器标签堆叠也依据容器宽度。
- inline 模式保留内容自适应宽度。FormGroup 占满所在行。
- 验证：默认 16px 间距下 admin 281px 表单无项目溢出；文档 640px 行呈现 312px + 16px + 312px，320px 行呈现整行项目；嵌套表单与 FormGroup 实际布局已检查。
- Form 测试及文档源/元数据检查通过（两个 5 秒超时的元数据测试以 60 秒上限单独重跑通过）；完整 231 页文档构建、压缩主题样式验证通过。中英文容器示例的 Code 与 Playground 已验证。
