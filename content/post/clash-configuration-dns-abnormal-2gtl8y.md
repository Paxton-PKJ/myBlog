---
title: clash配置之DNS异常
slug: clash-configuration-dns-abnormal-2gtl8y
url: /post/clash-configuration-dns-abnormal-2gtl8y.html
date: '2024-10-08 15:29:40+08:00'
lastmod: '2024-10-10 22:23:52+08:00'
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





最近几天观察到，访问部分国内网站时clash内核日志经常出现I/O timeout或者DNS no resolve的警告

排查发现可能原因如下

* <u>配置文件中DNS服务器没有写好</u>

  若使用机场配置文件，则自行编写配置文件，或见文章末

  自行编写的配置文件，DNS直接设置`enable: false`​  
  通常能解决99%的问题
* <u>在拥有ipv6地址时，配置文件未设置</u>​<u>​`ipv6: true`​</u>​

  自己的配置文件中，DNS部分加上即可

  或如果使用clash客户端，打开ipv6设置项即可
* <u>在拥有ipv6地址时，配置文件中</u>​<u>**DNS条目**</u>​<u>未设置</u>​<u>​`ipv6: true`​</u>​

  如果是机场的订阅文件，没可能让他改，自己写配置文件

  自己的配置文件中，DNS部分加上即可

最直接的办法

如果使用clash verge rev客户端最新版，直接在`全局扩展配置中`​，编写对应配置，全局扩展配置会覆盖配置文件中对应配置项

~~或者直接让网卡不获取ipv6地址~~

自编写DNS配置参考

```yaml
dns:
  enable: true
  #允许解析ipv6
  ipv6: true
  #默认域名解析服务器
  nameserver: ['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query']
  #direct出口域名解析的 DNS 服务器
  direct-nameserver: [223.5.5.5, 119.29.29.29]
  #后备域名解析服务器，使用境外 DNS
  fallback: ['https://dns.cloudflare.com/dns-query','tls://8.8.4.4:853']
  #筛选，满足条件的将使用 fallback结果或只使用 fallback解析
  fallback-filter: { geoip: true, ipcidr: [240.0.0.0/4, 0.0.0.0/32] }
```
