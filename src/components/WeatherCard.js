import React from 'react';
import './WeatherCard.css';
import { getDetailedOutfitRecommendation } from '../utils/outfitHelper';

const WeatherCard = ({ weather, location, currentTime, isSelectedDate }) => {
  if (!weather) return null;

  const temperature = Math.round(weather.main.temp);
  const feelsLike = Math.round(weather.main.feels_like);
  const description = weather.weather[0]?.description || '風大';
  const outfitRecommendation = getDetailedOutfitRecommendation(weather);

  return (
    <div className="weather-card">
      <div className="location">{location}</div>
      <div className="current-time">
        {isSelectedDate ? '選中的日期' : `現在, ${currentTime}`}
      </div>
      <div className="weather-description">{description}</div>
      
      <div className="temperature-main">{temperature}°</div>
      <div className="feels-like">體感溫度 {feelsLike}°</div>
      
      {/* 穿搭建議區域 */}
      <div className="outfit-recommendation">
        <div className="outfit-title">👗 穿搭建議</div>
        <div className="outfit-item">
          <span className="outfit-label">👕 上衣：</span>
          <span className="outfit-value">{outfitRecommendation.top}</span>
        </div>
        <div className="outfit-item">
          <span className="outfit-label">👖 褲子：</span>
          <span className="outfit-value">{outfitRecommendation.pants}</span>
        </div>
        <div className="outfit-item">
          <span className="outfit-label">👟 鞋子：</span>
          <span className="outfit-value">{outfitRecommendation.shoes}</span>
        </div>
        {outfitRecommendation.accessories && outfitRecommendation.accessories.length > 0 && (
          <div className="outfit-item accessories">
            <span className="outfit-label">👜 配件：</span>
            <div className="accessories-list">
              {outfitRecommendation.accessories.map((item, idx) => (
                <span key={idx} className="accessory-item">{item}</span>
              ))}
            </div>
          </div>
        )}
        {outfitRecommendation.notes && (
          <div className="outfit-notes">💡 {outfitRecommendation.notes}</div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;

