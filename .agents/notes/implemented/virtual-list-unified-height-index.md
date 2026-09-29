---
status: implemented
kind: project-specification
updated_at: 2026-09-29
modules:
  - packages/components/virtual-list
  - packages/components/select
  - packages/components/table
---

# 统一虚拟列表高度索引

## 用户要求

> 好的 那就统一使用第二种算法 开工

## 契约

- SVirtualList 对所有规模的数组和 count/itemAt 数据源统一使用 useSparseVirtualizer，不按一万条切换 TanStack 路径。
- dynamic 仅决定是否测量实际行高；固定行高无测量记录时直接通过乘除法定位，不分配高度差树。
- 动态测量按批提交，维护高度差索引和稳定 key，保留大列表的逻辑/物理滚动映射与拖动滚动条保护。
- 数据替换、排序与模式改变不得沿用错误测量。布局重测的旧锚点恢复不得覆盖后来发生的滚动定位或滚轮输入。
- Select 的 virtual-config.threshold 仍是是否启用虚拟渲染的门槛，不是内部算法切换门槛。

## 验证

- Select、VirtualList、Table 与键盘导航相关 98 项测试通过。
- 包含 40、400、10000 行固定行高、400 行动态行高、测量重置、重排、空列表恢复、生成数据、滚动条拖动与跨行编辑定位。
- 文档 21 项契约测试通过。
