import React, { useState, useEffect } from 'react';
import './SatelliteView.css';
import { 
  getTyphoonInfo,
  getWeatherWarnings,
  getWeatherWarningDetails,
  getHeavyRainWarnings,
  getLowTemperatureWarnings,
  getHighTemperatureWarnings
} from '../services/weatherService';

const SatelliteView = ({ onBack, location = '台北市' }) => {
  const [typhoonInfo, setTyphoonInfo] = useState([]);
  const [weatherWarnings, setWeatherWarnings] = useState([]);
  const [warningDetails, setWarningDetails] = useState([]);
  const [heavyRainWarnings, setHeavyRainWarnings] = useState([]);
  const [lowTempWarnings, setLowTempWarnings] = useState([]);
  const [highTempWarnings, setHighTempWarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('typhoon'); // 'typhoon', 'warnings', 'details', 'heavyRain', 'lowTemp', 'highTemp'

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // 同時獲取所有天氣警特報和颱風資訊
        const [
          typhoonResult,
          warningsResult,
          detailsResult,
          heavyRainResult,
          lowTempResult,
          highTempResult
        ] = await Promise.allSettled([
          getTyphoonInfo(),
          getWeatherWarnings(),
          getWeatherWarningDetails(),
          getHeavyRainWarnings(),
          getLowTemperatureWarnings(),
          getHighTemperatureWarnings(),
        ]);
        
        // 處理各項結果
        if (typhoonResult.status === 'fulfilled') {
          setTyphoonInfo(typhoonResult.value || []);
        }
        if (warningsResult.status === 'fulfilled') {
          setWeatherWarnings(warningsResult.value || []);
        }
        if (detailsResult.status === 'fulfilled') {
          setWarningDetails(detailsResult.value || []);
        }
        if (heavyRainResult.status === 'fulfilled') {
          setHeavyRainWarnings(heavyRainResult.value || []);
        }
        if (lowTempResult.status === 'fulfilled') {
          setLowTempWarnings(lowTempResult.value || []);
        }
        if (highTempResult.status === 'fulfilled') {
          setHighTempWarnings(highTempResult.value || []);
        }
      } catch (err) {
        console.error('獲取資料失敗:', err);
        setError('無法載入資料，請稍後再試');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [location]);


  return (
    <div className="satellite-view">
      <div className="satellite-header">
        <button className="back-button" onClick={onBack}>
          ← 返回
        </button>
        <h2 className="satellite-title">天氣警特報與颱風資訊</h2>
      </div>
      
      <div className="satellite-content">
        {/* 標籤切換 */}
        <div className="tab-selector">
          <button 
            className={`tab-button ${activeTab === 'typhoon' ? 'active' : ''}`}
            onClick={() => setActiveTab('typhoon')}
          >
            🌀 颱風資訊
          </button>
          <button 
            className={`tab-button ${activeTab === 'warnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('warnings')}
          >
            ⚠️ 天氣警特報
          </button>
          <button 
            className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            📋 警報詳情
          </button>
          <button 
            className={`tab-button ${activeTab === 'heavyRain' ? 'active' : ''}`}
            onClick={() => setActiveTab('heavyRain')}
          >
            🌧️ 豪大雨特報
          </button>
          <button 
            className={`tab-button ${activeTab === 'lowTemp' ? 'active' : ''}`}
            onClick={() => setActiveTab('lowTemp')}
          >
            ❄️ 低溫特報
          </button>
          <button 
            className={`tab-button ${activeTab === 'highTemp' ? 'active' : ''}`}
            onClick={() => setActiveTab('highTemp')}
          >
            🔥 高溫資訊
          </button>
        </div>

        {loading ? (
          <div className="satellite-loading">載入中...</div>
        ) : error ? (
          <div className="satellite-error">
            <p>{error}</p>
            <div className="error-solution">
              <p>由於 CORS 限制，無法直接從瀏覽器訪問中央氣象署 API。</p>
              <p>請直接前往中央氣象署網站查看：</p>
              <div className="error-links">
                <a 
                  href="https://www.cwb.gov.tw/V8/C/P/Typhoon/Typhoon.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="error-link"
                >
                  🌀 颱風資訊
                </a>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 颱風資訊 */}
            {activeTab === 'typhoon' && (
              <div className="typhoon-section">
                {typhoonInfo.length === 0 ? (
                  <div className="no-typhoon">
                    <p>目前無活動中的颱風</p>
                    <p className="no-typhoon-sub">西北太平洋地區目前無熱帶氣旋活動</p>
                    <div className="typhoon-iframe-fallback">
                      <p>或直接查看中央氣象署網站：</p>
                      <iframe
                        src="https://www.cwb.gov.tw/V8/C/P/Typhoon/Typhoon.html"
                        title="中央氣象署颱風資訊"
                        className="typhoon-iframe"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
              <div className="typhoon-list">
                {typhoonInfo.map((typhoon, index) => {
                  // 根據實際 API 回應格式解析資料
                  const cwaTdNo = typhoon.cwaTdNo || '未知編號';
                  const cwaTyNo = typhoon.cwaTyNo || '';
                  const name = typhoon.cwaTyphoonName || typhoon.typhoonName || '未命名';
                  const year = typhoon.year || '';
                  
                  // 獲取最新的分析資料（analysisData.fix 陣列的最後一個）
                  const analysisData = typhoon.analysisData?.fix || [];
                  const latestFix = analysisData.length > 0 ? analysisData[analysisData.length - 1] : null;
                  
                  // 獲取最新的預報資料（forecastData.fix 陣列的第一個）
                  const forecastData = typhoon.forecastData?.fix || [];
                  const nextForecast = forecastData.length > 0 ? forecastData[0] : null;
                  
                  // 解析座標（格式為 "經度,緯度"）
                  const parseCoordinate = (coordinate) => {
                    if (!coordinate) return { longitude: '', latitude: '' };
                    const parts = coordinate.split(',');
                    return {
                      longitude: parts[0] || '',
                      latitude: parts[1] || '',
                    };
                  };
                  
                  const latestCoord = latestFix ? parseCoordinate(latestFix.coordinate) : { longitude: '', latitude: '' };
                  
                  return (
                    <div key={index} className="typhoon-item">
                      <div className="typhoon-header">
                        <span className="typhoon-icon">🌀</span>
                        <div className="typhoon-title">
                          <h3>{name} {year && `(${year})`}</h3>
                          <p className="typhoon-number">
                            編號：{cwaTdNo}
                            {cwaTyNo && ` / 颱風編號：${cwaTyNo}`}
                          </p>
                        </div>
                      </div>
                      
                      {/* 最新定位資料 */}
                      {latestFix && (
                        <div className="typhoon-info">
                          <h4 className="typhoon-section-title">📍 最新定位</h4>
                          <p><strong>定位時間：</strong>{latestFix.fixTime}</p>
                          {(latestCoord.latitude || latestCoord.longitude) && (
                            <p><strong>位置：</strong>緯度 {latestCoord.latitude}°N, 經度 {latestCoord.longitude}°E</p>
                          )}
                          {latestFix.maxWindSpeed && (
                            <p><strong>近中心最大風速：</strong>{latestFix.maxWindSpeed} m/s</p>
                          )}
                          {latestFix.maxGustSpeed && (
                            <p><strong>近中心最大陣風：</strong>{latestFix.maxGustSpeed} m/s</p>
                          )}
                          {latestFix.pressure && (
                            <p><strong>中心氣壓：</strong>{latestFix.pressure} hPa</p>
                          )}
                          {latestFix.movingSpeed && (
                            <p><strong>移動速度：</strong>{latestFix.movingSpeed} km/h</p>
                          )}
                          {latestFix.movingDirection && (
                            <p><strong>移動方向：</strong>{latestFix.movingDirection}</p>
                          )}
                        </div>
                      )}
                      
                      {/* 預報資料 */}
                      {nextForecast && (
                        <div className="typhoon-forecast">
                          <h4 className="typhoon-section-title">🔮 預報資料</h4>
                          <p><strong>預報時距：</strong>{nextForecast.tau} 小時</p>
                          <p><strong>預報時間：</strong>{nextForecast.initTime}</p>
                          {nextForecast.coordinate && (
                            <p><strong>預報位置：</strong>{nextForecast.coordinate}</p>
                          )}
                          {nextForecast.maxWindSpeed && (
                            <p><strong>預報最大風速：</strong>{nextForecast.maxWindSpeed} m/s</p>
                          )}
                          {nextForecast.pressure && (
                            <p><strong>預報中心氣壓：</strong>{nextForecast.pressure} hPa</p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                </div>
                )}
              </div>
            )}

            {/* 天氣警特報 - 各別縣市地區 */}
            {activeTab === 'warnings' && (
              <div className="warnings-section">
                {weatherWarnings.length === 0 ? (
                  <div className="no-warnings">
                    <p>目前無天氣警特報</p>
                    <p className="no-warnings-sub">天氣狀況良好，無需特別注意</p>
                  </div>
                ) : (
                  <div className="warnings-list">
                    {weatherWarnings.map((warning, index) => (
                      <div key={index} className="warning-item">
                        <div className="warning-header">
                          <span className="warning-icon">⚠️</span>
                          <div className="warning-title">
                            <h3>{warning.locationName || warning.CountyName || '未知地區'}</h3>
                            <p className="warning-type">{warning.hazardConditions?.hazard?.hazardType || '天氣警報'}</p>
                          </div>
                        </div>
                        {warning.hazardConditions?.hazard?.info && (
                          <div className="warning-info">
                            <p>{warning.hazardConditions.hazard.info}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 警報詳情 */}
            {activeTab === 'details' && (
              <div className="warnings-section">
                {warningDetails.length === 0 ? (
                  <div className="no-warnings">
                    <p>目前無警報詳情</p>
                  </div>
                ) : (
                  <div className="warnings-list">
                    {warningDetails.map((detail, index) => (
                      <div key={index} className="warning-item">
                        <div className="warning-header">
                          <span className="warning-icon">📋</span>
                          <div className="warning-title">
                            <h3>{detail.headline || detail.title || '警報詳情'}</h3>
                          </div>
                        </div>
                        {detail.description && (
                          <div className="warning-info">
                            <p>{detail.description}</p>
                          </div>
                        )}
                        {detail.instruction && (
                          <div className="warning-info">
                            <p><strong>注意事項：</strong>{detail.instruction}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 豪大雨特報 */}
            {activeTab === 'heavyRain' && (
              <div className="warnings-section">
                {heavyRainWarnings.length === 0 ? (
                  <div className="no-warnings">
                    <p>目前無豪大雨特報</p>
                  </div>
                ) : (
                  <div className="warnings-list">
                    {heavyRainWarnings.map((warning, index) => (
                      <div key={index} className="warning-item">
                        <div className="warning-header">
                          <span className="warning-icon">🌧️</span>
                          <div className="warning-title">
                            <h3>{warning.locationName || warning.CountyName || '未知地區'}</h3>
                            <p className="warning-type">豪大雨特報</p>
                          </div>
                        </div>
                        {warning.hazardConditions?.hazard?.info && (
                          <div className="warning-info">
                            <p>{warning.hazardConditions.hazard.info}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 低溫特報 */}
            {activeTab === 'lowTemp' && (
              <div className="warnings-section">
                {lowTempWarnings.length === 0 ? (
                  <div className="no-warnings">
                    <p>目前無低溫特報</p>
                  </div>
                ) : (
                  <div className="warnings-list">
                    {lowTempWarnings.map((warning, index) => (
                      <div key={index} className="warning-item">
                        <div className="warning-header">
                          <span className="warning-icon">❄️</span>
                          <div className="warning-title">
                            <h3>{warning.locationName || warning.CountyName || '未知地區'}</h3>
                            <p className="warning-type">低溫特報</p>
                          </div>
                        </div>
                        {warning.hazardConditions?.hazard?.info && (
                          <div className="warning-info">
                            <p>{warning.hazardConditions.hazard.info}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 高溫資訊 */}
            {activeTab === 'highTemp' && (
              <div className="warnings-section">
                {highTempWarnings.length === 0 ? (
                  <div className="no-warnings">
                    <p>目前無高溫資訊</p>
                  </div>
                ) : (
                  <div className="warnings-list">
                    {highTempWarnings.map((warning, index) => (
                      <div key={index} className="warning-item">
                        <div className="warning-header">
                          <span className="warning-icon">🔥</span>
                          <div className="warning-title">
                            <h3>{warning.locationName || warning.CountyName || '未知地區'}</h3>
                            <p className="warning-type">高溫資訊</p>
                          </div>
                        </div>
                        {warning.hazardConditions?.hazard?.info && (
                          <div className="warning-info">
                            <p>{warning.hazardConditions.hazard.info}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
        
        <div className="satellite-info">
          <p>資料來源：<a href="https://opendata.cwb.gov.tw" target="_blank" rel="noopener noreferrer">中央氣象署開放資料平台</a></p>
        </div>
      </div>
    </div>
  );
};

export default SatelliteView;

