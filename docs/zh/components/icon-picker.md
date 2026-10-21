---
API_TITLES:
  PROPS: 调用参数
PROPS:
  - name: locale
    type: Language
    values: '组件语言包'
    description: 弹窗及其内部控件使用的语言包。
    default: 英文
  - name: title
    type: String
    values: '弹窗标题'
    description: 覆盖默认标题。
    default: 插入图标
  - name: iconList
    type: readonly string[]
    values: 'Iconify 名称或已注册的本地 SVG 名称'
    description: 候选名称；打开时通过 API 加载缺少的 Iconify 数据。
    default: 168 个常用 Carbon 候选名称
  - name: api
    type: boolean | IconPickerApiOptions
    values: 'true / false / { baseUrl, collections, timeout }'
    description: true 默认从公网 Iconify 加载缺少的数据；对象指定内网端点；false 禁止请求，须预注册所需图标。
    default: 'true'
    usage: '#icon-data-sources'
  - name: initialIcon
    type: String
    values: 'prefix:name'
    description: 弹窗打开时预选的图标。
    default: "''"
  - name: output
    type: String
    values: 'svg / code'
    description: 控制 Promise 返回完整 SVG，或包含 code、color、size 的精简对象。
    default: svg
  - name: color
    type: String
    values: 'HEX / RGB / HSL'
    description: 初始图标颜色。
    default: '#5667F4'
  - name: size
    type: Number
    values: '8 - 256'
    description: 固定输出尺寸；不传时由用户在弹窗内选择。
    default: 弹窗选择，初始为 24
  - name: label
    type: String
    values: '无障碍文本'
    description: 设置后输出 role=img 与 aria-label；不设置时输出装饰图标。
    default: null
  - name: showName
    type: Boolean
    values: 'true / false'
    description: 是否在图标宫格中显示名称。
    default: 'true'
  - name: showAlpha
    type: Boolean
    values: 'true / false'
    description: 是否允许选择透明度。
    default: 'false'
  - name: predefine
    type: Array
    values: '颜色预设'
    description: 传给颜色选择器的预设颜色。
    default: '[]'
  - name: maskClosable
    type: Boolean
    values: 'true / false'
    description: 是否允许点击遮罩关闭弹窗。
    default: 'true'
  - name: confirmText
    type: String
    values: '按钮文案'
    description: 自定义确认与取消按钮文字。
    default: null
  - name: cancelText
    type: String
    values: '按钮文案'
    description: 自定义确认与取消按钮文字。
    default: null
description: '通过 Promise 弹窗选择图标、颜色与尺寸，按需返回图标代码或完整 SVG。'
---

# Icon Picker 图标选择器

<card>

IconPicker 提供 Promise 风格的图标选择弹窗。`output: 'svg'` 返回完整 SVG
字符串；`output: 'code'` 返回包含图标代码、颜色和尺寸的精简对象。取消、关闭或在
服务端环境调用时返回 `undefined`。

传入 `size` 会固定输出尺寸；不传时，用户可以直接在弹窗中选择 8–256 px 的尺寸。

默认列表只包含 168 个候选名称，不包含对应 SVG。IconPicker 可以使用预注册数据或 API，不强制依赖公网；但默认 `api: true` 会从公网加载缺少的数据。内网项目请先阅读[数据来源与网络要求](#icon-data-sources)，推荐使用[自建 API](#self-hosted-api)；完全断网时使用[离线图标](#offline-icons)。

```ts
import { SIconPicker } from 'sax-design-vue'

const svg = await SIconPicker({
  title: '插入图标',
  output: 'svg',
  color: '#5667F4',
  showAlpha: true,
})

if (svg) editor.insertHtml(svg)

const icon = await SIconPicker({ output: 'code' })
// { code: 'cb:rocket', color: '#5667F4', size: 24 }
```

</card>

<card>

## 富文本插入

把光标放进下面的可编辑区域，点击“插入图标”。Demo 只保存并插入 Promise
返回的 SVG，不保存图标名称。

<template #example><icon-picker-default /></template>

<template #template>

@[code{64-93}](../../.vuepress/components/icon-picker/default.vue)

</template>

<template #script>

@[code{1-62}](../../.vuepress/components/icon-picker/default.vue)

</template>

<template #style>

@[code{95-148}](../../.vuepress/components/icon-picker/default.vue)

</template>

</card>

<card>

## 数据来源与网络要求

IconPicker 先复用应用已注册的数据和内部控件回退，再加载缺少的候选图标。普通 `SIcon` 不会主动联网，组件库也不会内置完整候选 SVG 集合。

| 场景                 | 推荐配置                                             | 运行时要求                                      |
| -------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| 可访问公网           | 默认 `api: true`                                     | 浏览器能访问 `https://api.iconify.design`       |
| 内网可访问业务服务器 | `api: { baseUrl: 'https://icons.intranet.example' }` | 浏览器能访问自建 Iconify 兼容服务，无需访问公网 |
| 完全离线、静态交付   | `api: false`，提前注册 `iconList`                    | 不需要图标 API                                  |

公网被防火墙拦截、CSP 限制、服务不可达或请求超时时，缺少的数据无法加载。弹窗会提示失败并允许重试；已有数据仍可使用，但未获取的候选不会显示，不能把默认模式当作完整的离线图标库。如果所有候选都尚未准备且 API 不可达，弹窗将没有可选项。

成功请求的数据只缓存在当前页面内，刷新后仍需重新取得数据；缓存不等于离线资源。关闭弹窗会取消未完成的请求。

</card>

<card>

## 内网自建 API（推荐）

内网需要较多图标时，推荐由团队通过 Docker 部署 Iconify API，前端仅配置服务地址。官方仓库提供 [`iconify/api` 镜像用法](https://github.com/iconify/api#docker)和[图标来源配置](https://github.com/iconify/api/blob/main/src/config/icon-sets.ts)。

自建服务不自动等于离线部署：官方服务默认图标来源可能在启动时获取更新。隔离网络应提前准备镜像和需要的 Iconify JSON 图标集，通过本地目录提供数据，而不是依赖运行时下载。

1. 在可联网的制备环境取得 `iconify/api` 镜像，以及 `@iconify-json/carbon` 包中的 `icons.json`，将该 JSON 保存为 `icon-sets/carbon.json`。文件名须与 JSON 的 `prefix: "carbon"` 一致。其他集合也各放一个对应前缀的 JSON。
2. 将镜像和数据目录导入内网；准备下面的 `compose.yaml`，与 `icon-sets` 目录放在一起：

```yaml
services:
  iconify-api:
    image: iconify/api:latest
    pull_policy: never
    restart: unless-stopped
    ports:
      - '3000:3000'
    environment:
      ICONIFY_SOURCE: none
      ALLOW_UPDATE: 'false'
    volumes:
      - ./icon-sets:/data/iconify-api/icons:ro
```

```sh
docker compose up -d
```

`pull_policy: never` 只使用已经导入宿主机的镜像，参见 [Compose 拉取策略](https://github.com/compose-spec/compose-spec/blob/main/container_spec.md#pull_policy)。`ICONIFY_SOURCE: none` 关闭远程官方图标来源，只加载挂载的本地 JSON。默认候选使用 Carbon，必须提供 `carbon.json`；空目录无法提供这些候选。JSON 供 API 服务读取，不需要把整套数据导入前端。上线时请将示例的 `latest` 换成已验证的镜像标签或摘要，隔离网络中提前导入该镜像。

3. 验证 `http://服务器地址:3000/carbon.json?icons=home,search` 返回图标 JSON，再配置调用：

```ts
import { SIconPicker } from 'sax-design-vue'

const icon = await SIconPicker({
  output: 'code',
  api: {
    baseUrl: 'https://icons.intranet.example',
    collections: { cb: 'carbon' },
    timeout: 10000,
  },
  iconList: ['cb:home', 'cb:search'],
})
```

`baseUrl` 必须是用户浏览器可访问的内网地址，不能直接使用仅 Docker 网络可解析的服务名。跨域时服务需允许前端来源；HTTPS 页面应使用 HTTPS API，可通过同域反向代理接入。参见[官方反向代理说明](https://iconify.design/docs/api/hosting-js/reverse-proxy.html)。

内网 API 只提供数据，`iconList` 仍决定弹窗候选；当前选择器不会自动检索服务器上全部图标。配置自建端点后，请求只发往该端点，失败时不会回退到公网。

</card>

<card>

## 完全离线使用

固定候选集合更适合在 admin 等业务项目构建时预打包，再以 `api: false` 运行。图标数据进入业务应用产物，组件库本身仍只携带内部控件图标。

安装所需集合到应用的构建环境：

```sh
pnpm add -D sax-design-vue-iconify @iconify-json/carbon
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { saxIcons } from 'sax-design-vue-iconify/vite'

export default defineConfig({
  plugins: [
    saxIcons({
      mode: 'local',
      collections: { cb: 'carbon' },
      safelist: ['cb:home', 'cb:search'],
    }),
    vue(),
  ],
})
```

```ts
import { SIconPicker } from 'sax-design-vue'

const icon = await SIconPicker({
  api: false,
  iconList: ['cb:home', 'cb:search'],
  output: 'code',
})
```

构建依赖也需要提前导入隔离网络；`mode: 'local'` 在构建时读取本地集合，浏览器运行时无需图标服务。也可在联网构建环境使用 `mode: 'api'` 完成应用打包，再离线部署产物。SSR 或非 HTML 入口需先导入 `virtual:sax-icons/register`，使 safelist 生效。

自有 SVG 可用 [`signSvgs`](../icons/#local-svg-files) 注册为 `lo-home` 等名称，或使用 `addIconDataRecord` 手动注册。动态候选必须在应用 safelist 中覆盖。仅设置 `api: false` 不会自动补全 168 个默认候选；未注册且非内部回退的图标不会显示，建议显式传入已准备好的 `iconList`。

</card>

<card>

## 返回格式与图标来源

`SIconPicker(options)`、`openIconPicker(options)` 和安装后的
`this.$iconPicker(options)` 使用同一套服务：

```ts
interface IconPickerCodeResult {
  code: string
  color: string
  size: number
}
```

- `output: 'svg'`：返回完整 `<svg>...</svg>` 字符串，可直接插入 HTML，后续展示不依赖图标运行时。
- `output: 'code'`：返回 `IconPickerCodeResult`，数据更精简，后续展示需要对应的图标库。
- 取消、关闭：返回 `undefined`。
- `iconList` 控制这一次弹窗中可选择的图标。
- 图形数据来自应用注册、内部控件回退或配置的可信 API；颜色由 ColorPicker 规范化后写入 SVG。网络要求和离线方案见[数据来源](#icon-data-sources)，内网环境优先使用[自建 API](#self-hosted-api)。

</card>
