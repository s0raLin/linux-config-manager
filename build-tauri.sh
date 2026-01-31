#!/bin/bash

# Linux 配置管理器 - Tauri 版本构建脚本

echo "🔨 构建 Linux 配置管理器 (Tauri 版本)"
echo "====================================="

# 检查依赖
if ! command -v pnpm &> /dev/null; then
    echo "❌ 错误: 未找到 pnpm"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "❌ 错误: 未找到 Rust/Cargo"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    pnpm install
fi

echo "🏗️  开始构建..."
echo "这可能需要几分钟时间..."

# 构建应用
pnpm tauri:build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 构建成功!"
    echo ""
    echo "📁 构建产物位置:"
    echo "   - AppImage: src-tauri/target/release/bundle/appimage/"
    echo "   - DEB 包:   src-tauri/target/release/bundle/deb/"
    echo "   - 可执行文件: src-tauri/target/release/app"
    echo ""
    echo "🚀 你可以直接运行可执行文件或安装 DEB 包"
else
    echo "❌ 构建失败"
    exit 1
fi