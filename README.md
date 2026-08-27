# 微信小程序

这是一个不依赖第三方运行库的原生微信小程序开发骨架。当前首页包含一个点击计数按钮，可用于验证页面渲染、数据绑定和点击事件。

## 开始开发前的必须条件

1. 在[微信公众平台](https://mp.weixin.qq.com/)注册小程序账号，取得小程序 AppID。
2. 安装最新版[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，并用该小程序的开发者微信账号登录。
3. 复制 `project.private.config.json.example` 为 `project.private.config.json`，把其中 AppID 替换成真实小程序 AppID。私有配置的同名字段会覆盖公共配置，且该文件已被 Git 忽略。AppID 是项目标识，不是 AppSecret；严禁把 AppSecret 写进小程序代码或 Git。
4. 在微信公众平台为参与者添加开发者权限；涉及网络请求时，再配置 HTTPS/WSS 合法域名和业务服务器证书。
5. 用微信开发者工具导入本目录，项目类型选择“小程序”。首页出现“开发环境已准备完成”，点击按钮后次数增加，即表示基础环境可用。

> `project.config.json` 中提交的是 `touristappid`，仅用于不涉及开放能力的本地体验。登录、云开发、支付、分享等能力必须使用真实 AppID，并按具体功能补充后台配置。

## 目录

```text
.
├── app.js                          # 小程序入口
├── app.json                        # 小程序全局配置
├── app.wxss                        # 小程序公共样式
├── pages/index/                    # 首页逻辑、结构与样式
├── project.config.json             # 微信开发者工具共享配置
├── project.private.config.json     # 本机 AppID 等私有配置（不提交）
└── sitemap.json                    # 页面索引规则
```

## 后续按需准备

- 需要账号体系：后端提供登录接口，以 `wx.login` 返回的 code 换取 OpenID；AppSecret 只能放在服务端。
- 需要联网：准备已备案的 HTTPS/WSS 域名，并在公众平台配置服务器域名。
- 需要云能力：开通微信云开发并记录环境 ID。
- 上线前：补齐名称、头像、类目资质、隐私保护指引、用户协议、版本体验与审核材料。
