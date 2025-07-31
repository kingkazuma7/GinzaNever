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
    normalScrollElements: '.gallery-grid, .modal-overlay',
    
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
        return true;
      }
    },

    // fullPage.js初期化後のコールバック
    afterRender: function() {
      console.log('fullPage.js initialized');
      // モーダルの初期化をここで実行
      setTimeout(() => {
        initializeModalGallery();
      }, 500);
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

// 初期化フラグ
let isModalInitialized = false;

// モーダルギャラリーの初期化
function initializeModalGallery() {
  if (isModalInitialized) {
    console.log('Modal already initialized, skipping...');
    return;
  }
  
  console.log('Initializing modal gallery...');
  
  const modal = document.getElementById('galleryModal');
  const openBtnPc = document.getElementById('openGalleryModal');
  const openBtnSp = document.getElementById('openGalleryModalSp');
  const closeBtn = document.getElementById('closeGalleryModal');
  
  console.log('Modal:', modal);
  console.log('Open button PC:', openBtnPc);
  console.log('Open button SP:', openBtnSp);
  console.log('Close button:', closeBtn);
  
  if (!modal || !closeBtn || (!openBtnPc && !openBtnSp)) {
    console.error('Modal elements not found:', {
      modal: !!modal,
      openBtnPc: !!openBtnPc,
      openBtnSp: !!openBtnSp,
      closeBtn: !!closeBtn
    });
    return;
  }

  let modalSwiper = null;

  // モーダルを開く
  const openModal = (e) => {
    console.log('Opening modal...');
    e.preventDefault();
    e.stopPropagation();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    console.log('Modal class added:', modal.classList.contains('active'));
    
    // fullPage.jsのスクロールを無効化
    if (typeof fullpage_api !== 'undefined') {
      fullpage_api.setAllowScrolling(false);
      fullpage_api.setKeyboardScrolling(false);
    }

    // モーダル内のスライダーを初期化
    setTimeout(() => {
      if (!modalSwiper) {
        console.log('Initializing swiper...');
        modalSwiper = new Swiper('.modal-gallery', {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          pagination: {
            el: '.modal-gallery .swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.modal-gallery .swiper-button-next',
            prevEl: '.modal-gallery .swiper-button-prev',
          },
        });
        console.log('Swiper initialized:', modalSwiper);
      }
    }, 100);
  };

  // モーダルを閉じる
  const closeModal = () => {
    console.log('Closing modal...');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    
    // fullPage.jsのスクロールを再有効化
    if (typeof fullpage_api !== 'undefined') {
      fullpage_api.setAllowScrolling(true);
      fullpage_api.setKeyboardScrolling(true);
    }
    
    // スライダーを破棄
    if (modalSwiper) {
      modalSwiper.destroy(true, true);
      modalSwiper = null;
    }
  };

  // イベントリスナーの設定（一度だけ）
  if (openBtnPc) {
    openBtnPc.addEventListener('click', openModal);
  }
  if (openBtnSp) {
    openBtnSp.addEventListener('click', openModal);
  }
  closeBtn.addEventListener('click', closeModal);
  
  console.log('Event listeners added');

  // モーダル外クリックで閉じる
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // ESCキーでモーダルを閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // 初期化完了フラグ
  isModalInitialized = true;
  console.log('Modal gallery initialized successfully');
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
  console.log('Starting initialization...');
  initializeFullPage();
  initializeMobileScroll();
  initializeLazyLoading();
  initializeGallerySlider();
  // モーダルの初期化はfullPage.jsの afterRender で実行
}

// DOMContentLoadedイベントで初期化を実行
document.addEventListener('DOMContentLoaded', initialize);

// リサイズ時のスライダー再初期化
window.addEventListener('resize', function() {
  initializeGallerySlider();
});