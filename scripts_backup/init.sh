#!/bin/bash
# 博客初始化脚本

echo "🚀 开始初始化 Hexo 博客..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "✓ Node.js 版本: $(node --version)"
echo "✓ npm 版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装项目依赖..."
npm install

# 检查安装是否成功
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 博客初始化完成！"
    echo ""
    echo "📝 常用命令："
    echo "  - 创建新文章: hexo new \"文章标题\""
    echo "  - 本地预览: hexo server"
    echo "  - 生成静态文件: hexo generate"
    echo "  - 部署到 GitHub Pages: hexo deploy"
    echo ""
    echo "或使用 Makefile 简化命令："
    echo "  - make help      # 查看所有命令"
    echo "  - make serve     # 启动本地服务器"
    echo "  - make deploy    # 部署博客"
    echo ""
else
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi
