---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
author: ["Paxton-PKJ"]
summary: ""             # 简单描述，会展示在主页，可被搜索
weight:                 # 输入1可以顶置文章
draft: false            # 是否为草稿
comments: true          # 是否开启评论
hidemeta: false         # 是否隐藏文章的元信息，如发布日期、作者等
searchHidden: false     # 该页面不能被搜索到
showbreadcrumbs: true   # 顶部显示当前路径
mermaid: true           # 是否开启mermaid
cover:
    image: ""           # 封面图片
    hidden: true        # 文章页面隐藏封面图片
tags:
- tag 1
- tag 2
---