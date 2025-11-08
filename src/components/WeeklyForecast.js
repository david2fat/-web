import React from 'react';
import './WeeklyForecast.css';

const WeeklyForecast = ({ forecast, onDateSelect, selectedDateWeather }) => {
  if (!forecast || !forecast.list) return null;

  // 獲取未來7天的天氣預報
  const dailyForecast = [];
  const processedDays = new Set();
  
  forecast.list.forEach((item, index) => {
    const date = new Date(item.dt * 1000);
    const dayName = date.toLocaleDateString('zh-TW', { weekday: 'short' });
    const dayKey = date.toDateString();
    
    if (!processedDays.has(dayKey) && dailyForecast.length < 7) {
      processedDays.add(dayKey);
      
      dailyForecast.push({
        day: dayName,
        date: date.getDate(),
        month: date.getMonth() + 1,
        temp: Math.round(item.main.temp),
        feelsLike: Math.round(item.main.feels_like),
        description: item.weather[0]?.description || '晴朗',
        icon: item.weather[0]?.main || 'Clear',
        windSpeed: item.wind?.speed || 0,
      });
    }
  });

  const getWeatherIcon = (icon) => {
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
    return icons[icon] || '☀️';
  };

  return (
    <div className="weekly-forecast">
      <h2 className="forecast-title">一週天氣預報</h2>
      <div className="forecast-grid">
        {dailyForecast.map((day, index) => {
          // 構建完整的天氣對象用於圖片更新
          const dayWeatherData = {
            main: {
              temp: day.temp,
              feels_like: day.feelsLike,
            },
            weather: [{
              main: day.icon,
              description: day.description,
            }],
            wind: {
              speed: day.windSpeed,
            },
          };
          
          // 檢查是否為選中的日期
          const isSelected = selectedDateWeather && 
            selectedDateWeather.main?.temp === day.temp &&
            selectedDateWeather.weather?.[0]?.main === day.icon;
          
          return (
          <div 
            key={index} 
            className={`forecast-day ${isSelected ? 'selected' : ''}`}
            onClick={() => onDateSelect && onDateSelect(dayWeatherData)}
            style={{ cursor: 'pointer' }}
          >
            <div className="day-header">
              <div className="day-name">{day.day}</div>
              <div className="day-date">{day.month}/{day.date}</div>
            </div>
            <div className="weather-icon">{getWeatherIcon(day.icon)}</div>
            <div className="day-temp">{day.temp}°</div>
            <div className="day-feels-like">體感 {day.feelsLike}°</div>
            <div className="day-description">{day.description}</div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklyForecast;

