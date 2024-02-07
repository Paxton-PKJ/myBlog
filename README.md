# 自用设置项记录

## 全局字体设置

字体文件存放于``/static/fonts/``目录下，可自行添加字体文件

``/assets/css/extended/blank.css``中增加全局字体设置

```css
@font-face {
    font-family: 'FantasqueSansM Nerd Font Mono';
    src: url('/fonts/FantasqueSansMNerdFontMono-Regular.ttf');
}

@font-face {
    font-family: 'HarmonyOS Sans SC';
    src: url('/fonts/HarmonyOS_Sans_SC_Regular.ttf');
}

body {
    font-family: 'FantasqueSansM Nerd Font Mono', 'HarmonyOS Sans SC', sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    margin: 0;
}
```

## 目录移动到侧边

参见链接：[https://www.sulvblog.cn/posts/blog/hugo_toc_side/](https://www.sulvblog.cn/posts/blog/hugo_toc_side/)

## 其他待定
