#!/bin/bash

# SSL 管理腳本
# 用於管理 Vite 開發服務器的 HTTPS 配置

set -e

cd "$(dirname "$0")"

show_help() {
    echo "SSL 管理腳本"
    echo ""
    echo "用法: $0 [command]"
    echo ""
    echo "命令:"
    echo "  enable    啟用 HTTPS"
    echo "  disable   停用 HTTPS"
    echo "  restart   重啟服務器"
    echo "  status    查看當前狀態"
    echo "  help      顯示此幫助信息"
}

enable_https() {
    echo "啟用 HTTPS..."
    sed -i 's/VITE_HTTPS=.*/VITE_HTTPS=true/' .env
    pm2 restart all
    echo "HTTPS 已啟用！"
    echo "請使用 https://34.80.28.226:5175 訪問"
}

disable_https() {
    echo "停用 HTTPS..."
    sed -i 's/VITE_HTTPS=.*/VITE_HTTPS=false/' .env
    pm2 restart all
    echo "HTTPS 已停用！"
    echo "請使用 http://34.80.28.226:5175 訪問"
}

restart_server() {
    echo "重啟服務器..."
    pm2 restart all
    echo "服務器已重啟！"
}

show_status() {
    echo "當前狀態:"
    pm2 list
    echo ""
    echo "環境配置:"
    grep -E "VITE_HTTPS|VITE_DEV_PORT" .env || echo "環境配置未找到"
    echo ""
    echo "SSL 證書:"
    if [ -f "ssl/cert.pem" ] && [ -f "ssl/key.pem" ]; then
        echo "✅ SSL 證書存在"
        openssl x509 -in ssl/cert.pem -noout -subject -dates 2>/dev/null | head -3 || echo "無法讀取證書信息"
    else
        echo "❌ SSL 證書不存在"
    fi
}

case "${1:-help}" in
    enable)
        enable_https
        ;;
    disable)
        disable_https
        ;;
    restart)
        restart_server
        ;;
    status)
        show_status
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        echo "錯誤: 未知命令 '$1'"
        echo ""
        show_help
        exit 1
        ;;
esac
