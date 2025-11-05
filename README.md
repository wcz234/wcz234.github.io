# Hexo 博客源码仓库

## 📁 仓库结构

这是一个标准的 Hexo 博客项目，用于生成静态博客网站。

```
blog/
├── _config.yml              # Hexo 全局配置
├── _config.landscape.yml   # Landscape 主题配置（备份）
├── package.json            # Node.js 依赖配置
├── package-lock.json       # 依赖锁定文件
├── .gitignore              # Git 忽略规则
├── deploy.sh               # 一键部署脚本
├── 博客操作指南.md         # 操作说明文档
├── scaffolds/              # 文章模板
├── source/                 # 源文件目录
│   ├── _posts/            # 文章文件
│   └── images/            # 图片资源
├── themes/                # 主题目录
└── node_modules/          # 依赖包（自动忽略）
```

## 🚀 分支说明

### hexo-source (源码分支)
- 📝 包含完整的 Hexo 源码
- 🎨 包括 Markdown 文章、配置文件、主题等
- 🛠️ 用于日常开发和维护

### hexo-blog (部署分支)
- 🌐 仅包含生成的静态文件
- 📦 由 Hexo 自动生成和部署
- ⚡ 用于 GitHub Pages 服务

## 🔄 工作流程

### 开发新文章
```bash
# 确保在 hexo-source 分支
git checkout hexo-source

# 创建新文章
hexo new "文章标题"

# 编辑文章内容
# 编辑器打开 source/_posts/文章标题.md

# 本地预览
hexo clean && hexo generate && hexo server
```

### 部署到GitHub Pages
```bash
# 确保在 hexo-source 分支
git checkout hexo-source

# 清理、生成并部署
hexo clean && hexo generate && hexo deploy
```

自动化流程：
1. `hexo clean` - 清理缓存
2. `hexo generate` - 生成静态文件
3. `hexo deploy` - 推送到 hexo-blog 分支
4. GitHub Pages 自动部署静态文件

## 📦 依赖管理

### 安装依赖
```bash
npm install
```

### 添加新依赖
```bash
npm install <package-name> --save
```

### 主题管理
```bash
# 注意：主题文件通常在 node_modules 中
# 自定义主题配置在 _config.yml 中
```

## 🌐 博客信息

- **域名**: https://wcz234.github.io
- **作者**: wcz234
- **主题**: Butterfly
- **框架**: Hexo 7.3.0

## 📞 联系方式

- GitHub: [@wcz234](https://github.com/wcz234)
- 邮箱: wcz234@users.noreply.github.com

---

*本仓库由 Hexo 自动维护 | 最后更新: 2025-11-05*