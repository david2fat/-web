# Railway 部署指南 - GitHub 自動部署

## 📋 已完成的配置

1. ✅ 已添加 `serve` 包用于提供静态文件服务
2. ✅ 已创建 `railway.json` 配置文件
3. ✅ 已创建 `Procfile` 用于 Railway 部署
4. ✅ 已创建 `nixpacks.toml` 用于构建配置
5. ✅ 已配置 `.gitignore` 排除不必要的文件

## 🚀 完整部署步驟

### 步驟 1: 將代碼推送到 GitHub

在 `myweatherweb` 資料夾中執行以下命令：

```bash
# 1. 檢查 Git 狀態
git status

# 2. 如果還沒有初始化 Git 倉庫
git init
git remote add origin git@github.com:david2fat/-web.git

# 3. 檢查遠程倉庫配置
git remote -v

# 4. 添加所有文件
git add .

# 5. 提交更改
git commit -m "修復圖片載入錯誤和 React DOM 錯誤，準備 Railway 部署"

# 6. 推送到 GitHub
git branch -M main
git push -u origin main
```

**注意**：如果遠程倉庫已有內容，可能需要先拉取：
```bash
git pull origin main --allow-unrelated-histories
# 解決衝突後再推送
git push -u origin main
```

### 步驟 2: 在 Railway 中創建新項目

1. 訪問 [Railway](https://railway.app/)
2. 使用 GitHub 帳號登入
3. 點擊 **"New Project"** 或 **"+ New"**
4. 選擇 **"Deploy from GitHub repo"**
5. 選擇您的 GitHub 倉庫：`david2fat/-web`
6. Railway 會自動檢測到項目並開始部署

### 步驟 3: 設置環境變量

在 Railway 項目頁面：

1. 點擊項目進入項目詳情
2. 點擊 **"Variables"** 標籤
3. 點擊 **"+ New Variable"** 添加以下環境變量：

#### 必需的环境变量

| 變量名稱 | 值 | 說明 |
|---------|-----|------|
| `REACT_APP_WEATHER_API_PROVIDER` | `openweather` 或 `cwb` | 選擇使用的天氣 API |
| `REACT_APP_OPENWEATHER_API_KEY` | `b056d2639727215b67d7ed7f02958c67` | OpenWeatherMap API Key |
| `REACT_APP_CWB_API_KEY` | `CWA-B300F895-3D5E-4C28-B03E-11E9E94CCE39` | 中央氣象署 API Key |

4. 添加完所有變量後，Railway 會自動重新部署

### 步驟 4: 配置自動部署

Railway 預設會自動部署，但您可以確認設置：

1. 在項目頁面，點擊 **"Settings"** 標籤
2. 在 **"Source"** 部分確認：
   - ✅ **Auto Deploy** 已啟用
   - ✅ 分支設置為 `main`（或您的主要分支）

### 步驟 5: 獲取部署 URL

部署完成後，有多種方式查看您的應用網址：

#### 方法 1: 在項目設置中查看（最簡單）

1. 在 Railway 項目頁面，點擊項目名稱進入項目詳情
2. 點擊左側或頂部的 **"Settings"**（設置）標籤
3. 向下滾動到 **"Domains"**（域名）部分
4. 您會看到：
   - **自動生成的網址**：例如 `your-project-name.up.railway.app`
   - 點擊網址旁邊的 **"Open"** 按鈕可以直接打開
   - 點擊 **"Generate Domain"** 可以創建自定義域名

#### 方法 2: 在服務詳情中查看

1. 在項目頁面，點擊服務（Service）卡片
2. 在服務詳情頁面頂部，會顯示 **"Public URL"** 或 **"Domain"**
3. 點擊網址即可訪問您的應用

#### 方法 3: 在部署詳情中查看

1. 在項目頁面，點擊 **"Deployments"**（部署）標籤
2. 點擊最新的部署記錄
3. 在部署詳情頁面頂部會顯示部署的網址

#### 方法 4: 使用 Railway CLI（可選）

如果您安裝了 Railway CLI：
```bash
railway domain
```

**注意**：
- 首次部署可能需要幾分鐘才能生成網址
- 確保部署狀態為 **"Active"**（活動中）
- 如果看不到網址，檢查部署是否成功完成

## 🔄 自動部署流程

設置完成後，每次您：

1. 修改代碼並推送到 GitHub：
   ```bash
   git add .
   git commit -m "您的提交訊息"
   git push origin main
   ```

2. Railway 會自動：
   - 檢測到 GitHub 的更改
   - 開始構建項目（執行 `npm ci` 和 `npm run build`）
   - 部署構建後的靜態文件（使用 `serve -s build`）

## 📝 檢查部署狀態

1. 在 Railway 項目頁面查看 **"Deployments"** 標籤
2. 點擊最新的部署查看構建日誌
3. 如果部署失敗，檢查日誌中的錯誤訊息

## ⚠️ 常見問題

### 部署失敗：構建錯誤

**解決方法**：
- 檢查 Railway 的構建日誌
- 確保 `package.json` 中的依賴都已正確安裝
- 確認 Node.js 版本兼容（項目使用 Node.js 18）

### 部署失敗：環境變量未設置

**解決方法**：
- 確認所有必需的环境變量都已添加
- 變量名稱必須完全匹配（區分大小寫）
- 添加變量後需要重新部署

### 圖片無法載入

**解決方法**：
- 確認 `public/images/` 資料夾中的圖片已提交到 GitHub
- 檢查圖片路徑是否正確（應為 `/images/xxx.png`）

### SSH 連接問題

如果使用 SSH 推送時遇到問題：

```bash
# 測試 SSH 連接
ssh -T git@github.com

# 應該看到：Hi david2fat! You've successfully authenticated...
```

如果沒有設置 SSH，可以使用 HTTPS：
```bash
git remote set-url origin https://github.com/david2fat/-web.git
```

## 📚 相關文件

- `railway.json` - Railway 部署配置
- `nixpacks.toml` - 構建配置
- `Procfile` - 啟動命令配置
- `package.json` - 項目依賴和腳本

