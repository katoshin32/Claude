/* ============================================================
   冨田・島岡法律事務所 / トレントLP
   公開前に CONFIG の3項目を実際の値に差し替えてください。
   ============================================================ */

var CONFIG = {
  // LINE公式アカウントの友だち追加URL（LINE Official Account Manager で取得）
  lineUrl: 'https://lin.ee/XXXXXXX',

  // Google広告のコンバージョンラベル。'AW-1234567890/AbCdEfGhIjK' の形式。
  // コンバージョンは「LINE友だち追加」を計測対象とする方針のため、
  // LINEボタンのクリックで送信する。空文字にすると送信しない。
  gadsConversionLabel: '',

  // 電話タップも計測する場合はこちらにも別ラベルを設定する
  gadsTelConversionLabel: ''
};

(function () {
  'use strict';

  /* --- LINEボタンにURLとクリック計測を紐づける ------------------ */
  var lineButtons = document.querySelectorAll('[data-line-cta]');

  Array.prototype.forEach.call(lineButtons, function (btn, i) {
    // HTML側の href が正、CONFIG は一括上書き用。
    // JSが落ちてもボタンが死なないよう、URLはHTMLにも書いてある。
    if (CONFIG.lineUrl) {
      btn.href = CONFIG.lineUrl;
    }

    // どの位置のボタンが押されたかをGA4側で分けて見られるようにしておく
    var position = btn.closest('section, header, .sticky-cta');
    var positionId = position ? (position.id || position.className.split(' ')[0]) : 'unknown';

    btn.addEventListener('click', function () {
      track('line_friend_add', {
        cta_position: positionId,
        cta_index: i
      });
      if (CONFIG.gadsConversionLabel) {
        sendConversion(CONFIG.gadsConversionLabel);
      }
    });
  });

  /* --- 電話タップの計測 ---------------------------------------- */
  var telButtons = document.querySelectorAll('[data-tel-cta]');
  Array.prototype.forEach.call(telButtons, function (btn) {
    btn.addEventListener('click', function () {
      track('tel_tap', {});
      if (CONFIG.gadsTelConversionLabel) {
        sendConversion(CONFIG.gadsTelConversionLabel);
      }
    });
  });

  /* --- スマホ固定CTA：ファーストビューを過ぎたら出す ------------- */
  var sticky = document.getElementById('stickyCta');
  var hero = document.querySelector('.hero');

  if (sticky && hero && 'IntersectionObserver' in window) {
    sticky.hidden = false;
    var observer = new IntersectionObserver(function (entries) {
      // ファーストビューが画面外に出たら表示（ヒーロー内にも同じボタンがあるため）
      sticky.classList.toggle('is-visible', !entries[0].isIntersecting);
    }, { rootMargin: '-80px 0px 0px 0px' });
    observer.observe(hero);
  } else if (sticky) {
    sticky.hidden = false;
    sticky.classList.add('is-visible');
  }

  /* --- FAQ：開いた質問を計測（どこで迷っているかを知るため） ------ */
  var faqItems = document.querySelectorAll('.faq-item');
  Array.prototype.forEach.call(faqItems, function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;
      var q = item.querySelector('summary');
      track('faq_open', { question: q ? q.textContent.trim() : '' });
    });
  });

  /* --- 計測ヘルパー -------------------------------------------- */
  function track(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  function sendConversion(label) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: label });
    }
  }
})();
