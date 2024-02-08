---
title: zerotier自建planet服务
slug: zerotier-self-built-planet-service-d6qaw
url: /post/zerotier-self-built-planet-service-d6qaw.html
date: '2023-10-23 16:16:27'
lastmod: '2024-02-08 21:34:54'
toc: true
tags:
  - linux
  - docker
keywords: linux,docker
isCJKLanguage: true
---

# zerotier自建planet服务

服务器需要具有公网 ip 且 ip 固定

端口需要设置放行 `UDP:9993`​ `TCP:9993,3443,3444`​

## 安装 zerotier-one 并生成修改后的 planet 文件

### 1.安装 zerotier-one

```bash
curl -s https://install.zerotier.com/ | sudo bash
```

### 2.查看认证信息

安装完成后进入安装目录

```bash
cd /var/lib/zerotier-one/
```

查看认证文件信息​​`identity.public`​ 和 `authtoken.secret`​​

```bash
cat identity.public
cat authtoken.secret
```

记录文件信息备用

### 3.下载并修改 zerotier-one 源码

准备编译环境

```bash
apt install gcc g++ git
```

在 `/var/lib/zerotier-one/` ​路径下执行下列命令，无法下载则开启魔法

```bash
git clone https://github.com/zerotier/ZeroTierOne
```

进入源码目录

```bash
cd ZeroTierOne/attic/world/
```

打开 `mkworld.cpp` ​文件

```bash
sudo nano mkworld.cpp
```

找到下图所示内容，即 zerotier 自带的四个 planet 服务器

​![](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202310231632003.png)​

注释掉红框部分，增加绿框部分，增加样例如下，参考其他服务器格式修改

```cpp
 roots.push_back(World::Root());
 roots.back().identity = Identity("identity.public中的字符串");
 roots.back().stableEndpoints.push_back(InetAddress("公网IP/9993"));
```

修改完成后，`ctrl+o` ​保存，`ctrl+x` ​退出

在 world 目录下执行三条命令

```bash
source ./build.sh
./mkworld
mv ./world.bin ./planet
```

source 命令可能因权限问题无法执行，提示如下

```bash
/usr/bin/ld: cannot open output file mkworld: Permission denied
collect2: error: ld returned 1 exit status
```

输入 `sudo su` ​进入 root 用户再次执行上面三条命令即可，source 命令执行过程中无提示，等待片刻即可

执行完成后，替换服务器的 planet，将 world 目录下的 planet 文件覆盖服务器上 zerotier 的 planet 文件

```bash

cp -r ./planet /var/lib/zerotier-one/
```

替换完成后，重启 zerotier 服务

```bash
systemctl restart zerotier-one.service
```

### 编译产生报错

在执行`build.sh`​时，编译异常终止，可能是服务器内存不足导致的，可以使用Windows开启wsl执行步骤3，执行完成后将planet上传到服务器中同理替换即可

## 安装 ztncui

采用 deb 包的安装方式

如果处于 root 用户则切换回普通用户，`user` ​为你的用户账户名

```bash
sudo su user
```

### 下载并安装 ztncui 的 deb 包

```bash
cd /
curl -O https://s3-us-west-1.amazonaws.com/key-networks/deb/ztncui/1/x86_64/ztncui_0.8.14_amd64.deb
sudo apt install ./ztncui_0.8.14_amd64.deb
```

### 修改ztncui配置文件

安装完成后输入以下命令修改 ztncui 的配置文件.env，路径为​ `/opt/key-networks/ztncui/.env`​​

```bash
sudo sh -c "echo ZT_TOKEN=`sudo cat /var/lib/zerotier-one/authtoken.secret` > /opt/key-networks/ztncui/.env"
sudo sh -c "echo HTTPS_PORT=3443 >> /opt/key-networks/ztncui/.env"
sudo sh -c "echo NODE_ENV=production >> /opt/key-networks/ztncui/.env"
sudo chmod 400 /opt/key-networks/ztncui/.env
sudo chown ztncui.ztncui /opt/key-networks/ztncui/.env
sudo systemctl restart ztncui
systemctl status ztncui
```

命令解释：

1. 将.env中`ZT_TOKEN`​的值设置为`authtoken.secret`​的值
2. 设置`HTTPS_PORT`​的值为3443，设置后ztncui将侦听服务器所有ip地址的3443端口的https请求，其他需求见下表
3. 设置为生产模式
4. 将配置文件设置为文件所有者可读写
5. 将.env文件的所有者更改为ztncui，所属组也更改为ztncui
6. 重启ztncui
7. 查看ztncui是否运行正常，若出现错误，通常为侦听接口相关配置产生冲突

关于侦听接口设置的表格如下

|Environment variable|Protocol|Listen On|Port|
| :--------------------: | :--------: | :--------------: | :----------: |
|[none]|HTTP|localhost|3000|
|HTTP_PORT|HTTP|localhost|HTTP_PORT|
|HTTP_ALL_INTERFACES|HTTP|all interfaces|HTTP_PORT|
|HTTPS_PORT|HTTPS|all interfaces|HTTPS_PORT|
|HTTPS_HOST|HTTPS|HTTPS_HOST|HTTPS_PORT|

我的参考配置文件如下

```bash
ZT_TOKEN=<span style="font-weight: bold;" data-type="strong"></span>
HTTPS_PORT=3443
HTTP_PORT=3444
NODE_ENV=production
```

每次修改配置都需重启服务

## 访问ztncui

注意使用`https`​，若设置了HTTP_PORT可使用http访问

访问地址： https://公网ip:3443  
默认用户名：admin  
默认密码：password

正常登录后创建网络和网段即可

### 无法登录

若点击登录后产生502报错或无响应，可能是没有配置密码文件，将`default.passwd`​复制为`passwd`​文件，重启服务再次尝试访问

```bash
cp -v /opt/key-networks/ztncui/etc/default.passwd /opt/key-networks/ztncui/etc/passwd
sudo systemctl restart ztncui
```

### 无法修改密码

若登录后更改密码产生502报错，可能是passwd文件的读写权限问题导致的，修改权限为所有人可读写（学艺不精不知道为了安全性应该如何设置，大佬浇浇）

```bash
sudo chmod a+rwx /opt/key-networks/ztncui/etc/passwd
```

刷新后能够正常修改密码

## 更换客户端planet文件

下载服务器中编译好的planet文件到本地替换即可

替换完成后重启zerotier服务

加入ztncui的网络后在客户机命令行输入

```bash
sudo zetotier-cli peers
```

可以看到服务器已经出现在planet列表中

​![](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202310231735045.png)​

注意，作为planet的服务器即使加入zerotier网络中也无法ping通其他leaf

‍
