#!/bin/bash

# Linux 配置管理器 DEB 打包脚本

set -e

echo "🚀 开始构建 DEB 包..."

# 检查依赖
check_dependencies() {
    local missing_deps=()
    
    if ! command -v dpkg-buildpackage &> /dev/null; then
        missing_deps+=("dpkg-dev")
    fi
    
    if ! command -v dh &> /dev/null; then
        missing_deps+=("debhelper")
    fi
    
    if ! command -v go &> /dev/null; then
        missing_deps+=("golang-go")
    fi
    
    if ! command -v pnpm &> /dev/null; then
        missing_deps+=("pnpm")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo "❌ 缺少以下依赖："
        printf '   %s\n' "${missing_deps[@]}"
        echo ""
        echo "请运行以下命令安装："
        echo "sudo apt update"
        echo "sudo apt install dpkg-dev debhelper golang-go"
        echo ""
        echo "安装 pnpm："
        echo "curl -fsSL https://get.pnpm.io/install.sh | sh"
        exit 1
    fi
}

# 清理之前的构建
clean_build() {
    echo "🧹 清理之前的构建文件..."
    rm -rf dist/
    rm -rf node_modules/
    rm -f backend/config-manager-backend
    rm -f ../*.deb
    rm -f ../*.changes
    rm -f ../*.buildinfo
}

# 构建项目
build_project() {
    echo "📦 安装前端依赖..."
    pnpm install
    
    echo "🎨 构建前端..."
    pnpm build
    
    echo "🔧 构建后端..."
    cd backend
    go mod tidy
    go build -o config-manager-backend cmd/server/main.go
    cd ..
}

# 设置权限
set_permissions() {
    echo "🔐 设置文件权限..."
    chmod +x debian/rules
    chmod +x debian/postinst
    chmod +x debian/prerm
    chmod +x debian/postrm
}

# 构建 DEB 包
build_deb() {
    echo "📦 构建 DEB 包..."
    dpkg-buildpackage -us -uc -b
}

# 主函数
main() {
    echo "Linux 配置管理器 DEB 打包工具"
    echo "================================"
    
    check_dependencies
    clean_build
    build_project
    set_permissions
    build_deb
    
    echo ""
    echo "✅ DEB 包构建完成！"
    echo ""
    echo "生成的文件："
    ls -la ../*.deb 2>/dev/null || echo "   未找到 .deb 文件"
    
    echo ""
    echo "安装命令："
    echo "sudo dpkg -i ../linux-config-manager_*.deb"
    echo ""
    echo "如果有依赖问题，运行："
    echo "sudo apt-get install -f"
}

# 运行主函数
main "$@"