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

// ページロード後一度だけアニメーションを実行するためのIntersection Observer
const animateObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // iOS Safariのレンダリング quirksに対応するため、わずかな遅延を追加
      setTimeout(() => {
        entry.target.classList.add('is-animated');
      }, 50); // 50msの遅延
      observer.unobserve(entry.target); // 一度アニメーションしたら監視を停止
    }
  });
}, {
  root: null,
  rootMargin: '0px',
  threshold: 0.1 // 10%表示されたらアニメーション開始
});

// 縦方向の全画面Swiper（VerticalPreview）
const verticalSwiper = new Swiper('.vertical-swiper', {
  direction: 'vertical',
  slidesPerView: 1,
  spaceBetween: 0,
  mousewheel: true,
  keyboard: { enabled: true },
  pagination: {
    el: '.vertical-swiper > .swiper-pagination',
    clickable: true,
  },
  speed: 900,
  effect: 'slide',
});

// 初期化関数
function initialize() {
  initializeMobileScroll();
  initializeLazyLoading();

  // アニメーション対象のテキスト要素を監視
  document.querySelectorAll('h1, h2, p, .btn-more, .contact-info, .social-links, .logo').forEach(element => {
    element.classList.add('js-animate-text'); // アニメーションクラスを付与
    animateObserver.observe(element);
  });
}

// DOMContentLoadedイベントで初期化を実行
document.addEventListener('DOMContentLoaded', initialize);

// リサイズ時のスライダー再初期化は不要