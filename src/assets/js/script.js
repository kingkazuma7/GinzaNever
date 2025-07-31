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
    
    // Swiperとの競合を避けるための設定
    normalScrollElements: '.gallery-slider, .swiper, .swiper-slide, .swiper-wrapper',
    
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
      
      // セクション3（ギャラリー）でSwiperを再初期化
      if (destination.index === 2) { // 0-indexed
        setTimeout(() => {
          if (window.gallerySlider) {
            window.gallerySlider.update();
            window.gallerySlider.autoplay.start();
          } else {
            initializeGallerySlider();
          }
        }, 500);
      }
    },

    // スマートフォンでのスクロール時の挙動
    onLeave: function(origin, destination, direction) {
      if (window.innerWidth <= 768) {
        return true; // スマートフォンでは通常スクロールを許可
      }
      
      // セクション3でのスクロール制御
      if (origin.index === 2) { // ギャラリーセクションから離脱
        // Swiperの自動再生を一時停止
        if (window.gallerySlider && window.gallerySlider.autoplay) {
          window.gallerySlider.autoplay.stop();
        }
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
    // スライダーが既に動作しているので、セクションタイトルのみアニメーション
    const title = section.querySelector('h2');
    if (title) {
      setTimeout(() => {
        title.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
      }, 300);
    }
    return;
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
  // スライダー要素の存在確認
  const swiperElement = document.querySelector('.gallery-slider');
  if (!swiperElement) {
    console.error('Swiper element not found');
    return;
  }

  console.log('Initializing gallery slider...');
  
  // fullPage.jsの影響を無効化
  swiperElement.style.transform = 'none';
  swiperElement.style.transition = 'none';
  
  // ギャラリースライダー（無限スクロール）
  const gallerySlider = new Swiper('.gallery-slider', {
    loop: true, // ループ有効
    slidesPerView: 1, // モバイルで1枚表示
    spaceBetween: 20,
    speed: 4000, // ループの速度（4秒で1周）
    allowTouchMove: true, // スワイプ有効（ユーザー操作可能）
    grabCursor: true, // カーソル変更
    
    // fullPage.jsとの競合回避
    touchStartPreventDefault: false,
    touchMoveStopPropagation: false,
    
    autoplay: {
      delay: 0, // 途切れなくループ
      disableOnInteraction: false, // ユーザー操作後も自動再生継続
      pauseOnMouseEnter: false, // マウスホバーでも継続
    },
    
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
        slidesPerView: 2, // PCで2枚表示
        spaceBetween: 40,
        speed: 6000, // PCでは少し遅く
      }
    },
    
    // 高級感のあるスムーズなイベント
    on: {
      init: function() {
        console.log('Swiper initialized successfully');
        
        // 初期化フラグをチェック（1度だけ実行）
        if (this.el.dataset.initialized) return;
        this.el.dataset.initialized = 'true';
        
        // スライダーを表示状態にする
        this.el.style.visibility = 'visible';
        this.el.style.opacity = '1';
        this.el.style.transform = 'none'; // fullPage.jsの影響を無効化
        
        console.log('Slides count:', this.slides.length);
        
        // fullPage.jsの影響を各スライドからも除去
        this.slides.forEach((slide, index) => {
          slide.style.opacity = '1'; // 確実に表示
          slide.style.visibility = 'visible';
          slide.style.display = 'flex';
          slide.style.position = 'relative';
          slide.style.transform = 'translateX(0)'; // X軸のみ制御
        });
        
        // 自動再生を強制開始
        if (this.autoplay) {
          this.autoplay.start();
        }
      },
      
      slideChange: function() {
        // スライド変更時のスムーズな効果
        const activeSlide = this.slides[this.activeIndex];
        if (activeSlide) {
          activeSlide.style.transform = 'translateX(0) scale(1.01)';
          setTimeout(() => {
            activeSlide.style.transform = 'translateX(0) scale(1)';
          }, 200);
        }
      },
      
      transitionStart: function() {
        // トランジション開始時 - fullPage.jsの影響を除去
        this.slides.forEach(slide => {
          slide.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
          // Y軸の変更を防ぐ
          const currentTransform = slide.style.transform;
          if (currentTransform && !currentTransform.includes('translateX')) {
            slide.style.transform = 'translateX(0)';
          }
        });
      },
      
      // エラーハンドリング
      beforeInit: function() {
        console.log('Swiper before init');
      },
      
      afterInit: function() {
        console.log('Swiper after init');
        // fullPage.jsに対してSwiper領域を通知
        if (typeof fullpage_api !== 'undefined') {
          fullpage_api.setAllowScrolling(true);
        }
      }
    }
  });
  
  // スライダーインスタンスをグローバルに保存（デバッグ用）
  window.gallerySlider = gallerySlider;
  
  return gallerySlider;
}

// 初期化関数
function initialize() {
  // まずfullPage.jsを初期化
  initializeFullPage();
  initializeMobileScroll();
  initializeLazyLoading();
  
  // fullPage.jsの初期化完了を待ってからSwiperを初期化
  setTimeout(() => {
    initializeGallerySlider();
  }, 1500);
  
  // 最初のセクションのアニメーションを実行
  setTimeout(() => {
    const firstSection = document.querySelector('.section1');
    if (firstSection) {
      animateContent(firstSection);
    }
  }, 2000);
}

// DOMContentLoadedイベントで初期化を実行
document.addEventListener('DOMContentLoaded', initialize);

// リサイズ時のスライダー再初期化
window.addEventListener('resize', function() {
  initializeGallerySlider();
});