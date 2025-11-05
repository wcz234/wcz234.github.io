@echo off
:: Hexo 博客自动化部署脚本 - Windows版

echo 🚀 Hexo 博客自动化部署开始...

:: 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="hexo-source" (
    echo ❌ 错误：请先切换到 hexo-source 分支
    echo 💡 执行: git checkout hexo-source
    pause
    exit /b 1
)

:: 检查是否有未提交的更改
git diff --exit-code >nul 2>&1
if %errorlevel% neq 0 (
    git diff --cached --exit-code >nul 2>&1
    if %errorlevel% neq 0 (
        echo 📝 发现未提交的更改，正在提交...
        git add .
        git commit -m "🎨 自动提交博客源码

🤖 Generated with Hexo Auto Deploy Script (Windows)

Co-Authored-By: Claude <noreply@anthropic.com>"
    )
)

echo 🧹 清理缓存和生成的文件...
hexo clean

echo 📝 生成静态站点文件...
hexo generate

echo 🚀 部署到 GitHub Pages ^(hexo-blog 分支^)...
hexo deploy

echo 📊 推送源码到远程仓库...
git push origin hexo-source

echo.
echo ✅ 部署完成！
echo 🌐 博客地址: https://wcz234.github.io
echo ⏳ GitHub Pages 需要时间处理，请等待 2-5 分钟
echo.
echo 📍 分支状态:
echo   - 源码分支: hexo-source ^(✅ 已推送^)
echo   - 部署分支: hexo-blog ^(✅ 已推送^)
echo.
echo 📞 访问信息:
echo   - 博客首页: https://wcz234.github.io
echo   - 源码仓库: https://github.com/wcz234/xpyqj_blog.github.io/tree/hexo-source

:: 询问是否要打开博客
set /p choice=🌐 是否要打开博客查看？^(y/n^):
if /i "%choice%"=="y" (
    start https://wcz234.github.io
    echo 🎉 已打开博客页面！
)

echo 💫 部署脚本执行完成！
pause