#!/bin/bash
# Hexo 博客一键部署脚本

echo "🚀 开始部署 Hexo 博客到 GitHub Pages..."

# 清理之前的生成文件
echo "🧹 清理缓存..."
hexo clean

# 生成静态文件
echo "📝 生成静态文件..."
hexo generate

# 部署到 GitHub
echo "🚀 部署到 GitHub Pages..."
hexo deploy

echo "✅ 部署完成！"
echo "🌐 您的博客地址: https://wcz234.github.io"
echo "⏳ 等待 2-5 分钟让 GitHub Pages 处理..."

# 询问是否要打开博客
read -p "是否要打开博客查看？(y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    start https://wcz234.github.io
fi