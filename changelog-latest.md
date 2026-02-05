## [v1.16.0] - 2026-02-05

## Major Update
- optimise frontend aes key process & crpyto util functions
- Color Vision Deficiency (CVD) support
- User Center Security 40% done
- Lots of bug fixed, see below
- Lots of refactor, see below

## Frontend

### ⚡ Performance

- Optimise table actions ([c2323d1](https://github.com/walnut-admin/walnut-admin-client/commit/c2323d1e9e0f6f84f3205c3970a182edbd37d5bd))

### ✨ Features

- Crypto helpers ([28d5855](https://github.com/walnut-admin/walnut-admin-client/commit/28d58554ec83d4a5ff81cf554044d89daf19840a))

- App dynamic route module ([f0b02d1](https://github.com/walnut-admin/walnut-admin-client/commit/f0b02d1a94c52b38e12fbfcdc761dca69eda3895))

- CVD support ([55a4971](https://github.com/walnut-admin/walnut-admin-client/commit/55a4971c721bc75914e4bca9cbec7cc016aa65d3))

- User security partial done ([451e276](https://github.com/walnut-admin/walnut-admin-client/commit/451e276d87921db94d633bb74a8418b3e3e5f62e))

### 🐛 Bug Fixes

- Lock guard error ([20a5446](https://github.com/walnut-admin/walnut-admin-client/commit/20a544656178cc729997b930582b56d42823dc46))

- Sign aes key empty ([4294e43](https://github.com/walnut-admin/walnut-admin-client/commit/4294e430b852d444f031327c699551fdbcf43ff2))

- Double tab state missing after refresh ([5d5f43c](https://github.com/walnut-admin/walnut-admin-client/commit/5d5f43c0d2639c71545743226bc66709c12651db))

- Table column actions error ([4b271d5](https://github.com/walnut-admin/walnut-admin-client/commit/4b271d5ffda4abd8495a6bbc36d8196fc1bfdc21))

- Should not update auth with token exists ([4e669fb](https://github.com/walnut-admin/walnut-admin-client/commit/4e669fb250e1cb4a0041abeb226c5aff45921819))

- Mainout preference did not call after route change ([15d1f1d](https://github.com/walnut-admin/walnut-admin-client/commit/15d1f1da743d5cf50272ad3b3ba8ccc7321b4611))

- Lock error ([bea68ad](https://github.com/walnut-admin/walnut-admin-client/commit/bea68ad68456fbc3c257e4721be5878baa486b75))

- App router push error ([7675142](https://github.com/walnut-admin/walnut-admin-client/commit/7675142b3b0d77b62d6e43c670abe3f1d8cf1fe3))

- Mainout preference init error stop ([1b79337](https://github.com/walnut-admin/walnut-admin-client/commit/1b79337fc605dd6cf56203f1d8561f6a78eea3e9))

- Socket manage error ([20a1f13](https://github.com/walnut-admin/walnut-admin-client/commit/20a1f137881c91a557a9331d3a55a6e829d2108d))

- Wrong usage in storage store ([4fd7f9b](https://github.com/walnut-admin/walnut-admin-client/commit/4fd7f9b2926f748b13798bcc92f7b2bad4b9081e))

- Pinia storage problem ([dc8a9d3](https://github.com/walnut-admin/walnut-admin-client/commit/dc8a9d303ec0930a6a71c0a1c2b472d4c450a7e9))

### 📦 Misc

- Better DX ([5f0456d](https://github.com/walnut-admin/walnut-admin-client/commit/5f0456d4d5c2c3a5db9c6e8f7935dd10e560bd2b))

### 🔧 Refactor

- Request header consts ([84d9e1c](https://github.com/walnut-admin/walnut-admin-client/commit/84d9e1c257dbcdbe6c47103b9b70c93b990f153a))

- Optimise crypto ([2edd1f6](https://github.com/walnut-admin/walnut-admin-client/commit/2edd1f6892dac566982b4c9f4f07d6b650a9be32))

- Res/req crypto optimise ([e95ac36](https://github.com/walnut-admin/walnut-admin-client/commit/e95ac36f1aa742dd2b951ab582ea388f2f96305a))

- Lock => mainout route ([ba07b6a](https://github.com/walnut-admin/walnut-admin-client/commit/ba07b6aca3c5cce4d1a5eb849f57508bbfc65aa0))

- Axios error code ([f2caabe](https://github.com/walnut-admin/walnut-admin-client/commit/f2caabe90ae8fbfbc478de3b161d8e0ac04652ce))

- Webauthn error message ([609d8f9](https://github.com/walnut-admin/walnut-admin-client/commit/609d8f93515ad1684fc9f79b863297c477557c34))

- Default props value ([736da09](https://github.com/walnut-admin/walnut-admin-client/commit/736da092fffe855a5124e05f977cb513096c37c2))

- Column setting prop ([a44de07](https://github.com/walnut-admin/walnut-admin-client/commit/a44de070a1ff5af3dd9d7d97a92ab71ec8869836))

- Clean up ([b76fbff](https://github.com/walnut-admin/walnut-admin-client/commit/b76fbffb02401bc48986ffeff0804207446500af))

- Not allowed should not be dynamic route ([214f37b](https://github.com/walnut-admin/walnut-admin-client/commit/214f37b23cd251a39d3c5b056290da91567f1170))

- Remove kick out api ([6f1c2bc](https://github.com/walnut-admin/walnut-admin-client/commit/6f1c2bcaac926e92fbd851c73d6149b839bf9d4a))

### 🔩 Chores

- Remove crypto-js & use crypto instead in sign logic ([a8fac65](https://github.com/walnut-admin/walnut-admin-client/commit/a8fac653536b29a0eb1d12568e0922feb72fab65))

## Backend

### ✨ Features

- CVD support ([2e5dffe](https://github.com/walnut-admin/walnut-admin-server/commit/2e5dffefe0726b3e9652e1019d23c56f76975464))

- User center security partial done ([e9bad16](https://github.com/walnut-admin/walnut-admin-server/commit/e9bad1695cdb00fe81ca0156aafe9412877350a0))

- Signout module ([7731f1f](https://github.com/walnut-admin/walnut-admin-server/commit/7731f1f7fbc29770c8591d2af1e704166c6afbe4))

### 🐛 Bug Fixes

- Object default return ([ea9c81b](https://github.com/walnut-admin/walnut-admin-server/commit/ea9c81b0ab90664437f83c2f4204dd7b9e6aa09c))

- Old cache expire ([d7b9748](https://github.com/walnut-admin/walnut-admin-server/commit/d7b9748e0280ed92ff3f3ade3f86ac3940c1558a))

- Device bind logic error ([7229039](https://github.com/walnut-admin/walnut-admin-server/commit/72290397ee58ad77fa598a1c0cadb6e28890ce5c))

- Missing free in main endpoint ([bd5dfde](https://github.com/walnut-admin/walnut-admin-server/commit/bd5dfde40f4baec05fc42f2e98e9e0e6d8d0b093))

- Lock guard murlock missing ([9a4c3a8](https://github.com/walnut-admin/walnut-admin-server/commit/9a4c3a8a472e20f2f96b4788c8c84c34ece8a5a3))

- Device bind for user error ([3523556](https://github.com/walnut-admin/walnut-admin-server/commit/3523556aa0e502cbac4b2d6f1ea6a529669273f7))

- Missing permissions cache ([0f328db](https://github.com/walnut-admin/walnut-admin-server/commit/0f328dbee3eee2227151dca99de913a558480e9d))

- Socket noti force quit error ([5b53521](https://github.com/walnut-admin/walnut-admin-server/commit/5b535219f1b0995bebe526b469e538ec8e362958))

- Permission cache should work with deviceId ([a0a247d](https://github.com/walnut-admin/walnut-admin-server/commit/a0a247d31da3fd19863fffc5e8484c556f22256a))

### 📦 Misc

- Socket emit ts support ([bfa8e5b](https://github.com/walnut-admin/walnut-admin-server/commit/bfa8e5b323fd05c1b0861e3f2cedf1c3c297000a))

### 🔧 Refactor

- Missing await ([6e9bbb2](https://github.com/walnut-admin/walnut-admin-server/commit/6e9bbb2b9235d47847d840aa5dcdedef5e6c5c2e))

- Crypto interceptor logger ([0cd4e47](https://github.com/walnut-admin/walnut-admin-server/commit/0cd4e47aa4cf75ff0393c0adef38448fc5a286a1))

- Remove sleep middleware ([6f6e0fd](https://github.com/walnut-admin/walnut-admin-server/commit/6f6e0fd29587015cec8f8f08daad2b6c25c1d65d))

- Aes key optimise ([8977baa](https://github.com/walnut-admin/walnut-admin-server/commit/8977baaf0ef6656a5db216bbb200629a04517602))

- Error code ([921b91e](https://github.com/walnut-admin/walnut-admin-server/commit/921b91e3710a5de4068380ffaa4799fe18510c6a))

- Optimise exception handler ([71137ec](https://github.com/walnut-admin/walnut-admin-server/commit/71137ec51d9f5354814da808329de97a83115dbc))

- App error log white list ([74a8ea4](https://github.com/walnut-admin/walnut-admin-server/commit/74a8ea4f223d2dcb74f46108c0d64ad663b29764))

- SnapShot optimise ([343a234](https://github.com/walnut-admin/walnut-admin-server/commit/343a2341df0bd8845c1c44a5560ab13dfe843895))

- Socket room specific ([16e8f69](https://github.com/walnut-admin/walnut-admin-server/commit/16e8f69f4a9c4b32beff349d1db7201a8fe0a8d9))

- Remove hasAdminRole ([3e1b9d6](https://github.com/walnut-admin/walnut-admin-server/commit/3e1b9d6fb6dd1a153b69551d2ac1086236643885))

- Ali sts token support read only policy ([03c4567](https://github.com/walnut-admin/walnut-admin-server/commit/03c4567e47bc670015fe52e4bdb637105b731547))

- Ali sts token white list for visitor ([373b7b5](https://github.com/walnut-admin/walnut-admin-server/commit/373b7b547a43d84e8f6ab0e94e664695e1ff9ed8))

- Force quit ([f79a6e8](https://github.com/walnut-admin/walnut-admin-server/commit/f79a6e859ff49ae806b65b8c29ee8e2399f79322))

### 🚧 WIP

- Virtual re-design ([b4e6f91](https://github.com/walnut-admin/walnut-admin-server/commit/b4e6f913378b5e87c04f78d17a81d6c2a1770df2))
