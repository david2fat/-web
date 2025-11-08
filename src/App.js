import React, { useState, useEffect } from 'react';
import './App.css';
import WeatherCard from './components/WeatherCard';
import OutfitCharacter from './components/OutfitCharacter';
import WeeklyForecast from './components/WeeklyForecast';
import SatelliteView from './components/SatelliteView';
import { getCurrentWeather, getWeeklyForecast } from './services/weatherService';

// 台灣城市列表
const TAIWAN_CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '嘉義市', '新竹縣', '苗栗縣', '彰化縣',
  '南投縣', '雲林縣', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '澎湖縣', '金門縣', '連江縣', '竹北市'
];

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [location, setLocation] = useState('台北市');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDateWeather, setSelectedDateWeather] = useState(null); // 選中的日期天氣
  const [gender, setGender] = useState('male'); // 性別選擇：'male' 或 'female'
  const [showSatellite, setShowSatellite] = useState(false); // 是否顯示衛星雲圖頁面

  useEffect(() => {
    fetchWeather();
    fetchForecast();
  }, [location]);

  const fetchWeather = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getCurrentWeather(location);
      setWeather(data);
    } catch (err) {
      console.error('獲取天氣失敗:', err);
      // 如果 API 失敗，使用模擬數據作為後備
      const mockData = {
        name: location,
        main: {
          temp: 15,
          feels_like: 8,
        },
        weather: [{
          main: 'Windy',
          description: '風大',
        }],
        wind: {
          speed: 5.5,
        },
      };
      setWeather(mockData);
      setError(`無法連接到天氣服務: ${err.message}，顯示模擬數據`);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async () => {
    try {
      const data = await getWeeklyForecast(location);
      setForecast(data);
    } catch (err) {
      console.error('獲取天氣預報失敗:', err);
      // 使用模擬數據作為後備
      const mockForecast = generateMockForecast();
      setForecast(mockForecast);
    }
  };

  const generateMockForecast = () => {
    const weatherTypes = ['Clear', 'Clouds', 'Rain', 'Windy'];
    const descriptions = ['晴朗', '多雲', '下雨', '風大'];
    const list = [];
    
    for (let i = 0; i < 40; i++) {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(i / 8));
      date.setHours(9 + (i % 8) * 3, 0, 0, 0);
      
      const weatherIndex = Math.floor(Math.random() * weatherTypes.length);
      const baseTemp = 15 + Math.floor(Math.random() * 10) - 5;
      
      list.push({
        dt: Math.floor(date.getTime() / 1000),
        main: {
          temp: baseTemp,
          feels_like: baseTemp - 3,
        },
        weather: [{
          main: weatherTypes[weatherIndex],
          description: descriptions[weatherIndex],
        }],
        wind: {
          speed: 3 + Math.random() * 5,
        },
      });
    }
    
    return { list };
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours < 12 ? '上午' : '下午';
    const displayHours = hours > 12 ? hours - 12 : hours;
    return `${period}${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">載入中...</div>
      </div>
    );
  }

  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    setSelectedDateWeather(null); // 切換城市時重置選中的日期
  };

  // 處理日期選擇
  const handleDateSelect = (dateWeather) => {
    setSelectedDateWeather(dateWeather);
  };

  // 處理查看衛星雲圖
  const handleViewSatellite = () => {
    setShowSatellite(true);
  };

  // 處理返回主頁
  const handleBackFromSatellite = () => {
    setShowSatellite(false);
  };

  // 如果顯示天氣警特報與數值預報頁面，只渲染該組件
  if (showSatellite) {
    return <SatelliteView onBack={handleBackFromSatellite} location={location} />;
  }

  return (
    <div className="app">
      <div className="location-selector">
        <label htmlFor="city-select">選擇城市：</label>
        <select 
          id="city-select" 
          value={location} 
          onChange={handleLocationChange}
          className="city-select"
        >
          {TAIWAN_CITIES.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
        <label htmlFor="gender-select">性別：</label>
        <select 
          id="gender-select" 
          value={gender} 
          onChange={(e) => setGender(e.target.value)}
          className="city-select"
        >
          <option value="male">👨 男性</option>
          <option value="female">👩 女性</option>
        </select>
      </div>
      <div className="main-content">
        <WeatherCard 
          weather={selectedDateWeather || weather} 
          location={location}
          currentTime={getCurrentTime()}
          isSelectedDate={!!selectedDateWeather}
        />
        <OutfitCharacter 
          weather={selectedDateWeather || weather} 
          gender={gender}
          onViewSatellite={handleViewSatellite}
        />
      </div>
      <WeeklyForecast 
        forecast={forecast} 
        onDateSelect={handleDateSelect}
        selectedDateWeather={selectedDateWeather}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default App;

