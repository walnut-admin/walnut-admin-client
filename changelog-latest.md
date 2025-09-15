## [1.5.0] - 2025-09-15

### Features
- [Front] upgrade to vite7
- [Front] `google-analytics` optimise & `sentry` implement
- [Front] `new content prompt` supported by `pwa`
- [Front] `disable-devtool` support
-
### Changed
- [Front] no more default `legacy` plugin
- [Front] `env` clean up
- [Front] update deps
- [Front] `global components` re-design
- [Front] `pinia store` re-design
- [Front] `types` optimise, no more simple list in `types` folder but in seperate module
- [Front] `i18n` re-design, integrate code & logic
- [Front] `url masking` white list query support
- [Front] `table/crud` support `onSetDefaultQueryFormData`

### Fixed
- [Front] `checker-plugin` caused HMR not work [here]https://github.com/walnut-admin/walnut-admin-client/commit/9a46084be3590d57c4c56b7cbb94de55faddf226
- [Front] `tabs` fullscreen & affix error
- [Both] `locale` query error
- [Back] `sign ticket` error
- [Back] `monitor user` list error
- [Back] missing session caused update error
- [Back] stupid twice aggragate for basic list

### Deprecated
-

### Removed
- [Front] remove `cz-custom`
- [Front] remove several vueuse hooks
