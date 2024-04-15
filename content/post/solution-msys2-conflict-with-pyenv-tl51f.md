---
title: 解决msys2与pyenv冲突
slug: solution-msys2-conflict-with-pyenv-tl51f
url: /post/solution-msys2-conflict-with-pyenv-tl51f.html
date: '2024-04-15 20:13:42'
lastmod: '2024-04-15 20:33:53'
toc: true
isCJKLanguage: true
tags:
  - msys2
  - pyenv
  - python
  - gcc
  - 环境管理
categories:
  - 杂七杂八疑难杂症
keywords: msys2,pyenv,python,gcc,环境管理
---





## 问题发现

有一天突发奇想想试试windows最新的gcc环境

各种搜索之下安装了msys2并在ucrt64中安装了mingw-w64套件，并将bin路径加入环境变量

之后某天发现pyenv管理的python环境无效，输入`python --version`​后显示的版本为`Python 3.11.9`​并非我原本设置的`3.10.10`​

同时检查pyenv中并没有安装更新的版本，推测是ucrt64中也存在python，影响了环境变量

## 问题解决

预期的解决目标是，pyenv和msys2都保留，并且使用pyenv管理msys2中的python

首先，找到pyenv的python版本文件夹`C:\Users\52563.pyenv\pyenv-win\versions`​

可以看到该位置已经有一个3.10.10的文件夹

使用powershell在该文件夹位置创建一个软链接，将ucrt64的bin文件夹软链接到pyenv的versions文件夹

```powershell
New-Item -ItemType SymbolicLink -Path C:\Users\52563\.pyenv\pyenv-win\versions -Name ucrt64 -Target C:\environments\msys64\ucrt64\bin
```

​![](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404152025413.png)​

同时，在环境变量中，将ucrt64的变量移动到pyenv下方

​![](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404152024073.png)​

之后，在powershell中输入`pyenv versions`​，可以发现两个版本3.10.10和ucrt64

使用global切换版本检查`python --version`​均正常，`gcc -v`​正常

​![](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202404152030531.png)​

‍
