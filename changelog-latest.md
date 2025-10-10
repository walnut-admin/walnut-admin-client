## [1.8.0] - 2025-10-10

### Features
- [Both] `perference` settings
- [Both] `new app setting support`: `maskUrl` / `hijackRefresh` / `watermark` / `transition`
- [Back] `lock feature` 100% implement with api support
- [Back] new `TransactionInterceptor`, use `node:async_hooks` & `afterCommit` to achieve logic after transaction commit
- [Front] `useKeepAliveEffect` for `mounted` & `actived` component
- [Front] scope settings implement
- [Front] theme settings implement

### Changed
- [Back] remove `locked` field in `device` collection
- [Back] enhance on create dynamic virtual class
- [Back] `getWalnutAdminCookie` implements
- [Front] form translate core function

### Fixed
- [Back] app level guard excute order
- [Back] lang public missing lock free
- [Back] `deleted` dto error
- [Back] `app key` rotate cron job
- [Front] locale change error
- [Front] auth page style error
- [Front] avatar upload logic error
- [Front] cropper style error

### Deprecated
-

### Removed
- [Front] `backToTopMode`
