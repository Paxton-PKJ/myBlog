---
title: clash.yaml配置文件简单解读
slug: clashyaml-configuration-file-simple-interpretation-z21hugw
url: /post/clashyaml-configuration-file-simple-interpretation-z21hugw.html
date: '2024-10-05 22:06:40+08:00'
lastmod: '2024-10-05 22:06:42+08:00'
toc: true
tags:
  - openwrt
  - clash
categories:
  - 杂七杂八疑难杂症
keywords: openwrt,clash
description: clash的yaml配置文件简单解读，附带配置文件模板
isCJKLanguage: true
---





本格式基于clash meta内核编写，支持截至文章发布日期最新版clash meta内核以及clash meta for Android

## 配置目标

在使用 Clash 订阅的时候，订阅内通常集成了一些机场的自带规则，但这些规则有时候并不足够或者无法满足个人要求，如果直接修改配置文件，更新订阅时自定义规则将被重置

---

按格式编写后，上传到gist等能够直接使用链接进行订阅

刷新订阅的同时保持自定义分流规则不变

## 配置格式

一个clash配置文件需要以下几个基本字段

* ​`proxy-providers`​

  使用订阅地址，内核会自动获取机场的配置文件，并从中**单独提取出机场的节点信息**

  同时也支持引入本地配置文件的节点信息
* ​`proxy-groups`​

  即clashGUI内部显示的<u>节点选择列表</u>
* ​`rule-providers`​

  导入文件或 URL 中的**分流规则配置**
* ​`rules`​

  对导入规则的引用，代理时由上到下进行规则匹配

> 一个地址匹配规则时：首先先在`rules`​中按各个规则列表逐个匹配，匹配上后，进入rules对应的`proxy-groups`​中按`proxies`​的指定依次进入，直到到达`proxy-providers`​的节点

### proxy-providers（代理集合）

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202410052020626.png)​

可以填写多个订阅来源（代理提供者）

```yaml
proxy-providers:
  provider1: 				#订阅来源名称，可自定义
    type: http 				#网址订阅
    path: './proxy_providers/provider1.yaml'	#文件名对应修改即可
    url: ""					#订阅地址
    interval: 3600 			#更新间隔，单位秒
    health-check:			#延迟测试
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 300
  
provider2:
    type: file 				#文件配置
    path: ./proxy_providers/provider2.yaml		#本地配置地址
    health-check:
      enable: true
      url: https://www.gstatic.com/generate_204
      interval: 300
```

更多内容参见[代理集合配置 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/proxy-providers/)

### proxy-groups（策略组）

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202410051958128.png)​

​`proxy-groups`​也可以分为三个部分（我定义的）

* 节点选择部分
* 分类策略部分
* 地区分类部分

---

策略组通用配置项目解读

* ​`name`​

  策略组的显示名称
* ​`type`​

  策略组的类型

  通常使用`select`​（手动选择）、`url-test`​（由延迟判定自动选择）
* ​`include-all`​

  引用所有`proxy-providers`​提供的节点
* ​`use`​

  对`proxy-providers`​的引用

  ```yaml
  use:
    - provider1
    - provider1
  ```
* ​`proxies`​

  对`proxy-groups`​的引用

  **与include-all/use不能同时使用**

以下样例提供仅有香港、美国节点的样板配置

* ‍

#### 地区分类部分

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202410052029864.png)​

```yaml
proxy-groups:
  - name: 🇭🇰 香港节点
    type: url-test
    include-all: true
    filter: "(?i)港|hk|hongkong|hong kong"
  - name: 🇺🇲 美国节点
    type: url-test
    include-all: true
    filter: "(?i)美|us|unitedstates|united states"
  - name: 其它地区
    type: url-test
    include-all: true
    filter: "(?i)^(?!.*(?:🇭🇰|🇺🇸|港|hk|hongkong|美|us|unitedstates)).*"
```

* ​`filter`​

  由include与use提供的所有节点中筛选符合策略组需求的节点

  使用正则表达式

此时策略组内显示的是**节点信息**

#### 节点选择部分

通常由节点选择、手动切换、自动选择三个部分组成

直连直接使用`Direct`​字段也可以，为了直观，我单独定义了一个 🎯 直连 策略组，拦截同理

```yaml
proxy-groups:
  - name: 🚀 节点选择
    type: select
    proxies:			#节点选择，显然需要提供所有的可选选项
      - ♻️ 自动选择
      - 🚀 手动切换
      - 🎯 直连
      - 🇭🇰 香港节点
      - 🇺🇲 美国节点
  - name: 🚀 手动切换	#手动切换，直接提供所有的节点信息
    type: select
    include-all: true
  - name: ♻️ 自动选择	#自动选择，提供上节地区分类部分name字段
    type: url-test		#以地区自动选择，地区节点自动选择由地区分类部分策略负责
    proxies:	
      - 🇭🇰 香港节点
      - 🇺🇲 美国节点
  - name: 🎯 直连		#直连，提供Direct即可
    type: select
    proxies:
      - DIRECT
  - name: 🛑 拦截		#拦截，提供Reject即可
    type: select
    proxies:
      - REJECT
```

#### 分类策略部分

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202410052057243.png)​

```yaml
proxy-groups: 
  - name: 💬 人工智能
    type: select
    proxies:
      - 🚀 节点选择
      - ♻️ 自动选择
      - 🎯 直连
      - 🇭🇰 香港节点
      - 🇺🇲 美国节点
  - name: 🎮 游戏平台
    type: select
    proxies:
      - 🎯 直连
      - 🇨🇳 台湾节点
      - 🇭🇰 香港节点
```

按以上模板按需填写

更多配置内容见[策略组配置 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/proxy-groups/)

### rule-provider（规则集合）

规则能够让clash知道一条地址或ip是否应该被代理

```yaml
rule-providers:
  Ai:
    type: http
    behavior: domain
    format: mrs		#对应填写
    path: ./providers/rule-provider_Ai.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/clash-ruleset/ai.mrs"
    interval: 86400
  MyProxy:
    type: http
    behavior: classical
    format: text
    url: #自定义的规则地址
    path: ./providers/rule-provider_MyProxy.list
    interval: 86400
```

* ​`type`​

  可选http/file，由链接导入或本地文件导入
* ​`behavior`​

  可选`domain`​/`ipcidr`​/`classical`​，对应不同格式文件，按实际填写

  区别参见[规则集合内容 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/rule-providers/content/)
* ​`format`​

  格式，可选 `yaml`​/`text`​/`mrs`​，不填默认 `yaml`​

  格式区别参见[规则集合内容 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/rule-providers/content/)
* ​`path`​

  由链接引入的保存文件路径

  或本地文件引入的来源路径
* ​`interval`​

  更新时间，单位秒

[规则集合 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/rule-providers/)

### rules（路由规则）

```yaml
rules:
#自定义规则
  - RULE-SET,MyDirect,🎯 直连	#自定义直连规则
  - RULE-SET,MyProxy,🚀 节点选择	#自定义代理规则
  - RULE-SET,MyReject,🛑 拦截	#自定义阻止联网规则
#规则组
  - RULE-SET,Ai,💬 人工智能
  - RULE-SET,Epic,🎮 游戏平台	#多个规则集合统合到一个策略组
  - RULE-SET,Steam,🎮 游戏平台
#未命中任何规则，兜底
  - MATCH,🐟 漏网之鱼
```

<u>规则集合与策略组联系的桥梁</u>

由上到下匹配，本例均使用RULE-SET规则，其余规则参见[路由规则 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/rules/)

自定义的规则放在前面优先匹配

格式为：`匹配规则,规则集合名,策略组名`​

---

整合以上四个部分即可得到一个完整的配置文件

​![](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/%E6%97%A0%E6%A0%87%E9%A2%98-2023-08-12-1526.excalidraw.svg)​

## 完整模板

填入订阅地址即可

```yaml
port: 7890
socks-port: 7891
allow-lan: true
mode: rule
log-level: info
external-controller: :9090
# url 里填写自己的订阅
proxy-providers:
  tapfog:
    type: http
    path: "./proxy/tapfog.yaml"
    url: ""
    interval: 3600
    health-check:
      enable: true
      url: http://www.gstatic.com/generate_204
      interval: 300
proxy-groups:
  - name: 🚀 节点选择
    type: select
    proxies:
      - ♻️ 自动选择
      - 🚀 手动切换
      - 🎯 直连
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点

  - name: 🚀 手动切换
    type: select
    include-all: true

  - name: ♻️ 自动选择
    type: url-test
    proxies:
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点

  - name: 📲 电报消息
    type: select
    proxies:
      - 🚀 节点选择
      - ♻️ 自动选择
      - 🚀 手动切换
      - 🎯 直连
      - 🇸🇬 狮城节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点
  - name: 💬 人工智能
    type: select
    proxies:
      - 🚀 节点选择
      - ♻️ 自动选择
      - 🚀 手动切换
      - 🎯 直连
      - 🇸🇬 狮城节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点
  - name: 📹 油管视频
    type: select
    proxies:
      - 🚀 节点选择
      - ♻️ 自动选择
      - 🚀 手动切换
      - 🎯 直连
      - 🇸🇬 狮城节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点
  - name: 📺 哔哩哔哩
    type: select
    proxies:
      - 🎯 直连
      - 🇨🇳 台湾节点
      - 🇭🇰 香港节点
  - name: 🌍 国外媒体
    type: select
    proxies:
      - 🚀 节点选择
      - ♻️ 自动选择
      - 🚀 手动切换
      - 🎯 直连
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点
  - name: 🌏 国内媒体
    type: select
    proxies:
      - 🎯 直连
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🚀 手动切换
  - name: 📢 谷歌FCM
    type: select
    proxies:
      - 🎯 直连
      - 🚀 节点选择
      - 🇺🇲 美国节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇰🇷 韩国节点
      - 🚀 手动切换
  - name: Ⓜ️ 微软Bing
    type: select
    proxies:
      - 🎯 直连
      - 🚀 节点选择
      - 🇺🇲 美国节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇰🇷 韩国节点
      - 🚀 手动切换
  - name: Ⓜ️ 微软云盘
    type: select
    proxies:
      - 🎯 直连
      - 🚀 节点选择
      - 🇺🇲 美国节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇰🇷 韩国节点
      - 🚀 手动切换
  - name: Ⓜ️ 微软服务
    type: select
    proxies:
      - 🎯 直连
      - 🚀 节点选择
      - 🇺🇲 美国节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇰🇷 韩国节点
      - 🚀 手动切换
  - name: 🎮 游戏平台
    type: select
    proxies:
      - 🎯 直连
      - 🚀 节点选择
      - 🇺🇲 美国节点
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇰🇷 韩国节点
      - 🚀 手动切换
  - name: 🛑 广告拦截
    type: select
    proxies:
      - 🛑 拦截
      - 🎯 直连
  - name: 🍃 应用净化
    type: select
    proxies:
      - 🛑 拦截
      - 🎯 直连
  - name: 🐟 漏网之鱼
    type: select
    proxies:
      - 🚀 节点选择
      - ♻️ 自动选择
      - 🎯 直连
      - 🇭🇰 香港节点
      - 🇨🇳 台湾节点
      - 🇸🇬 狮城节点
      - 🇯🇵 日本节点
      - 🇺🇲 美国节点
      - 🇰🇷 韩国节点
      - 🚀 手动切换
  - name: 🎯 直连
    type: select
    proxies:
      - DIRECT
  - name: 🛑 拦截
    type: select
    proxies:
      - REJECT
  #######################
  - name: 🇰🇷 韩国节点
    type: url-test
    include-all: true
    filter: "(?i)韩|kr|korea|south korea"

  - name: 🇭🇰 香港节点
    type: url-test
    include-all: true
    filter: "(?i)港|hk|hongkong|hong kong"

  - name: 🇨🇳 台湾节点
    type: url-test
    include-all: true
    filter: "(?i)台|tw|taiwan"

  - name: 🇯🇵 日本节点
    type: url-test
    include-all: true
    filter: "(?i)日|jp|japan"

  - name: 🇺🇲 美国节点
    type: url-test
    include-all: true
    filter: "(?i)美|us|unitedstates|united states"

  - name: 🇸🇬 狮城节点
    type: url-test
    include-all: true
    filter: "(?i)(新|sg|singapore)"

  - name: 其它地区
    type: url-test
    include-all: true
    filter: "(?i)^(?!.*(?:🇭🇰|🇯🇵|🇺🇸|🇸🇬|🇨🇳|港|hk|hongkong|台|tw|taiwan|日|jp|japan|新|sg|singapore|美|us|unitedstates|韩|kr|korea|south korea)).*"

rules:
  - RULE-SET,LocalAreaNetwork,🎯 直连
  - RULE-SET,UnBan,🎯 直连
  - RULE-SET,BanAD,🛑 广告拦截
  - RULE-SET,BanProgramAD,🍃 应用净化
  - RULE-SET,GoogleFCM,📢 谷歌FCM
  - RULE-SET,GoogleCN,🎯 直连
  - RULE-SET,SteamCN,🎯 直连
  - RULE-SET,Bing,Ⓜ️ 微软Bing
  - RULE-SET,OneDrive,Ⓜ️ 微软云盘
  - RULE-SET,Microsoft,Ⓜ️ 微软服务
  - RULE-SET,Telegram,📲 电报消息
  - RULE-SET,Ai,💬 人工智能
  - RULE-SET,Epic,🎮 游戏平台
  - RULE-SET,Origin,🎮 游戏平台
  - RULE-SET,Sony,🎮 游戏平台
  - RULE-SET,Steam,🎮 游戏平台
  - RULE-SET,Nintendo,🎮 游戏平台
  - RULE-SET,YouTube,📹 油管视频
  - RULE-SET,BilibiliHMT,📺 哔哩哔哩
  - RULE-SET,Bilibili,📺 哔哩哔哩
  - RULE-SET,ChinaMedia,🌏 国内媒体
  - RULE-SET,ProxyMedia,🌍 国外媒体
  - RULE-SET,ProxyGFWlist,🚀 节点选择
  - RULE-SET,ChinaDomain,🎯 直连
  - RULE-SET,ChinaCompanyIp,🎯 直连
  - RULE-SET,Download,🎯 直连
  - GEOIP,CN,🎯 直连
  - MATCH,🐟 漏网之鱼
rule-providers:
  LocalAreaNetwork:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvTG9jYWxBcmVhTmV0d29yay5saXN0
    path: ./providers/rule-provider_LocalAreaNetwork.yaml
    interval: 86400
  UnBan:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvVW5CYW4ubGlzdA
    path: ./providers/rule-provider_UnBan.yaml
    interval: 86400
  BanAD:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvQmFuQUQubGlzdA
    path: ./providers/rule-provider_BanAD.yaml
    interval: 86400
  BanProgramAD:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvQmFuUHJvZ3JhbUFELmxpc3Q
    path: ./providers/rule-provider_BanProgramAD.yaml
    interval: 86400
  GoogleFCM:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9Hb29nbGVGQ00ubGlzdA
    path: ./providers/rule-provider_GoogleFCM.yaml
    interval: 86400
  GoogleCN:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvR29vZ2xlQ04ubGlzdA
    path: ./providers/rule-provider_GoogleCN.yaml
    interval: 86400
  SteamCN:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9TdGVhbUNOLmxpc3Q
    path: ./providers/rule-provider_SteamCN.yaml
    interval: 86400
  Bing:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvQmluZy5saXN0
    path: ./providers/rule-provider_Bing.yaml
    interval: 86400
  OneDrive:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvT25lRHJpdmUubGlzdA
    path: ./providers/rule-provider_OneDrive.yaml
    interval: 86400
  Microsoft:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvTWljcm9zb2Z0Lmxpc3Q
    path: ./providers/rule-provider_Microsoft.yaml
    interval: 86400
  Telegram:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvVGVsZWdyYW0ubGlzdA
    path: ./providers/rule-provider_Telegram.yaml
    interval: 86400
  Ai:
    type: http
    behavior: domain
    format: mrs
    path: ./providers/rule-provider_Ai.mrs
    url: "https://github.com/DustinWin/ruleset_geodata/releases/download/clash-ruleset/ai.mrs"
    interval: 86400
  Epic:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9FcGljLmxpc3Q
    path: ./providers/rule-provider_Epic.yaml
    interval: 86400
  Origin:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9PcmlnaW4ubGlzdA
    path: ./providers/rule-provider_Origin.yaml
    interval: 86400
  Sony:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9Tb255Lmxpc3Q
    path: ./providers/rule-provider_Sony.yaml
    interval: 86400
  Steam:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9TdGVhbS5saXN0
    path: ./providers/rule-provider_Steam.yaml
    interval: 86400
  Nintendo:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9OaW50ZW5kby5saXN0
    path: ./providers/rule-provider_Nintendo.yaml
    interval: 86400
  YouTube:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9Zb3VUdWJlLmxpc3Q
    path: ./providers/rule-provider_YouTube.yaml
    interval: 86400
  BilibiliHMT:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9CaWxpYmlsaUhNVC5saXN0
    path: ./providers/rule-provider_BilibiliHMT.yaml
    interval: 86400
  Bilibili:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUnVsZXNldC9CaWxpYmlsaS5saXN0
    path: ./providers/rule-provider_Bilibili.yaml
    interval: 86400
  ChinaMedia:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvQ2hpbmFNZWRpYS5saXN0
    path: ./providers/rule-provider_ChinaMedia.yaml
    interval: 86400
  ProxyMedia:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUHJveHlNZWRpYS5saXN0
    path: ./providers/rule-provider_ProxyMedia.yaml
    interval: 86400
  ProxyGFWlist:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvUHJveHlHRldsaXN0Lmxpc3Q
    path: ./providers/rule-provider_ProxyGFWlist.yaml
    interval: 86400
  ChinaDomain:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvQ2hpbmFEb21haW4ubGlzdA
    path: ./providers/rule-provider_ChinaDomain.yaml
    interval: 86400
  ChinaCompanyIp:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvQ2hpbmFDb21wYW55SXAubGlzdA
    path: ./providers/rule-provider_ChinaCompanyIp.yaml
    interval: 86400
  Download:
    type: http
    behavior: classical
    url: https://api.dler.io/getruleset?type=6&url=aHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL0FDTDRTU1IvQUNMNFNTUi9tYXN0ZXIvQ2xhc2gvRG93bmxvYWQubGlzdA
    path: ./providers/rule-provider_Download.yaml
    interval: 86400
```

‍
