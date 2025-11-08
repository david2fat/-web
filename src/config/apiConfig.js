/**
 * API 配置
 * 請在 .env 文件中設置您的 API Key
 */

// OpenWeatherMap API 配置
export const OPENWEATHER_API_KEY = process.env.REACT_APP_OPENWEATHER_API_KEY || '';
export const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// 調試：檢查環境變數是否正確載入
if (process.env.NODE_ENV === 'development') {
  console.log('環境變數檢查:');
  console.log('REACT_APP_OPENWEATHER_API_KEY:', process.env.REACT_APP_OPENWEATHER_API_KEY ? '已設置' : '未設置');
  console.log('REACT_APP_WEATHER_API_PROVIDER:', process.env.REACT_APP_WEATHER_API_PROVIDER || '未設置');
}

// 台灣中央氣象署 API 配置
export const CWB_API_KEY = process.env.REACT_APP_CWB_API_KEY || '';
export const CWB_BASE_URL = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore';

// 選擇使用的 API（'openweather' 或 'cwb'）
export const WEATHER_API_PROVIDER = process.env.REACT_APP_WEATHER_API_PROVIDER || 'openweather';

// 台灣城市名稱對應（用於中央氣象署 API）
export const CITY_NAME_MAP = {
  '台北市': '臺北市',
  '新北市': '新北市',
  '桃園市': '桃園市',
  '台中市': '臺中市',
  '台南市': '臺南市',
  '高雄市': '高雄市',
  '基隆市': '基隆市',
  '新竹市': '新竹市',
  '嘉義市': '嘉義市',
  '新竹縣': '新竹縣',
  '苗栗縣': '苗栗縣',
  '彰化縣': '彰化縣',
  '南投縣': '南投縣',
  '雲林縣': '雲林縣',
  '嘉義縣': '嘉義縣',
  '屏東縣': '屏東縣',
  '宜蘭縣': '宜蘭縣',
  '花蓮縣': '花蓮縣',
  '台東縣': '臺東縣',
  '澎湖縣': '澎湖縣',
  '金門縣': '金門縣',
  '連江縣': '連江縣',
  '竹北市': '新竹縣',
};

