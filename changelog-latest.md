## [v1.13.0] - 2026-01-21

## Major Update
- OPAQUE enhancement
- MFA implementation
- Bug fix

## Frontend

### ✨ Features

- Opaque identifiers implement ([fbc2911](https://github.com/walnut-admin/walnut-admin-client/commit/fbc2911494c758f931885b9ed6123e16d9464607))

- Zxcvbn password check ([7f65c15](https://github.com/walnut-admin/walnut-admin-client/commit/7f65c15335315e6fabe5778ff58d9d57b47f49bf))

- Kick out all devices after update password ([eb5a4f5](https://github.com/walnut-admin/walnut-admin-client/commit/eb5a4f558a7450b0a01b9f6bf9b2d29094c85b65))

- Mfa totop ([fe5f1c4](https://github.com/walnut-admin/walnut-admin-client/commit/fe5f1c4a10853e3b994aa7af18ba5fcf2a378087))

### 🐛 Bug Fixes

- Mobile aside menu width missing ([03ec04f](https://github.com/walnut-admin/walnut-admin-client/commit/03ec04f60e142378aff8f74ae1bffdd11afde68d))

- Dark mode change slash ([ce937f7](https://github.com/walnut-admin/walnut-admin-client/commit/ce937f7feef5c62a8e960cf2c2c1f7342b5baa5e))

- Auth mainout also need preferences ([aaf7468](https://github.com/walnut-admin/walnut-admin-client/commit/aaf746831559742fd7468094c7d0c70d45845439))

- Still need global style in naive-ui ([87c32e5](https://github.com/walnut-admin/walnut-admin-client/commit/87c32e5a5ad8f1e9932ed647d838321a5d85b4c6))

- Remove mainout padding ([7ae9eca](https://github.com/walnut-admin/walnut-admin-client/commit/7ae9ecaddfca82940dfa461a159f08e5c5a8a35e))

- Missing preference fetch after signin ([d77d378](https://github.com/walnut-admin/walnut-admin-client/commit/d77d37875e1203ca15d873b8aa958bf699c3fb3c))

### 🔧 Refactor

- About desc style in mobile ([80b139c](https://github.com/walnut-admin/walnut-admin-client/commit/80b139c1f8594126497560d432be746c88222d10))

- About info mobile style ([1e55e4c](https://github.com/walnut-admin/walnut-admin-client/commit/1e55e4cc59f428a7067342e157d05c6b083ee29e))

- Device mobile style ([8d327cb](https://github.com/walnut-admin/walnut-admin-client/commit/8d327cbd9e7f9d8f8b6881c86835a495b992badc))

- Opaque update/clear password for admin ([791c40f](https://github.com/walnut-admin/walnut-admin-client/commit/791c40fe7e54141d6df8c346ffc5b24c01279d26))

- Route layout/mainout diff ([871266a](https://github.com/walnut-admin/walnut-admin-client/commit/871266a8bd16ac75f0d3407297d7f49b225f24bb))

- Mfa theme & i18n ([d2179e5](https://github.com/walnut-admin/walnut-admin-client/commit/d2179e5cb6288c7c7cf58d2b1852aaff4f72cc37))

- Extract lock/preference from profile endpoint ([a2cfc33](https://github.com/walnut-admin/walnut-admin-client/commit/a2cfc339f0aece5110efa0c7b0e1769ff4f1bed8))

- Mainout style ([dd1079e](https://github.com/walnut-admin/walnut-admin-client/commit/dd1079ed3770fd03321293e725877db5277b8862))

### 🔩 Chores

- Todo ([c5d8378](https://github.com/walnut-admin/walnut-admin-client/commit/c5d83781733ee87bb8f469625ee69aa92c2c99e8))

### 🚧 WIP

- Mfa ([1a401ff](https://github.com/walnut-admin/walnut-admin-client/commit/1a401ff82646b51f4338dbcae5fa23bf8854997f))

## Backend

### ✨ Features

- Dev only guard ([c1cdad7](https://github.com/walnut-admin/walnut-admin-server/commit/c1cdad70de225f2d77e579cfe4caf376e098c80c))

- Opaque identifiers implement ([c8d27df](https://github.com/walnut-admin/walnut-admin-server/commit/c8d27dfe5332e243a846ebd9e374d6b62751ef48))

- Update password should kick out all relative devices ([d256682](https://github.com/walnut-admin/walnut-admin-server/commit/d2566826c06ac4558b32bc583ae7291c5774fe5d))

- Opaque admin/user separate & logic integrate ([27b6e1a](https://github.com/walnut-admin/walnut-admin-server/commit/27b6e1a183c1ad4362017b8245c49564c682739b))

- Mfa module ([c57f02b](https://github.com/walnut-admin/walnut-admin-server/commit/c57f02bc3102bb0923215bc5c209558ddf0c16c7))

- AT payload mfa relative ([30af0c1](https://github.com/walnut-admin/walnut-admin-server/commit/30af0c1d626b4d7fdc2b3709adcea558a68a90ed))

- Mfa setup & verified ([d9f7ba7](https://github.com/walnut-admin/walnut-admin-server/commit/d9f7ba744e78d23cc34011fc9f88133637d68352))

- Decorators eslint support ([71eb7f9](https://github.com/walnut-admin/walnut-admin-server/commit/71eb7f9e8a61a534bf0417fde84dbd2388cef900))

- Api ok response add operation ([7be7acb](https://github.com/walnut-admin/walnut-admin-server/commit/7be7acb7773fad1317a8eb0ab13a44f1cc3c653d))

### 🐛 Bug Fixes

- Oauth callback error ([0ec7cd2](https://github.com/walnut-admin/walnut-admin-server/commit/0ec7cd2e7fc3976f51fc93a118d6fe9d6cc89cad))

- Session error ([eca1024](https://github.com/walnut-admin/walnut-admin-server/commit/eca1024b92d41f7faacdda6c6b558e08adb4e0bc))

- Force quit error after password change ([1580cc4](https://github.com/walnut-admin/walnut-admin-server/commit/1580cc44645a11e9da126e3c33042efc0f9af32c))

- GetAppSettings default error ([9a0708d](https://github.com/walnut-admin/walnut-admin-server/commit/9a0708d5b5205fa76a605f9dd8c5c6ebbf586706))

- Device generate error ([7d01957](https://github.com/walnut-admin/walnut-admin-server/commit/7d019570460ada12c620b45ebb085f7fef608d81))

- Totp bind temp id error ([ec95b38](https://github.com/walnut-admin/walnut-admin-server/commit/ec95b38a21e7ef87f0ec568ec6ba5cfd52205805))

- VerifyMfaStatus should update before error ([83aef42](https://github.com/walnut-admin/walnut-admin-server/commit/83aef428e5bd8eee520ab8d92a86bf4b70188819))

- Device initial should use db session ([809a4b5](https://github.com/walnut-admin/walnut-admin-server/commit/809a4b50de0a607a533d2251434444e2a6a84a92))

- Winston log missing level ([baa2065](https://github.com/walnut-admin/walnut-admin-server/commit/baa20656cf875d6ee3f48fc2fd379f2a4b75f0f8))

- Eslint error ([536b416](https://github.com/walnut-admin/walnut-admin-server/commit/536b416785b2d5734fd087dc0eac78d1b368c6c1))

- Swagger dynamic dto name error ([ba8bb4a](https://github.com/walnut-admin/walnut-admin-server/commit/ba8bb4a76e8b1c3f454a0f2b20d699e66f27cbde))

- Ok response not support array ([06385b3](https://github.com/walnut-admin/walnut-admin-server/commit/06385b361cc5cf0e0417506cab07ee3a68642ead))

- Mfa post verify error ([99ae90a](https://github.com/walnut-admin/walnut-admin-server/commit/99ae90a58e4ec29bda050b6229f482178bf8f70d))

- Type error ([be8dfc6](https://github.com/walnut-admin/walnut-admin-server/commit/be8dfc6ae35faf4a735680d28a6c485f119ba81a))

- Errors after update deps ([697c7dc](https://github.com/walnut-admin/walnut-admin-server/commit/697c7dce279aa8e7e7b50d70708c7d0057c32409))

- Preference/lock/private setting should lock free ([5c568dd](https://github.com/walnut-admin/walnut-admin-server/commit/5c568dd3201bd1f851632ab3ccdd1edb564d8593))

- Lock error ([59f5f07](https://github.com/walnut-admin/walnut-admin-server/commit/59f5f07b93679b36e3a14ab595b116a868cae909))

### 📦 Misc

- Mfa global guard ([3983d89](https://github.com/walnut-admin/walnut-admin-server/commit/3983d894dfff9960d3c86670c8dc740a717c3968))

### 🔧 Refactor

- Permission cache key use userId ([1b562fb](https://github.com/walnut-admin/walnut-admin-server/commit/1b562fb08fa6794f76f23e2a0d1b1369f2e573f7))

- Remove pwd relative code ([068cbe0](https://github.com/walnut-admin/walnut-admin-server/commit/068cbe003d80a8eef526ba76046512c4b8bbb391))

- Email shared module ([54ab18d](https://github.com/walnut-admin/walnut-admin-server/commit/54ab18d88551daacc8e23aacb08d7395c45a7eb9))

- Clean up user module ([ea74400](https://github.com/walnut-admin/walnut-admin-server/commit/ea74400b77dc96bda9ea4847d506a368ae1bdc8f))

- Verify code cache service ([528173d](https://github.com/walnut-admin/walnut-admin-server/commit/528173dd268b31e0e00bd30f44083decf3a03912))

- Task rename ([400318f](https://github.com/walnut-admin/walnut-admin-server/commit/400318f9b3330c2a7fd128af24b37b3ab7a4705e))

- Monitor user shared module ([6855ee2](https://github.com/walnut-admin/walnut-admin-server/commit/6855ee2bdbc18d4f334e036d0cf0bb17ed0025ae))

- Refresh shared module ([a0ae933](https://github.com/walnut-admin/walnut-admin-server/commit/a0ae933a211fbc176afa66b71cfabe3e4043d92b))

- Oauth optimise ([719886c](https://github.com/walnut-admin/walnut-admin-server/commit/719886ccb966af8b4c8e4ef77429c01f3116e663))

- Base repo readById session ([a056aff](https://github.com/walnut-admin/walnut-admin-server/commit/a056aff54a40f7114c303f94c5ca85e35b5195a2))

- User read session ([4e363c6](https://github.com/walnut-admin/walnut-admin-server/commit/4e363c6e06b4696d67de0256a058bebba7634ded))

- User shared module ([6d15021](https://github.com/walnut-admin/walnut-admin-server/commit/6d150213edafe087b5d362486cb9eff4fbca99ad))

- Crypto module ([06ec775](https://github.com/walnut-admin/walnut-admin-server/commit/06ec775ba5aeaf9bce137a7bdddc9936ba09c75a))

- Encrypt/hash diff ([c4c4b91](https://github.com/walnut-admin/walnut-admin-server/commit/c4c4b9181e56919f91dca8ed5067306a447fcfc5))

- Mfa totp error exception ([26f6701](https://github.com/walnut-admin/walnut-admin-server/commit/26f67018c4c347c9829a8e7ac4ee2ca24942fd2c))

- Sign ticket cookie expire same as at ([3e6d4f4](https://github.com/walnut-admin/walnut-admin-server/commit/3e6d4f4b3546d80bfdfd9feb282344a0a6dc0fbf))

- Sign ttl same as at ([314bdca](https://github.com/walnut-admin/walnut-admin-server/commit/314bdcaac8da1bb1f81e2784c94ef98bcc99607d))

- Token module => global ([a477f45](https://github.com/walnut-admin/walnut-admin-server/commit/a477f453fc75f1fe74429d7b22523534932882a9))

- Monitor user repo extract ([5815d38](https://github.com/walnut-admin/walnut-admin-server/commit/5815d38cf95d76d04b995e60e52a52e22570eb83))

- Refresh repo extract ([cea1833](https://github.com/walnut-admin/walnut-admin-server/commit/cea1833ef362bd89eaa8f3c925e2a21f7f248fdc))

- Still need deviceId when generate AT payload ([ad7db5c](https://github.com/walnut-admin/walnut-admin-server/commit/ad7db5ce2a9f24d95e61946aa7d4fd72a0d8bb48))

- Monitor user repo extract ([b5225ca](https://github.com/walnut-admin/walnut-admin-server/commit/b5225ca3d6bfa51b046c2ea7e80e0db6450f4101))

- Device guard log ([f2b181c](https://github.com/walnut-admin/walnut-admin-server/commit/f2b181cc083049cb199ee320ec47ed5fab7d601b))

- Cache unify ([b9bd52d](https://github.com/walnut-admin/walnut-admin-server/commit/b9bd52dc2b4abfad0f49bc9411ca96f7b2a609de))

- Device/lock logger ([197f610](https://github.com/walnut-admin/walnut-admin-server/commit/197f6102c4731177627838b865f7865ce40322af))

- Mfa guard logger ([b21f814](https://github.com/walnut-admin/walnut-admin-server/commit/b21f81493ef42697cdd5ad9b28636a7bad6a8419))

- Rename crud decorator ([db79fc2](https://github.com/walnut-admin/walnut-admin-server/commit/db79fc239e34455b6dd886ba0129c1984550a307))

- Sign free decorator ([30e3efc](https://github.com/walnut-admin/walnut-admin-server/commit/30e3efcb207f31cb7c1040f11a4f52acd2e3fcc6))

- Device id from cookie ([9727fd0](https://github.com/walnut-admin/walnut-admin-server/commit/9727fd0e9634939f08a6150150880745bd2d146f))

- Ok response dto swagger cleanup ([c41739a](https://github.com/walnut-admin/walnut-admin-server/commit/c41739a064e8b80c7dd76d315991c133fb8e2c2b))

- Do not use ApiOkResponse ([c434a17](https://github.com/walnut-admin/walnut-admin-server/commit/c434a17d629ee7da3755ab7cde4e19318f6411e5))

- Enhance mfa code ([1c93afc](https://github.com/walnut-admin/walnut-admin-server/commit/1c93afcb56d0fe0b35789da6da68597e8f20823c))

- User mfa model rename ([c812a9f](https://github.com/walnut-admin/walnut-admin-server/commit/c812a9f69978e6441a040a78322ce4dd8cc2c3f7))

- Primitive data in swagger ([d0cc4d0](https://github.com/walnut-admin/walnut-admin-server/commit/d0cc4d0430a3f87e3ac62c5a0fa930216bbeaff8))

- Remove ApiBody ([1c87e65](https://github.com/walnut-admin/walnut-admin-server/commit/1c87e65d67478835d28f44cb49546d29f3331784))

- Jwt optional guard ([9f351f2](https://github.com/walnut-admin/walnut-admin-server/commit/9f351f24b0fd28a3322e33f59fa91471214f72ea))

- Extract lock/preference from profile endpoint ([0b1cbeb](https://github.com/walnut-admin/walnut-admin-server/commit/0b1cbebebc6880fac03fc3f2e1eedb1ee7652571))

### 🔩 Chores

- New env ([71931ab](https://github.com/walnut-admin/walnut-admin-server/commit/71931ab6a2cda7075e432c69f5ee07e34cc3a853))

- Do not change app name ([e0d0597](https://github.com/walnut-admin/walnut-admin-server/commit/e0d0597600b89190c0e358ebca3b27fbb624d989))

- Webauthn config ([d7afbe0](https://github.com/walnut-admin/walnut-admin-server/commit/d7afbe0c42105d2414d6cce7777d07a5374f19db))

- Decorators eslint rules ([09b2a05](https://github.com/walnut-admin/walnut-admin-server/commit/09b2a058768a143ce6f03e4a1de9308f1d610d1f))

- Eslint rule ([254f155](https://github.com/walnut-admin/walnut-admin-server/commit/254f15546b30665a5441b0b748bfa9138c856d13))

- Swagger => scalar ([35071c5](https://github.com/walnut-admin/walnut-admin-server/commit/35071c58bc9a346011fd2d26f6f2684fdcdd17f3))

- WalnutAdminGuardJwtOptional lint ([d687f62](https://github.com/walnut-admin/walnut-admin-server/commit/d687f62af238660d96097d8922b73a59b28f1622))

- Remove useless deps ([80362cb](https://github.com/walnut-admin/walnut-admin-server/commit/80362cb3c65fc0927383bfd4d946c7745bf6b27f))

- Update deps ([584b7b3](https://github.com/walnut-admin/walnut-admin-server/commit/584b7b33d97b5c31edccf41b2f2adea76b36993b))

- Scalar should be in deps but not dev deps ([a9f40f9](https://github.com/walnut-admin/walnut-admin-server/commit/a9f40f917a1f8eb9eef7f7802d40a84b1c0f72a9))

### 🚧 WIP

- Opaque module re-design ([c0fbbc9](https://github.com/walnut-admin/walnut-admin-server/commit/c0fbbc97d7df5a4926782b08fb8cd2ec97ef0894))
