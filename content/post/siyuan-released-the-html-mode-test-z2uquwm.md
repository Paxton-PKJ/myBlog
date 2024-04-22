---
title: 思源发布html模式测试
slug: siyuan-released-the-html-mode-test-z2uquwm
url: /post/siyuan-released-the-html-mode-test-z2uquwm.html
date: '2024-04-21 19:06:26'
lastmod: '2024-04-21 19:12:20'
toc: true
isCJKLanguage: true
---

<p>This article offers a sample of basic Markdown syntax that can be used in Hugo content files, also it shows whether basic HTML elements are decorated with CSS in a Hugo theme.</p>
<h2>Headings</h2>
<p>The following HTML <code>&lt;h1&gt;</code>—<code>&lt;h6&gt;</code> elements represent six levels of section headings. <code>&lt;h1&gt;</code> is the highest section level while <code>&lt;h6&gt;</code> is the lowest.</p>
<h1>H1</h1>
<h2>H2</h2>
<h3>H3</h3>
<h4>H4</h4>
<h5>H5</h5>
<h6>H6</h6>
<h2>Paragraph</h2>
<p>Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur? Quianimin porecus evelectur, cum que nis nust voloribus ratem aut omnimi, sitatur? Quiatem. Nam, omnis sum am facea corem alique molestrunt et eos evelece arcillit ut aut eos eos nus, sin conecerem erum fuga. Ri oditatquam, ad quibus unda veliamenimin cusam et facea ipsamus es exerum sitate dolores editium rerore eost, temped molorro ratiae volorro te reribus dolorer sperchicium faceata tiustia prat.</p>
<p>Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.</p>
<h2>Blockquotes</h2>
<p>The blockquote element represents content that is quoted from another source, optionally with a citation which must be within a <code>footer</code> or <code>cite</code> element, and optionally with in-line changes such as annotations and abbreviations.</p>
<h4>Blockquote without attribution</h4>
<blockquote>
<p>Tiam, ad mint andaepu dandae nostion secatur sequo quae.<br />
<strong>Note</strong>  that you can use <em>Markdown syntax</em> within a blockquote.</p>
</blockquote>
<h4>Blockquote with attribution</h4>
<blockquote>
<p>Don't communicate by sharing memory, share memory by communicating.<br><br />
— <cite>Rob Pike<sup class="footnotes-ref" id="footnotes-ref-1"><a href="#footnotes-def-1">1</a></sup></cite></p>
</blockquote>
<h2>Tables</h2>
<p>Tables aren't part of the core Markdown spec, but Hugo supports supports them out-of-the-box.</p>
<table>
<thead>
<tr>
<th>Name</th>
<th>Age</th>
</tr>
</thead>
<tbody>
<tr>
<td>Bob</td>
<td>27</td>
</tr>
<tr>
<td>Alice</td>
<td>23</td>
</tr>
</tbody>
</table>
<h4>Inline Markdown within tables</h4>
<table>
<thead>
<tr>
<th>Italics</th>
<th>Bold</th>
<th>Code</th>
</tr>
</thead>
<tbody>
<tr>
<td><em>italics</em></td>
<td><strong>bold</strong></td>
<td><code>code</code></td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>A</th>
<th>B</th>
<th>C</th>
<th>D</th>
<th>E</th>
<th>F</th>
</tr>
</thead>
<tbody>
<tr>
<td>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</td>
<td>Phasellus ultricies, sapien non euismod aliquam, dui ligula tincidunt odio, at accumsan nulla sapien eget ex.</td>
<td>Proin eleifend dictum ipsum, non euismod ipsum pulvinar et. Vivamus sollicitudin, quam in pulvinar aliquam, metus elit pretium purus</td>
<td>Proin sit amet velit nec enim imperdiet vehicula.</td>
<td>Ut bibendum vestibulum quam, eu egestas turpis gravida nec</td>
<td>Sed scelerisque nec turpis vel viverra. Vivamus vitae pretium sapien</td>
</tr>
</tbody>
</table>
<h2>Code Blocks</h2>
<h4>Code block with backticks</h4>
<pre><code class="language-html">&lt;!doctype html&gt;
&lt;html lang=&quot;en&quot;&gt;
&lt;head&gt;
  &lt;meta charset=&quot;utf-8&quot;&gt;
  &lt;title&gt;Example HTML5 Document&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;p&gt;Test&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;
</code></pre>
<h4>Code block indented with four spaces</h4>
<p>&lt;!doctype html&gt;</p>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Example HTML5 Document</title>
</head>
<body>
<p>Test</p>
</body>
</html>
<h4>Diff code block</h4>
<pre><code class="language-diff">[dependencies.bevy]
git = &quot;https://github.com/bevyengine/bevy&quot;
rev = &quot;11f52b8c72fc3a568e8bb4a4cd1f3eb025ac2e13&quot;
- features = [&quot;dynamic&quot;]
+ features = [&quot;jpeg&quot;, &quot;dynamic&quot;]
</code></pre>
<h2>List Types</h2>
<h4>Ordered List</h4>
<ol>
<li>First item</li>
<li>Second item</li>
<li>Third item</li>
</ol>
<h4>Unordered List</h4>
<ul>
<li>List item</li>
<li>Another item</li>
<li>And another item</li>
</ul>
<h4>Nested list</h4>
<ul>
<li>Fruit
<ul>
<li>Apple</li>
<li>Orange</li>
<li>Banana</li>
</ul>
</li>
<li>Dairy
<ul>
<li>Milk</li>
<li>Cheese</li>
</ul>
</li>
</ul>
<h2>Hyperlinked image</h2>
<p><img src="https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png" alt="Google" /><a href="https://google.com">https://google.com</a></p>
<h2>emoji</h2>
<p>Emoji can be enabled in a Hugo project in a number of ways.</p>
<div>
<!--more-->
</div>
<p>The <a href="https://gohugo.io/functions/emojify/"><code>emojify</code></a> function can be called directly in templates or <a href="https://gohugo.io/templates/shortcode-templates/#inline-shortcodes">Inline Shortcodes</a>.</p>
<p>To enable emoji globally, set <code>enableEmoji</code> to <code>true</code> in your site's <a href="https://gohugo.io/getting-started/configuration/">configuration</a> and then you can type emoji shorthand codes directly in content files; e.g.</p>
<div>
<p><span class="nowrap"><span class="emojify">🙈</span> <code>:see_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙉</span> <code>:hear_no_evil:</code></span>  <span class="nowrap"><span class="emojify">🙊</span> <code>:speak_no_evil:</code></span></p>
<br>
</div>
<p>The <a href="http://www.emoji-cheat-sheet.com/">Emoji cheat sheet</a> is a useful reference for emoji shorthand codes.</p>
<h2>math</h2>
<p>Mathematical notation in a Hugo project can be enabled by using third party JavaScript libraries.</p>
<div>
<!--more-->
</div>
<p>In this example we will be using <a href="https://katex.org/">KaTeX</a></p>
<ul>
<li>Create a partial under <code>/layouts/partials/math.html</code></li>
<li>Within this partial reference the <a href="https://katex.org/docs/autorender.html">Auto-render Extension</a> or host these scripts locally.</li>
<li>Include the partial in your templates like so:</li>
</ul>
<pre><code class="language-bash">{{ if or .Params.math .Site.Params.math }}
{{ partial &quot;math.html&quot; . }}
{{ end }}
</code></pre>
<ul>
<li>To enable KaTex globally set the parameter <code>math</code> to <code>true</code> in a project's configuration</li>
<li>To enable KaTex on a per page basis include the parameter <code>math: true</code> in content files</li>
</ul>
<p><strong>Note:</strong>   Use the online reference of <a href="https://katex.org/docs/supported.html">Supported TeX Functions</a></p>
<h3>Examples</h3>
<p>Inline math: $\varphi = \dfrac{1+\sqrt5}{2}= 1.6180339887…$</p>
<p>Block math:</p>
$$\varphi = 1+\frac{1} {1+\frac{1} {1+\frac{1} {1+\cdots} } }$$
<p>‍</p>
<div class="footnotes-defs-div"><hr class="footnotes-defs-hr" />
<ol class="footnotes-defs-ol"><li id="footnotes-def-1"><p>The above quote is excerpted from Rob Pike's <a href="https://www.youtube.com/watch?v=PAAkCSZUG1c">talk</a> during Gopherfest, November 18, 2015. <a href="#footnotes-ref-1" class="vditor-footnotes__goto-ref">↩</a></p>
</li>
</ol></div>