# renyufly.github.io

个人网站，基于 [Astro](https://astro.build/) 与
[Navfolio](https://github.com/dodolalorc/astro-navfolio) , [Navofolio使用说明](https://dodolalorc.cn/projects/astro-navfolio/)构建，并部署到 GitHub Pages。

## 本地开发

环境要求：

- Node.js 22.12 或更高版本
- Bun
- Python 3
- 项目 `.venv` 中的 FontTools 和 Brotli

安装依赖并启动开发服务器：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install --upgrade pip fonttools brotli
bun install
bun run dev
```

生产构建：

```powershell
bun run build
```

构建结果位于 `dist/`，推送到 `main` 后由 GitHub Actions 自动部署。

## 内容位置

- 站点配置：`src/config/site.toml`
- 关于页面：`src/content/about.mdx`
- 博客文章：`src/content/blog/`
- 项目内容：`src/content/projects/`

## 创建和发布博客文章

### 1. 创建文章文件

在项目根目录运行：

```powershell
bun run post:new my-first-post
```

命令会创建：

```text
src/content/blog/my-first-post.md
```

文件名会成为文章 URL 的一部分：

```text
https://renyufly.github.io/blog/my-first-post/
```

建议文件名使用小写英文、数字和连字符，不要使用空格。需要使用 MDX 时，可以运行：

```powershell
bun run post:new my-first-post --mdx
```

### 2. 填写文章信息

打开生成的文件，修改顶部两个 `---` 之间的 Frontmatter：

```yaml
---
title: 我的第一篇文章
description: 这篇文章主要介绍……
date: 2026-09-09
draft: true
language: zh-CN
sticky: false
showHeroImage: false
tags:
  - Astro
  - Web
categories:
  - 网站建设
series: []
comments: false
sidebar:
  enable: true
  toc: true
  relatedPosts: true
---
```

常用字段说明：

- `title`：文章标题。
- `description`：文章摘要，会显示在文章列表和页面元信息中。
- `date`：发布日期，可以使用 `YYYY-MM-DD`。
- `draft`：`true` 表示草稿，不会出现在生产网站；发布时改成 `false`。
- `language`：文章正文语言，可选 `en` 或 `zh-CN`。
- `sticky`：是否置顶。可以使用 `true`，也可以使用正数设置排序优先级。
- `heroImage`：封面图片。没有封面时删除该字段；本地图片可以与文章放在一起并使用 `./cover.webp`，也可以填写远程 HTTPS 图片地址。
- `showHeroImage`：是否在文章详情页显示封面。
- `tags`：标签列表。
- `categories`：分类列表。
- `series`：所属系列，例如 `series: ["Astro 学习"]`。
- `comments`：是否允许显示评论；当前站点评论功能整体关闭。
- `sidebar.toc`：是否显示文章目录。
- `sidebar.relatedPosts`：是否显示相关文章。

生成模板中的 `heroImage: ''` 如果没有替换成真实图片，请删除这一行。页面布局会自动显示 Frontmatter 中的标题，因此正文中的 `# my-first-post` 可以删除，正文建议从普通段落或二级标题开始：

````markdown
这里开始写正文。

## 第一部分

正文支持标准 Markdown，包括列表、链接、图片、表格和代码块。

```typescript
const message = 'Hello, world!';
console.log(message);
```
````

可以参考现有文章：`src/content/blog/hello-navfolio.md`。

## 创建和发布项目

### 1. 创建项目文件

在项目根目录运行：

```powershell
bun run project:new my-project
```

命令默认创建 MDX 文件：

```text
src/content/projects/my-project.mdx
```

对应的页面地址是：

```text
https://renyufly.github.io/projects/my-project/
```

`src/content/projects/index.mdx` 是项目列表页的保留文件，不要使用 `index` 作为新项目文件名，也不要用生成命令覆盖它。

如果项目只需要普通 Markdown，可以运行：

```powershell
bun run project:new my-project --md
```

### 2. 填写项目信息

项目 Frontmatter 示例：

```yaml
---
title: 我的项目
description: 项目的简短介绍。
date: 2026-09-09
draft: true
language: zh-CN
sticky: false
showHeroImage: false
icon: globe-2
authors:
  - name: Yuxiang Ren
    url: https://github.com/renyufly
links:
  - label: GitHub
    href: https://github.com/renyufly/example
    kind: github
  - label: Live Demo
    href: https://example.com
    kind: demo
tags:
  - Astro
  - TypeScript
categories:
  - Web
series: []
comments: false
sidebar:
  enable: false
  toc: true
  relatedPosts: false
---
```

项目专用字段说明：

- `icon`：项目卡片图标，可使用 `github`、`box`、`code-2`、`database`、`file-code-2`、`globe-2`、`layers-3`、`palette`、`rocket`、`sparkles`、`terminal` 或 `wand-sparkles`。
- `iconColor`：可选图标颜色，例如 `"#4f8a72"`。
- `authors`：项目作者列表，`url` 可以省略。
- `links`：项目相关链接；`kind` 可使用 `github`、`website`、`platform`、`docs` 或 `demo`。
- 其他字段与博客文章相同。

同样地，没有封面时应删除生成模板中的 `heroImage: ''`。正文可以介绍项目背景、技术方案、实现过程、使用方法和后续计划。可以参考：`src/content/projects/personal-site.md`。

## 本地预览内容

启动开发服务器：

```powershell
bunx astro dev stop    # 关闭之前(如有)
bun run dev
```

然后访问：

- 首页：<http://127.0.0.1:4321/>
- 博客：<http://127.0.0.1:4321/blog/>
- 项目：<http://127.0.0.1:4321/projects/>

草稿不会出现在文章或项目列表中。如需预览新内容，可以暂时将 `draft` 设置为 `false`，但在内容尚未准备好发布时不要提交这个修改。

提交前执行完整检查：

```powershell
bun run format:check
bun test
bun run build
```

## 发布内容

确认准备发布的文章或项目包含：

```yaml
draft: false
```

然后提交并推送。例如发布博客文章：

```powershell
git add src/content/blog/my-first-post.md
git commit -m "Add my first post"
git push origin main
```

发布项目时将路径替换为对应的项目文件：

```powershell
git add src/content/projects/my-project.mdx
git commit -m "Add my project"
git push origin main
```

推送到 `main` 后，`.github/workflows/deploy-pages.yml` 会构建并部署网站。GitHub 仓库的 Pages 发布来源应设置为 **GitHub Actions**，不要设置为从 `main` 分支直接使用 Jekyll 构建。

## 内容语言说明

网站右上角的中英文按钮只切换导航、搜索和其他系统界面，不会自动翻译博客或项目正文，也不会改变文章 URL。

每篇文章和每个项目可以独立选择正文语言：

```yaml
language: zh-CN
```

或：

```yaml
language: en
```

目前不同语言的内容会共同显示在同一个 Blog 或 Projects 列表中。如果以后需要同一篇内容的中英文版本，建议创建两个不同 slug 的文件，并在正文中互相链接。

第三方许可信息见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。

## 常用内容位置

```
src/config/site.toml        站点配置、个人资料与页面文案
src/content/about.mdx       关于页面
src/content/blog/           博客与使用手册
src/content/projects/       项目入口与项目文档
src/content/vibe/           轻量动态
src/content/media/          书、电影、剧集、专辑与播客
public/images/              Logo、头像与静态图片
```

项目提供统一的内容脚手架命令：

```
bun run post:new my-first-post
bun run project:new my-project
bun run vibe:new today-cloud
bun run media:new my-favourite-book
```

文件名会经过安全处理，并作为初始标题和输出文件名。页面模块同时拥有各自的默认模板，因此新增字段或修改 frontmatter 时，不需要改动脚手架的 TypeScript 实现。

构建结果位于 dist，可以部署到 GitHub Pages、Vercel、Netlify、Cloudflare Pages 或其他静态托管平台。仓库内置的 GitHub Actions 流程会处理项目页的 base 路径，也可以通过 SITE_URL 和 SITE_BASE 手动覆盖。
