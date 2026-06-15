# Monorepo 改造方案

## 概述

将 walnut-admin-client 从单包结构改造为 **Turborepo + pnpm workspaces** 的 monorepo，按 `apps/` + `packages/` 结构拆分。

- **工具**: Turborepo + pnpm workspaces
- **范围**: 仅前端，不纳入后端
- **包管理器**: pnpm >=9.0.0
- **原则**: 依赖锁定精确版本，清空缓存后全新安装

## 目录结构

```
walnut-monorepo/
├── apps/
│   ├── admin/           # @walnut/admin — 管理后台主应用
│   └── mfa-demo/        # @walnut/mfa-demo — 预留
├── packages/
│   ├── shared/          # @walnut/shared — 基础共享（零依赖）
│   ├── axios/           # @walnut/axios — HTTP 客户端
│   ├── core/            # @walnut/core — 核心运行时
│   ├── ui/              # @walnut/ui — W* 组件库
│   └── ai/              # @walnut/ai — AI 聊天子系统
├── build/               # 共享构建工具（未来从 apps/admin 提升）
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

packages/ai ────── 依赖 ui + core + axios
packages/core ──── 依赖 shared + axios
packages/ui ────── 依赖 shared + core
packages/axios ─── 依赖 shared
packages/shared ── 零依赖（最底层）
```

依赖方向严格单向向下，`@walnut/shared` 是唯一零依赖的基础包。

## 各包拆分明细

### @walnut/shared（基础共享）

| 来源 | 内容 |
|------|------|
| `src/const/` | 全部常量（app, menu, tab, persistent, symbol, transition） |
| `types/custom.d.ts` 等 | 通用类型定义（ViteEnv, DeepKeyOf, UnionToIntersection...） |
| `src/utils/crypto/` | 加解密工具（AES-GCM, RSA-OAEP, HKDF, HMAC, 签名派生） |
| `src/utils/persistent/` | 存储抽象层（localStorage, IndexedDB, Cookie, 迁移） |
| `src/utils/regex.ts` | 正则模式（手机号/邮箱） |
| `src/utils/queue.ts` | 队列数据结构 |
| `src/utils/shared.ts` | 通用工具函数（slot text, device 检测, 对象路径...） |
| `src/utils/file/` | 文件工具（base64, download） |
| `src/utils/window/` | 窗口工具（base64, open） |

### @walnut/axios（HTTP 客户端）

| 来源 | 内容 |
|------|------|
| `src/utils/axios/core/` | AppAxios 核心（config, instance） |
| `src/utils/axios/adapters/` | 适配器（cache, cancel, retry, throttle, merge, id） |
| `src/utils/axios/interceptors/request/` | 请求拦截（token, 签名, 加密, 指纹, 语言） |
| `src/utils/axios/interceptors/response/` | 响应拦截（解密, refreshToken, RSA解密, CapJS token） |
| `src/utils/axios/types.d.ts` | Axios 类型扩展 |

### @walnut/core（核心运行时）

| 来源 | 内容 |
|------|------|
| `src/hooks/` | 全部 composables |
| `src/store/` | 全部 Pinia store（25 个模块） |
| `src/router/` | 路由核心（guard, utils, builtin + mainout 路由） |
| `src/core/index.ts` | AppCoreFn1 |
| `src/socket/` | Socket.IO 客户端 |
| `src/const/symbol.ts` | Injection symbol keys |

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
| `src/components/Global/AI/` | 全部（components, store, composables, config, prompts, utils, types） |

### apps/admin（主应用，保留部分）

| 保留内容 | 说明 |
|----------|------|
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

| Phase | 内容 | 验证点 |
|-------|------|--------|
| 1. 搭骨架 | 创建 monorepo 根，移入 apps/admin，packages 空壳 | `pnpm dev` 正常启动 |
| 2. 抽 shared | 移动常量/类型/工具/crypto/persistent | types:check + lint 通过 |
| 3. 抽 axios | 移动 HTTP 客户端 | 登录 + API 请求正常 |
| 4. 抽 core | 移动 hooks/stores/路由核心 | 路由 + store + 页面正常 |
| 5. 抽 ui | 移动 W* 组件 | 表单/表格/CRUD 渲染正常 |
| 6. 抽 ai | 移动 AI 聊天子系统 | AI 面板/流式响应正常 |
| 7. 收尾 | 清理残留，统一 import 路径 | 完整构建 + lint 通过 |

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
