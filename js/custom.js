/**
 * Winter Zen - 冬日书斋
 * 包含：雪花粒子效果 + 天气卡片Hero
 */

(function() {
  'use strict';

  /* ========================================
   * 第一部分：雪花粒子效果
   * ======================================== */

  /* V2.0 双层粒子配置 */
  const SNOW_CONFIG = {
    // 背景层星星 - 极小、慢、呼吸闪烁
    starCount: 60,
    starMinSize: 0.5,
    starMaxSize: 1.5,
    starMinSpeed: 0.05,
    starMaxSpeed: 0.15,
    // 前景层雪花 - 稍大、带光晕
    snowCount: 50,
    snowMinSize: 1,
    snowMaxSize: 3,
    snowMinSpeed: 0.3,
    snowMaxSpeed: 1.0,
    // 通用配置
    minOpacity: 0.2,
    maxOpacity: 0.7,
    windForce: 0.5,
    parallaxStrength: 0.02,
    glowEnabled: true
  };

  let snowCanvas, snowCtx;
  let stars = [];
  let snowflakes = [];
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;
  let snowAnimationId;

  /* 背景层：星星粒子（呼吸闪烁） */
  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * snowCanvas.width;
      this.y = Math.random() * snowCanvas.height;
      this.size = SNOW_CONFIG.starMinSize + Math.random() * (SNOW_CONFIG.starMaxSize - SNOW_CONFIG.starMinSize);
      this.speedY = SNOW_CONFIG.starMinSpeed + Math.random() * (SNOW_CONFIG.starMaxSpeed - SNOW_CONFIG.starMinSpeed);
      this.baseOpacity = 0.1 + Math.random() * 0.3;
      this.opacity = this.baseOpacity;
      this.breathPhase = Math.random() * Math.PI * 2;
      this.breathSpeed = 0.01 + Math.random() * 0.02;
    }
    update() {
      this.y += this.speedY;
      this.breathPhase += this.breathSpeed;
      this.opacity = this.baseOpacity + Math.sin(this.breathPhase) * 0.15;
      if (this.y > snowCanvas.height + 5) { this.y = -5; this.x = Math.random() * snowCanvas.width; }
    }
    draw() {
      snowCtx.beginPath();
      snowCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      snowCtx.fillStyle = 'rgba(255, 255, 255, ' + Math.max(0, this.opacity) + ')';
      snowCtx.fill();
    }
  }

  /* 前景层：雪花粒子（带光晕+风吹） */
  class Snowflake {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * snowCanvas.width;
      this.y = Math.random() * snowCanvas.height - snowCanvas.height;
      this.size = SNOW_CONFIG.snowMinSize + Math.random() * (SNOW_CONFIG.snowMaxSize - SNOW_CONFIG.snowMinSize);
      this.speedY = SNOW_CONFIG.snowMinSpeed + Math.random() * (SNOW_CONFIG.snowMaxSpeed - SNOW_CONFIG.snowMinSpeed);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = SNOW_CONFIG.minOpacity + Math.random() * (SNOW_CONFIG.maxOpacity - SNOW_CONFIG.minOpacity);
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = 0.01 + Math.random() * 0.02;
      this.glowSize = this.size * 2;
    }
    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * SNOW_CONFIG.windForce;
      const parallaxX = (mouseX - snowCanvas.width / 2) * SNOW_CONFIG.parallaxStrength;
      const parallaxY = (mouseY - snowCanvas.height / 2) * SNOW_CONFIG.parallaxStrength * 0.5;
      this.x += parallaxX * (this.size / SNOW_CONFIG.snowMaxSize);
      this.y += parallaxY * (this.size / SNOW_CONFIG.snowMaxSize);
      if (this.y > snowCanvas.height + 10) { this.y = -10; this.x = Math.random() * snowCanvas.width; }
      if (this.x < -10) this.x = snowCanvas.width + 10;
      if (this.x > snowCanvas.width + 10) this.x = -10;
    }
    draw() {
      if (SNOW_CONFIG.glowEnabled) {
        snowCtx.shadowBlur = this.glowSize;
        snowCtx.shadowColor = 'rgba(255, 255, 255, 0.8)';
      }
      snowCtx.beginPath();
      snowCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      snowCtx.fillStyle = 'rgba(255, 255, 255, ' + this.opacity + ')';
      snowCtx.fill();
      snowCtx.shadowBlur = 0;
    }
  }

  function initSnowCanvas() {
    snowCanvas = document.createElement('canvas');
    snowCanvas.id = 'snow-canvas';
    snowCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    document.body.insertBefore(snowCanvas, document.body.firstChild);
    snowCtx = snowCanvas.getContext('2d');
    resizeSnowCanvas();
  }

  function resizeSnowCanvas() {
    snowCanvas.width = window.innerWidth;
    snowCanvas.height = window.innerHeight;
  }

  function initParticles() {
    stars = [];
    snowflakes = [];
    for (let i = 0; i < SNOW_CONFIG.starCount; i++) {
      stars.push(new Star());
    }
    for (let i = 0; i < SNOW_CONFIG.snowCount; i++) {
      const s = new Snowflake();
      s.y = Math.random() * snowCanvas.height;
      snowflakes.push(s);
    }
  }

  function animateSnow() {
    snowCtx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    stars.forEach(s => { s.update(); s.draw(); });
    snowflakes.forEach(s => { s.update(); s.draw(); });
    snowAnimationId = requestAnimationFrame(animateSnow);
  }

  function initSnow() {
    initSnowCanvas();
    initParticles();
    animateSnow();
    window.addEventListener('mousemove', e => { targetMouseX = e.clientX; targetMouseY = e.clientY; }, { passive: true });
    window.addEventListener('resize', resizeSnowCanvas, { passive: true });
    document.addEventListener('visibilitychange', () => {
      document.hidden ? cancelAnimationFrame(snowAnimationId) : animateSnow();
    });
  }

  /* ========================================
   * 第二部分：天气卡片Hero
   * ======================================== */

  const WEATHER_POETRY = [
    { lines: ['千山鸟飞绝', '万径人踪灭'], author: '柳宗元《江雪》' },
    { lines: ['寒夜客来茶当酒', '竹炉汤沸火初红'], author: '杜耒《寒夜》' },
    { lines: ['晚来天欲雪', '能饮一杯无'], author: '白居易《问刘十九》' },
    { lines: ['孤舟蓑笠翁', '独钓寒江雪'], author: '柳宗元《江雪》' }
  ];

  function getRandomPoetry() {
    return WEATHER_POETRY[Math.floor(Math.random() * WEATHER_POETRY.length)];
  }

  function getLunarDate() {
    const lunarMonths = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];
    const lunarDays = ['初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
                       '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                       '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十'];
    const now = new Date();
    return lunarMonths[now.getMonth()] + lunarDays[Math.min(now.getDate() - 1, 29)];
  }

  function getSeasonStamp() {
    const m = new Date().getMonth() + 1;
    if (m >= 3 && m <= 5) return '春';
    if (m >= 6 && m <= 8) return '夏';
    if (m >= 9 && m <= 11) return '秋';
    return '冬';
  }

  function formatDateEN() {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // 缓存天气数据（默认显示，秒开）
  let cachedWeather = { temp: '8', condition: '晴', humidity: '65', wind: '北风 2级', aqi: 0, aqiText: '--', visibility: '10' };
  let cachedCity = '杭州';

  // 获取实时天气（Open-Meteo，免费无需key，全球数据）
  async function fetchRealWeather() {
    try {
      // 1. IP定位获取经纬度（使用ipwho.is，HTTPS免费）
      const ipRes = await fetch('https://ipwho.is/');
      const ipData = await ipRes.json();
      
      if (!ipData.success) throw new Error('IP定位失败');
      
      const city = ipData.city || '未知';
      const lat = ipData.latitude;
      const lon = ipData.longitude;
      cachedCity = city;
      console.log('[WeatherHero] 定位:', city, lat, lon);

      // 2. Open-Meteo天气API（免费、快速、无需key）
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,visibility&timezone=auto`);
      const data = await weatherRes.json();
      
      const current = data.current;
      const temp = Math.round(current.temperature_2m);
      const humidity = current.relative_humidity_2m;
      const windSpeed = Math.round(current.wind_speed_10m);
      const windDir = current.wind_direction_10m;
      const visibility = Math.round((current.visibility || 10000) / 1000);
      
      // 风向转中文
      const dirs = ['北', '东北', '东', '东南', '南', '西南', '西', '西北'];
      const windCN = dirs[Math.round(windDir / 45) % 8] + '风';
      const windLevel = windSpeed < 12 ? '2级' : windSpeed < 20 ? '3级' : windSpeed < 29 ? '4级' : '5级';
      
      // WMO天气代码转中文
      const wmoMap = {
        0: '晴', 1: '晴', 2: '多云', 3: '阴',
        45: '雾', 48: '雾', 51: '小雨', 53: '小雨', 55: '中雨',
        61: '小雨', 63: '中雨', 65: '大雨', 66: '冻雨', 67: '冻雨',
        71: '小雪', 73: '中雪', 75: '大雪', 77: '雪粒',
        80: '阵雨', 81: '阵雨', 82: '暴雨', 85: '小雪', 86: '大雪',
        95: '雷暴', 96: '雷暴', 99: '雷暴'
      };
      const condition = wmoMap[current.weather_code] || '晴';

      cachedWeather = { temp, condition, humidity, wind: windCN + ' ' + windLevel, aqi: 0, aqiText: '--', visibility };
      
      console.log('[WeatherHero] 天气获取成功:', cachedWeather);
      return { city: cachedCity, weather: cachedWeather };
    } catch (err) {
      console.error('[WeatherHero] 天气获取失败:', err);
      return { city: cachedCity, weather: cachedWeather };
    }
  }

  function getMockWeather() {
    if (cachedWeather) return cachedWeather;
    return {
      temp: '--', condition: '加载中',
      humidity: '--', wind: '--',
      aqi: 0, aqiText: '--', visibility: '--'
    };
  }

  function isHomePage() {
    const path = window.location.pathname;
    // 路径检测
    if (path === '/' || path === '/index.html' || path === '') return true;
    if (/^\/page\/\d+\/?$/.test(path)) return true;
    // body类名检测
    if (document.body.classList.contains('home')) return true;
    // 页面类型检测 (Butterfly主题)
    const pageType = window.GLOBAL_CONFIG_SITE && window.GLOBAL_CONFIG_SITE.pageType;
    if (pageType === 'home') return true;
    // DOM元素检测
    if (document.querySelector('#recent-posts')) return true;
    return false;
  }

  async function createWeatherHero() {
    // 只在首页创建
    if (!isHomePage()) {
      console.log('[WeatherHero] 非首页，跳过创建');
      return;
    }

    // 避免重复创建
    if (document.querySelector('.weather-hero')) {
      console.log('[WeatherHero] 已存在，跳过创建');
      return;
    }
    
    console.log('[WeatherHero] 开始创建天气卡片');

    const poetry = getRandomPoetry();
    const stamp = getSeasonStamp();
    const dateEN = formatDateEN();
    const dateLunar = getLunarDate();
    
    // 直接用默认值渲染（秒开），后台静默更新
    let cityName = cachedCity;
    let weather = cachedWeather;

    const heroHTML = `
    <section class="weather-hero" id="weather-hero">
      <div class="weather-hero-content">
        <div class="weather-poetry">
          <h2>${poetry.lines[0]}</h2>
          <h2>${poetry.lines[1]}</h2>
          <p class="poetry-author">—— ${poetry.author}</p>
          <div class="poetry-decoration">
            <svg width="40" height="60" viewBox="0 0 100 150" fill="currentColor" opacity="0.3">
              <path d="M50 0 L10 60 H40 L20 100 H40 L30 150 H70 L60 100 H80 L60 60 H90 Z"/>
            </svg>
          </div>
        </div>

        <div class="weather-card">
          <div class="weather-card-inner">
            <div class="corner-bl"></div>
            <div class="corner-br"></div>
            <div class="weather-stamp"><span>${stamp}</span></div>
            <div class="weather-location">
              <h1 class="weather-city" id="weather-city-name">${cityName}</h1>
              <p class="weather-date">
                <span>${dateEN}</span>
                <span class="dot"></span>
                <span>${dateLunar}</span>
              </p>
            </div>
            <div class="weather-temp">
              <div class="weather-temp-value">
                <span class="weather-temp-number">${weather.temp}</span>
                <span class="weather-temp-unit">°C</span>
              </div>
              <p class="weather-condition">${weather.condition}</p>
            </div>
            <div class="weather-divider"></div>
            <div class="weather-details">
              <div class="weather-detail-item">
                <span class="weather-detail-label">Humidity</span>
                <span class="weather-detail-value">${weather.humidity}%</span>
              </div>
              <div class="weather-detail-item">
                <span class="weather-detail-label">Wind</span>
                <span class="weather-detail-value">${weather.wind}</span>
              </div>
              <div class="weather-detail-item">
                <span class="weather-detail-label">Air Quality</span>
                <span class="weather-detail-value ${weather.aqi <= 50 ? 'good' : ''}">${weather.aqiText} ${weather.aqi}</span>
              </div>
              <div class="weather-detail-item">
                <span class="weather-detail-label">Visibility</span>
                <span class="weather-detail-value">${weather.visibility} km</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="scroll-hint" title="向下滚动">
        <i class="fas fa-chevron-down"></i>
      </div>
    </section>
    `;

    // 插入逻辑
    let inserted = false;
    
    // 插入到 main#content-inner 之前（最可靠）
    const contentInner = document.getElementById('content-inner');
    if (contentInner) {
      contentInner.insertAdjacentHTML('beforebegin', heroHTML);
      console.log('[WeatherHero] 成功插入到 #content-inner 之前');
      inserted = true;
    }
    
    // 备选：插入到 #page-header 之后
    if (!inserted) {
      const pageHeader = document.getElementById('page-header');
      if (pageHeader) {
        pageHeader.insertAdjacentHTML('afterend', heroHTML);
        console.log('[WeatherHero] 成功插入到 #page-header 之后');
        inserted = true;
      }
    }
    
    // 备选：插入到 body-wrap 开头
    if (!inserted) {
      const bodyWrap = document.getElementById('body-wrap');
      if (bodyWrap) {
        bodyWrap.insertAdjacentHTML('afterbegin', heroHTML);
        console.log('[WeatherHero] 成功插入到 #body-wrap 开头');
        inserted = true;
      }
    }
    
    if (!inserted) {
      console.log('[WeatherHero] 未找到合适的插入位置');
      return;
    }

    // 绑定滚动提示点击事件
    setTimeout(() => {
      const scrollHint = document.querySelector('.scroll-hint');
      if (scrollHint) {
        scrollHint.addEventListener('click', () => {
          const target = document.getElementById('content-inner') || 
                        document.querySelector('.recent-posts') || 
                        document.querySelector('main');
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
          }
        });
      }
    }, 100);

    // 异步获取实时天气并更新
    console.log('[WeatherHero] 开始获取实时天气...');
    fetchRealWeather().then(data => {
      console.log('[WeatherHero] 获取到天气数据:', data);
      const cityEl = document.getElementById('weather-city-name');
      const tempEl = document.querySelector('.weather-temp-number');
      const condEl = document.querySelector('.weather-condition');
      const detailEls = document.querySelectorAll('.weather-detail-value');
      
      if (cityEl) {
        console.log('[WeatherHero] 更新城市名:', data.city);
        cityEl.textContent = data.city;
      }
      if (tempEl) tempEl.textContent = data.weather.temp;
      if (condEl) condEl.textContent = data.weather.condition;
      if (detailEls[0]) detailEls[0].textContent = data.weather.humidity + '%';
      if (detailEls[1]) detailEls[1].textContent = data.weather.wind;
      if (detailEls[2]) detailEls[2].textContent = data.weather.aqiText || '--';
      if (detailEls[3]) detailEls[3].textContent = data.weather.visibility + ' km';
      
      console.log('[WeatherHero] 天气数据更新完成');
    }).catch(err => {
      console.error('[WeatherHero] 天气更新失败:', err);
    });
  }

  /* ========================================
   * 第三部分：初始化
   * ======================================== */

  function init() {
    initSnow();
    // 多次尝试创建天气卡片，确保DOM完全加载
    createWeatherHero();
    setTimeout(createWeatherHero, 300);
    setTimeout(createWeatherHero, 800);
  }

  // 立即输出调试信息
  console.log('[WeatherHero] JS文件已加载');
  console.log('[WeatherHero] 当前路径:', window.location.pathname);
  console.log('[WeatherHero] pageType:', window.GLOBAL_CONFIG_SITE ? window.GLOBAL_CONFIG_SITE.pageType : '未定义');
  
  // 确保在页面完全加载后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // 页面加载完成后再次尝试
  window.addEventListener('load', () => {
    console.log('[WeatherHero] window.load 事件触发');
    setTimeout(createWeatherHero, 100);
  });

  // Pjax支持
  document.addEventListener('pjax:complete', () => {
    const oldHero = document.querySelector('.weather-hero');
    if (oldHero) oldHero.remove();
    setTimeout(createWeatherHero, 200);
  });

})();
