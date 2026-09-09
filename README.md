# renyufly.github.io

Ren Yuxiang 的个人网站，基于 [Astro](https://astro.build/) 与
[Navfolio](https://github.com/dodolalorc/astro-navfolio) 构建，并部署到 GitHub Pages。

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

第三方许可信息见 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。
