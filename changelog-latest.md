## [1.3.0] - 2025-08-22

## Breaking Changes
- [Front] `utils/hooks` folder restructure
- [Front] `auto-import` content modified
- [Front] `axios` refactoring

### Features
- [Both] `signature guard`, includes many features
- [Front] `idb` implement
- [Front] `ras-oaep` implement
- [Front] `SingletonPromise`
- [Front] `useExpireTimer`
- [Front] `Suspense` on global `router-view`
- [Front] add `superjson`
- [Front] `storage` demo page

### Changed
- [Front] app level script re-design
- [Front] `pinia` store re-integrate
- [Front] `axios` re-design
- [Front] `useAppStorageSync` and `useAppStorageAsync`
- [Front] `localStorage` use `aes-gcm` for encrypt
- [Front] each page refresh would call device `initial` API to update device info
- [Front] `useCountdown` => `useCountdownStorage`
- [Front] remove `VITE_CRYPTO_PERSIST`, add `VITE_CRYPTO_URL`
- [Front] `cookie` re-design

### Fixed
- [Front] `useCountdownStorage` should not keep the left seconds when page is closed
- [Back] `setCustomHeaders` fatal error

### Deprecated
-

### Removed
- [Front] `useAppStorage`
- [Front] `ua-parser-js`
