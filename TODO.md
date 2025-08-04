## TODOS

- 重要紧急

  - [ ] dev setting / features / user settings 急需分离，现在都耦合在appsettings里了
  - [ ] menu字段：usedDicts/usedLocales/watermark/watermarkconfig/queryEnhanced/queryEnhancedMode/paramsEnhanced/paramsEnhancedMode/full/query，menu表把乱七八糟的字段都塞进meta里，不要平铺字段
  - [x] 弹出类的form做表单内容改变关闭提示
  - [x] form支持嵌套字段
  - [x] 移除所有eslint/ts error
  - [x] 已经缓存了的页面不要loadingbar
  - [x] lock security 有问题
  - [ ] 示例模块，设备模块，删除模块，认证模块
  - [ ] 强退在线用户(修改密码/重置密码都会提出当前在线的用户)
  - [x] ~~~vue3-mindmap，能帮忙捋捋思路~~~
  - [ ] 菜单内嵌query，以及手动跳转的query的留存
  - [x] 用户表加一个字段，角色是分开模式还是合并模式，都可以自定义，同时如果是分开模式，右上角配合选择切换权限
  - [x] 路由加密，单独指query，param感觉没有加密的必要?（query和params的加密解密都完成了，但配置需要进一步细化）
  - [ ] 修改密码功能
  - [ ] 个人信息页面
  - [ ] 用户查看，完善抽屉，同时手机号/邮箱作为敏感信息，都需要单独处理
  - [ ] 找回密码
  - [x] api 函数重命名 结尾都以API结束 好区分是请求函数
  - [x] ~~merge request的axios adapter完成了，字典数据接口需要重新梳理一下，可以不用initDict在form/table/desc组件里了~~

- 重要不紧急

  - [x] 999 查看[issue](https://github.com/vuejs/vue-router-next/issues/626)。嵌套路由的keep-alive有问题，为了暂时让keep-alive好使，就把路由扁平化了。但是左侧menu和头部的breadcrumb需要做相应的变动（路由不再是树状结构，但在左侧菜单和面包屑的位置逻辑还是原来树状的逻辑）
  - [x] ~~888 查看[issue](https://github.com/vuejs/core/issues/4294)。项目中组件的props的类型定义都在vue的文件的外部，引入并使用到defineProps上会导致编译错误，暂时为了解决问题，都在组件内部又重新定义了一遍props的类型，后续支持了就可以从外部文件引入类型了。~~
  - [ ] 000 /* @vue-ignore */ ugly
  - [ ] 111 tsx explict import
  - [x] axios config demo
  - [ ] 页面中的错误模拟 demo
  - [ ] pdf/word/excel/print.js plugin
  - [ ] error monitor (sentry?)
  - [x] untyper
  - [ ] cdn/混淆
  - [ ] 拆分面板 splitpanes
  - [ ] markdown (vditor)
  - [ ] fullcalendar
  - [x] tiptap 替代 tinymce? A: 不用tiptap替换了，直接self host了，也可以用
  - [x] vite-plugin-csp-guard/vite-plugin-istanbul

- 不重要不紧急

  - [x] 打包优化+自动化部署
  - [x] 第三方认证
  - [x] case police
  - [x] 菜单 自定义动画/记住滚动位置/页面离开提示(路由和全局)
  - [x] 动态设置tab的名称，图标，badge, 进入之前的路由钩子处理
  - [x] 输入框的定制插槽 - 复制
  - [x] vue-tsc 错误全部消除（至少是真的全部消除过一次了
  - [ ] layout 扩展
  - [ ] 主题扩展
  - [x] 手机号组件，邮箱填充组件，身份证组件
  - [ ] https://github.com/theajack/disable-devtool
  - [ ] https://github.com/rrweb-io/rrweb
  - [ ] https://github.com/hrynko/vue-pdf-embed
  - [x] cap https://github.com/tiagorangel1/cap
  - [x] https://github.com/zumerlab/snapdom https://github.com/sindresorhus/capture-website still use html-to-image
  - [x] https://github.com/yjl9903/unplugin-info
  - [x] https://github.com/SSShooter/mind-elixir-core instead of vue3-mindmap
  - [x] https://github.com/vite-pwa/vite-plugin-pwa
  - [ ] https://github.com/antfu/case-police
  - [x] https://github.com/sindresorhus/capture-website
  - [x] closure-compiler (尝试搞过，难搞)

- 不重要紧急

  - [x] 后台自定义code
  - [x] 后台入参校验
  - [x] 登录日志/操作日志
  - [x] 权限模块开发
  - [x] hover css
  - [x] tab样式重做
  - [x] 劫持F5事件
  - [ ] 搜索组件
  - [ ] 99 tsx + setup + auto-import 打包后会出问题，暂时需要显式引入 [issue](https://github.com/antfu/unplugin-auto-import/issues/75)

- 不知道如何解决的问题

1. - Q: tab右键快照在特定页面特定滚动模式下会报错，报错还一点详细都没有，不知道什么导致的错误 [issue](https://github.com/bubkoo/html-to-image/issues/314)
   - A: 发现了，是css的 w: 属性导致的错误 就是 unocss的attribute 用法 去掉吧 确实很hack的写法 还会导致报错
2. - Q: cap token也做到axios的响应拦截器了，逻辑类似refresh token，但在access token 和 cap token都失效时，调用多个接口会导致多次触发刷新逻辑
   - A:
