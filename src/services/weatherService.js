/**
 * 天氣 API 服務
 * 支持 OpenWeatherMap 和台灣中央氣象署 API
 */

import {
  OPENWEATHER_API_KEY,
  OPENWEATHER_BASE_URL,
  CWB_API_KEY,
  CWB_BASE_URL,
  WEATHER_API_PROVIDER,
  CITY_NAME_MAP,
} from '../config/apiConfig';

/**
 * 使用 OpenWeatherMap API 獲取天氣
 */
const fetchOpenWeather = async (location) => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API Key 未設置');
  }

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/weather?q=${location},TW&appid=${OPENWEATHER_API_KEY}&units=metric&lang=zh_tw`
  );

  if (!response.ok) {
    throw new Error(`OpenWeatherMap API 錯誤: ${response.status}`);
  }

  return await response.json();
};

/**
 * 使用 OpenWeatherMap API 獲取一週天氣預報
 */
const fetchOpenWeatherForecast = async (location) => {
  if (!OPENWEATHER_API_KEY) {
    throw new Error('OpenWeatherMap API Key 未設置');
  }

  const response = await fetch(
    `${OPENWEATHER_BASE_URL}/forecast?q=${location},TW&appid=${OPENWEATHER_API_KEY}&units=metric&lang=zh_tw`
  );

  if (!response.ok) {
    throw new Error(`OpenWeatherMap Forecast API 錯誤: ${response.status}`);
  }

  return await response.json();
};

/**
 * 使用中央氣象署 API 獲取天氣
 */
const fetchCWBWeather = async (location) => {
  if (!CWB_API_KEY) {
    throw new Error('中央氣象署 API Key 未設置');
  }

  // 轉換城市名稱
  const cityName = CITY_NAME_MAP[location] || location;
  
  // 使用一般天氣預報 API
  const response = await fetch(
    `${CWB_BASE_URL}/F-C0032-001?Authorization=${CWB_API_KEY}&locationName=${encodeURIComponent(cityName)}`
  );

  if (!response.ok) {
    throw new Error(`中央氣象署 API 錯誤: ${response.status}`);
  }

  const data = await response.json();
  
  // 轉換為與 OpenWeatherMap 相似的格式
  if (data.success === 'true' && data.records && data.records.location) {
    const locationData = data.records.location[0];
    const weatherElement = locationData.weatherElement;
    
    // 獲取溫度
    const tempElement = weatherElement.find(e => e.elementName === 'T');
    const temp = tempElement ? parseFloat(tempElement.time[0].parameter.parameterName) : 20;
    
    // 獲取天氣狀況
    const wxElement = weatherElement.find(e => e.elementName === 'Wx');
    const weatherDesc = wxElement ? wxElement.time[0].parameter.parameterName : '多雲';
    
    // 風速（中央氣象署 API 可能需要不同的處理）
    const windSpeed = 3;
    
    return {
      name: location,
      main: {
        temp: temp,
        feels_like: temp - 2, // 估算體感溫度
      },
      weather: [{
        main: getWeatherMain(weatherDesc),
        description: weatherDesc,
      }],
      wind: {
        speed: windSpeed,
      },
    };
  }
  
  throw new Error('無法解析中央氣象署 API 回應');
};

/**
 * 將中文天氣描述轉換為 OpenWeatherMap 格式
 */
const getWeatherMain = (description) => {
  const desc = description || '';
  if (desc.includes('雨')) return 'Rain';
  if (desc.includes('雪')) return 'Snow';
  if (desc.includes('雲') || desc.includes('陰')) return 'Clouds';
  if (desc.includes('晴')) return 'Clear';
  if (desc.includes('霧')) return 'Mist';
  return 'Clear';
};

/**
 * 使用中央氣象署 API 獲取一週天氣預報
 */
const fetchCWBForecast = async (location) => {
  if (!CWB_API_KEY) {
    throw new Error('中央氣象署 API Key 未設置');
  }

  const cityName = CITY_NAME_MAP[location] || location;
  
  // 使用一週天氣預報 API
  const response = await fetch(
    `${CWB_BASE_URL}/F-D0047-091?Authorization=${CWB_API_KEY}&locationName=${encodeURIComponent(cityName)}`
  );

  if (!response.ok) {
    throw new Error(`中央氣象署 Forecast API 錯誤: ${response.status}`);
  }

  const data = await response.json();
  
  // 轉換為與 OpenWeatherMap 相似的格式
  if (data.success === 'true' && data.records && data.records.locations) {
    const locations = data.records.locations[0];
    const locationData = locations.location[0];
    const weatherElement = locationData.weatherElement;
    
    const list = [];
    const tempElement = weatherElement.find(e => e.elementName === 'T');
    const wxElement = weatherElement.find(e => e.elementName === 'Wx');
    
    if (tempElement && wxElement) {
      const times = tempElement.time.slice(0, 40); // 取前 40 個時段
      
      times.forEach((time, index) => {
        const date = new Date(time.dataTime);
        const temp = parseFloat(time.elementValue[0].value);
        const weatherDesc = wxElement.time[index]?.elementValue[0].value || '多雲';
        
        list.push({
          dt: Math.floor(date.getTime() / 1000),
          main: {
            temp: temp,
            feels_like: temp - 2,
          },
          weather: [{
            main: getWeatherMain(weatherDesc),
            description: weatherDesc,
          }],
          wind: {
            speed: 3,
          },
        });
      });
    }
    
    return { list };
  }
  
  throw new Error('無法解析中央氣象署 Forecast API 回應');
};

/**
 * 獲取當前天氣
 */
export const getCurrentWeather = async (location) => {
  try {
    if (WEATHER_API_PROVIDER === 'cwb') {
      return await fetchCWBWeather(location);
    } else {
      return await fetchOpenWeather(location);
    }
  } catch (error) {
    console.error('獲取天氣失敗:', error);
    throw error;
  }
};

/**
 * 獲取一週天氣預報
 */
export const getWeeklyForecast = async (location) => {
  try {
    if (WEATHER_API_PROVIDER === 'cwb') {
      return await fetchCWBForecast(location);
    } else {
      return await fetchOpenWeatherForecast(location);
    }
  } catch (error) {
    console.error('獲取天氣預報失敗:', error);
    throw error;
  }
};

/**
 * 通用函數：獲取天氣警特報資料
 * @param {string} datasetId - 資料集 ID (例如: W-C0033-001)
 * @returns {Promise<Array>} 警報資料陣列
 */
const fetchWeatherWarningData = async (datasetId) => {
  if (!CWB_API_KEY) {
    throw new Error('中央氣象署 API Key 未設置');
  }

  try {
    const params = new URLSearchParams({
      Authorization: CWB_API_KEY,
      format: 'JSON',
      limit: '100',
      expires: 'false',
    });
    
    const apiUrl = `${CWB_BASE_URL}/${datasetId}?${params.toString()}`;
    
    console.log(`調用 ${datasetId} API:`, apiUrl.replace(CWB_API_KEY, '***'));
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API 回應錯誤 (${datasetId}):`, response.status, errorText);
      throw new Error(`${datasetId} API 錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // 檢查 API 回應格式
    if (data.success === 'true' || data.success === true) {
      if (data.records) {
        // 嘗試不同的資料結構
        if (data.records.location && Array.isArray(data.records.location)) {
          return data.records.location;
        }
        if (data.records.alert && Array.isArray(data.records.alert)) {
          return data.records.alert;
        }
        if (data.records.records && Array.isArray(data.records.records)) {
          return data.records.records;
        }
        if (Array.isArray(data.records)) {
          return data.records;
        }
      }
      if (Array.isArray(data)) {
        return data;
      }
      return [];
    }
    
    if (data.success === 'false' || data.success === false) {
      console.warn(`${datasetId} API 返回錯誤:`, data);
      return [];
    }
    
    console.warn(`${datasetId} API 回應格式異常:`, data);
    return [];
  } catch (error) {
    console.error(`獲取 ${datasetId} 失敗:`, error);
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || error.message.includes('NetworkError')) {
      console.warn('CORS 錯誤，可能是 API 不允許直接從瀏覽器訪問');
      return [];
    }
    throw error;
  }
};

/**
 * 獲取天氣警特報 - 各別縣市地區目前之天氣警特報
 * W-C0033-001
 */
export const getWeatherWarnings = async () => {
  return await fetchWeatherWarningData('W-C0033-001');
};

/**
 * 獲取天氣警特報 - 各別天氣警特報之內容及所影響之區域
 * W-C0033-002
 */
export const getWeatherWarningDetails = async () => {
  return await fetchWeatherWarningData('W-C0033-002');
};

/**
 * 獲取天氣警特報 - 豪大雨特報
 * W-C0033-003
 */
export const getHeavyRainWarnings = async () => {
  return await fetchWeatherWarningData('W-C0033-003');
};

/**
 * 獲取天氣警特報 - 低溫特報
 * W-C0033-004
 */
export const getLowTemperatureWarnings = async () => {
  return await fetchWeatherWarningData('W-C0033-004');
};

/**
 * 獲取天氣警特報 - 高溫資訊
 * W-C0033-005
 */
export const getHighTemperatureWarnings = async () => {
  return await fetchWeatherWarningData('W-C0033-005');
};

/**
 * 獲取數值預報
 * 使用中央氣象署的 F-C0032-001 資料集（一般天氣預報）
 */
export const getNumericalForecast = async (location) => {
  if (!CWB_API_KEY) {
    throw new Error('中央氣象署 API Key 未設置');
  }

  try {
    const cityName = CITY_NAME_MAP[location] || location;
    const apiUrl = `${CWB_BASE_URL}/F-C0032-001?Authorization=${CWB_API_KEY}&locationName=${encodeURIComponent(cityName)}`;
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors', // 明確指定 CORS 模式
    });

    if (!response.ok) {
      throw new Error(`數值預報 API 錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success === 'true' && data.records && data.records.location) {
      return data.records.location[0];
    }
    
    // 如果 API 返回錯誤訊息
    if (data.success === 'false') {
      console.warn('數值預報 API 返回錯誤:', data);
      return null;
    }
    
    return null;
  } catch (error) {
    console.error('獲取數值預報失敗:', error);
    // 如果是 CORS 錯誤，返回 null 而不是拋出錯誤
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS')) {
      console.warn('CORS 錯誤，可能是 API 不允許直接從瀏覽器訪問');
      return null;
    }
    throw error;
  }
};

/**
 * 獲取颱風資訊
 * 使用中央氣象署的 W-C0034-005 資料集（熱帶氣旋路徑）
 * API 文檔: https://opendata.cwa.gov.tw/dist/opendata-swagger.html
 */
export const getTyphoonInfo = async () => {
  if (!CWB_API_KEY) {
    throw new Error('中央氣象署 API Key 未設置');
  }

  try {
    // 構建 API URL，根據文檔添加參數
    const params = new URLSearchParams({
      Authorization: CWB_API_KEY,
      format: 'JSON', // 指定 JSON 格式
      limit: '100', // 限制最多回傳 100 筆
      dataset: 'analysisData,forecastData', // 包含分析資料和預報資料
    });
    
    const apiUrl = `${CWB_BASE_URL}/W-C0034-005?${params.toString()}`;
    
    console.log('調用颱風資訊 API:', apiUrl.replace(CWB_API_KEY, '***'));
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      mode: 'cors',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API 回應錯誤:', response.status, errorText);
      throw new Error(`颱風資訊 API 錯誤: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    console.log('颱風資訊 API 回應:', data);
    
    // 檢查 API 回應格式
    // 根據實際 API 回應，結構為：data.records.tropicalCyclones.tropicalCyclone
    if (data.success === 'true' || data.success === true) {
      if (data.records && data.records.tropicalCyclones) {
        const tropicalCyclones = data.records.tropicalCyclones;
        // 檢查是否有 tropicalCyclone 陣列
        if (tropicalCyclones.tropicalCyclone && Array.isArray(tropicalCyclones.tropicalCyclone)) {
          return tropicalCyclones.tropicalCyclone;
        }
        // 如果 tropicalCyclone 是單一物件，轉換為陣列
        if (tropicalCyclones.tropicalCyclone && typeof tropicalCyclones.tropicalCyclone === 'object') {
          return [tropicalCyclones.tropicalCyclone];
        }
      }
      // 如果沒有資料，返回空陣列
      return [];
    }
    
    // 如果 API 返回錯誤訊息
    if (data.success === 'false' || data.success === false) {
      console.warn('颱風資訊 API 返回錯誤:', data);
      return [];
    }
    
    // 如果沒有 success 欄位，但有意料之外的結構
    console.warn('颱風資訊 API 回應格式異常:', data);
    return [];
  } catch (error) {
    console.error('獲取颱風資訊失敗:', error);
    // 如果是 CORS 錯誤，返回空陣列而不是拋出錯誤
    if (error.message.includes('Failed to fetch') || error.message.includes('CORS') || error.message.includes('NetworkError')) {
      console.warn('CORS 錯誤，可能是 API 不允許直接從瀏覽器訪問');
      return [];
    }
    throw error;
  }
};

