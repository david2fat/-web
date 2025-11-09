/**
 * 使用本地圖片或影片生成人物全身圖案
 * 圖片存放在 public/images/ 資料夾中
 * 影片存放在 public/videos/ 資料夾中
 */

// 使用 process.env.PUBLIC_URL 確保在開發和生產環境中都能正確載入
const PUBLIC_URL = process.env.PUBLIC_URL || '';

// 本地媒體資源配置（支持圖片和影片）
// type: 'image' 或 'video'
// url: 資源路徑
const LOCAL_MEDIA = {
  // 男性資源
  MALE: {
    SUNNY: {
      type: 'image', // 或 'video'
      url: `${PUBLIC_URL}/images/sunny.png`,
      // 如果有影片，可以這樣配置：
      // type: 'video',
      // url: `${PUBLIC_URL}/videos/sunny.mp4`,
    },
    RAINY: {
      type: 'video',
      url: `${PUBLIC_URL}/videos/rainy.mp4`, // 正確的文件名應該是 rainy.mp4
      // 如果影片載入失敗，會自動回退到圖片
      fallback: {
        type: 'image',
        url: `${PUBLIC_URL}/images/rainy.png`,
      },
    },
    COOL: {
      type: 'image',
      url: `${PUBLIC_URL}/images/cool.png`,
      // url: `${PUBLIC_URL}/videos/cool.mp4`,
    },
  },
  // 女性資源
  FEMALE: {
    SUNNY: {
      type: 'image',
      url: `${PUBLIC_URL}/images/sunny2.png`,
      // url: `${PUBLIC_URL}/videos/sunny2.mp4`,
    },
    RAINY: {
      type: 'image',
      url: `${PUBLIC_URL}/images/rainy2.png`,
      // url: `${PUBLIC_URL}/videos/rainy2.mp4`,
    },
    COOL: {
      type: 'image',
      url: `${PUBLIC_URL}/images/cool2.png`,
      // url: `${PUBLIC_URL}/videos/cool2.mp4`,
    },
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
 * 生成特定穿搭類型的媒體資源配置
 * @param {string} outfitTypeId - 穿搭類型 ID
 * @param {string} gender - 性別 ('male' 或 'female')
 * @returns {Object} 媒體資源配置 { type: 'image'|'video', url: string }
 */
const generateAvatarConfig = (outfitTypeId, gender = 'male') => {
  const outfitType = OUTFIT_TYPES[outfitTypeId];
  if (!outfitType) {
    // 預設返回晴天短袖短褲
    const defaultType = OUTFIT_TYPES.SUNNY_SHORTS_SHORT_SLEEVE;
    const genderMedia = gender === 'female' ? LOCAL_MEDIA.FEMALE : LOCAL_MEDIA.MALE;
    return genderMedia[defaultType.imageKey];
  }
  
  const genderMedia = gender === 'female' ? LOCAL_MEDIA.FEMALE : LOCAL_MEDIA.MALE;
  return genderMedia[outfitType.imageKey];
};

/**
 * 生成特定穿搭類型的媒體資源配置
 * @param {string} outfitTypeId - 穿搭類型 ID
 * @param {string} gender - 性別 ('male' 或 'female')
 * @returns {Object} 媒體資源配置 { type: 'image'|'video', url: string }
 */
export const generateOutfitAvatarUrl = (outfitTypeId, gender = 'male') => {
  return generateAvatarConfig(outfitTypeId, gender);
};

/**
 * 獲取媒體資源類型（圖片或影片）
 * @param {string} outfitTypeId - 穿搭類型 ID
 * @param {string} gender - 性別 ('male' 或 'female')
 * @returns {string} 'image' 或 'video'
 */
export const getOutfitMediaType = (outfitTypeId, gender = 'male') => {
  const config = generateAvatarConfig(outfitTypeId, gender);
  return config?.type || 'image';
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
 * 預先載入所有穿搭類型的媒體資源（圖片或影片）
 */
export const preloadAllOutfitAvatars = async () => {
  const outfitTypes = Object.keys(OUTFIT_TYPES);
  const promises = outfitTypes.map(async (typeKey) => {
    const outfitType = OUTFIT_TYPES[typeKey];
    const config = generateOutfitAvatarUrl(typeKey);
    const cacheKey = `avatar_url_${typeKey}`;
    
    // 檢查是否已經緩存
    const cachedConfig = sessionStorage.getItem(cacheKey);
    if (cachedConfig) {
      try {
        return JSON.parse(cachedConfig);
      } catch {
        // 如果解析失敗，繼續預載入
      }
    }
    
    try {
      if (config.type === 'video') {
        // 預先載入影片
        const video = document.createElement('video');
        video.preload = 'metadata';
        try {
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('影片載入超時'));
            }, 5000); // 5秒超時
            
            video.onloadedmetadata = () => {
              clearTimeout(timeout);
              resolve();
            };
            video.onerror = (err) => {
              clearTimeout(timeout);
              reject(err);
            };
            video.src = config.url;
          });
          
          // 緩存配置
          sessionStorage.setItem(cacheKey, JSON.stringify(config));
          return { type: typeKey, ...config };
        } catch (videoError) {
          // 如果影片載入失敗，嘗試使用 fallback 圖片
          if (config.fallback && config.fallback.type === 'image') {
            console.warn(`影片預載入失敗，將使用備用圖片: ${outfitType.name}`);
            try {
              const img = new Image();
              await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
                img.src = config.fallback.url;
              });
              
              // 緩存 fallback 配置
              sessionStorage.setItem(cacheKey, JSON.stringify(config.fallback));
              return { type: typeKey, ...config.fallback, usedFallback: true };
            } catch (fallbackError) {
              console.warn(`備用圖片也載入失敗: ${outfitType.name}`, fallbackError);
              return { type: typeKey, ...config, error: true };
            }
          }
          // 沒有 fallback，返回錯誤標記
          console.warn(`影片預載入失敗且無備用方案: ${outfitType.name}`, videoError);
          return { type: typeKey, ...config, error: true };
        }
      } else {
        // 預先載入圖片
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = config.url;
        });
        
        // 緩存配置
        sessionStorage.setItem(cacheKey, JSON.stringify(config));
        return { type: typeKey, ...config };
      }
    } catch (error) {
      console.warn(`預載入失敗: ${outfitType.name}`, error);
      // 即使預載入失敗，也返回配置，讓組件自己處理
      return { type: typeKey, ...config, error: true };
    }
  });
  
  // 使用 Promise.allSettled 確保即使某些預載入失敗，也不會影響其他資源
  const results = await Promise.allSettled(promises);
  
  // 過濾出成功的結果
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
  
  // 記錄失敗的數量
  const failed = results.filter(result => result.status === 'rejected');
  if (failed.length > 0) {
    console.warn(`${failed.length} 個資源預載入失敗，將在需要時動態載入`);
  }
  
  return successful;
};

