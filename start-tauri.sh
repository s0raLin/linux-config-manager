#!/bin/bash

# Linux 配置管理器 - Tauri 版本启动脚本

echo "🚀 启动 Linux 配置管理器 (Tauri 版本)"
echo "=================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请安装 Node.js 18+ 版本"
    exit 1
fi

# 检查 pnpm
if ! command -v pnpm &> /dev/null; then
    echo "❌ 错误: 未找到 pnpm"
    echo "请运行: npm install -g pnpm"
    exit 1
fi

# 检查 Rust
if ! command -v cargo &> /dev/null; then
    echo "❌ 错误: 未找到 Rust/Cargo"
    echo "请安装 Rust: https://rustup.rs/"
    exit 1
fi

# 检查系统依赖 (仅 Linux)
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "🔍 检查系统依赖..."
    
    missing_deps=()
    
    # 检查 webkit2gtk
    if ! pkg-config --exists webkit2gtk-4.0; then
        missing_deps+=("libwebkit2gtk-4.0-dev")
    fi
    
    # 检查 gtk3
    if ! pkg-config --exists gtk+-3.0; then
        missing_deps+=("libgtk-3-dev")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo "❌ 缺少系统依赖:"
        printf '%s\n' "${missing_deps[@]}"
        echo ""
        echo "请运行以下命令安装依赖:"
        echo "sudo apt update"
        echo "sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev"
        exit 1
    fi
fi

echo "✅ 依赖检查通过"

# 检查是否已安装前端依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装前端依赖..."
    pnpm install
    if [ $? -ne 0 ]; then
        echo "❌ 前端依赖安装失败"
        exit 1
    fi
fi

echo "🎯 启动 Tauri 开发模式..."
echo "这可能需要几分钟时间来编译 Rust 代码..."
echo ""

# 启动 Tauri 开发模式
pnpm tauri:dev