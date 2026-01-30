## [v1.14.0] - 2026-01-30

## Major Update
- risk module implement
- cap guard workflow enhance
- device enhance
- fingerprint logic enhance
- playwrite test implement

## Frontend

### ✨ Features

- Totally remove needCap api logic and support axios interceptor ([392fbc6](https://github.com/walnut-admin/walnut-admin-client/commit/392fbc65888e1bf2c21ee349a719bf9ed9ca6adf))

- Device private detect ([255bbcc](https://github.com/walnut-admin/walnut-admin-client/commit/255bbccbf1ad2804e57924b47796c4c570ae6c37))

### 🐛 Bug Fixes

- Json editor prop not working ([6ce38f8](https://github.com/walnut-admin/walnut-admin-client/commit/6ce38f82a64ec5e6a0c668668feb3f84a8196855))

- Closable not working ([70404cc](https://github.com/walnut-admin/walnut-admin-client/commit/70404ccf4f338b3f4ef5df2aec4c400f4c0bb68f))

- Init error ([082f9e6](https://github.com/walnut-admin/walnut-admin-client/commit/082f9e66fa65c498ac10ea1fff2f7cb514ac132c))

- Fingerprint diff in chrome & edge & its private window ([80a7ad2](https://github.com/walnut-admin/walnut-admin-client/commit/80a7ad20e4650823e7d3315105ffd55e0fc94b7f))

### 🔧 Refactor

- Device initial logic change ([fcd8f72](https://github.com/walnut-admin/walnut-admin-client/commit/fcd8f72c3aa17b924a03605a0c70b40e1309637c))

- Remove closable control ([40d19ce](https://github.com/walnut-admin/walnut-admin-client/commit/40d19ce9f888442b6987ec948cb8d50cd25daf69))

- Device id ([3328c72](https://github.com/walnut-admin/walnut-admin-client/commit/3328c72f99032e2b50b78bcfbbfd681029f22048))

- Fingerprint components ([792700d](https://github.com/walnut-admin/walnut-admin-client/commit/792700d94994cb338d829b8bf7fd0504b976b226))

- Device private detect ([bf2434d](https://github.com/walnut-admin/walnut-admin-client/commit/bf2434db95becc2cf59090493c4e47b1c3c67cea))

### 🔩 Chores

- Update mind-elixir ([cd61e33](https://github.com/walnut-admin/walnut-admin-client/commit/cd61e33fa9decfec677fb06e34abdb84cf9f79e9))

## Backend

### ✅ Tests

- Playwright implement ([79dba36](https://github.com/walnut-admin/walnut-admin-server/commit/79dba3632ab310a8085562a06c8ba11a5886f07c))

### ✨ Features

- Add normalized ip support ([5fcae63](https://github.com/walnut-admin/walnut-admin-server/commit/5fcae633bf0b094c93073df0cbe060261a2d55c4))

- Ip utils ([ce81054](https://github.com/walnut-admin/walnut-admin-server/commit/ce810540481201a7c2fc482412a1c9d166d7ec5d))

- Redis module ([0c0ce07](https://github.com/walnut-admin/walnut-admin-server/commit/0c0ce07e9defbd08b878a83a7a1ee0c2483a6112))

- Risk guard ([247c7f7](https://github.com/walnut-admin/walnut-admin-server/commit/247c7f71843df027bfd5c94aa5fbf04e745f8e76))

- Risk module ([f5122ca](https://github.com/walnut-admin/walnut-admin-server/commit/f5122ca29abb574e62017348c4fd9772e2f7a45d))

- Add delByPattern ([4e91038](https://github.com/walnut-admin/walnut-admin-server/commit/4e910386542d883a4a6a8a1b985d0dbf2b36db5e))

- Device ip change update ([6842276](https://github.com/walnut-admin/walnut-admin-server/commit/68422765aa90be4e06cb4aa808f8c3fe4491c154))

- Device private field ([7e44c25](https://github.com/walnut-admin/walnut-admin-server/commit/7e44c250404b8dcfa2175f29b11d46f8a9bbbad8))

### 🐛 Bug Fixes

- Visitor should not have mfa guard ([7e00534](https://github.com/walnut-admin/walnut-admin-server/commit/7e00534887ddba01bf728b583b7f5d10b04dd355))

- Sign guard error when at expired ([436b122](https://github.com/walnut-admin/walnut-admin-server/commit/436b122ce0d949a888183accb529003f3291e2a3))

- Throttler guard error ([519cc96](https://github.com/walnut-admin/walnut-admin-server/commit/519cc9657a5f0bcee41cdc0d3f4c577393311696))

- Auth error logic cannot excute in interptor, so extend AuthGuard to handle error logic ([a1e1658](https://github.com/walnut-admin/walnut-admin-server/commit/a1e1658a88d297690b6fda66388b4ec7ba5b09e3))

- App error userId error ([cffb637](https://github.com/walnut-admin/walnut-admin-server/commit/cffb6378792a5cfdaa96724f6d470669802c6a11))

- Monitor user transaction error ([451237a](https://github.com/walnut-admin/walnut-admin-server/commit/451237af5ee0e874689da63c918bb31cc965db79))

- Missing condition in cap guard ([b90a81c](https://github.com/walnut-admin/walnut-admin-server/commit/b90a81c7aee8ea9b53d0ca462608e0af026c095a))

- Sync device & monitor cron job ([40e4822](https://github.com/walnut-admin/walnut-admin-server/commit/40e48223be8e622baa586e41ba0a86eb36ab14d4))

- Locale message should throw error in param ([d820684](https://github.com/walnut-admin/walnut-admin-server/commit/d82068449c7480ca70aee1789f7a434bf8fdf5cb))

- Ua middleware error ([68145b9](https://github.com/walnut-admin/walnut-admin-server/commit/68145b99e1b15e1155a6ea9261ab3b6b9a5af6aa))

- Get is local ip is promise ([4312ca1](https://github.com/walnut-admin/walnut-admin-server/commit/4312ca1ffdc988951c42279a9a14cee38d793cf4))

### 🔧 Refactor

- Cap error code ([0c15251](https://github.com/walnut-admin/walnut-admin-server/commit/0c15251a02ac860b768d4a3cc3c63c69a4709c3a))

- Device initial logic change ([8f15b36](https://github.com/walnut-admin/walnut-admin-server/commit/8f15b3616775c6c3703b4f71c8beac0a29b5d573))

- Ip service ([9a73ac8](https://github.com/walnut-admin/walnut-admin-server/commit/9a73ac82898bd544a1a11008febd055884fc37c6))

- Remove temp useless code ([40df1b3](https://github.com/walnut-admin/walnut-admin-server/commit/40df1b3b35911d1f0b80819d705e7ab98bf5407d))

- Remove risk middleware ([8226f69](https://github.com/walnut-admin/walnut-admin-server/commit/8226f69db79d2c7aa8a728728ef71ef5aad6dc53))

- Risk & cap guard enhancement ([5356289](https://github.com/walnut-admin/walnut-admin-server/commit/53562896542753f444511a8ddf38eb319c35f4f7))

- Optimize risk ([e629a43](https://github.com/walnut-admin/walnut-admin-server/commit/e629a43a61d2fba17af807839ecae8e513511d4a))

- Optimize risk module ([a022dff](https://github.com/walnut-admin/walnut-admin-server/commit/a022dff7ecbbfc9853810eccc9bd98b6c9e9a4af))

- Risk service ([1ba203c](https://github.com/walnut-admin/walnut-admin-server/commit/1ba203c15252ea93f7e83fae6b266bf41844f597))

- Risk rate service ([40bc401](https://github.com/walnut-admin/walnut-admin-server/commit/40bc4011c79a38a7fdbf9a81c971c3f32e0aab7d))

- Date.now() => AppDayjs().valueOf() ([c70a789](https://github.com/walnut-admin/walnut-admin-server/commit/c70a78902aa520f8f8fb316557652a417681dd60))

- Monitor user visitor id index & unique ([4b00ffc](https://github.com/walnut-admin/walnut-admin-server/commit/4b00ffc4f714bb1ce00c854d1735e0a7e743083a))

- Cache device params ([1ff51e1](https://github.com/walnut-admin/walnut-admin-server/commit/1ff51e1142d3c1976e9bae19e0a9e64fb08bcaa0))

- Remove cap need endpoint ([cf7c143](https://github.com/walnut-admin/walnut-admin-server/commit/cf7c143a2fa46d933a900a4499ba1d0bda691d3c))

- Device repo ([e268d8a](https://github.com/walnut-admin/walnut-admin-server/commit/e268d8a516d4c7d2080e66a071cca693b016a1ac))

- Risk murlock cache key ([4c5939d](https://github.com/walnut-admin/walnut-admin-server/commit/4c5939d0d836538962597036c50a3581a4fcdf1f))

- User device repo ([c2f97f4](https://github.com/walnut-admin/walnut-admin-server/commit/c2f97f47c77f7f300474985424c66ba82348a5a5))

- User repo ([b1e4841](https://github.com/walnut-admin/walnut-admin-server/commit/b1e484197a12ecddb9606f595810665d25af724e))

- Temp/permanent ip intergrate ([661de84](https://github.com/walnut-admin/walnut-admin-server/commit/661de84286b18550d854e65c698e2bbbf2c6ba0d))

- Cache log ([d3e4034](https://github.com/walnut-admin/walnut-admin-server/commit/d3e40347babe676630f8bd609b804c7447a9c7ba))

- Remove ip cookie ([edf117d](https://github.com/walnut-admin/walnut-admin-server/commit/edf117d102f5ca21e0b64a999f3e826f96a24a50))

- Error log ip ([413a06a](https://github.com/walnut-admin/walnut-admin-server/commit/413a06ae5e2da7da50dc62a27b6a168100dd593f))

### 🔩 Chores

- Missing release scripts ([7c51751](https://github.com/walnut-admin/walnut-admin-server/commit/7c51751d73e3e9ae8759456458e6e8f15db3a315))
