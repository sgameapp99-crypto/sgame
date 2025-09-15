#!/bin/bash

# 玩運彩預測平台 - Nuxt3 快速啟動腳本

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日誌函數
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 檢查 Node.js 版本
check_nodejs() {
    log_info "檢查 Node.js 環境..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安裝，請先安裝 Node.js 18.x 或更高版本"
        log_info "安裝指令："
        echo "curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
        echo "sudo apt-get install -y nodejs"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        log_error "Node.js 版本過低 (當前: $(node --version))，需要 v18.x 或更高版本"
        exit 1
    fi
    
    log_success "Node.js 版本檢查通過: $(node --version)"
    log_success "npm 版本: $(npm --version)"
}

# 安裝相依套件
install_dependencies() {
    log_info "安裝 Nuxt3 相依套件..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "相依套件安裝完成"
}

# 創建環境配置文件
create_env_file() {
    log_info "創建環境配置文件..."
    
    if [ ! -f ".env" ]; then
        if [ -f "env.example" ]; then
            cp env.example .env
            log_success "已從 env.example 創建 .env 文件"
        else
            cat > .env << 'EOF'
# 應用配置
NUXT_PUBLIC_APP_TITLE=玩運彩預測平台
NUXT_PUBLIC_APP_ENV=development
NUXT_PUBLIC_APP_VERSION=1.0.0

# API 配置
NUXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NUXT_PUBLIC_API_TIMEOUT=10000

# GCP 配置
NUXT_PUBLIC_GCP_PROJECT_ID=your-project-id
NUXT_PUBLIC_GCP_REGION=asia-east1

# 第三方登入配置
NUXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
NUXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id

# 功能開關
NUXT_PUBLIC_ENABLE_MOCK_API=true
NUXT_PUBLIC_ENABLE_DEBUG_MODE=true
EOF
            log_success "已創建基本 .env 文件"
        fi
        
        log_warning "請編輯 .env 文件，設置正確的環境變數"
    else
        log_info ".env 文件已存在，跳過創建"
    fi
}

# 檢查 Git 倉庫
check_git() {
    log_info "檢查 Git 倉庫..."
    
    if [ ! -d ".git" ]; then
        log_warning "未檢測到 Git 倉庫，是否要初始化？(y/n)"
        read -p "請選擇: " init_git
        
        if [[ $init_git =~ ^[Yy]$ ]]; then
            git init
            git add .
            git commit -m "Initial commit: 玩運彩預測平台 Nuxt3 前端初始化"
            log_success "Git 倉庫初始化完成"
        fi
    else
        log_success "Git 倉庫已存在"
    fi
}

# 創建必要目錄
create_directories() {
    log_info "創建必要目錄..."
    
    # 創建公共資源目錄
    mkdir -p public/{images,icons,fonts}
    mkdir -p static
    
    # 創建 assets 目錄
    mkdir -p assets/{images,icons,fonts}
    
    log_success "目錄結構創建完成"
}

# 運行類型檢查
run_type_check() {
    log_info "準備 Nuxt3 TypeScript..."
    
    # Nuxt3 會自動生成 TypeScript 配置
    if npm run postinstall; then
        log_success "Nuxt3 TypeScript 準備完成"
    else
        log_warning "TypeScript 準備過程中出現問題，但可以繼續"
    fi
}

# 啟動開發服務器
start_dev_server() {
    log_info "準備啟動 Nuxt3 開發服務器..."
    
    log_success "Nuxt3 環境設置完成！"
    echo ""
    log_info "可用的指令："
    echo "  npm run dev          - 啟動開發服務器"
    echo "  npm run build        - 建置生產版本"
    echo "  npm run generate     - 生成靜態網站"
    echo "  npm run preview      - 預覽生產版本"
    echo "  npm run type-check   - TypeScript 類型檢查"
    echo "  npm run lint         - ESLint 代碼檢查"
    echo "  npm run format       - Prettier 代碼格式化"
    echo ""
    
    log_warning "是否要立即啟動開發服務器？(y/n)"
    read -p "請選擇: " start_server
    
    if [[ $start_server =~ ^[Yy]$ ]]; then
        log_info "正在啟動 Nuxt3 開發服務器..."
        log_info "服務器將在 http://localhost:5173 上運行"
        log_info "網絡訪問: http://10.140.0.2:5173"
        log_info "按 Ctrl+C 停止服務器"
        echo ""
        npm run dev
    else
        log_info "您可以稍後運行 'npm run dev' 來啟動開發服務器"
    fi
}

# 顯示幫助信息
show_help() {
    echo "玩運彩預測平台 - Nuxt3 快速啟動腳本"
    echo ""
    echo "用法: $0 [選項]"
    echo ""
    echo "選項:"
    echo "  -h, --help     顯示此幫助信息"
    echo "  --no-install   跳過套件安裝"
    echo "  --no-git       跳過 Git 檢查"
    echo "  --no-server    不啟動開發服務器"
    echo ""
    echo "範例:"
    echo "  $0                    # 完整設置"
    echo "  $0 --no-install       # 跳過套件安裝"
    echo "  $0 --no-server        # 設置但不啟動服務器"
}

# 主函數
main() {
    local skip_install=false
    local skip_git=false
    local skip_server=false
    
    # 解析命令行參數
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            --no-install)
                skip_install=true
                shift
                ;;
            --no-git)
                skip_git=true
                shift
                ;;
            --no-server)
                skip_server=true
                shift
                ;;
            *)
                log_error "未知參數: $1"
                show_help
                exit 1
                ;;
        esac
    done
    
    echo "🚀 玩運彩預測平台 - Nuxt3 前端環境快速設置"
    echo "=============================================="
    echo ""
    
    # 執行設置步驟
    check_nodejs
    
    if [ "$skip_install" = false ]; then
        install_dependencies
    fi
    
    create_env_file
    create_directories
    
    if [ "$skip_git" = false ]; then
        check_git
    fi
    
    run_type_check
    
    if [ "$skip_server" = false ]; then
        start_dev_server
    else
        log_success "Nuxt3 前端環境設置完成！"
        log_info "運行 'npm run dev' 來啟動開發服務器"
    fi
}

# 運行主函數
main "$@"
