## [v1.9.0] - 2025-11-06

## Frontend

### ✨ Features

- ObjectToPaths support ignoreKeys ([55774cf](https://github.com/walnut-admin/walnut-admin-client/commit/55774cf804026923622591fe5852d35fd102e02d))

- Json editor ([c16621c](https://github.com/walnut-admin/walnut-admin-client/commit/c16621c2a877a6a7c3157a24a22985cd5f2b22ac))

- Json editor button display ([531d4d8](https://github.com/walnut-admin/walnut-admin-client/commit/531d4d8c8712eb285d2735c67ae6dca1131c8de7))

- Px => rem ([37dc7f3](https://github.com/walnut-admin/walnut-admin-client/commit/37dc7f35b3e6b2250af35ea724f1ddd9ec95ddc2))

- Add footer buttons for dialog usage ([921fa42](https://github.com/walnut-admin/walnut-admin-client/commit/921fa42a27dd1ecf848b52275da623f9dea5b822))

- Code mirror json diff ([4b317e7](https://github.com/walnut-admin/walnut-admin-client/commit/4b317e75623d1bac8107465a8ede0ab979a70665))

- Support copy ([d360ba3](https://github.com/walnut-admin/walnut-admin-client/commit/d360ba303fb4cc05fffa58f579f65335b0e08f7e))

- Log operate device modal ([c6a5ecf](https://github.com/walnut-admin/walnut-admin-client/commit/c6a5ecfb161369fde2560c71c7694c37a2075f62))

- Device management ([291a90f](https://github.com/walnut-admin/walnut-admin-client/commit/291a90f3ad5b5aa0bc83badc9efc7a22640f1952))

### 🐛 Bug Fixes

- Tree expanded keys error ([3c09e13](https://github.com/walnut-admin/walnut-admin-client/commit/3c09e134a1b9e062ef20362322a3b9714c584f1b))

- Axios cancel error on root path ([46826e4](https://github.com/walnut-admin/walnut-admin-client/commit/46826e4de7396c6b2af5ae6d3a8b9cd2bbd874c4))

- Locale select refresh not work ([e0125be](https://github.com/walnut-admin/walnut-admin-client/commit/e0125bec61f391c2b0bbb6af2ec4cd1bc5c862a9))

- Desc logic error ([eb91e58](https://github.com/walnut-admin/walnut-admin-client/commit/eb91e58648d25effb3464f18dc74b7c01e96dabf))

- Monitor duplicate request ([81fdaf4](https://github.com/walnut-admin/walnut-admin-client/commit/81fdaf415bf93a41850eb9a020cde2ba66704cd2))

- Missing route white list in query/params encrypt ([e2f6c7a](https://github.com/walnut-admin/walnut-admin-client/commit/e2f6c7adc0485bd278da11a737202018ac049b16))

- Client rsa pub key both end missing edge handler ([eee304b](https://github.com/walnut-admin/walnut-admin-client/commit/eee304b6cfdc425f071478f6839f5e25080a2cf0))

- Device cache & fingerprint ensure ([9daaf0b](https://github.com/walnut-admin/walnut-admin-client/commit/9daaf0b9d8e2b3fb836b523f370e8f6303736371))

- Intro id not match ([f4e2a08](https://github.com/walnut-admin/walnut-admin-client/commit/f4e2a08e7d9aabc804a1cf93fa7194c8d5504eca))

### 🔧 Refactor

- Table right icon style ([a4e1c9f](https://github.com/walnut-admin/walnut-admin-client/commit/a4e1c9f1a78f5bdab0c56e3ef1ad15e6301c0154))

- Watermark form item ([9308567](https://github.com/walnut-admin/walnut-admin-client/commit/9308567dddbc692bd58efe2db3d94964b9edbdc0))

- Modal closable ([285e16f](https://github.com/walnut-admin/walnut-admin-client/commit/285e16f3b398d460575ca9607c8f7b6286a61730))

- Remove old app settings relative ([dcc96a7](https://github.com/walnut-admin/walnut-admin-client/commit/dcc96a738a865d09829fe9085f1d2f59fe331901))

- Log operate remove delete ([abef3ea](https://github.com/walnut-admin/walnut-admin-client/commit/abef3eaf36725c916f0c4509cc51e37734d830d5))

- Remove useless todo ([886b073](https://github.com/walnut-admin/walnut-admin-client/commit/886b073b9139d7b58e35361fc1ea767b3d6e8307))

- Device relative ([48a18fc](https://github.com/walnut-admin/walnut-admin-client/commit/48a18fcee2498aa32cc3014740c68730d6a4beeb))

- Dialog form footer buttons ([e5c2341](https://github.com/walnut-admin/walnut-admin-client/commit/e5c2341615cbab83de2aba2dbf27139a73d34e11))

- Not allowed page ([5ddef47](https://github.com/walnut-admin/walnut-admin-client/commit/5ddef475c7d41c1ec87acd9770922e795ac3dba5))

### 🔩 Chores

- Unocss naive ui warning color ([d3de473](https://github.com/walnut-admin/walnut-admin-client/commit/d3de4734abe27e6578b82157e5d6bd51da6f8a96))

### 🚧 WIP

- Device manage ([db58146](https://github.com/walnut-admin/walnut-admin-client/commit/db581462451d80174e3a2588d6923a2ab6c78845))

## Backend

### ✨ Features

- Response base structure add requestId for trace ([4edc4b0](https://github.com/walnut-admin/walnut-admin-server/commit/4edc4b0803af1071de7106f1fff7480ea2ed60b7))

- Exception error id/ip/deviceId log ([c5925f0](https://github.com/walnut-admin/walnut-admin-server/commit/c5925f0156787168a74c68f14f12adc5c3028fd1))

- Device list location query support ([3113003](https://github.com/walnut-admin/walnut-admin-server/commit/31130033e88c0bb55e3bdaf6b4c7dcd1ee830943))

- Object field decorator support res mask sensitive ([90f0f52](https://github.com/walnut-admin/walnut-admin-server/commit/90f0f52db5941bc8bd4a608a836238596ba5d2bf))

- Als module & service ([48ded37](https://github.com/walnut-admin/walnut-admin-server/commit/48ded372a8d7557f657d1fea9ebf938484e5508a))

- Log operate support snapshot ([f43a105](https://github.com/walnut-admin/walnut-admin-server/commit/f43a105455ca13e69d3ea7177a19e4ac727c01bf))

- Log operate get device ([24fef14](https://github.com/walnut-admin/walnut-admin-server/commit/24fef145bbe6a8f9d0988fafd982aa0ba9f8b4cd))

- Delay shared module ([449d0f5](https://github.com/walnut-admin/walnut-admin-server/commit/449d0f517dd367ea2c8d476195478aead2911e92))

- Device shared module ([a38143b](https://github.com/walnut-admin/walnut-admin-server/commit/a38143b05672c78bd11a9d9c9e744bb8169d27be))

- User device shared module ([c743b8b](https://github.com/walnut-admin/walnut-admin-server/commit/c743b8b02267ff9847645f3498b90526a1a7a6e1))

- Device module ([2c81572](https://github.com/walnut-admin/walnut-admin-server/commit/2c81572c1f82cefd7e2835287683086219b42791))

- User device last active at ([19d5167](https://github.com/walnut-admin/walnut-admin-server/commit/19d51678d3bc1fd54627bde0bc3e71a77f9c983b))

### 🐛 Bug Fixes

- Log operate snapshot error ([e9a60d4](https://github.com/walnut-admin/walnut-admin-server/commit/e9a60d491500b259c406cfec62263995b3b31c02))

- Object transform fill empty object ([e03db1a](https://github.com/walnut-admin/walnut-admin-server/commit/e03db1af99ea57d015c1a4e9ac0f08fa3e8a5a37))

- State/aes-key should be device free ([7245413](https://github.com/walnut-admin/walnut-admin-server/commit/724541309f413503f78d889a65b8bc3197860531))

- Update state logic error ([03e66b9](https://github.com/walnut-admin/walnut-admin-server/commit/03e66b99e9d089a02f3202f1839c2b5455dbccb5))

- MaskSensitive true when necessary ([f33a021](https://github.com/walnut-admin/walnut-admin-server/commit/f33a021e81fffe2ebd71c2050c01f812174c8b87))

- Both client/server rsa pub key missing edge conditions ([0702bec](https://github.com/walnut-admin/walnut-admin-server/commit/0702becfc76be6901664f6dc2cef18971ba1bdc6))

### 🔧 Refactor

- Cap free ([195d554](https://github.com/walnut-admin/walnut-admin-server/commit/195d55437e17c361b83ae6bd2a037cdda7795cbe))

- Device free ([a549717](https://github.com/walnut-admin/walnut-admin-server/commit/a54971781126fe45d6d00271041577c60fd7bbb1))

- Typo ([da36c51](https://github.com/walnut-admin/walnut-admin-server/commit/da36c516a6aa53b0cab14509cd2e771d80560220))

- Typo ([54ffe47](https://github.com/walnut-admin/walnut-admin-server/commit/54ffe474b61f1b39314e90a03b93228995fecc06))

- Device need locked field ([36475db](https://github.com/walnut-admin/walnut-admin-server/commit/36475db8f73816465eafbef28d9043f43885a41d))

- Menu meta watermark prop missing ([268644c](https://github.com/walnut-admin/walnut-admin-server/commit/268644c3b4857b9f92d96c0a0c792c484a73553d))

- Log operate device virtual field ([b05526a](https://github.com/walnut-admin/walnut-admin-server/commit/b05526ac4ca1d63449e531cd17781853d5342a7f))

- Log operate remove delete ([c72a2f6](https://github.com/walnut-admin/walnut-admin-server/commit/c72a2f629f72ff6a199db2cd3e5ba6408111c003))

- Virtual user fields ([53159d7](https://github.com/walnut-admin/walnut-admin-server/commit/53159d79d2ce0392e874d9a47e93576eceb4f6b9))

- New exceptions ([5bffe3a](https://github.com/walnut-admin/walnut-admin-server/commit/5bffe3a91c555632b4b69abec1b5e65080349822))

- Device => deviceShared ([c23157f](https://github.com/walnut-admin/walnut-admin-server/commit/c23157f4bb9c1b3e887d45ea677302bd97d9e1a6))

- Settings public should be device free ([4fdbc84](https://github.com/walnut-admin/walnut-admin-server/commit/4fdbc84d869d2739b7333f535b8da8b0640487fd))

### 🔩 Chores

- Gitignore ([273ceb7](https://github.com/walnut-admin/walnut-admin-server/commit/273ceb7decd000cb49d664170e1aafa4d94f4ae4))

### 🚧 WIP

- Device list/read ([e45d896](https://github.com/walnut-admin/walnut-admin-server/commit/e45d896df259f83b8fe4c0ab6b194291c17fd281))
