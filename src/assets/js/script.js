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

// アニメーション実行済みフラグ
const animatedSections = new Set();

// アニメーションとコンテンツ表示の制御
function animateContent(section) {
  // セクションのインデックスを取得
  const sectionIndex = Array.from(document.querySelectorAll('.section')).indexOf(section);
  
  // すでにアニメーション済みの場合はスキップ
  if (animatedSections.has(sectionIndex)) {
    return;
  }
  
  // アニメーション済みとしてマーク
  animatedSections.add(sectionIndex);
  
  // セクション1の特別な処理（ロゴとタイトル）
  if (section.classList.contains('section1')) {
    const logo = section.querySelector('.logo');
    const title = section.querySelector('.main-title');
    
    if (logo) {
      setTimeout(() => {
        logo.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        logo.style.opacity = '1';
        logo.style.transform = 'translateY(0)';
      }, 400);
    }
    
    if (title) {
      setTimeout(() => {
        title.style.transition = 'all 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 900);
    }
    return;
  }
  
  const items = section.querySelectorAll('.gallery-item, h2, p, .btn-more, .contact-info, .social-links');
  
  // ギャラリーセクションの特別な処理
  if (section.classList.contains('section3')) {
    // スライダーのスムーズなアニメーション
    setTimeout(() => {
      const slider = section.querySelector('.gallery-slider');
      if (slider && slider.swiper) {
        const slides = slider.swiper.slides;
        slides.forEach((slide, index) => {
          // 初期状態を設定（透明から開始）
          slide.style.opacity = '0';
          slide.style.transform = 'translateY(20px)';
          
          setTimeout(() => {
            slide.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            slide.style.opacity = index < 2 ? '1' : '0.7'; // 最初の2つをアクティブに
            slide.style.transform = 'translateY(0)';
          }, index * 150);
        });
      }
    }, 200);
  }
  
  items.forEach((item, index) => {
    // 初期状態を設定（透明から開始）
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    // ふわっと現れるアニメーション
    setTimeout(() => {
      item.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 100 + 150);
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
  // ギャラリースライダー（PC: 2カラム、モバイル: 1カラム）
  const gallerySlider = new Swiper('.gallery-slider', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true, // 無限スクロール
    loopAdditionalSlides: 2, // より滑らかなループのために追加スライド
    speed: 1200, // より滑らかなスピード（1.2秒）
    effect: 'slide',
    
    // 高級感のあるイージング
    autoplay: {
      delay: 5000, // より余裕のある間隔
      disableOnInteraction: false,
      pauseOnMouseEnter: true, // マウスホバーで一時停止
    },
    
    // スムーズなトランジション設定
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    centeredSlides: false,
    
    // ページネーション
    pagination: {
      el: '.gallery-slider .swiper-pagination',
      clickable: true,
      dynamicBullets: true, // ダイナミックドット
      dynamicMainBullets: 3, // 表示するメインドット数
    },
    
    // レスポンシブ設定
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 40, // より広い間隔
        slidesPerGroup: 2,
        centeredSlides: false,
      }
    },
    
    // 高級感のあるスムーズなイベント
    on: {
      init: function() {
        // 初期化フラグをチェック（1度だけ実行）
        if (this.el.dataset.initialized) return;
        this.el.dataset.initialized = 'true';
        
        // 初期化時のふわっと現れる効果
        const slides = this.slides;
        slides.forEach((slide, index) => {
          slide.style.opacity = '0';
          slide.style.transform = 'translateY(15px)';
          setTimeout(() => {
            slide.style.transition = 'opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            slide.style.opacity = '1';
            slide.style.transform = 'translateY(0)';
          }, index * 100);
        });
      },
      
      slideChange: function() {
        // スライド変更時のスムーズな効果
        const activeSlide = this.slides[this.activeIndex];
        if (activeSlide) {
          activeSlide.style.transform = 'scale(1.01)';
          setTimeout(() => {
            activeSlide.style.transform = 'scale(1)';
          }, 200);
        }
      },
      
      transitionStart: function() {
        // トランジション開始時
        this.slides.forEach(slide => {
          slide.style.transition = 'all 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        });
      }
    }
  });
}

// 初期化関数
function initialize() {
  initializeFullPage();
  initializeMobileScroll();
  initializeLazyLoading();
  initializeGallerySlider();
  
  // 最初のセクションのアニメーションを実行
  setTimeout(() => {
    const firstSection = document.querySelector('.section1');
    if (firstSection) {
      animateContent(firstSection);
    }
  }, 1000);
}

// DOMContentLoadedイベントで初期化を実行
document.addEventListener('DOMContentLoaded', initialize);

// リサイズ時のスライダー再初期化
window.addEventListener('resize', function() {
  initializeGallerySlider();
});