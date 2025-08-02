// 画像の遅延読み込み設定
alert("script.jsが読み込まれました。");
// jQueryが読み込まれたか確認
if (typeof jQuery !== 'undefined') {
  alert("jQueryが読み込まれました。");
} else {
  alert("jQueryが読み込まれていません。");
}

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
  observer: true,
  observeParents: true
});

// 初期化関数
function initialize() {
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