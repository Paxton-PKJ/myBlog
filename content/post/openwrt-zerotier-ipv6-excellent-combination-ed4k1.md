---
title: openwrt+zerotier+ipv6绝佳组合
slug: openwrt-zerotier-ipv6-excellent-combination-ed4k1
url: /post/openwrt-zerotier-ipv6-excellent-combination-ed4k1.html
date: '2024-07-08 15:34:51+08:00'
lastmod: '2024-07-08 15:34:49+08:00'
toc: true
tags:
  - openwrt
keywords: openwrt
isCJKLanguage: true
---





众所周知，学校提供的内网连接工具通常都是一坨，为了方便非校园网环境下也能连接到校园网中，正好宿舍中有一个[OpenWrt路由器](https://blog.paxton-cloud.top/post/cmcc-rax3000m-nand-flashing-record-zsnjap.html)，正好学校提供公网ipv6地址，又正好zerotier在双端ipv6环境下表现稳定，于是有此下文

预期完成搭建后，zerotier下的所有设备都将通过OpenWrt路由器作为网络出口，同时zerotier局域网设备可以与OpenWrt局域网设备互访

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081532452.png)​

## 配置路由器zerotier

路由器zerotier安装略

在zerotier中输入zerotier控制台`Network ID`​加入网络，勾选`自动允许客户端NAT`​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081433174.png)​

## 配置路由器防火墙

安装zerotier后，网络——接口——设备中会出现一个zt开头的新设备

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081440697.png)​

回到接口，添加新接口：名称`zerotier`​，协议`不配置协议`​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081441558.png)​

同页面点击防火墙设置：创建防火墙`zerotier`​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081442971.png)​

---

来到网络——防火墙页面

常规设置——区域——编辑zerotier：

入站数据，出站数据，转发全部选择`允许`​

勾选`IP动态伪装`​，允许转发到目标区域选择`lan和wan`​，运行来自源区域的转发选择`lan`​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081445204.png)​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081446806.png)​

---

来到网络——防火墙——通信规则页面

添加名为zerotier的通信规则，按下图配置

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081447708.png)​

## zerotier控制台配置

为了zerotier中的流量全都能通过路由器，需要配置zerotier路由表

在控制台`Managed Routes`​中添加路由，将虚拟局域网的流量转发到路由器

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081450114.png)​

## zerotier客户端配置

客户端zerotier加入局域网后

安卓端需要在应用设置中勾选`Allow mobile data`​，并在网络设置中按下图配置

其中`ipv4 DNS`​设置为`路由器zerotier地址`​

​![267c1c3652b9da3664e73314e975051](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/267c1c3652b9da3664e73314e975051-20240708145754-cvd99xf.jpg)​

windows端需要按图勾选

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081459347.png)​

同时，由于系统存在的多网卡多dns冲突，此时虽然能透过路由器访问校园网，但是无法正常使用路由器中的科学研究插件（open克拉斯）

使用nslookup命令可以查看当前使用的dns

---

来到控制面板——网络和Internet——网络和共享中心——更改适配器设置页面

右键`Zerotie One`​网卡选择属性——Internet协议版本4，在dns服务器中填入路由器zerotierip地址

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202407081505316.png)​

点击高级，去除自动跃点并填入数值10，对于有线网卡填入15，无线网卡填入20

配置完全后，可以正常进行局域网互访，以及科学研究
