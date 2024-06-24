




> **非算力版，emmc芯片不可使用本记录！**

拼多多128购入20240326版本，参考1124版本刷机教程成功

## 开启ssh

### 下载配置文件

通电并连接路由器，不需要联网，防止锁机

登录后台192.168.10.1，使用路由器背面账号密码登录

主页 -> 更多 -> 管理 -> 配置管理 -> 导出文件

下载文件名为`cfg_export_config_file.conf`​

### 解压并修改配置文件

将文件传入任意linux环境中（wsl）

输入命令解压配置文件：

```shell
openssl aes-256-cbc -d -pbkdf2 -k $CmDc#RaX30O0M@\!$ -in cfg_export_config_file.conf -out - | tar -zxvf -
```

在同目录下得到`etc`​文件夹，编辑`etc/config/dropbear`​将`option enable '0'`​修改为1

编辑`etc/shadow`​，将第一行第一个冒号至第二个冒号中间的内容删除

回到etc的上层目录，运行命令打包新配置文件

```shell
tar -zcvf - etc | openssl aes-256-cbc -pbkdf2 -k $CmDc#RaX30O0M@\!$ -out cfg_export_config_file_new.conf
```

若提示`Permission denied`​，命令前加sudo重试

得到了`cfg_export_config_file_new.conf`​

### 导入新配置文件

主页 -> 更多 -> 管理 -> 配置管理 -> 选择文件

选择上一步打包好的`cfg_export_config_file_new.conf`​导入

### 测试ssh

```shell
ssh 192.168.10.1
```

## 刷入U-boot

使用hanwckf的uboot：[github.com/hanwckf/bl-mt798x](https://github.com/hanwckf/bl-mt798x)

windows使用scp命令将uboot文件上传到路由器

```powershell
scp "D:/path/to/uboot/mt7981_cmcc_rax3000m-fip-fixed-parts.bin" root@192.168.10.1:/tmp
```

艺高人胆大，不备份固件直接刷入，ssh登录路由器执行：

```powershell
mtd write /tmp/mt7981_cmcc_rax3000m-fip-fixed-parts.bin FIP
```

完成后输入`reboot`​重启

访问`192.168.1.1`​即可进入uboot刷入第三方固件

## 固件下载安装

使用[openwrt.ai](openwrt.ai)定制的固件

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202406241628341.png)​

在输入设备型号时注意选择nand版本

可以选择自己需要定制软件包构建

构建完成后选择`SYSUPGRADE.BIN`​结尾的镜像下载

uboot中上传安装即可

安装完成重启后输入`192.168.1.1`​即可进入openwrt系统

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202406241626007.png)​

## 其他

后续还想进入uboot刷机界面的话

先断电，按住rest按键，插上电源后大约5-10秒，指示灯变绿色后松开

手动将电脑ip地址改为192.168.1.100

输入192.168.1.1即可

‍
