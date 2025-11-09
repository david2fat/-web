import React, { useState, useEffect, useRef } from 'react';
import './OutfitCharacter.css';
import { 
  getOutfitTypeByWeather, 
  generateOutfitAvatarUrl,
  preloadAllOutfitAvatars 
} from '../utils/avatarGenerator';

const OutfitCharacter = ({ weather, gender = 'male', onViewSatellite }) => {
  const [mediaConfig, setMediaConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mediaError, setMediaError] = useState(false);
  const videoRef = useRef(null);

  // 組件掛載時預先下載所有穿搭類型
  useEffect(() => {
    preloadAllOutfitAvatars().catch(console.error);
  }, []);

  useEffect(() => {
    // 根據天氣獲取對應的穿搭類型媒體配置
    setLoading(true);
    setMediaError(false);
    const outfitTypeKey = getOutfitTypeByWeather(weather);
    const config = generateOutfitAvatarUrl(outfitTypeKey, gender);
    
    // 預先載入媒體資源以確保載入完成
    if (config.type === 'video') {
      // 預載入影片
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        setMediaConfig(config);
        setLoading(false);
        setMediaError(false);
      };
      video.onerror = () => {
        // 如果影片載入失敗，嘗試使用 fallback 圖片
        if (config.fallback) {
          console.warn('影片載入失敗，使用備用圖片:', config.url);
          const img = new Image();
          img.onload = () => {
            setMediaConfig(config.fallback);
            setLoading(false);
            setMediaError(false);
          };
          img.onerror = () => {
            setMediaError(true);
            setLoading(false);
            console.error('備用圖片也載入失敗:', config.fallback.url);
          };
          img.src = config.fallback.url;
        } else {
          setMediaError(true);
          setLoading(false);
          console.warn('影片載入失敗且無備用方案:', config.url);
        }
      };
      video.src = config.url;
    } else {
      // 預載入圖片
      const img = new Image();
      img.onload = () => {
        setMediaConfig(config);
        setLoading(false);
        setMediaError(false);
      };
      img.onerror = () => {
        setMediaError(true);
        setLoading(false);
        console.warn('圖片載入失敗:', config.url);
      };
      img.src = config.url;
    }
  }, [weather, gender]); // 當 weather 或 gender 改變時更新

  // 當媒體配置改變時，如果是影片則自動播放
  useEffect(() => {
    if (mediaConfig?.type === 'video' && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.warn('影片自動播放失敗:', err);
      });
    }
  }, [mediaConfig]);

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
          ) : mediaError ? (
            <div className="avatar-fallback">👤</div>
          ) : mediaConfig?.type === 'video' ? (
            <video
              ref={videoRef}
              src={mediaConfig.url}
              className="avatar-media"
              autoPlay
              loop
              muted
              playsInline
              key={mediaConfig.url}
              onError={() => {
                console.error('影片載入錯誤:', mediaConfig.url);
                setMediaError(true);
              }}
            />
          ) : (
            <img 
              src={mediaConfig?.url} 
              alt="天氣穿搭角色" 
              className="avatar-media"
              key={mediaConfig?.url}
              onError={() => {
                console.error('圖片載入錯誤:', mediaConfig?.url);
                setMediaError(true);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OutfitCharacter;

