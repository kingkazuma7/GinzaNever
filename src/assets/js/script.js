// fullPage.jsの初期化と設定を管理する関数
function initializeFullPage() {
  const fpOptions = {
    // 基本設定
    licenseKey: 'YOUR_KEY_HERE',
    navigation: true,
    navigationPosition: 'right',
    
    // スクロール設定
    scrollingSpeed: 700,
    autoScrolling: true,
    fitToSection: true,
    scrollBar: false,
    
    // タッチデバイス設定
    touchSensitivity: 15,
    normalScrollElements: '.gallery-grid',
    
    // レスポンシブ設定
    responsiveWidth: 768,
    responsiveHeight: 500,
    
    // スマートフォン時の設定
    afterResponsive: function(isResponsive) {
      // スマートフォンでもフルページスクロールを適用
      fullpage_api.setAutoScrolling(true);
      fullpage_api.setFitToSection(true);
    },
    
    // アニメーション設定
    afterLoad: function(origin, destination, direction) {
      animateContent(destination.item);
    },

    // スマートフォンでのスクロール時の挙動
    onLeave: function(origin, destination, direction) {
      if (window.innerWidth <= 768) {
        return true; // スマートフォンでは通常スクロールを許可
      }
    }
  };

  // fullPage.jsの初期化
  new fullpage('#fullpage', fpOptions);
}

// コンテンツのアニメーション処理
function animateContent(section) {
  const contentElements = section.querySelectorAll('.content');
  contentElements.forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  });
}

// スマートフォンでのスクロール位置調整
function initializeMobileScroll() {
  if (window.innerWidth <= 768) {
    let scrollTimeout;
    
    document.addEventListener('scroll', function() {
      // スクロール中のパフォーマンス最適化のためにデバウンス処理を追加
      if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
      }

      scrollTimeout = window.requestAnimationFrame(function() {
        adjustScrollPosition();
      });
    }, { passive: true });
  }
}

// スクロール位置の調整処理
function adjustScrollPosition() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    const rect = section.getBoundingClientRect();
    if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

// 画像の遅延読み込み設定
function initializeLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) {
    images.forEach(img => {
      img.setAttribute('loading', 'lazy');
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }
}

// ギャラリースライダーの初期化
function initializeGallerySlider() {
  if (window.innerWidth < 769) {
    new Swiper('.gallery-slider-sp', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
    });
  }
}

// 初期化関数
function initialize() {
  initializeFullPage();
  initializeMobileScroll();
  initializeLazyLoading();
  initializeGallerySlider();
}

// DOMContentLoadedイベントで初期化を実行
document.addEventListener('DOMContentLoaded', initialize);

// リサイズ時のスライダー再初期化
window.addEventListener('resize', function() {
  initializeGallerySlider();
});