@echo off
REM 博客初始化脚本 (Windows)

echo 🚀 开始初始化 Hexo 博客...
echo.

REM 检查 Node.js 是否安装
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 错误: 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

echo ✓ Node.js 已安装
node --version
npm --version
echo.

REM 安装依赖
echo 📦 安装项目依赖...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ 博客初始化完成！
    echo.
    echo 📝 常用命令：
    echo   - 创建新文章: hexo new "文章标题"
    echo   - 本地预览: hexo server
    echo   - 生成静态文件: hexo generate
    echo   - 部署到 GitHub Pages: hexo deploy
    echo.
    echo 或使用快捷脚本：
    echo   - deploy.bat    # 一键部署
    echo.
) else (
    echo ❌ 安装失败，请检查错误信息
    pause
    exit /b 1
)

pause
