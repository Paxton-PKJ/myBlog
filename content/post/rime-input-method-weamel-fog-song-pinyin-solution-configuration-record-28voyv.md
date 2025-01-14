---
title: rime输入法（weasel）之雾凇拼音方案配置记录
slug: rime-input-method-weamel-fog-song-pinyin-solution-configuration-record-1bt25t
url: >-
  /post/rime-input-method-weamel-fog-song-pinyin-solution-configuration-record-1bt25t.html
date: '2025-01-14 15:56:37+08:00'
lastmod: '2025-01-14 20:06:22+08:00'
toc: true
isCJKLanguage: true
---





* [雾凇拼音文档(dvel.me)](https://dvel.me/posts/rime-ice)
* [rime 官方 wiki](https://github.com/rime/home/wiki)
* [方案制作详解](https://github.com/LEOYoon-Tsaw/Rime_collections/blob/master/Rime_description.md)
* [Weasel 皮肤外型定制化文档](https://github.com/rime/weasel/wiki/Weasel-%E5%AE%9A%E5%88%B6%E5%8C%96)

## 安装 weasel

weasel 是 rime 输入法的 Windows 平台实现，即 rime-Windows

下载 weasel：[github.com/rime/weasel/releases/latest](https://github.com/rime/weasel/releases/latest)

安装最后弹出的配置窗口保持默认即可

首次安装需要选择至少一个内置方案，暂时选择 **「全拼」** ，配色选择随意，后续修改

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20250114164724-3rixg7z.png)​

## 安装雾凇拼音方案

下载 `full.zip` ​包含所有词典和方案文件：[github.com/iDvel/rime-ice/releases/latest](https://github.com/iDvel/rime-ice/releases/latest)

在任务栏 rime 图标处打开**用户文件夹，将** `full.zip`​**内容解压后全部复制进去即可**

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141659137.png)​

点击**重新部署**即切换到雾凇拼音方案，<span data-type="text" style="color: var(--b3-font-color13);" id="">对任何配置文件的修改都需要点击重新部署生效</span>

## 皮肤自定义

小狼毫的在线设计网页：[润笔](https://pdog18.github.io/rime-soak/#/theme)

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141715391.png)​

提前在网页设计好自己的皮肤，点击右下角 save 按钮，得到下图代码，保存（只有进行了修改的项会显示在代码中，**下图仅作示例**）
同时下图所示语法为 rime 配置文件的缩写写法，我个人更喜欢展开

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141713725.png)​

附上我自用的仿微信输入法皮肤配置，在用户文件夹下新建 `weasel.custom.yaml` ​即可，如有则覆盖
​`style` ​修改输入框整体外型，`preset_color_schemes` ​修改配色，配置项详解见 [Weasel 皮肤外型定制化文档](https://github.com/rime/weasel/wiki/Weasel-%E5%AE%9A%E5%88%B6%E5%8C%96)

所有修改均需要点击**重新部署**生效

> 注意，patch 是 rime 的一种以个人设置覆盖方案设置的“补丁”方式，**修改配置项但不影响原文件**
> 上图的写法只会修改对应条目，而下面我的写法将使得原文件中 `style`​，`preset_color_schemes` ​条目**只剩 patch 中内容**
> [几个打补丁的示例(dvel.me)](https://dvel.me/posts/rime-ice/#%E5%87%A0%E4%B8%AA%E6%89%93%E8%A1%A5%E4%B8%81%E7%9A%84%E7%A4%BA%E4%BE%8B)

```yaml
patch:
  style:
    color_scheme: paxton_green # 配色方案名称
    horizontal: true # 水平候选窗口
    inline_preedit: false # 在候选词上方显示预输入文本
    font_face: "Segoe UI Emoji,霞鹜文楷 GB 屏幕阅读版" # 优先使用前面的字体，缺字时使用后面的字体
    font_point: 16 # 字体大小
    layout:
      margin_x: 10 # 横向外边距
      margin_y: 10 # 纵向外边距
      hilite_padding_x: 4 # 候选背景色块横向内边距
      hilite_padding_y: 2 # 候选背景色块纵向内边距
      hilite_spacing: 2 # 序号和候选项之间的间隔
      candidate_spacing: 20 # 候选项之间的间隔
      round_corner: 8 # 候选背景色块圆角半径
      corner_radius: 8 # 候选窗口圆角半径
      shadow_radius: 4 # 阴影半径
      shadow_offset_x: 8 # 阴影偏移
      shadow_offset_y: -8

  preset_color_schemes:
    paxton_green:
      name: 自用微信绿
      author: paxton
      text_color: 0
      candidate_text_color: 0
      label_color: 5592405
      back_color: 16777215
      comment_text_color: 5592405
      border_color: 13421772
      hilited_text_color: 0
      hilited_candidate_text_color: 16777215
      hilited_back_color: 16777215
      hilited_comment_text_color: 16777215
      hilited_label_color: 16777215
      hilited_candidate_back_color: 7844097
      shadow_color: 0xcccccc
```

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141758428.png "自用绿效果参考")​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20250114181211-d9n70ey.png "皮肤配色对应配置项")​

## 导入搜狗个人词库

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/image-20250114185630-gceqqv0.png)​

按图片操作将搜狗词库导出

下载打开：[深蓝词库转换工具（github.com）](https://github.com/studyzy/imewlconverter/releases/latest)

按图片点击转换即可，高级设置可按需调整

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141905551.png)​

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141906915.png)​

将导出的文件移动到 `用户文件夹\cn_dicts` ​文件夹，并重命名为 `sougou.dict.yaml`​，同时在顶部加入以下内容

```yaml
# sougou.dict.yaml

---
name: sougou
version: "1"
sort: by_weight
...
```

打开 `用户文件夹\rime_ice.dict.yaml` ​文件，按下例修改即可

```yaml
import_tables:
  - cn_dicts/8105     # 字表
  # - cn_dicts/41448  # 大字表（按需启用）（启用时和 8105 同时启用并放在 8105 下面）
  - cn_dicts/base     # 基础词库
  - cn_dicts/ext      # 扩展词库
  - cn_dicts/tencent  # 腾讯词向量（大词库，部署时间较长）
  - cn_dicts/others   # 一些杂项

  # 建议把扩展词库放到下面，有重复词条时，最上面的权重生效
  # - cn_dicts/mydict
  - cn_dicts/sougou
```

可以发现已经出现搜狗词

​![image](https://image-host-pkj.oss-cn-guangzhou.aliyuncs.com/202501141926168.png)​

## 常用技巧

* [删词 or 降权](https://dvel.me/posts/rime-ice/#%e5%88%a0%e8%af%8d-or-%e9%99%8d%e6%9d%83)
* [Tab 切光标](https://dvel.me/posts/rime-ice/#tab-%e5%88%87%e5%85%89%e6%a0%87)
* **符号**：全拼 `v`​ 开头

  ​`v1`​ 得到数字 1 的 emoji 和各种符号表示形式

  ​`va`​得到字母a的各种声调字符
* **Unicode**：大写 `U`​ 开头，如 `U62fc`​ 得到「拼」。
* **数字、金额大写**：大写 `R`​ 开头，如 `R1234`​ 得到「一千二百三十四、壹仟贰佰叁拾肆元整」。
* **农历日期**：大写 `N`​ 开头，如 `N20240210`​ 得到「二〇二四年正月初一」
* **以词定字**：默认快捷键为左右中括号 `[`​ `]`​，分别<u>取第一个和最后一个字</u>
* **简易计算器：**​<kbd>cC</kbd>​+算式
