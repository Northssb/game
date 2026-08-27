# 羽球搭子微信小程序

“羽球搭子”是一个帮助用户在同城寻找羽毛球球局的原生微信小程序。平台负责球局发现、实力匹配、人员招募、申请审核和信用展示，不参与球馆预订、费用收取或比赛比分记录。

当前版本是可交互的本地 MVP 原型，使用本地示例数据和微信存储演示核心前端流程，尚未接入真实账号、业务服务器和管理员后台。

## 开始开发前的必须条件

1. 在[微信公众平台](https://mp.weixin.qq.com/)注册小程序账号，取得小程序 AppID。
2. 安装最新版[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，并用该小程序的开发者微信账号登录。
3. 复制 `project.private.config.json.example` 为 `project.private.config.json`，把其中 AppID 替换成真实小程序 AppID。私有配置的同名字段会覆盖公共配置，且该文件已被 Git 忽略。AppID 是项目标识，不是 AppSecret；严禁把 AppSecret 写进小程序代码或 Git。
4. 在微信公众平台为参与者添加开发者权限；涉及网络请求时，再配置 HTTPS/WSS 合法域名和业务服务器证书。
5. 用微信开发者工具导入本目录，项目类型选择“小程序”。首页正常显示同城球局卡片并可以切换底部导航，即表示基础环境可用。

> `project.config.json` 中提交的是 `touristappid`，仅用于不涉及开放能力的本地体验。登录、云开发、支付、分享等能力必须使用真实 AppID，并按具体功能补充后台配置。

## 目录

```text
.
├── app.js                          # 小程序入口
├── app.json                        # 小程序全局配置
├── app.wxss                        # 小程序公共样式
├── data/mock-data.js              # 本地原型数据
├── docs/MVP-PRD.md                # MVP 产品边界、规则与验收口径
├── pages/index/                    # 同城球局首页与一键匹配
├── pages/game-detail/              # 球局详情与加入申请
├── pages/create/                   # 发布球局
├── pages/my-games/                 # 参加/发起球局及组织者审核
├── pages/profile/                  # 实力、信用和联系方式档案
├── pages/rating/                   # 中羽技能与场景问卷
├── utils/game-rules.js             # 匹配、联系方式和信用等纯业务规则
├── project.config.json             # 微信开发者工具共享配置
├── project.private.config.json     # 本机 AppID 等私有配置（不提交）
└── sitemap.json                    # 页面索引规则
```

## 当前原型规则

- 球局类型包括男单、女单、男双、女双和混双，补位人数根据目标人数自动计算。
- 一键匹配只推荐符合城市、区域、类型和实力范围的球局，不自动报名。
- 组织者审核通过后才显示双方联系方式，球局结束 24 小时后隐藏。
- 经图片举证并由管理员审核成立的爽约会累计为历史信用记录。
- 球馆、场地费和球费由用户审核通过后自行线下商定。

## 后续按需准备

- 需要账号体系：后端提供登录接口，以 `wx.login` 返回的 code 换取 OpenID；AppSecret 只能放在服务端。
- 需要联网：准备已备案的 HTTPS/WSS 域名，并在公众平台配置服务器域名。
- 需要云能力：开通微信云开发并记录环境 ID。
- 上线前：补齐名称、头像、类目资质、隐私保护指引、用户协议、版本体验与审核材料。
