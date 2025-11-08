import React, { useState, useEffect } from 'react';
import './OutfitCharacter.css';
import { 
  getOutfitTypeByWeather, 
  generateOutfitAvatarUrl,
  preloadAllOutfitAvatars 
} from '../utils/avatarGenerator';

const OutfitCharacter = ({ weather, gender = 'male', onViewSatellite }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // 組件掛載時預先下載所有穿搭類型
  useEffect(() => {
    preloadAllOutfitAvatars().catch(console.error);
  }, []);

  useEffect(() => {
    // 根據天氣獲取對應的穿搭類型頭像 URL
    setLoading(true);
    const outfitTypeKey = getOutfitTypeByWeather(weather);
    const url = generateOutfitAvatarUrl(outfitTypeKey, gender);
    
    // 直接使用 URL，不依賴緩存（因為現在使用本地圖片）
    // 預先載入圖片以確保載入完成
    const img = new Image();
    img.onload = () => {
      setAvatarUrl(url);
      setLoading(false);
    };
    img.onerror = () => {
      // 如果載入失敗，仍然設置 URL 讓瀏覽器處理
      setAvatarUrl(url);
      setLoading(false);
      console.warn('圖片載入失敗:', url);
    };
    img.src = url;
  }, [weather, gender]); // 當 weather 或 gender 改變時更新

  if (!weather) return null;

  // 獲取天氣圖標
  const getWeatherIcon = (weatherMain) => {
    const icons = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Windy': '💨',
      'Mist': '🌫️',
    };
    return icons[weatherMain] || '☀️';
  };

  const weatherMain = weather.weather?.[0]?.main || 'Clear';
  const weatherIcon = getWeatherIcon(weatherMain);

  return (
    <div className="outfit-scene">
      {/* 天氣圖標 */}
      <div className="weather-icon-overlay">
        <div className="weather-icon-badge">
          {weatherIcon}
        </div>
      </div>
      {/* 天氣警特報與颱風資訊按鈕 */}
      {onViewSatellite && (
        <button 
          className="satellite-button"
          onClick={onViewSatellite}
          title="查看天氣警特報與颱風資訊"
        >
          ⚠️ 警特報
        </button>
      )}
      {/* 角色 */}
      <div className="character">
        <div className="character-avatar">
          {loading ? (
            <div className="avatar-loading">載入中...</div>
          ) : (
            <img 
              src={avatarUrl} 
              alt="天氣穿搭角色" 
              className="avatar-image"
              key={avatarUrl} // 添加 key 確保圖片更新時重新渲染
              onError={(e) => {
                // 如果載入失敗，顯示備用方案
                console.error('圖片載入錯誤:', avatarUrl);
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="avatar-fallback">👤</div>';
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitCharacter;

