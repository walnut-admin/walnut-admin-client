## [v1.12.0] - 2025-12-26

## Frontend

### ⚡ Performance

- Storage optimize ([23a9153](https://github.com/walnut-admin/walnut-admin-client/commit/23a9153f50fde0eed41479a7a9e4218cdc009264))

### ✨ Features

- Session key implement with endpoint sign flow ([52b6337](https://github.com/walnut-admin/walnut-admin-client/commit/52b63377e86096f7f29b9fa2e985a73aece1cc09))

- Opaque auth instead of normal password ([e0919d9](https://github.com/walnut-admin/walnut-admin-client/commit/e0919d97d13c0d67914884bfaad8249da1a36cc5))

- Missing permission page ([1d87fad](https://github.com/walnut-admin/walnut-admin-client/commit/1d87fad0e67b8dd7184b7356e44f9d4473e69ca5))

- Opaque change password ([b727665](https://github.com/walnut-admin/walnut-admin-client/commit/b7276655bde0e351217aae334ea287e8e6dc6baf))

### 🐛 Bug Fixes

- Google auth error should stop loading ([eaf3c95](https://github.com/walnut-admin/walnut-admin-client/commit/eaf3c954918465c5ea992d7cd88898e381eb9623))

- Typo ([1527337](https://github.com/walnut-admin/walnut-admin-client/commit/1527337bbedc0c7c830337b7cee3e40750a6310a))

- Interval server error ([045a4aa](https://github.com/walnut-admin/walnut-admin-client/commit/045a4aadcd96c80250fab2d988132d42fcb98080))

- Remove google fed cm loading ([f80f3f2](https://github.com/walnut-admin/walnut-admin-client/commit/f80f3f26afa91ef736ea297c4fe8ec006f136ffb))

- Otp loading error ([e6ecb40](https://github.com/walnut-admin/walnut-admin-client/commit/e6ecb40492a070864e590314665fbf455d0c6fc5))

- Password type error ([3fc467f](https://github.com/walnut-admin/walnut-admin-client/commit/3fc467faba6b3e90293b0ca5eed2491c4103effa))

- Form rule merge missing ([0986d2f](https://github.com/walnut-admin/walnut-admin-client/commit/0986d2fdcd3bcc135a9cb101966536de6de22101))

- Input padding override caused otp error ([056a0f9](https://github.com/walnut-admin/walnut-admin-client/commit/056a0f9cc4a9858c3b24d9b07f053b06018ee0a0))

- Search intro error ([b91c0d4](https://github.com/walnut-admin/walnut-admin-client/commit/b91c0d440f990b5f1d57dd99de7e186b33c47019))

- Account setting tab ([099d5e9](https://github.com/walnut-admin/walnut-admin-client/commit/099d5e96c7a2a7d21245cef401d1e7810143ab96))

### 🔧 Refactor

- Remove account & opaque/google one-tap auth ([5567520](https://github.com/walnut-admin/walnut-admin-client/commit/55675202ba9a287f157193c51a6f48cd9f386b05))

- Hover glare duration ([ef2526b](https://github.com/walnut-admin/walnut-admin-client/commit/ef2526b4e865fc05ec24d861614ef87fb3c90f84))

- Visitor password ([3a4b421](https://github.com/walnut-admin/walnut-admin-client/commit/3a4b421f50abe60e013b1bb9d00f96a2adc844ff))

### 🔩 Chores

- Todo ([a656795](https://github.com/walnut-admin/walnut-admin-client/commit/a65679532611f2c59fce42a31c0e6532448900ff))

- Update naive-ui ([807e1d0](https://github.com/walnut-admin/walnut-admin-client/commit/807e1d0ba7f76a5a754e4a10e810cbc9ca2b79b8))

## Backend

### ✨ Features

- Cache service add expire and delByPattern ([25873e3](https://github.com/walnut-admin/walnut-admin-server/commit/25873e3bf6148ef85e1a1004653c39095086adb9))

- Jwt optional guard ([45c1b71](https://github.com/walnut-admin/walnut-admin-server/commit/45c1b7138e33c1f596c34bfe601122c459d57a70))

- Session key implement & sign guard rework ([d2383cf](https://github.com/walnut-admin/walnut-admin-server/commit/d2383cf0128b03cb94473099c86530f77d1a9951))

- Opaque auth ([7bbfbde](https://github.com/walnut-admin/walnut-admin-server/commit/7bbfbde52fa1ab116036af24ea49c3d4372d513e))

### 🐛 Bug Fixes

- Error code white list ([3babbf0](https://github.com/walnut-admin/walnut-admin-server/commit/3babbf01e1c05c0d281b325f8ea1707dffcc59b1))

- Locale public sign free ([b1945e8](https://github.com/walnut-admin/walnut-admin-server/commit/b1945e8b0649695f59f70d6773e457fc3918d582))

- Jwt free others also free ([e58bde7](https://github.com/walnut-admin/walnut-admin-server/commit/e58bde71cc1986d17207cf6f6aca9c0f27faaa5d))

- Refresh should sign free ([f3d42a1](https://github.com/walnut-admin/walnut-admin-server/commit/f3d42a14eb2c0f4ae5ba748f3a7789b3fb132a7c))

- Fatal type error ([1bd6d7e](https://github.com/walnut-admin/walnut-admin-server/commit/1bd6d7efcb121d1cbc5809c8ff12ef7c97441878))

- Fatal error on socket connect ([8f9a045](https://github.com/walnut-admin/walnut-admin-server/commit/8f9a0458c7abda46fae8cf0748a2d7c9aec2c8a1))

- Mongo duplicate error catch ([0abb557](https://github.com/walnut-admin/walnut-admin-server/commit/0abb5570ab1eb0bfb747adcce975e6925feb2704))

- Sign ticket cookie auto renewal ([10f10b4](https://github.com/walnut-admin/walnut-admin-server/commit/10f10b455f8359846d540185559b9e1cf3a54fdd))

- RegistrationRecord not required ([c070657](https://github.com/walnut-admin/walnut-admin-server/commit/c0706576b7d467f95dada8136a9643d4e731f1f9))

- Sign guard ticket cookie renewal ([b4499c6](https://github.com/walnut-admin/walnut-admin-server/commit/b4499c678ae4d9d8239a4a1793993af201fef637))

- Sign guard ticket race ([ad0110b](https://github.com/walnut-admin/walnut-admin-server/commit/ad0110b6c0367ae701f100205c9844dcc938409e))

### 🔧 Refactor

- Cache key const extract ([f2e275d](https://github.com/walnut-admin/walnut-admin-server/commit/f2e275db8c23a5a59c347152bffaa3cb757ff078))

- Auth remove passReqToCallback ([42b4160](https://github.com/walnut-admin/walnut-admin-server/commit/42b4160bfa6d66e2bc7be7c0afe8c9ddd1229192))

- Sign guard execute after jwt ([fd65efe](https://github.com/walnut-admin/walnut-admin-server/commit/fd65efec929553ead65e1f21b1fd21eb45d82100))

- Remove node-forge ([5d6cdb3](https://github.com/walnut-admin/walnut-admin-server/commit/5d6cdb35ed1da2e3d9942ef97ecc011a3cc42e24))

- Auth module deps ([4fac5c9](https://github.com/walnut-admin/walnut-admin-server/commit/4fac5c95139124ed17f11789ef05edc380f41672))

- Ensure req.user in auth controller ([5a938e0](https://github.com/walnut-admin/walnut-admin-server/commit/5a938e0e2d4d3914e63f5bb5287162a42faf5f03))

- Permission dto ([848d946](https://github.com/walnut-admin/walnut-admin-server/commit/848d946fc25ce4333f6d66f5a70dcfd48566212e))

- Device generate rule change ([2bb4de1](https://github.com/walnut-admin/walnut-admin-server/commit/2bb4de106ef1bfcfac01dd841d5d0a9cc3169c93))

- Auth public settings ([896b59e](https://github.com/walnut-admin/walnut-admin-server/commit/896b59e0aa02ca85a4e2054e661763c449a22491))

- Optimize cap guard ([6d8a97e](https://github.com/walnut-admin/walnut-admin-server/commit/6d8a97ef5ca92f87ca2fd16e09abd32404e661f2))

- Sign ticket logic should be in sign guard ([e1c61d9](https://github.com/walnut-admin/walnut-admin-server/commit/e1c61d953483272e6cb8fa88da9612e8d593bb1b))

- Opaque change password permission ([866ff1f](https://github.com/walnut-admin/walnut-admin-server/commit/866ff1f2e2f81f4379a28993cfed87892f57bc80))

### 🔩 Chores

- Update google jwk ([371720e](https://github.com/walnut-admin/walnut-admin-server/commit/371720e24f93954aa4538b28d1da681c879b1173))

- Env update ([99a4683](https://github.com/walnut-admin/walnut-admin-server/commit/99a468394950eb0bdbd90bfca76ec4f331bd52b7))

### 🚧 WIP

- Auth session implement ([c2d0c70](https://github.com/walnut-admin/walnut-admin-server/commit/c2d0c70ca53dcef71cbc1b72e3ca12324aa0c4d8))

- Opaque change password/register ([e8d33a7](https://github.com/walnut-admin/walnut-admin-server/commit/e8d33a7234305e765c89409dfcd91f2273cfd9cd))
