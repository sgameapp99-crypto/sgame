#!/bin/bash
# 保存為：switch-to-production.sh

echo "=== 切換到生產環境 ==="
echo ""

# 1. 確保代碼是最新構建
echo "步驟 1: 構建最新代碼"
cd /home/gogofire1774/sgame/copy/vue
npm run build

# 2. 啟動/重啟生產環境 (8080)
echo ""
echo "步驟 2: 啟動生產環境 (Port 8080)"
pm2 restart app:preview || pm2 start ecosystem.config.cjs --only app:preview

# 3. 可選：停止開發環境以節省資源
echo ""
echo "步驟 3: 停止開發環境 (Port 5175) - 節省資源"
pm2 stop app:dev

# 4. 備份 Nginx 配置
echo ""
echo "步驟 4: 備份 Nginx 配置"
sudo cp /etc/nginx/sites-available/sgame-443.conf \
        /etc/nginx/sites-available/sgame-443.conf.bak.$(date +%Y%m%d_%H%M%S)

# 5. 修改 Nginx 指向生產環境 (8080)
echo ""
echo "步驟 5: 修改 Nginx 配置 (5175 → 8080)"
sudo sed -i 's/127\.0\.0\.1:5175/127.0.0.1:8080/g' /etc/nginx/sites-available/sgame-443.conf

# 6. 驗證配置
echo ""
echo "步驟 6: 驗證 Nginx 配置"
sudo nginx -t

if [ $? -eq 0 ]; then
    # 7. 重新載入 Nginx
    echo ""
    echo "步驟 7: 重新載入 Nginx"
    sudo systemctl reload nginx
    
    # 8. 測試
    echo ""
    echo "步驟 8: 測試服務"
    echo "---"
    sleep 2
    
    echo "測試本地訪問..."
    if curl -k -s https://127.0.0.1:443/ > /dev/null; then
        echo "✅ Nginx 本地訪問正常"
    else
        echo "❌ Nginx 本地訪問失敗"
    fi
    
    echo "測試 Cloudflare 訪問..."
    if curl -s https://app.sportspro.tw/ > /dev/null; then
        echo "✅ Cloudflare 訪問正常"
    else
        echo "❌ Cloudflare 訪問失敗"
    fi
    
    # 9. 顯示狀態
    echo ""
    echo "步驟 9: 當前服務狀態"
    echo "---"
    pm2 list
    
    echo ""
    echo "🎉 切換完成！"
    echo ""
    echo "當前配置："
    echo "  • Nginx 指向: Port 8080 (生產環境)"
    echo "  • app:preview 狀態: online"
    echo "  • app:dev 狀態: stopped (節省資源)"
    echo ""
    echo "測試訪問："
    echo "  curl https://app.sportspro.tw/"
else
    echo "❌ Nginx 配置驗證失敗，未進行切換"
    echo "正在恢復備份..."
    sudo cp /etc/nginx/sites-available/sgame-443.conf.bak.$(date +%Y%m%d_%H%M%S) \
            /etc/nginx/sites-available/sgame-443.conf
fi