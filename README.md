# 天氣穿搭 App

一個專為台灣設計的天氣穿搭建議 React 應用程式。

## 功能特色

- 🌤️ 即時天氣資訊顯示
- 👗 根據天氣自動推薦穿搭
- 🎨 可愛的角色和場景視覺化
- 📍 支援台灣各城市天氣查詢

## 安裝步驟

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發伺服器：
```bash
npm start
```

應用程式將在 http://localhost:3000 開啟

## 天氣 API 設定

應用程式支持兩種天氣 API：

### 方式一：OpenWeatherMap API（推薦）

1. 前往 [OpenWeatherMap](https://openweathermap.org/api) 註冊帳號
2. 獲取免費 API Key
3. 創建 `.env` 文件（複製 `.env.example`）
4. 在 `.env` 文件中設置：
   ```
   REACT_APP_WEATHER_API_PROVIDER=openweather
   REACT_APP_OPENWEATHER_API_KEY=your_api_key_here
   ```

### 方式二：台灣中央氣象署 API（免費）

1. 前往 [中央氣象署開放資料平台](https://opendata.cwb.gov.tw/) 註冊帳號
2. 登入後點擊「取得授權碼」獲取 API Key
3. 創建 `.env` 文件（複製 `.env.example`）
4. 在 `.env` 文件中設置：
   ```
   REACT_APP_WEATHER_API_PROVIDER=cwb
   REACT_APP_CWB_API_KEY=your_api_key_here
   ```

### 注意事項

- `.env` 文件已加入 `.gitignore`，不會被提交到版本控制
- 如果未設置 API Key，應用程式會使用模擬數據作為後備
- 重新啟動開發伺服器後，環境變數才會生效

## 專案結構

```
src/
  ├── App.js              # 主應用程式組件
  ├── App.css             # 主樣式
  ├── components/         # React 組件
  │   ├── WeatherCard.js  # 天氣資訊卡片
  │   └── OutfitCharacter.js # 穿搭角色組件
  └── utils/
      └── outfitHelper.js # 穿搭建議邏輯
```

## 技術棧

- React 18
- CSS3
- OpenWeatherMap API（可選）

## 授權

MIT License

