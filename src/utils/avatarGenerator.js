/**
 * 使用本地圖片生成人物全身圖案
 * 圖片存放在 public/images/ 資料夾中
 */

// 本地圖片路徑（支持男女不同圖案）
// 使用 process.env.PUBLIC_URL 確保在開發和生產環境中都能正確載入
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const LOCAL_IMAGES = {
  // 男性圖片
  MALE: {
    SUNNY: `${PUBLIC_URL}/images/sunny.png`,
    RAINY: `${PUBLIC_URL}/images/rainy.png`,
    COOL: `${PUBLIC_URL}/images/cool.png`,
  },
  // 女性圖片
  FEMALE: {
    SUNNY: `${PUBLIC_URL}/images/sunny2.png`,
    RAINY: `${PUBLIC_URL}/images/rainy2.png`,
    COOL: `${PUBLIC_URL}/images/cool2.png`,
  },
};

// 預定義的穿搭類型配置
// 使用本地圖片，根據性別選擇
export const OUTFIT_TYPES = {
  SUNNY_SHORTS_SHORT_SLEEVE: {
    id: 'sunny_shorts_short_sleeve',
    name: '晴天 短褲短袖',
    imageKey: 'SUNNY',
  },
  SUNNY_SHORTS_LONG_SLEEVE: {
    id: 'sunny_shorts_long_sleeve',
    name: '晴天 短褲長袖',
    imageKey: 'COOL',
  },
  RAINY_LONG_PANTS_LONG_SLEEVE: {
    id: 'rainy_long_pants_long_sleeve',
    name: '雨天 長褲長袖',
    imageKey: 'RAINY',
  },
  RAINY_SHORTS_LONG_SLEEVE_BOOTS: {
    id: 'rainy_shorts_long_sleeve_boots',
    name: '雨天 短褲長袖 雨靴',
    imageKey: 'RAINY',
  },
};

/**
 * 生成特定穿搭類型的圖片 URL
 * @param {string} outfitTypeId - 穿搭類型 ID
 * @param {string} gender - 性別 ('male' 或 'female')
 * @returns {string} 圖片 URL
 */
const generateAvatarUrl = (outfitTypeId, gender = 'male') => {
  const outfitType = OUTFIT_TYPES[outfitTypeId];
  if (!outfitType) {
    // 預設返回晴天短袖短褲
    const defaultType = OUTFIT_TYPES.SUNNY_SHORTS_SHORT_SLEEVE;
    const genderImages = gender === 'female' ? LOCAL_IMAGES.FEMALE : LOCAL_IMAGES.MALE;
    return genderImages[defaultType.imageKey];
  }
  
  const genderImages = gender === 'female' ? LOCAL_IMAGES.FEMALE : LOCAL_IMAGES.MALE;
  return genderImages[outfitType.imageKey];
};

/**
 * 生成特定穿搭類型的圖片 URL
 * @param {string} outfitTypeId - 穿搭類型 ID
 * @param {string} gender - 性別 ('male' 或 'female')
 * @returns {string} 圖片 URL
 */
export const generateOutfitAvatarUrl = (outfitTypeId, gender = 'male') => {
  return generateAvatarUrl(outfitTypeId, gender);
};

/**
 * 獲取緩存的頭像 URL
 * 如果沒有緩存，生成新的並緩存
 * @param {string} outfitTypeId - 穿搭類型 ID
 */
export const getCachedAvatarUrl = (outfitTypeId = 'SUNNY_SHORTS_SHORT_SLEEVE') => {
  const cacheKey = `avatar_${outfitTypeId}`;
  
  // 嘗試從 sessionStorage 獲取緩存的 URL
  const cachedUrl = sessionStorage.getItem(cacheKey);
  
  if (cachedUrl) {
    return cachedUrl;
  }
  
  // 如果沒有緩存，生成新的 URL
  const avatarUrl = generateOutfitAvatarUrl(outfitTypeId);
  
  // 緩存到 sessionStorage（只在當前會話有效）
  sessionStorage.setItem(cacheKey, avatarUrl);
  
  return avatarUrl;
};

/**
 * 隨機選擇一個穿搭類型（可選功能）
 */
export const getRandomOutfitType = () => {
  const outfitTypeKeys = Object.keys(OUTFIT_TYPES);
  const savedType = localStorage.getItem('avatarOutfitType');
  
  if (savedType && outfitTypeKeys.includes(savedType)) {
    return savedType;
  }
  
  // 隨機選擇一個穿搭類型並保存
  const randomType = outfitTypeKeys[Math.floor(Math.random() * outfitTypeKeys.length)];
  localStorage.setItem('avatarOutfitType', randomType);
  return randomType;
};

/**
 * 根據天氣選擇合適的穿搭類型
 */
export const getOutfitTypeByWeather = (weather) => {
  if (!weather) {
    return 'SUNNY_SHORTS_SHORT_SLEEVE';
  }
  
  const temp = weather.main?.temp || 20;
  const feelsLike = weather.main?.feels_like || temp;
  const weatherMain = weather.weather?.[0]?.main || 'Clear';
  const description = weather.weather?.[0]?.description || '';
  
  const isRainy = weatherMain === 'Rain' || weatherMain === 'Drizzle' || 
                  weatherMain === 'Thunderstorm' || description.includes('雨');
  
  // 使用體感溫度作為主要判斷依據
  const effectiveTemp = feelsLike;
  
  // 根據天氣和溫度選擇穿搭類型
  if (isRainy) {
    // 雨天
    if (effectiveTemp >= 20) {
      // 雨天但溫度較高：短褲長袖雨靴
      return 'RAINY_SHORTS_LONG_SLEEVE_BOOTS';
    } else {
      // 雨天且溫度較低：長褲長袖
      return 'RAINY_LONG_PANTS_LONG_SLEEVE';
    }
  } else {
    // 晴天
    if (effectiveTemp >= 25) {
      // 很熱：短褲短袖
      return 'SUNNY_SHORTS_SHORT_SLEEVE';
    } else {
      // 較涼：短褲長袖
      return 'SUNNY_SHORTS_LONG_SLEEVE';
    }
  }
};

/**
 * 預先下載所有穿搭類型的頭像
 */
export const preloadAllOutfitAvatars = async () => {
  const outfitTypes = Object.keys(OUTFIT_TYPES);
  const promises = outfitTypes.map(async (typeKey) => {
    const outfitType = OUTFIT_TYPES[typeKey];
    const url = generateOutfitAvatarUrl(typeKey);
    const cacheKey = `avatar_url_${typeKey}`;
    
    // 檢查是否已經緩存
    const cachedUrl = sessionStorage.getItem(cacheKey);
    if (cachedUrl) {
      return { type: typeKey, url: cachedUrl };
    }
    
    try {
      // 預先載入圖片
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      
      // 緩存 URL
      sessionStorage.setItem(cacheKey, url);
      
      return { type: typeKey, url };
    } catch (error) {
      console.warn(`Failed to preload avatar for ${outfitType.name}:`, error);
      return { type: typeKey, url: null };
    }
  });
  
  return Promise.all(promises);
};

