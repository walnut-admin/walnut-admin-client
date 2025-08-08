## [1.2.1] - 2025-08-08

### Features
- [Back] custom throttle decorator which can be configed from cache
- [Back] scope resolver & roleMode usage with it
- [Front] `unplugin-info` replace `__APP_INFO__`

### Changed
- [Back] postman in dev no need for capjs token guard
- [Back] functional guard logic extend
- [Back] auth setting redesign
- [Back] WIP: frontend feature config in endpoint
- [Front] hook folder restructure
- [Front] use useScriptTag to load `web-vitals` & `google analytics`
- [Front] upgrade `vue-tsc` & `vite-plugin-checker`
- [Front] WIP: pwa reload/offline support
- [Front] WIP: `setupStorageMigrations`

### Fixed
- [Back] cache list error
- [Front] fix ellipsis tooltip in data-table style problem

### Deprecated
-

### Removed
- [Both] remove fking useless weibo oauth
- [Front] remove `useCleanLocalStroage`
