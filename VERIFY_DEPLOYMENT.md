# 驗證 Railway 部署中的文件

## 📋 如何確認 Railway 部署中是否有 `rainy2.mp4` 文件

### 方法 1: 直接訪問文件 URL（最簡單）

部署完成後，在瀏覽器中直接訪問：

```
https://您的Railway域名/videos/rainy2.mp4
```

**例如**：
- 如果您的 Railway 域名是 `your-app.up.railway.app`
- 訪問：`https://your-app.up.railway.app/videos/rainy2.mp4`

**結果判斷**：
- ✅ **成功**：如果文件存在，瀏覽器會開始下載或播放影片
- ❌ **失敗**：如果文件不存在，會顯示 404 錯誤頁面

### 方法 2: 檢查構建日誌

1. 登入 [Railway](https://railway.app/)
2. 進入您的項目
3. 點擊 **"Deployments"** 標籤
4. 點擊最新的部署記錄
5. 查看構建日誌，搜索 `rainy2.mp4`

**在日誌中查找**：
```
Copying files...
public/videos/rainy2.mp4
```

### 方法 3: 使用瀏覽器開發者工具

1. 打開您的應用網站
2. 按 `F12` 打開開發者工具
3. 切換到 **"Network"**（網路）標籤
4. 選擇女性角色和雨天天氣
5. 查看是否有請求 `rainy2.mp4`
6. 檢查請求狀態：
   - ✅ **200 OK**：文件存在且載入成功
   - ❌ **404 Not Found**：文件不存在

### 方法 4: 檢查本地 Git 提交

確認文件已經提交到 Git：

```bash
cd myweatherweb
git ls-files public/videos/rainy2.mp4
```

如果命令有輸出，表示文件已經在 Git 中。

### 方法 5: 檢查構建後的 build 目錄（本地測試）

在本地構建並檢查：

```bash
cd myweatherweb
npm run build
ls build/videos/rainy2.mp4
```

如果文件存在，表示構建過程正確。

## 🔍 常見問題排查

### 問題 1: 文件在本地但部署後找不到

**可能原因**：
- 文件沒有提交到 Git
- `.gitignore` 排除了文件
- 文件路徑不正確

**解決方法**：
```bash
# 檢查文件是否在 Git 中
git ls-files public/videos/rainy2.mp4

# 如果沒有，添加並提交
git add public/videos/rainy2.mp4
git commit -m "添加 rainy2.mp4 影片文件"
git push origin main
```

### 問題 2: 文件太大導致部署失敗

**檢查方法**：
```bash
# 查看文件大小
ls -lh public/videos/rainy2.mp4
```

**建議**：
- 單個文件建議 < 10MB
- 如果太大，考慮壓縮影片

### 問題 3: 配置錯誤

確認 `src/utils/avatarGenerator.js` 中的配置：

```javascript
FEMALE: {
  RAINY: {
    type: 'video',  // 必須是 'video'
    url: `${PUBLIC_URL}/videos/rainy2.mp4`,  // 路徑正確
    fallback: {
      type: 'image',
      url: `${PUBLIC_URL}/images/rainy2.png`,
    },
  },
}
```

## ✅ 快速驗證清單

- [ ] 本地文件存在：`public/videos/rainy2.mp4`
- [ ] 文件已提交到 Git：`git ls-files public/videos/rainy2.mp4` 有輸出
- [ ] 配置正確：`type: 'video'` 且 `url` 正確
- [ ] 已推送到 GitHub
- [ ] Railway 部署成功
- [ ] 可以直接訪問文件 URL
- [ ] 應用中選擇女性+雨天時能正常顯示

## 📝 注意事項

1. **文件路徑**：確保路徑是 `/videos/rainy2.mp4`（不是 `/public/videos/rainy2.mp4`）
2. **大小寫**：文件名大小寫必須完全匹配
3. **文件格式**：確保是有效的 MP4 文件
4. **部署時間**：首次包含大文件的部署可能需要更長時間

