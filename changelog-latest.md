## [v1.15.0] - 2026-02-01

## Frontend

### 🐛 Bug Fixes

- Mainout preference read sign error ([601da25](https://github.com/walnut-admin/walnut-admin-client/commit/601da25716fa4d2f2ee5365ae4f91bb8c7ada613))

- Cap modal z-index ([7a6f2cd](https://github.com/walnut-admin/walnut-admin-client/commit/7a6f2cdc9c303acb114a8a16a7f099d03f78b3db))

- Star github noti error ([f35cb84](https://github.com/walnut-admin/walnut-admin-client/commit/f35cb84b0846c14698aa60ffcccf4c1db4654069))

- GetSocket init null ([7a58a90](https://github.com/walnut-admin/walnut-admin-client/commit/7a58a90d92abec2b57b79689eba7ca6087acd9a0))

- Lock init error ([6e34aab](https://github.com/walnut-admin/walnut-admin-client/commit/6e34aab78f0a778a3b566830404d9b18f6fb6a22))

- Lock init shoud await ([6f04a24](https://github.com/walnut-admin/walnut-admin-client/commit/6f04a24b57b11039d0549e4a60041b980410980d))

### 🔧 Refactor

- Singleton promise add config ([35caac4](https://github.com/walnut-admin/walnut-admin-client/commit/35caac4267fcf3690e2e900c07334d788c168787))

- Missing await ([4277fb9](https://github.com/walnut-admin/walnut-admin-client/commit/4277fb9b3da542e2f407911595dfe25198051dbd))

### 🔩 Chores

- Remove release ([15013ec](https://github.com/walnut-admin/walnut-admin-client/commit/15013ecc9ed1368a1e2c10aa4608b73ba9a6455e))
-
## Backend

### ✨ Features

- Logger enhance & perttier ([d3a187c](https://github.com/walnut-admin/walnut-admin-server/commit/d3a187c5b9fd2b44ee514260c238ed658666007e))

- Temp useless favicon middleware ([958dcf0](https://github.com/walnut-admin/walnut-admin-server/commit/958dcf03df0c32e77c3fb312cfe6b308cbdde0dd))

- Cookie key env optimise ([ae64abf](https://github.com/walnut-admin/walnut-admin-server/commit/ae64abf86e43002c929a8edf53e8f32bcf0f3cd0))

### 🐛 Bug Fixes

- Sign guard ticket error ([1c5bdc0](https://github.com/walnut-admin/walnut-admin-server/commit/1c5bdc0196d6a7ed057be0901402ba358ffdf0bd))

- Device id cookie should httpOnly true ([adf9b76](https://github.com/walnut-admin/walnut-admin-server/commit/adf9b76afc8ec878aad80d50bea3c0c727c9e9b2))

- Missing lock free in mfa controller & preference ([d7a50eb](https://github.com/walnut-admin/walnut-admin-server/commit/d7a50eb28c060f49f5000ebb2975ce913d415565))

- Device guard missing active judge ([5cf26c3](https://github.com/walnut-admin/walnut-admin-server/commit/5cf26c3c4c19ca62cc061c5c9c0d7e643b30442d))

- Throttler missing getClass context ([ea29ae0](https://github.com/walnut-admin/walnut-admin-server/commit/ea29ae078947e78555623a4e1c5b5efc004ab83a))

- Critial should not check in cap guard ([98906a3](https://github.com/walnut-admin/walnut-admin-server/commit/98906a338f98923919ea8b54fbb2cc9c3fccf631))

### 🔧 Refactor

- Remove db transaction event ([bd06d80](https://github.com/walnut-admin/walnut-admin-server/commit/bd06d8019e498a663d12c3bd8d586929fed7d23c))

- Db transaction als ([166115e](https://github.com/walnut-admin/walnut-admin-server/commit/166115e79724d287bea65c3b8ede6397fe2442d8))

- Allow header ([2ff6474](https://github.com/walnut-admin/walnut-admin-server/commit/2ff64741e3985b3d5905ab4937452e2a45664fd9))

- Request id generate rule change ([2bce38d](https://github.com/walnut-admin/walnut-admin-server/commit/2bce38d18cccf1983e867213aa49bb5971408464))

- Extract blacklist path module ([7d7ac19](https://github.com/walnut-admin/walnut-admin-server/commit/7d7ac19677211549b6e016caa884d552c3e1837b))

- Response time do not need suffix ([6929263](https://github.com/walnut-admin/walnut-admin-server/commit/69292632e89f52c9577acf32a969cbb228b56764))

- Session id cookie over-design ([7247820](https://github.com/walnut-admin/walnut-admin-server/commit/72478209a0ca0741edc255a0c0130885839ffc68))

- Opaque/oauth failed login info collect ([31fa502](https://github.com/walnut-admin/walnut-admin-server/commit/31fa502a1094a61cc8e2035303fc782e628d3215))

- Murlock cache key ([3a95941](https://github.com/walnut-admin/walnut-admin-server/commit/3a95941e238478cdcf793c9d7fa1544f1515c932))

- Eslint fix ([d26184d](https://github.com/walnut-admin/walnut-admin-server/commit/d26184d508f21c3946cc59bb1de84cbacacc4d5e))

- Device guard in dev postman ([5e91f7a](https://github.com/walnut-admin/walnut-admin-server/commit/5e91f7aa83fa92deb775ffb4418f08483c3ca67c))

- Ua in dev postman ([2338d1e](https://github.com/walnut-admin/walnut-admin-server/commit/2338d1e40bdff17b733516ed4947f8d15633739d))

- Cap throttler extract into config ([8834b5b](https://github.com/walnut-admin/walnut-admin-server/commit/8834b5b3e48a06b6686043853883376a9d48d3b2))

- Device inital throttler config ([dafe134](https://github.com/walnut-admin/walnut-admin-server/commit/dafe134701e4a319cd6a77ea2122fae32e44def2))

- Lock error custom code ([d4de240](https://github.com/walnut-admin/walnut-admin-server/commit/d4de240a30bcbc8a25a9f7cc19c315f9070a8242))

- Cap ttl ([efee5fc](https://github.com/walnut-admin/walnut-admin-server/commit/efee5fce69271324e1023bafd077b1e06e44b74a))

### 🔩 Chores

- Remove csrf ([74b472c](https://github.com/walnut-admin/walnut-admin-server/commit/74b472c8e648e2d883378be738b8864fe73148b9))

- Mfa free order in eslint ([df6f467](https://github.com/walnut-admin/walnut-admin-server/commit/df6f4670b2b0144fbde076fde1ffccf403eb6c1b))
