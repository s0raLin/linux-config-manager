#!/bin/bash

# Linux 配置管理器演示脚本

echo "🎯 Linux 配置管理器演示"
echo "========================"
echo ""
echo "本项目提供两个版本："
echo ""
echo "1. 🌐 Web 版本 (Go 后端)"
echo "   - 适合服务器部署"
echo "   - 支持多用户访问"
echo "   - 支持导入/导出功能"
echo "   - 需要网络连接"
echo ""
echo "2. 🖥️  桌面版本 (Tauri + Rust 后端)"
echo "   - 适合个人使用"
echo "   - 原生桌面应用"
echo "   - 离线使用"
echo "   - 更好的系统集成"
echo ""

read -p "请选择要启动的版本 (1=Web版本, 2=桌面版本): " choice

case $choice in
    1)
        echo ""
        echo "🌐 启动 Web 版本..."
        if [ -f "start.sh" ]; then
            chmod +x start.sh
            ./start.sh
        else
            echo "❌ 未找到 start.sh 文件"
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "🖥️  启动桌面版本..."
        if [ -f "start-tauri.sh" ]; then
            chmod +x start-tauri.sh
            ./start-tauri.sh
        else
            echo "❌ 未找到 start-tauri.sh 文件"
            exit 1
        fi
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac