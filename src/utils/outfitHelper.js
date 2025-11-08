/**
 * 根據天氣條件推薦穿搭（視覺用）
 */
export const getOutfitRecommendation = (weather) => {
  if (!weather) {
    return getDefaultOutfit();
  }

  const temp = weather.main.temp;
  const feelsLike = weather.main.feels_like;
  const windSpeed = weather.wind?.speed || 0;
  const weatherMain = weather.weather[0]?.main || 'Clear';

  // 使用體感溫度作為主要判斷依據
  const effectiveTemp = feelsLike;

  let outfit = {
    skinColor: '#FFDBAC',
    hairColor: '#8B4513',
    topColor: '#DC143C', // 紅色外套
    hasCollar: true,
    collarColor: '#FFB6C1', // 粉紅色領子
    pantsColor: '#4169E1', // 藍色牛仔褲
    shoesColor: '#8B4513', // 棕色靴子
  };

  // 根據溫度調整穿搭
  if (effectiveTemp >= 25) {
    // 炎熱天氣
    outfit.topColor = '#FFD700'; // 淺色短袖
    outfit.hasCollar = false;
    outfit.pantsColor = '#87CEEB'; // 淺色短褲
    outfit.shoesColor = '#FFFFFF'; // 白色涼鞋
  } else if (effectiveTemp >= 20) {
    // 溫暖天氣
    outfit.topColor = '#FFA500'; // 橙色長袖
    outfit.hasCollar = false;
    outfit.pantsColor = '#4169E1'; // 牛仔褲
    outfit.shoesColor = '#000000'; // 黑色運動鞋
  } else if (effectiveTemp >= 15) {
    // 涼爽天氣（圖片中的情況）
    outfit.topColor = '#DC143C'; // 紅色外套
    outfit.hasCollar = true;
    outfit.collarColor = '#FFB6C1'; // 粉紅色領子
    outfit.pantsColor = '#4169E1'; // 藍色牛仔褲
    outfit.shoesColor = '#8B4513'; // 棕色靴子
  } else if (effectiveTemp >= 10) {
    // 寒冷天氣
    outfit.topColor = '#191970'; // 深藍色厚外套
    outfit.hasCollar = true;
    outfit.collarColor = '#FFFFFF'; // 白色領子
    outfit.pantsColor = '#2F4F4F'; // 深色長褲
    outfit.shoesColor = '#000000'; // 黑色靴子
  } else {
    // 非常寒冷
    outfit.topColor = '#000000'; // 黑色厚外套
    outfit.hasCollar = true;
    outfit.collarColor = '#FFD700'; // 金色領子
    outfit.pantsColor = '#000000'; // 黑色長褲
    outfit.shoesColor = '#000000'; // 黑色靴子
  }

  // 根據風速調整（風大時可能需要更保暖）
  if (windSpeed > 5) {
    if (outfit.topColor === '#DC143C') {
      outfit.topColor = '#8B0000'; // 更深的紅色
    }
  }

  // 根據天氣狀況調整
  if (weatherMain === 'Rain' || weatherMain === 'Drizzle') {
    outfit.topColor = '#4169E1'; // 藍色雨衣
    outfit.shoesColor = '#000000'; // 黑色雨鞋
  } else if (weatherMain === 'Snow') {
    outfit.topColor = '#FFFFFF'; // 白色厚外套
    outfit.pantsColor = '#FFFFFF'; // 白色長褲
    outfit.shoesColor = '#000000'; // 黑色雪靴
  }

  return outfit;
};

/**
 * 根據天氣條件獲取詳細的穿搭建議（文字描述）
 */
export const getDetailedOutfitRecommendation = (weather) => {
  if (!weather) {
    return {
      top: '長袖T恤',
      pants: '牛仔褲',
      shoes: '運動鞋',
      accessories: [],
      notes: '建議根據實際體感調整',
    };
  }

  const temp = weather.main.temp;
  const feelsLike = weather.main.feels_like;
  const windSpeed = weather.wind?.speed || 0;
  const weatherMain = weather.weather[0]?.main || 'Clear';
  const description = weather.weather[0]?.description || '';

  // 使用體感溫度作為主要判斷依據
  const effectiveTemp = feelsLike;

  let recommendation = {
    top: '',
    pants: '',
    shoes: '',
    accessories: [],
    notes: '',
  };

  // 判斷是否為雨天
  const isRainy = weatherMain === 'Rain' || weatherMain === 'Drizzle' || 
                  weatherMain === 'Thunderstorm' || description.includes('雨');

  // 根據溫度推薦上衣
  if (effectiveTemp >= 28) {
    recommendation.top = '短袖T恤或背心';
    recommendation.notes = '天氣炎熱，建議穿著輕薄透氣';
  } else if (effectiveTemp >= 25) {
    recommendation.top = '短袖T恤';
    recommendation.notes = '天氣溫暖，適合輕便穿著';
  } else if (effectiveTemp >= 20) {
    recommendation.top = '長袖T恤或薄長袖';
    recommendation.notes = '天氣舒適，可搭配薄外套';
  } else if (effectiveTemp >= 15) {
    recommendation.top = '長袖上衣 + 薄外套或風衣';
    recommendation.notes = '天氣涼爽，建議多層次穿搭';
  } else if (effectiveTemp >= 10) {
    recommendation.top = '長袖上衣 + 厚外套或大衣';
    recommendation.notes = '天氣寒冷，注意保暖';
  } else {
    recommendation.top = '長袖上衣 + 厚外套或羽絨衣';
    recommendation.notes = '天氣非常寒冷，務必做好保暖';
  }

  // 根據溫度推薦褲子
  if (effectiveTemp >= 25) {
    recommendation.pants = '短褲或薄長褲';
  } else if (effectiveTemp >= 20) {
    recommendation.pants = '薄長褲或牛仔褲';
  } else if (effectiveTemp >= 15) {
    recommendation.pants = '長褲或牛仔褲';
  } else if (effectiveTemp >= 10) {
    recommendation.pants = '厚長褲或保暖褲';
  } else {
    recommendation.pants = '厚長褲或保暖褲（建議多層）';
  }

  // 根據天氣狀況推薦鞋子
  if (isRainy) {
    recommendation.shoes = '雨鞋或防水靴子';
    recommendation.accessories.push('雨傘');
    recommendation.accessories.push('雨衣或防水外套');
    recommendation.notes = '雨天建議，務必攜帶雨具';
  } else if (weatherMain === 'Snow') {
    recommendation.shoes = '防滑雪靴或厚靴子';
    recommendation.accessories.push('手套');
    recommendation.accessories.push('圍巾');
    recommendation.notes = '下雪天氣，注意防滑保暖';
  } else if (effectiveTemp >= 25) {
    recommendation.shoes = '涼鞋或透氣運動鞋';
  } else if (effectiveTemp >= 20) {
    recommendation.shoes = '運動鞋或休閒鞋';
  } else if (effectiveTemp >= 15) {
    recommendation.shoes = '運動鞋或休閒鞋';
  } else if (effectiveTemp >= 10) {
    recommendation.shoes = '靴子或保暖鞋';
  } else {
    recommendation.shoes = '厚靴子或保暖鞋';
  }

  // 根據風速添加建議
  if (windSpeed > 5) {
    recommendation.accessories.push('防風外套');
    if (!recommendation.notes.includes('風')) {
      recommendation.notes += ' 風大，建議穿著防風衣物';
    }
  }

  // 根據溫度添加配件建議
  if (effectiveTemp < 15) {
    recommendation.accessories.push('圍巾');
    recommendation.accessories.push('手套');
  }
  if (effectiveTemp < 10) {
    recommendation.accessories.push('毛帽');
  }

  // 晴天建議
  if (weatherMain === 'Clear' && effectiveTemp >= 20) {
    recommendation.accessories.push('太陽眼鏡');
    recommendation.accessories.push('帽子');
  }

  return recommendation;
};

const getDefaultOutfit = () => {
  return {
    skinColor: '#FFDBAC',
    hairColor: '#8B4513',
    topColor: '#DC143C',
    hasCollar: true,
    collarColor: '#FFB6C1',
    pantsColor: '#4169E1',
    shoesColor: '#8B4513',
  };
};

