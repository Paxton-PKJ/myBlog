---
title: clash配置之DNS异常
slug: clash-configuration-dns-abnormal-2gtl8y
url: /post/clash-configuration-dns-abnormal-2gtl8y.html
date: '2024-10-08 15:29:40+08:00'
lastmod: '2024-10-12 11:29:10+08:00'
toc: true
tags:
  - openwrt
  - clash
categories:
  - 杂七杂八疑难杂症
keywords: openwrt,clash
description: 关于匹配到direct规则的网站，内核日志经常出现I/O timeout或者DNS no resolve的警告的解决方法
isCJKLanguage: true
---





最近几天观察到，**访问部分国内网站**时clash内核日志经常出现**I/O timeout**或者**DNS no resolve**的警告

排查发现可能原因如下

1. <u>配置文件中DNS服务器配置没有写好</u>
2. <u>在拥有ipv6地址时，配置文件未设置</u>​<u>​`ipv6: true`​</u>​
3. <u>在拥有ipv6地址时，配置文件中</u>​<u>**DNS条目**</u>​<u>未设置</u>​<u>​`ipv6: true`​</u>​

解决方法

1. 问题1，按照wiki模板修改dns配置

    ```yaml
    dns:
      enable: true
      use-hosts: true
      use-system-hosts: true
      listen: 0.0.0.0:1053
      ipv6: false
      default-nameserver:
        - 223.5.5.5
      enhanced-mode: fake-ip
      fake-ip-range: 198.18.0.1/16
      nameserver:
        - https://doh.pub/dns-query
        - https://dns.alidns.com/dns-query
      fallback:
        - tls://8.8.4.4
        - tls://1.1.1.1
      proxy-server-nameserver:
        - https://doh.pub/dns-query
      direct-nameserver:
        - system
      fallback-filter:
        geoip: true
        geoip-code: CN
        geosite:
          - gfw
    ```
2. 问题23，关闭ipv6，或者在配置文件或GUI中打开Ipv6相关设置项

各条目详细解释见[DNS配置 - 虚空终端 Docs (metacubex.one)](https://wiki.metacubex.one/config/dns/)

DNS解析流程如下，忽略了 Clash 内部的 DNS 映射处理

<div>
<div class="mermaid"></div>
</div>

```mermaid
flowchart TD
  Start[客户端发起请求] --> rule[匹配规则]
  rule -->  Domain[匹配到基于域名的规则]
  rule --> IP[匹配到基于 IP 的规则]

  Domain --> |域名匹配到直连规则|DNS
  IP --> DNS[通过 Clash DNS 解析域名]


  Domain --> |域名匹配到代理规则|Remote[通过代理服务器解析域名并建立连接]

  Cache --> |Redir-host/FakeIP-Direct 未命中|NS[匹配 nameserver-policy 并查询 ]
  Cache --> |Cache 命中|Get
  Cache --> |FakeIP 未命中,代理域名|Remote

  NS --> |匹配成功| Get[将查询到的 IP 用于匹配 IP 规则]
  NS --> |没匹配到| NF[nameserver/fallback 并发查询]

  NF --> Get[查询得到 IP]
  Get --> |缓存 DNS 结果|Cache[(Cache)]
  Get --> S[通过 IP 直接/通过代理建立连接]

  DNS --> Redir-host/FakeIP
  Redir-host/FakeIP --> |查询 DNS 缓存|Cache
```

‍
