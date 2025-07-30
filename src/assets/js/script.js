// fullPage.jsの初期化
function initializeFullPage() {
  new fullpage('#fullpage', {
    // ナビゲーション
    navigation: true,
    navigationPosition: 'right',
    
    // スクロール設定
    scrollingSpeed: 700,
    autoScrolling: true,
    fitToSection: true,
    
    // レスポンシブ設定
    responsiveWidth: 768,
    
    // イベントコールバック
    afterLoad: function(origin, destination, direction) {
      // セクションが読み込まれた後の処理
      const currentSection = destination.item;
      const sectionIndex = destination.index + 1;
      
      // ページネーションの更新
      document.querySelectorAll('#pagination a').forEach(a => a.classList.remove('active'));
      document.querySelector(`#pagination${sectionIndex}`).classList.add('active');
    }
  });
}

// 関数を実行
initializeFullPage();