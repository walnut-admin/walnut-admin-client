# Monorepo 改造方案

## 概述

将 walnut-admin-client 从单包结构改造为 **Turborepo + pnpm workspaces** 的 monorepo，按 `apps/` + `packages/` 结构拆分。

- **工具**: Turborepo + pnpm workspaces
- **范围**: 仅前端，不纳入后端
- **包管理器**: pnpm >=9.0.0
- **原则**: `packages/` = 框架级通用模块（可独立发布复用），`apps/admin/` = 业务逻辑

## 目录结构

```
walnut-monorepo/
├── apps/
│   ├── admin/           # @walnut/admin — 管理后台主应用
│   └── mfa-demo/        # @walnut/mfa-demo — 预留 Demo 应用
├── packages/
│   ├── shared/          # @walnut/shared — 基础共享（零依赖）
│   ├── axios/           # @walnut/axios — HTTP 客户端框架
│   ├── core/            # @walnut/core — 通用 composables
│   ├── ui/              # @walnut/ui — W* 组件库
│   └── ai/              # @walnut/ai — AI 聊天子系统
├── turbo.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── eslint.config.mjs
├── commitlint.config.mjs
├── .npmrc
├── package.json
└── pnpm-lock.yaml
```

## 包依赖图

```
apps/admin ────── 依赖全部 5 个 packages
apps/mfa-demo ─── 依赖 ui + shared（未来）

packages/ai ────── 依赖 ui + core + axios + shared
packages/ui ────── 依赖 shared + core
packages/core ──── 依赖 shared           ← 精简后不再依赖 axios
packages/axios ─── 依赖 shared
packages/shared ── 零依赖（最底层）
```

依赖方向严格单向向下。`@walnut/shared` 是唯一零依赖的基础包。

## 各包拆分明细

### @walnut/shared（基础共享）— 零依赖

| 来源 | 内容 |
|------|------|
| `src/const/` | 通用常量（不含 admin 业务常量如 menu/tab/symbol） |
| `types/custom.d.ts` 等 | 通用类型定义（ViteEnv, DeepKeyOf, UnionToIntersection...） |
| `src/utils/crypto/` | 加解密工具（AES-GCM, RSA-OAEP, HKDF, HMAC, 签名派生） |
| `src/utils/persistent/` | 存储抽象层（localStorage, IndexedDB, Cookie, 迁移） |
| `src/utils/regex.ts` | 正则模式（手机号/邮箱） |
| `src/utils/queue.ts` | 队列数据结构 |
| `src/utils/shared.ts` | 通用工具函数（slot text, device 检测, 对象路径...） |
| `src/utils/file/` | 文件工具（base64, download） |
| `src/utils/window/` | 窗口工具（base64, open） |

### @walnut/axios（HTTP 客户端框架）

**仅保留框架代码，业务拦截器/config 留在 apps/admin：**

| → packages/axios/src/ | 内容 |
|-----------------------|------|
| `core/instance.ts` | Axios class（通用 HTTP 封装管道） |
| `adapters/` | cache, cancel, retry, throttle, merge, id |
| `types.d.ts` | 精简版：IAxios.Config + Transformers 接口（移除 IModels 引用） |

| → apps/admin/src/utils/axios/ | 内容 |
|------------------------------|------|
| `core/config.ts` | originalConfig（依赖 useAppEnvProxy） |
| `interceptors/request/` | token, signature, crypto, fingerprint, language |
| `interceptors/response/` | decrypt, refreshToken, RSA decrypt, capJSToken, sign |
| `types.d.ts` | BaseResponse, BaseListParams, module augmentation |
| `index.ts` | AppAxios 实例组装 |
| `constant.ts, utils.ts` | 常量 + 工具 |

### @walnut/core（通用 composables）— 仅框架 hooks

**只纳入零 `@/` 业务依赖的 hooks，共 ~21 files, ~800 lines：**

| 来源 | 文件 | 依赖（非 @walnut） |
|------|------|-------------------|
| `hooks/core/` | useContext, useLocalRefresh, useProps, useState | vue, lodash-es, @vueuse/core |
| `hooks/component/` | useConfirm, useGlobalAsyncComponent, useMessage, useNoti | vue, naive-ui(types), easy-fns-ts |
| `hooks/vueuse/` | 全部 10 个 | @vueuse/core, vue, naive-ui |
| `hooks/web/` | useBlob, useLinkTag, useRouterParam | vue, @vueuse/core, vue-router |

### @walnut/ui（UI 组件库）

| 来源 | 内容 |
|------|------|
| `src/components/UI/` | WForm/WTable 体系 + 全部基础 UI 组件 |
| `src/components/Advanced/` | WCRUD + ApiSelect + RoleSelect |
| `src/components/Extra/` | 通用组件（EmailInput, IconPicker 等） |
| `src/components/Business/` | 业务组件（AvatarUpload, Dict, AreaCascader） |
| `src/components/HOC/` | WithValue.tsx |

### @walnut/ai（AI 聊天子系统）

| 来源 | 内容 |
|------|------|
| `src/components/Global/AI/` | components, store, composables, config, prompts, utils, types |

### apps/admin（主应用 + 所有业务逻辑）

| 内容 | 说明 |
|------|------|
| `src/App/` | Vue app 初始化、NaiveUI provider |
| `src/views/` | 所有页面 |
| `src/layout/` | 布局组件 |
| `src/api/` | API 调用层 |
| `src/locales/` | i18n |
| `src/plugins/` | PWA 注册 |
| `src/main.ts` | 应用入口 |
| `src/components/Global/` | 其余全局组件（Cap, ForceQuit, VerifyAuth 等） |
| `src/components/App/` | App 级组件（DarkMode, LocalePicker, Lock 等） |
| `src/components/Vendor/` | 第三方封装（CodeMirror, ECharts 等） |
| **`src/store/`** | **25 个 Pinia store 模块（业务状态）** |
| **`src/router/`** | **Vue Router + 守卫 + 内建路由** |
| **`src/socket/`** | **Socket.IO 客户端** |
| **`src/core/`** | **AppCoreFn1（路由+菜单+权限初始化）** |
| **`src/hooks/`** | **业务 hooks（~14 个，依赖 store/router/api）** |
| **`src/utils/axios/`** | **config + interceptors 注册** |
| `src/const/` | 业务常量（menu, tab, symbol, persistent keys） |

## admin hooks 分类

### → @walnut/core（框架 hooks）

```
hooks/core/    useContext, useLocalRefresh, useProps, useState
hooks/component/ useConfirm, useGlobalAsyncComponent, useMessage, useNoti
hooks/vueuse/  useBattery, useBreakpoints, useDocumentVisibility,
               useDraggableElement, useExpireTimer, useIntervalFnWithPercent,
               useNavigatorLanguage, useNetwork, usePreferredReducedMotion, useResize
hooks/web/     useBlob, useLinkTag, useRouterParam
```

### → apps/admin（业务 hooks，留在 admin）

```
hooks/app/     useAppContentFull, useAppDark, useAppEnv, useAppHijackF5,
               useAppIntro, useAppResize, useAppTextSelection, useAppTitle
hooks/core/    useDict, useRedirect
hooks/web/     useMonitor, useRouterQuery
hooks/component/ useCountdown, useDriver
```

## 构建配置关键点

### 包构建方式
- **packages**: Vite library mode，输出 ESM + `.d.ts`（`vite-plugin-dts`）
- **apps/admin**: Vite SPA mode，`ssr.noExternal` 包含 `@walnut/ui` 和 `@walnut/ai`

### UnoCSS 适配
- 配置保留在 `apps/admin/uno.config.ts`
- `content.filesystem` 额外扫描 `packages/ui/src/` 和 `packages/ai/src/`

### NaiveUI 组件自动注册
- `unplugin-vue-components` 运行在 `apps/admin` 层
- 新增 resolver 将 W* 组件解析指向 `@walnut/ui`

### Auto-import 适配
- `unplugin-auto-import` 新增从 `@walnut/core` 导入 hooks 的预设

## 迁移策略

**原则：不依赖任何其他 package 的先迁移，逐层向上。**

| Phase | 内容 | 验证点 |
|-------|------|--------|
| 1. 抽 shared | 移动常量/类型/工具/crypto/persistent | `pnpm build --filter=@walnut/shared` + types:check |
| 2a. 抽 axios | 移动 instance + adapters，精简 types | `pnpm build --filter=@walnut/axios` |
| 2b. 抽 core | 移动 21 个框架 hooks | `pnpm build --filter=@walnut/core` |
| 3. 抽 ui | 移动 W* 组件，imports 指向 @walnut/core | 表单/表格/CRUD 渲染正常 |
| 4. 抽 ai | 移动 AI 聊天子系统 | AI 面板/流式响应正常 |
| 5. 收尾 | apps/admin import 路径全量切换 | 完整构建 + lint 通过 |

> Phase 2a 和 2b 都只依赖 shared，可并行。shared 完成即可同时开工。

每 Phase 独立 commit，出错可随时回退。

## 依赖版本锁定

### 根 workspace

| 依赖 | 版本 |
|------|------|
| turbo | 2.4.0 |
| typescript | 6.0.3 |
| eslint | 10.3.0 |
| @antfu/eslint-config | 8.2.0 |
| @commitlint/cli | 20.5.3 |
| @commitlint/config-conventional | 20.5.3 |
| simple-git-hooks | 2.13.1 |
| lint-staged | 17.0.2 |
| rimraf | 6.1.3 |

### packages peerDependencies

| 依赖 | 版本 |
|------|------|
| vue | 3.5.34 |
| vue-router | 5.0.6 |
| pinia | 3.0.4 |
| naive-ui | 2.44.1 |
| @vueuse/core | 14.3.0 |
| vue-i18n | 11.4.2 |
| axios | 1.16.0 |

## 验证方式

1. `pnpm install` 根目录成功，无 peer dependency 警告
2. `pnpm dev` 启动 apps/admin，页面完整可交互
3. `pnpm build` 全量构建通过（需要 `NODE_OPTIONS=--max-old-space-size=8192`）
4. `pnpm lint` / `pnpm types:check` 全量通过
5. 登录 → 系统管理 → AI 聊天 → Demo 全流程可用
