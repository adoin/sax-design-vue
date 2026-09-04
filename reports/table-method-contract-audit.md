# Table 方法参数核对（2026-09-05）

基线为 `91f5231`。本轮对照公开接口、实际方法和双语文档，补齐方法签名检查，并验证行对象、数字行键、页内索引和生成源索引的区别。

## 实际修复

- `measure()` 的实现返回 `nextTick` Promise，`TableExposes` 却声明返回 `void`。现声明为 `Promise<void>`，中英文 API 同步；等待的是重置/重测请求执行，并非所有后续 ResizeObserver 回调完成。运行时行为保持原样。
- 树索引使用 WeakMap 按代理对象查找。调用方保留原始行对象时，`scrollToRow` 无法定位，`toggleRowExpand` 无法展开。存取索引统一通过 `toRaw`，原始对象与它的 Vue 代理指向同一记录；内容相同的另一个对象仍不匹配。这个索引也用于详情和编辑的行解析。
- 指定行校验使用 Set 按对象身份筛选，原始对象同样可能没有命中，导致无效行返回校验通过。新增反例先复现 required 失败字段得到 `valid: true`，再统一选择集合的原始对象身份。未修改校验规则、数据所有权或失效请求判断。
- 双语文档补全 `toggleRowExpand`、`setExpandedKeys`、`scrollToRow`、`scrollToColumn` 的参数类型及限制。树键赋值不触发懒加载；树展开方法等待懒加载，加载失败拒绝 Promise。普通滚动先匹配数字行键，未命中才按当前页索引；生成源只接受当前页内的绝对数字源索引，不替调用方展开祖先或翻页。固定/隐藏列不触发横向定位。

## 可重复检查与边界

- `audit:table-api` 从 TableExposes / TableGridExposes 提取 73 + 9 个函数签名，逐语言比较参数顺序、类型、可选性、rest 标记及返回值。归一化空白、联合类型顺序、默认 Row 泛型和 TableRowKey 别名。它是声明结构检查，不是任意 TypeScript 类型等价证明。
- 负向用例分别改变行参数类型、expanded 可选性、Promise 返回值，均被检测。TableSelect 没有独立 Exposes 接口，本项的 checked 为 0；其运行时方法名称及既有六项文档检查保持，不伪造签名检查覆盖。
- 三项组件用例验证数字行键优先、字符串不转数字、原始对象/代理对象等价、同值新对象和不存在目标不定位、measure Promise 及实际测量请求、普通树展开/收起、原始对象校验、生成源第三页的绝对索引及不自动翻页。
- 初轮测试的分页控件依赖浏览器 IntersectionObserver，随后在该索引用例中隔离分页呈现组件；实际分页配置与表格行模型仍运行。未通过修改生产 Popper 掩盖测试环境缺少浏览器 API。

## 验证结果

- Table、Grid、TableSelect、VirtualList 和文档测试：68 个文件、635 项通过。文档测试包含完整示例源码及 API 元数据。
- Web、Vitest、Play 类型检查全部通过；修正测试中的隐式 any 后，原始对象专项再次通过。
- 六页 API 浏览器检查通过：中英文 Table、Grid、TableSelect 的条目、用法链接、唯一锚点与类型详情均正常。
- 双语普通树和懒树、百万行十万列示例的页面、明暗主题、Code 内 Playground 及独立 Playground 入口通过；末端仅挂载 7 行，底部及固定列几何误差为 0。结果见 `table-docs-runtime.json`。
- 首次浏览器执行时原有 8080 文档服务已停止，命令以连接拒绝退出；确认端口和进程后重启文档服务，重新完成上述检查。没有把失败执行计为通过。

这轮没有证明全部嵌套 options 的语义，也没有完成所有新能力的交叉组合。`todos.md` 的整项 API 和组合验收继续保持未完成。
