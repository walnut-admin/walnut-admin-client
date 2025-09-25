## [1.7.0] - 2025-09-25

### Features
- [Both] `lock/unlock` api support, new: cross device lock/unlock support, lock guard support,

### Changed
- [Back] `socket` re-design, support auth middleware to handle http logic and auth logic
- [Back] `JwtAccessGuard` move to app level guard, if need jwt free endpoint, need to add `@WalnutAdminGuardJwtFree()` decorator
- [Both] `deviceId` 30 days support, geoInfo 7 days support
- [Back] `force-quit` change to room usage

### Fixed
- [Back] `cache` list error
- [Front] `locale` error in auth page

### Deprecated
-

### Removed
-
