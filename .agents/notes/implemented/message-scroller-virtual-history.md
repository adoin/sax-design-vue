---
status: implemented
kind: project-specification
updated_at: 2026-10-12
---

# Message Scroller 动态虚拟消息与历史懒加载

用户要求内置动态行高虚拟滚动，保留懒加载，并将文档示例改为用户与 Agent 对话。

- items / v-model:items 采用 AgentHistoryMessage[]，稳定唯一 id；提供 items 后默认 virtual=true，复用 SVirtualList dynamic 测量，retainMaxSize=false。不提供 items 仍使用原有 default 插槽。
- message 插槽自定义单条数据消息；默认使用 SMessage。estimatedItemHeight、overscan 控制预估与预渲染。
- loadMore(signal) 返回更早消息数组，组件合并并去重，保留请求期间新加入的消息；并发锁、重试、hasMore / 空结果停止、卸载和加载器替换时取消。
- 历史头插按可见消息 id 与像素偏移恢复定位；虚拟测量不复用普通 DOM 头插补偿，避免双重修正。滚动意图来自滚轮、键盘、触摸及滚动条拖动，动态布局变化保持底部跟随。
- 文档包含普通插槽对话与 200 条动态虚拟对话、三页历史、流式增高和用户 SAvatar。
- 浏览器：200 条初始数据仅渲染约 6–15 行，实测行高 57–317px；流式增高和 End 定位距底部小于 1px。三页历史均加载，稳定可见 id / 像素偏移保留；历史阅读中追加对话不抢滚动且显示未读。
- Home / End 和虚拟首尾入口使用 SVirtualList API 直接定位，避免动态测量打断浏览器平滑滚动。捕获向上滚动意图先暂停跟随，不在初始化跟随过程中意外请求历史。
- 45 项 Agent 回归、21 项文档检查、web / play / vitest 类型检查、主题构建通过；双语基础 / 虚拟四例 Code 与 Playground 验证通过。
