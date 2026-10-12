---
status: implemented
kind: project-specification
updated_at: 2026-10-12
---

# Agent 公开命名与 Message 头像

## 用户要求

> message应该更像IM布局，比如头像在我们发的信息里应该靠右
> 文档可以加一下头像组件来做而不是KS
> AI的回答，请使用之前的AI 图标……这二者最好可以通过全局配置一次替换
> 目前项目的AI字眼，换成Agent吧……先换字眼再根据字眼改变，改对应的配置项名称

## 实现契约

- 公开分类为 Agent，编辑器为 Agent Editor / SAgentEditor，公共类型与属性定义使用 AgentEditor* / agentEditorProps / agentEditorEmits。新增 agent-editor 组件及样式入口；既有内部实现目录与文档 URL 保留，以保持链接稳定。
- 图片属性及插槽名为 agent-icon，全局配置为 agentIcon。SConfigProvider 与 app.use(SaxDesignVue, { agentIcon }) 共享同一配置链。
- 共享图标实现位于 agent-shared/agent-icon.vue。Message 与编辑器采用同一个默认 SVG，不复制图形；优先级为自定义插槽、组件 agent-icon、全局 agentIcon、内置 SVG。显式空字符串恢复默认。
- Message 用户头像在气泡右侧，其他角色保持左侧，头像与消息顶部对齐。文档用户头像复用 SAvatar 与既有图片，助手默认使用 Agent 图标。avatar 插槽可以覆盖整个头像；agent-icon 插槽只替换默认助手图标。
- 双语 Message 新增共享图标示例，切换 SVG、PNG、默认值同时影响 Message 和 Agent Editor。全局配置指南及编辑器图标 API 同步新名称。

## 验证

- 66 项编辑器与 Agent 组件测试、21 项文档检查通过，web / play / vitest 类型检查及主题构建通过。
- 229 页文档构建通过；中英文编辑器六例、Message 两例共 16 例的 Code 和 Playground 全部浏览器验证通过。
- 浏览器测量用户头像位于气泡右侧；共享 SVG / PNG 同时更新两个图标，默认值恢复 SVG。测试覆盖局部覆盖与显式恢复默认。
