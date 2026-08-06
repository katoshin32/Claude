'use client';

/* ============================================================
   トレントLP（改修版）
   このファイルを app/page.tsx にそのまま上書きしてください。

   layout.tsx 側は変更不要です。
     ・Googleタグ（GA4 / 広告）はそのまま効きます
     ・LINEクリックのコンバージョン計測（line-cv）もそのまま効きます
     ・画面下の固定CTA（FloatingCTABar）もそのまま表示されます
   ============================================================ */

const LINE_URL = 'https://lin.ee/Mc3bGjk';

const STYLES = `:root{--bg: #FDFAF6;--bg-warm: #FAF2E7;--bg-deep: #F5E9DA;--card: #FFFFFF;--ink: #35291F;--ink-mid: #5C4B3F;--ink-soft: #8A7768;--accent: #B87333;--accent-dark: #96591F;--accent-pale: #F2E1CC;--brown: #3B2B20;--brown-soft: #55402F;--line: #06C755;--line-dark: #05AB49;--rule: #E9DCCA;--red: #B0402E;--serif: var(--font-noto-serif-jp, "Hiragino Mincho ProN"), "Hiragino Mincho ProN", "HiraMinProN-W3", "Yu Mincho", "YuMincho", "Noto Serif JP", "MS PMincho", serif;--sans: var(--font-noto-sans-jp, "Hiragino Sans"), "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "YuGothic", "Noto Sans JP", "Meiryo", sans-serif;--wrap: 1080px;--radius: 14px;--shadow: 0 2px 20px rgba(90, 60, 30, .07)}
*,*:before,*:after{box-sizing:border-box}
html{scroll-behavior:smooth;scroll-padding-top:72px;-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:16px;line-height:1.9;letter-spacing:.03em;font-feature-settings:"palt" 1}
img{max-width:100%;height:auto;display:block}
a{color:var(--accent-dark)}
h1,h2,h3{font-family:var(--serif);font-weight:600;line-height:1.5;letter-spacing:.04em;margin:0}
p{margin:0 0 1.2em}
p:last-child{margin-bottom:0}
ul,ol{margin:0;padding:0;list-style:none}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
.wrap{width:100%;max-width:var(--wrap);margin:0 auto;padding:0 20px}
.wrap.narrow{max-width:800px}
.btn{display:inline-flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;padding:16px 30px;border-radius:999px;text-decoration:none;font-weight:700;letter-spacing:.05em;line-height:1.5;transition:transform .15s ease,box-shadow .15s ease,background-color .15s ease}
.btn:hover{transform:translateY(-2px)}
.btn:active{transform:translateY(0)}
.btn-main{font-size:1.06rem}
.btn-sub{font-size:.76rem;font-weight:400;opacity:.9;letter-spacing:.02em}
.btn-line{background:var(--line);color:#fff;box-shadow:0 4px 16px #06c75547}
.btn-line:hover{background:var(--line-dark);box-shadow:0 7px 22px #06c75557}
.btn-lg{padding:19px 40px;width:100%;max-width:460px}
.btn-sm{padding:10px 20px;font-size:.86rem}
.btn-sm .btn-main{font-size:.86rem}
.btn-block{width:100%;max-width:520px}
.btn-ghost{background:transparent;color:var(--brown);border:1px solid var(--rule);box-shadow:none;flex:1 1 220px;padding:14px 24px;background:#fff}
.btn-ghost:hover{border-color:var(--accent);color:var(--accent-dark)}
.ico-line{display:inline-block;width:20px;height:19px;margin-right:2px;background:currentColor;-webkit-mask:no-repeat center / contain;mask:no-repeat center / contain;-webkit-mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 23'%3E%3Cpath d='M12 0C5.37 0 0 4.27 0 9.54c0 4.72 4.26 8.67 10.02 9.42.39.08.92.26 1.05.59.12.3.08.77.04 1.08l-.17 1.02c-.05.3-.24 1.18 1.06.64s6.99-4.12 9.54-7.05C23.2 13.32 24 11.53 24 9.54 24 4.27 18.63 0 12 0z'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 23'%3E%3Cpath d='M12 0C5.37 0 0 4.27 0 9.54c0 4.72 4.26 8.67 10.02 9.42.39.08.92.26 1.05.59.12.3.08.77.04 1.08l-.17 1.02c-.05.3-.24 1.18 1.06.64s6.99-4.12 9.54-7.05C23.2 13.32 24 11.53 24 9.54 24 4.27 18.63 0 12 0z'/%3E%3C/svg%3E")}
.btn-lg .ico-line{width:24px;height:23px}
.site-header{position:sticky;top:0;z-index:100;background:#3b2b20f7;backdrop-filter:saturate(140%) blur(6px)}
.header-inner{display:flex;align-items:center;gap:24px;min-height:62px}
.brand{text-decoration:none;color:#fff;line-height:1.3;margin-right:auto}
.brand-ja{display:block;font-family:var(--serif);font-size:.96rem;letter-spacing:.08em}
.brand-en{display:block;font-size:.58rem;letter-spacing:.18em;color:#c9b49e}
.header-nav{display:flex;gap:22px}
.header-nav a{color:#e7d9c8;text-decoration:none;font-size:.84rem;letter-spacing:.06em}
.header-nav a:hover{color:#fff}
.hero{border-bottom:1px solid var(--rule)}
.hero-main{background:#fbf3e7;padding:48px 0 0}
.hero-inner{display:grid;grid-template-columns:1fr 320px;gap:40px;align-items:start}
.hero-eyebrow{display:inline-block;background:#fff;color:var(--accent-dark);font-size:.8rem;font-weight:700;letter-spacing:.05em;padding:7px 20px;border-radius:999px;margin-bottom:20px;box-shadow:0 2px 10px #5a3c1e12}
.hero-title{font-size:clamp(1.5rem,6.3vw,2.3rem);line-height:1.55;margin-bottom:22px;color:var(--brown)}
.ht-line{display:inline-block}
.ht-em{font-weight:600;color:var(--accent-dark)}
.ht-mark{color:var(--accent);font-weight:400}
.hero-lead{font-size:1.02rem;color:var(--ink-mid);max-width:40em;margin-bottom:26px}
.hero-price{display:flex;flex-wrap:wrap;gap:10px;margin-bottom:20px}
.hero-price li{flex:1 1 150px;background:#fff;border:1px solid var(--accent-pale);border-radius:18px;padding:14px 16px;text-align:center;box-shadow:0 2px 10px #5a3c1e0d}
.hero-price .is-cap{border-color:var(--accent);background:#fff}
.hp-label{display:block;font-size:.74rem;color:var(--ink-soft);letter-spacing:.04em}
.hp-value{display:block;font-family:var(--serif);font-size:1.85rem;font-weight:600;color:var(--accent-dark);line-height:1.25;white-space:nowrap}
.hp-value small{font-size:.82rem;margin-left:1px}
.hp-note{display:block;font-size:.68rem;color:var(--ink-soft)}
.hero-cta-alt{font-size:.8rem;color:var(--ink-soft);margin-top:14px;line-height:1.9}
.hero-figure{position:relative;z-index:2;margin-bottom:-48px}
.hero-illust{width:100%;height:auto;display:block}
.hero-figure-cap{display:flex;align-items:center;justify-content:center;gap:11px;margin-top:2px;font-size:.84rem;color:var(--brown);font-weight:700}
.hero-avatar{width:52px;height:52px;border-radius:50%;object-fit:cover;flex:0 0 auto;border:3px solid #fff;box-shadow:0 3px 10px #5a3c1e24;background:var(--bg-deep)}
.hero-figure-cap small{display:block;font-size:.7rem;color:var(--ink-soft);font-weight:400}
.hero-foot{position:relative;z-index:1;background:#f1e3cb;padding:56px 0 40px}
.hero-circles{display:flex;flex-wrap:wrap;gap:20px;justify-content:center}
.hero-circles li{width:138px;height:138px;border-radius:50%;background:#fbf3e7;border:5px solid #fff;box-shadow:0 4px 14px #5a3c1e17;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;padding:0 8px;text-align:center}
.hc-ico{width:26px;height:26px;color:var(--accent)}
.hc-ico svg{width:100%;height:100%;display:block}
.hc-label{font-size:.8rem;font-weight:700;color:var(--brown);line-height:1.45;letter-spacing:.01em}
.sec{padding:72px 0}
.sec-empathy{background:var(--bg)}
.sec-delegate{background:var(--bg-warm)}
.sec-fee{background:var(--bg)}
.sec-results{background:var(--bg-warm)}
.sec-flow{background:var(--bg)}
.sec-lawyer{background:var(--bg-warm)}
.sec-access{background:var(--bg)}
.sec-faq{background:var(--bg-warm)}
.sec-head{text-align:center;margin-bottom:38px}
.sec-head h2{font-size:clamp(1.28rem,2.6vw,1.85rem);color:var(--accent);letter-spacing:.1em;margin-bottom:14px}
.sec-head h2 em{font-style:normal;color:var(--brown)}
.sec-rule{display:block;width:min(100%,420px);height:16px;margin:0 auto;color:var(--accent)}
.sec-lead{color:var(--ink-mid);max-width:44em;margin-bottom:36px}
.sec-lead.center{margin-left:auto;margin-right:auto;text-align:center}
.check-list{display:flex;flex-direction:column;gap:12px;margin-bottom:44px}
.check-list li{display:flex;align-items:center;gap:16px;background:var(--bg-warm);border-radius:10px;padding:17px 26px;color:var(--brown);font-weight:500;line-height:1.7}
.check-list li:before{content:"";flex:0 0 auto;width:23px;height:23px;background:no-repeat center / contain url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23C0A16A' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='3'/%3E%3Cpath d='M8 12.4l2.9 2.9 5.4-5.9'/%3E%3C/svg%3E")}
.ally{background:#f1e3cb;border-radius:var(--radius);padding:16px}
.ally-inner{background:#ffffffeb;border:1px solid var(--accent-pale);border-radius:9px;padding:36px 32px;text-align:center}
.ally-lead{color:var(--brown-soft);font-size:.93rem;line-height:2;margin-bottom:22px}
.ally-punch{font-family:var(--serif);color:var(--accent-dark);font-weight:600;font-size:clamp(1.1rem,2.3vw,1.5rem);line-height:1.85;letter-spacing:.03em}
.ally-punch span{display:inline-block}
.ally-punch em{font-style:normal;background:linear-gradient(transparent 62%,#b8733333 62%)}
.ally-note{margin-top:18px;font-size:.78rem;color:var(--ink-soft);line-height:1.9}
.callout-warm{background:#fff;border:1px solid var(--accent-pale);border-left:4px solid var(--accent);border-radius:var(--radius);padding:28px 32px}
.callout-warm h3{font-size:1.2rem;color:var(--accent-dark);margin-bottom:12px}
.callout-warm p{color:var(--ink-mid)}
.callout-note{font-size:.82rem;color:var(--ink-soft);border-top:1px dashed var(--rule);padding-top:12px;margin-top:14px}
.callout-slim{margin:40px auto 0;max-width:800px}
.callout-slim h3{font-size:1.06rem}
.sec-promise{background:var(--bg-deep)}
.promise-list{display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(258px,1fr))}
.promise{background:#fff;border-radius:12px;border-top:5px solid var(--accent);padding:28px 28px 32px;box-shadow:0 3px 16px #5a3c1e12}
.pr-num{display:block;text-align:center;font-size:.68rem;letter-spacing:.16em;font-weight:700;color:var(--ink-soft);margin-bottom:10px}
.pr-title{text-align:center;font-size:1.14rem;color:var(--brown);margin-bottom:16px}
.pr-title em{font-style:normal;color:var(--accent)}
.pr-line{display:block;width:34px;height:2px;background:var(--accent-pale);margin:0 auto 20px}
.promise p{font-size:.88rem;color:var(--ink-mid);line-height:2}
.split{display:grid;grid-template-columns:1fr 1.25fr;gap:22px}
.split-col{background:#fff;border-radius:var(--radius);padding:28px 30px;box-shadow:var(--shadow)}
.split-you{border-top:4px solid var(--accent)}
.split-us{border-top:4px solid var(--brown)}
.split-col h3{margin-bottom:18px}
.split-tag{display:inline-block;font-size:.82rem;letter-spacing:.08em;font-family:var(--sans);font-weight:700;background:var(--accent-pale);color:var(--accent-dark);padding:4px 14px;border-radius:999px}
.split-us .split-tag{background:#eae1d7;color:var(--brown)}
.do-list{counter-reset:n}
.do-list li{position:relative;padding:9px 0 9px 30px;color:var(--ink-mid);font-size:.96rem;border-bottom:1px dotted var(--rule)}
.do-list li:last-child{border-bottom:0}
ol.do-list li:before{counter-increment:n;content:counter(n);position:absolute;left:0;top:13px;width:20px;height:20px;border-radius:50%;background:var(--accent);color:#fff;font-size:.7rem;font-weight:700;text-align:center;line-height:20px}
ul.do-list li:before{content:"";position:absolute;left:4px;top:17px;width:12px;height:7px;border-left:2px solid var(--brown);border-bottom:2px solid var(--brown);transform:rotate(-45deg)}
.split-foot{margin-top:16px;padding-top:14px;border-top:1px solid var(--rule);font-size:.86rem;color:var(--accent-dark);font-weight:700}
.talk-demo{margin:44px auto 0;max-width:560px;background:#8fa9be;border-radius:var(--radius);padding:22px 18px 16px}
.talk-demo-title{text-align:center;color:#fff;font-size:.86rem;font-weight:700;letter-spacing:.06em;margin-bottom:16px}
.talk{display:flex;flex-direction:column;gap:10px}
.talk-row{display:flex;gap:8px;align-items:flex-end}
.talk-me{justify-content:flex-end}
.talk-avatar{flex:0 0 32px;width:32px;height:32px;border-radius:50%;background:var(--brown);color:#fff;font-size:.72rem;display:grid;place-items:center;font-family:var(--serif)}
.bubble{max-width:78%;padding:10px 14px;border-radius:16px;font-size:.88rem;line-height:1.75;letter-spacing:.01em}
.bubble-me{background:#8de055;color:#263238;border-bottom-right-radius:4px}
.bubble-you{background:#fff;color:var(--ink);border-bottom-left-radius:4px}
.bubble-head{display:block;font-weight:700;padding-bottom:6px;margin-bottom:7px;border-bottom:1px solid rgba(0,0,0,.13)}
.bubble-photos{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;background:transparent;padding:0;width:240px;max-width:62%}
.doc{aspect-ratio:3 / 4;border-radius:3px;overflow:hidden;background:#f4f1ea;position:relative}
.doc:after{content:"";position:absolute;inset:15% 17%;background:repeating-linear-gradient(to bottom,#C3BCAF 0 1px,transparent 1px 5px)}
.talk-demo-note{margin-top:12px;text-align:center;font-size:.7rem;color:#ffffffd9}
.cta-band{display:flex;justify-content:center;margin-top:44px}
.fee-main{display:grid;grid-template-columns:320px 1fr;gap:0;background:#fff;border:2px solid var(--accent);border-radius:var(--radius);overflow:hidden;box-shadow:var(--shadow)}
.fee-headline{background:linear-gradient(160deg,#fbf0e1,#f6e4ce);padding:32px 28px;text-align:center;border-right:1px solid var(--accent-pale)}
.fee-plan-name{font-family:var(--serif);font-size:1.1rem;color:var(--brown);margin-bottom:10px}
.fee-plan-name span{font-size:.78rem;color:var(--accent-dark)}
.fee-amount{margin-bottom:4px;line-height:1}
.fee-num{font-family:var(--serif);font-size:4rem;font-weight:600;color:var(--accent-dark)}
.fee-unit{font-family:var(--serif);font-size:1.3rem;color:var(--accent-dark)}
.fee-tax{font-size:.8rem;color:var(--ink-soft)}
.fee-amount-sub{font-size:1rem;color:var(--brown);margin-bottom:10px}
.fee-amount-sub strong{font-size:1.35rem;color:var(--accent-dark);font-family:var(--serif)}
.fee-plan-note{font-size:.76rem;color:var(--ink-soft)}
.fee-includes{padding:28px 32px;display:grid;grid-template-columns:1fr 1fr;gap:4px 24px;align-content:start}
.fee-includes li{position:relative;padding:6px 0 6px 24px;font-size:.9rem;color:var(--ink-mid)}
.fee-includes li:before{content:"";position:absolute;left:2px;top:14px;width:11px;height:6px;border-left:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(-45deg)}
.fee-table-block{margin-top:30px;background:#fff;border:1px solid var(--rule);border-radius:var(--radius);padding:32px 34px}
.fee-table-title{font-size:1.2rem;color:var(--brown);margin-bottom:12px;text-align:center}
.fee-table-lead{font-size:.92rem;color:var(--ink-mid);margin-bottom:22px}
.fee-table{width:100%;border-collapse:collapse;font-size:.96rem}
.fee-table th,.fee-table td{padding:14px 16px;text-align:left}
.fee-table thead th{background:var(--bg-deep);color:var(--brown);font-size:.82rem;letter-spacing:.06em}
.fee-table thead th:last-child,.fee-table tbody td,.fee-table tfoot td{text-align:right}
.fee-table tbody tr{border-bottom:1px solid var(--rule)}
.fee-table tbody th{font-weight:600;color:var(--ink)}
.fee-table .is-free th,.fee-table .is-free td{color:var(--accent-dark);font-weight:700}
.fee-table tfoot tr{background:var(--accent-pale)}
.fee-table tfoot th{font-weight:700;color:var(--brown)}
.fee-table tfoot td strong{font-family:var(--serif);font-size:1.45rem;color:var(--accent-dark)}
.fee-notes{margin-top:24px;padding:20px 22px;background:var(--bg);border-radius:10px;font-size:.84rem;color:var(--ink-mid)}
.fee-notes>p{margin-bottom:10px;color:var(--brown)}
.fee-notes ul li{position:relative;padding-left:16px;margin-bottom:8px;line-height:1.8}
.fee-notes ul li:before{content:"";position:absolute;left:2px;top:11px;width:5px;height:5px;border-radius:50%;background:var(--accent)}
.pay-block{margin-top:26px;background:#fff;border:1px solid var(--rule);border-radius:var(--radius);padding:26px 30px}
.pay-block h3{font-size:1.02rem;color:var(--brown);margin-bottom:16px}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
.pay-item-title{font-weight:700;font-size:.92rem;color:var(--brown);margin-bottom:8px}
.pay-item-text{font-size:.88rem;color:var(--ink-mid)}
.pay-item-note{display:block;font-size:.76rem;color:var(--ink-soft)}
.pay-cards{display:flex;flex-wrap:wrap;gap:6px}
.pay-cards span{font-size:.7rem;letter-spacing:.06em;font-weight:700;color:var(--ink-mid);border:1px solid var(--rule);border-radius:4px;padding:4px 10px;background:var(--bg)}
.pay-lead{margin-top:18px;padding-top:16px;border-top:1px solid var(--rule);color:var(--accent-dark);font-weight:700;text-align:center}
.fee-other{margin-top:24px;background:#fff;border:1px solid var(--rule);border-radius:var(--radius)}
.fee-other>summary{cursor:pointer;padding:18px 46px 18px 24px;font-size:.92rem;color:var(--ink-mid);list-style:none;position:relative}
.fee-other>summary::-webkit-details-marker{display:none}
.fee-other>summary:after{content:"";position:absolute;right:24px;top:50%;width:9px;height:9px;margin-top:-6px;border-right:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(45deg);transition:transform .2s}
.fee-other[open]>summary:after{transform:rotate(-135deg);margin-top:-2px}
.fee-other-body{padding:4px 24px 24px;display:grid;grid-template-columns:1fr 1fr;gap:22px}
.fee-other-item{background:var(--bg);border-radius:10px;padding:20px 22px}
.fo-name{font-family:var(--serif);font-size:1.04rem;color:var(--brown);margin-bottom:4px}
.fo-price{font-weight:700;color:var(--accent-dark);margin-bottom:10px}
.fo-desc{font-size:.84rem;color:var(--ink-mid)}
.result-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;align-items:start}
.result-card{background:#fff;border:1px solid var(--rule);border-radius:var(--radius);padding:24px 24px 26px;box-shadow:var(--shadow)}
.result-card.is-primary{grid-column:span 3;display:grid;grid-template-columns:1fr 1fr;gap:8px 32px;border-color:var(--accent);border-width:2px;background:linear-gradient(140deg,#fff 60%,#fdf4e9)}
.result-card.is-primary .rc-tag,.result-card.is-primary .rc-title{grid-column:1}
.result-card.is-primary .rc-figures{grid-column:2;grid-row:1 / span 3;align-self:center}
.rc-tag{display:inline-block;font-size:.68rem;letter-spacing:.08em;border:1px solid var(--rule);border-radius:4px;padding:2px 9px;color:var(--ink-soft);margin-bottom:10px;width:fit-content}
.rc-title{font-size:1rem;color:var(--brown);margin-bottom:14px}
.rc-figures{display:flex;align-items:center;justify-content:center;gap:14px;padding:14px 0;margin-bottom:10px;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule)}
.result-card.is-primary .rc-figures{border:0;padding:0}
.rc-from,.rc-to{text-align:center;font-family:var(--serif);font-weight:600;line-height:1.3}
.rc-from small,.rc-to small{display:block;font-family:var(--sans);font-size:.64rem;font-weight:400;color:var(--ink-soft);letter-spacing:.06em}
.rc-from{font-size:1.3rem;color:var(--ink-soft);text-decoration:line-through;text-decoration-thickness:1px}
.rc-to{font-size:1.75rem;color:var(--accent-dark)}
.result-card.is-primary .rc-to{font-size:2.4rem}
.result-card.is-primary .rc-from{font-size:1.5rem}
.rc-arrow{color:var(--accent);font-size:1.1rem}
.rc-meta{font-size:.78rem;color:var(--accent-dark);font-weight:700;margin-bottom:8px}
.rc-desc{font-size:.84rem;color:var(--ink-mid)}
.disclaimer{margin-top:26px;font-size:.76rem;color:var(--ink-soft);text-align:center;max-width:46em;margin-left:auto;margin-right:auto}
.flow-list{display:grid;grid-template-columns:repeat(4,1fr);gap:18px}
.flow-item{position:relative;background:#fff;border:1px solid var(--rule);border-radius:var(--radius);padding:30px 22px 24px;text-align:center}
.flow-num{position:absolute;top:-16px;left:50%;transform:translate(-50%);width:34px;height:34px;border-radius:50%;background:var(--accent);color:#fff;font-family:var(--serif);font-size:1rem;font-weight:600;display:grid;place-items:center;box-shadow:0 3px 10px #b873334d}
.flow-item h3{font-size:.98rem;color:var(--brown);margin-bottom:10px}
.fl-tag{display:inline-block;margin-top:7px;font-family:var(--sans);font-size:.66rem;font-weight:700;letter-spacing:.06em;background:var(--accent);color:#fff;border-radius:999px;padding:3px 12px}
.flow-item p{font-size:.84rem;color:var(--ink-mid);text-align:left}
.flow-note{margin-top:34px;background:var(--accent-pale);border-radius:var(--radius);padding:24px 28px;text-align:center}
.flow-note p:first-child{font-size:1.05rem;color:var(--brown);font-family:var(--serif)}
.flow-note p:last-child{font-size:.88rem;color:var(--ink-mid)}
.lawyer{display:grid;grid-template-columns:300px 1fr;gap:40px;align-items:start}
.lawyer-photo img{width:100%;border-radius:var(--radius);box-shadow:var(--shadow);background:var(--bg-deep);aspect-ratio:4 / 5;object-fit:cover}
.lawyer-name{font-family:var(--serif);font-size:1.6rem;color:var(--brown);margin-bottom:2px}
.lawyer-name span{font-size:1rem}
.lawyer-affil{font-size:.84rem;color:var(--accent-dark);margin-bottom:20px}
.lawyer-message{margin:0 0 26px;padding:24px 26px;background:#fff;border-radius:var(--radius);border-left:4px solid var(--accent)}
.lawyer-message p{color:var(--ink-mid);font-size:.95rem}
.lawyer-message p:first-child{font-family:var(--serif);font-size:1.1rem;color:var(--brown);margin-bottom:14px}
.lawyer-cols{display:grid;grid-template-columns:1fr 1.5fr;gap:30px}
.lawyer-sub{font-size:.92rem;color:var(--brown);margin-bottom:10px;padding-bottom:6px;border-bottom:1px solid var(--rule)}
.tick-list li{position:relative;padding:4px 0 4px 20px;font-size:.88rem;color:var(--ink-mid)}
.tick-list li:before{content:"";position:absolute;left:2px;top:12px;width:10px;height:6px;border-left:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(-45deg)}
.career div{display:flex;gap:14px;padding:4px 0;font-size:.86rem}
.career dt{flex:0 0 4.5em;color:var(--ink-soft)}
.career dd{margin:0;color:var(--ink-mid)}
.office-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;margin-top:40px}
.office-item{background:#fff;border:1px solid var(--rule);border-radius:var(--radius);padding:24px 26px}
.office-item h3{font-size:.95rem;color:var(--accent-dark);margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--rule)}
.office-item p{font-size:.85rem;color:var(--ink-mid);margin-bottom:.9em}
.office-name{font-weight:700;color:var(--brown)!important}
.access{display:grid;grid-template-columns:1fr 1.08fr;gap:34px;align-items:start}
.ac-route{display:flex;align-items:center;gap:11px;font-family:var(--serif);font-size:1.1rem;font-weight:600;color:var(--brown);background:#fff;border:1px solid var(--accent-pale);border-radius:999px;padding:13px 24px;margin-bottom:24px}
.ac-route-ico{flex:0 0 auto;width:22px;height:22px;color:var(--accent)}
.ac-route-ico svg{width:100%;height:100%;display:block}
.ac-list>div{display:grid;grid-template-columns:6.5em 1fr;gap:14px;padding:14px 2px;border-bottom:1px solid var(--rule)}
.ac-list>div:first-child{border-top:1px solid var(--rule)}
.ac-list dt{font-size:.84rem;font-weight:700;color:var(--accent-dark)}
.ac-list dd{margin:0;font-size:.89rem;color:var(--ink-mid);line-height:1.9}
.access-map{border-radius:var(--radius);overflow:hidden;border:1px solid var(--rule);background:var(--bg-deep);aspect-ratio:4 / 3}
.access-map iframe{width:100%;height:100%;border:0;display:block}
.faq-list{display:flex;flex-direction:column;gap:12px}
.faq-item{background:#fff;border:1px solid var(--rule);border-radius:12px;overflow:hidden}
.faq-item>summary{cursor:pointer;list-style:none;position:relative;padding:18px 56px 18px 54px;font-family:var(--serif);font-size:1.02rem;color:var(--brown);line-height:1.6}
.faq-item>summary::-webkit-details-marker{display:none}
.faq-item>summary:before{content:"Q";position:absolute;left:22px;top:18px;font-family:var(--serif);font-weight:700;color:var(--accent);font-size:1.05rem}
.faq-item>summary:after{content:"";position:absolute;right:24px;top:26px;width:9px;height:9px;border-right:2px solid var(--accent);border-bottom:2px solid var(--accent);transform:rotate(45deg);transition:transform .2s}
.faq-item[open]>summary{background:var(--bg-warm)}
.faq-item[open]>summary:after{transform:rotate(-135deg)}
.faq-body{padding:18px 30px 24px 54px;border-top:1px solid var(--rule);font-size:.92rem;color:var(--ink-mid)}
.sec-final{background:linear-gradient(160deg,#4a3527,#35251a);padding:76px 0;text-align:center}
.final-title{font-size:clamp(1.4rem,2.6vw,1.95rem);color:#fff;margin-bottom:16px}
.final-lead{color:#dcc9b5;font-size:.95rem;max-width:34em;margin:0 auto 32px}
.sec-final .btn-block{margin:0 auto}
.final-alt{margin-top:36px;padding-top:30px;border-top:1px solid rgba(255,255,255,.14)}
.final-alt-title{font-size:.82rem;color:#b9a390;margin-bottom:14px}
.final-alt-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;max-width:520px;margin:0 auto}
.final-alt .btn-ghost{background:transparent;color:#e7d9c8;border-color:#ffffff47}
.final-alt .btn-ghost:hover{background:#ffffff14;color:#fff;border-color:#ffffff80}
.site-footer{background:var(--brown);color:#c9b49e;padding:40px 0 32px;text-align:center;font-size:.82rem}
.footer-brand{font-family:var(--serif);font-size:1.05rem;color:#fff;margin-bottom:14px}
.footer-brand span{display:block;font-size:.62rem;letter-spacing:.16em;color:#a08d79}
.footer-info{line-height:2;margin-bottom:18px}
.footer-nav{display:flex;gap:20px;justify-content:center;flex-wrap:wrap;margin-bottom:20px}
.footer-nav a{color:#c9b49e;text-decoration:none;font-size:.8rem}
.footer-nav a:hover{color:#fff;text-decoration:underline}
.footer-copy{font-size:.7rem;color:#8e7b68}
@media(max-width:900px){.hero-inner{grid-template-columns:1fr;gap:24px}
.hero-figure{max-width:340px;margin:0 auto -40px}
.split,.fee-main{grid-template-columns:1fr}
.fee-headline{border-right:0;border-bottom:1px solid var(--accent-pale)}
.fee-other-body,.promise-list{grid-template-columns:1fr}
.access{grid-template-columns:1fr;gap:26px}
.result-grid{grid-template-columns:1fr 1fr}
.result-card.is-primary{grid-column:span 2}
.flow-list{grid-template-columns:1fr 1fr;gap:26px 18px}
.lawyer{grid-template-columns:1fr;gap:26px}
.lawyer-photo{max-width:240px}
.office-grid{grid-template-columns:1fr}}
@media(max-width:768px){.header-nav,.header-cta{display:none}
html{scroll-padding-top:68px}}
@media(max-width:620px){body{font-size:15.5px;line-height:1.85}
.sec{padding:54px 0}
.hero-main{padding:30px 0 0}
.hero-foot{padding:48px 0 34px}
.hero-title{line-height:1.5}
.hero-circles{gap:14px}
.hero-circles li{width:calc(50% - 7px);height:auto;aspect-ratio:1;border-width:4px}
.hero-price li{flex:1 1 100%;display:grid;grid-template-columns:auto 1fr;align-items:baseline;gap:0 12px;text-align:left;padding:11px 16px}
.hero-price .hp-label{font-size:.82rem}
.hero-price .hp-value{font-size:1.55rem;text-align:right;white-space:nowrap}
.hero-price .hp-note{grid-column:1 / -1;text-align:right;margin-top:-2px}
.btn-lg{padding:17px 22px}
.btn-main{font-size:1rem}
.fee-includes{grid-template-columns:1fr;padding:22px 24px}
.fee-table-block{padding:24px 20px}
.fee-table th,.fee-table td{padding:12px 8px;font-size:.88rem}
.fee-num{font-size:3.2rem}
.pay-grid,.result-grid{grid-template-columns:1fr}
.result-card.is-primary{grid-column:span 1;grid-template-columns:1fr}
.result-card.is-primary .rc-figures{grid-column:1;grid-row:auto;border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);padding:14px 0;margin:4px 0 12px}
.flow-list{grid-template-columns:1fr;gap:26px}
.lawyer-cols{grid-template-columns:1fr;gap:22px}
.callout-warm{padding:22px 20px}
.faq-item>summary{padding:16px 44px;font-size:.96rem}
.faq-item>summary:before{left:18px;top:16px}
.faq-item>summary:after{right:18px}
.faq-body{padding:16px 20px 20px 44px}
.split-col{padding:24px 22px}
.talk-demo{padding:18px 14px 14px}
.bubble{max-width:84%}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}
.btn{transition:none}
.btn:hover{transform:none}}`;

export default function Home() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      {/* ============================================================
           ヘッダー
           ============================================================ */}
      <header className="site-header">
        <div className="wrap header-inner">
          <a className="brand" href="#top">
            <span className="brand-ja">冨田・島岡法律事務所</span>
            <span className="brand-en">TOMIDA &amp; SHIMAOKA LAW OFFICE</span>
          </a>
          <nav className="header-nav" aria-label="ページ内メニュー">
            <a href="#fee">料金</a>
            <a href="#flow">解決の流れ</a>
            <a href="#faq">よくある質問</a>
          </nav>
          <a className="btn btn-line btn-sm header-cta" href={LINE_URL} target="_blank" rel="noopener" data-line-cta="">
            <span className="ico-line" aria-hidden="true"></span>LINEで相談する
          </a>
        </div>
      </header>

      <main id="top">

      {/* ============================================================
           1. ファーストビュー
           ============================================================ */}
      <section className="hero">
        <div className="hero-main">
          <div className="wrap hero-inner">
            <div className="hero-body">
              <p className="hero-eyebrow">トレント（BitTorrent）の意見照会書・通知書・請求書が届いた方へ</p>

              <h1 className="hero-title">
                <span className="ht-line">まずは、</span><span className="ht-line">ご安心ください。</span><br />
                <span className="ht-line ht-em"><span className="ht-mark" aria-hidden="true">「</span>あとは、</span><span className="ht-line ht-em">すべてお任せください。<span className="ht-mark" aria-hidden="true">」</span></span>
              </h1>

              <p className="hero-lead">
                書類の写真をLINEでお送りください。弁護士本人が内容を確認し、
                これから何が起こるのか、費用はいくらになるのかを、分かりやすくお伝えします。
              </p>

              <ul className="hero-price" aria-label="費用の概要">
                <li className="is-cap"><span className="hp-label">着手金</span><span className="hp-value">33<small>万円</small></span><span className="hp-note">税込・1社あたり</span></li>
                <li><span className="hp-label">成功報酬・追加費用</span><span className="hp-value">0<small>円</small></span><span className="hp-note">いただくのは着手金のみ</span></li>
              </ul>

              <div className="hero-cta">
                <a className="btn btn-line btn-lg" href={LINE_URL} target="_blank" rel="noopener" data-line-cta="">
                  <span className="ico-line" aria-hidden="true"></span>
                  <span className="btn-main">LINEで書類の写真を送る</span>
                  <span className="btn-sub">無料・24時間受付／弁護士本人が確認します</span>
                </a>
                <p className="hero-cta-alt">
                  土日祝も原則24時間以内に返信／オンラインで全国対応<br />
                  LINEをお使いでない方は
                  <a href="#contact-alt">お問い合わせフォーム・お電話</a>
                  からもご相談いただけます。
                </p>
              </div>
            </div>

            <div className="hero-figure">
              {/* 届いた書類とLINEでの相談を表したイラスト */}
              <svg className="hero-illust" viewBox="0 0 420 400" role="img" aria-label="届いた書類とスマートフォンのイラスト">
                <circle cx="206" cy="198" r="170" fill="#F7E7D2"/>
                <g fill="#BCC7A6">
                  <ellipse cx="64" cy="330" rx="36" ry="14" transform="rotate(-24 64 330)"/>
                  <ellipse cx="112" cy="354" rx="27" ry="11" transform="rotate(-7 112 354)"/>
                  <ellipse cx="356" cy="338" rx="31" ry="12" transform="rotate(22 356 338)"/>
                </g>
                <g transform="rotate(-7 165 180)">
                  <rect x="92" y="74" width="150" height="200" rx="9" fill="#fff" stroke="#E7D9C4" strokeWidth="2"/>
                  <rect x="112" y="100" width="74" height="10" rx="5" fill="#C3B49D"/>
                  <g fill="#E7DDCE">
                    <rect x="112" y="128" width="110" height="7" rx="3.5"/>
                    <rect x="112" y="146" width="110" height="7" rx="3.5"/>
                    <rect x="112" y="164" width="84" height="7" rx="3.5"/>
                    <rect x="112" y="192" width="110" height="7" rx="3.5"/>
                    <rect x="112" y="210" width="62" height="7" rx="3.5"/>
                  </g>
                  <circle cx="204" cy="243" r="20" fill="none" stroke="#C0644A" strokeWidth="3"/>
                  <rect x="194" y="237" width="20" height="4" rx="2" fill="#C0644A"/>
                  <rect x="194" y="245" width="20" height="4" rx="2" fill="#C0644A"/>
                </g>
                <path d="M64 232h180a10 10 0 0 1 10 10v92a10 10 0 0 1-10 10H64a10 10 0 0 1-10-10v-92a10 10 0 0 1 10-10z" fill="#DCA96F"/>
                <path d="M54 242l100 66 100-66" fill="none" stroke="#F0C89B" strokeWidth="8" strokeLinejoin="round" strokeLinecap="round"/>
                <g transform="translate(256 126)">
                  <rect x="0" y="0" width="128" height="218" rx="19" fill="#4A3527"/>
                  <rect x="8" y="8" width="112" height="202" rx="13" fill="#fff"/>
                  <rect x="46" y="15" width="36" height="6" rx="3" fill="#EAE1D4"/>
                  <rect x="18" y="40" width="78" height="32" rx="11" fill="#EFE8DE"/>
                  <rect x="42" y="84" width="68" height="26" rx="11" fill="#06C755"/>
                  <rect x="18" y="122" width="86" height="32" rx="11" fill="#EFE8DE"/>
                  <rect x="54" y="166" width="56" height="24" rx="11" fill="#06C755"/>
                </g>
              </svg>

              <p className="hero-figure-cap">
                <img className="hero-avatar" src="https://static.readdy.ai/image/5e182d52a94dfeeda6703180d188c585/23d653c5a2e092151eaee21a33c16434.png" alt="" width="52" height="52" loading="eager" />
                <span>担当　加藤 信 弁護士<small>愛知県弁護士会所属</small></span>
              </p>
            </div>
          </div>
        </div>

        <div className="hero-foot">
          <div className="wrap">
            <ul className="hero-circles">
              <li>
                <span className="hc-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-2.7-.4L3 21l1.6-4.6A8.2 8.2 0 0 1 3 11.5a8.4 8.4 0 0 1 9-8.4 8.4 8.4 0 0 1 9 8.4z"/>
                  </svg>
                </span>
                <span className="hc-label">初回相談<br />無料</span>
              </li>
              <li>
                <span className="hc-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 3v5h5M9 13h6M9 17h4"/>
                  </svg>
                </span>
                <span className="hc-label">LINEで<br />書類を送るだけ</span>
              </li>
              <li>
                <span className="hc-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="8" r="3.6"/>
                    <path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>
                  </svg>
                </span>
                <span className="hc-label">弁護士本人が<br />直接対応</span>
              </li>
              <li>
                <span className="hc-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2.5" y="5" width="19" height="14" rx="2.5"/>
                    <path d="M2.5 10h19M6 15h4"/>
                  </svg>
                </span>
                <span className="hc-label">カード・<br />分割払い可</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
           2. 共感 ＋ あなたの味方です
           ============================================================ */}
      <section className="sec sec-empathy">
        <div className="wrap narrow">
          <div className="sec-head">
            <h2>このような方から、ご相談をいただいています</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <ul className="check-list">
            <li>突然、書類が届いて戸惑っている</li>
            <li>家族や職場には知らせたくない</li>
            <li>弁護士に相談するのは初めてで、少し不安がある</li>
            <li>自分で相手方とやり取りするのは避けたい</li>
            <li>費用がいくらかかるのか分からず、踏み出せずにいる</li>
          </ul>

          <div className="ally">
            <div className="ally-inner">
              <p className="ally-lead">
                トレントの仕組みをよく知らないまま使ってしまった——<br />
                そういう方から、私たちは数多くのご相談をお受けしています。<br />
                あなたが抱えている状況は、決して特別なことではありません。
              </p>
              <p className="ally-punch">
                <span>ひとりで抱え込まず、</span><span>頼ってしまってください。</span><br />
                <span>ご相談いただいたその時から、</span><span>私たちは<em>あなたの味方</em>です。</span>
              </p>
            </div>
          </div>

          <p className="ally-note">
            ※ ご相談の内容は弁護士の守秘義務により固く守られます。当事務所からご家族や勤務先へ
            連絡することは一切ありません。ご相談・ご依頼にあたっては、ご本人確認のため
            お名前・ご連絡先をお伺いします（匿名でのご依頼はお受けできません）。
          </p>
        </div>
      </section>

      {/* ============================================================
           3. 3つのお約束
           ============================================================ */}
      <section className="sec sec-promise">
        <div className="wrap">
          <div className="sec-head">
            <h2>3つのお約束</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <p className="sec-lead center">ご依頼いただいた方に、事務所として次の3つをお約束します。</p>

          <ul className="promise-list">
            <li className="promise">
              <span className="pr-num">PROMISE 01</span>
              <h3 className="pr-title"><em>「じっくり」</em>お聞きします</h3>
              <span className="pr-line" aria-hidden="true"></span>
              <p>
                何があったのかを問い詰めることはしません。書類の内容だけでなく、
                ご家族のこと、お仕事のこと、いま不安に思っていることまで、
                時間をかけてお聞きします。そのうえで、あなたの状況に合った
                進め方をご提案します。
              </p>
            </li>
            <li className="promise">
              <span className="pr-num">PROMISE 02</span>
              <h3 className="pr-title"><em>「はっきり」</em>お伝えします</h3>
              <span className="pr-line" aria-hidden="true"></span>
              <p>
                弁護士費用は1社あたり着手金33万円のみで、成功報酬はいただきません。
                相手方へお支払いする示談金の見込みも、ご依頼いただく前にお伝えします。
                あとから「聞いていない費用」が出てくることはありません。
              </p>
            </li>
            <li className="promise">
              <span className="pr-num">PROMISE 03</span>
              <h3 className="pr-title"><em>「すっきり」</em>終わらせます</h3>
              <span className="pr-line" aria-hidden="true"></span>
              <p>
                早く終わらせたいからと、その場しのぎの示談はしません。
                あとから追加の請求が来ないか、和解の範囲は十分か。
                ご納得いただける内容かを確かめたうえで、
                不安を残さない形でこの件を終わらせます。
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ============================================================
           4. 丸投げできる
           ============================================================ */}
      <section className="sec sec-delegate">
        <div className="wrap">
          <div className="sec-head">
            <h2>お願いするのは、<br />書類の写真を送っていただくことだけ。</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <p className="sec-lead center">
            ご依頼後、相手方（権利者・法律事務所）との窓口はすべて弁護士がお引き受けします。
            直接、電話や手紙のやり取りをしていただく必要はありません。
          </p>

          <div className="split">
            <div className="split-col split-you">
              <h3><span className="split-tag">お願いすること</span></h3>
              <ol className="do-list">
                <li>LINEで書類の写真を送っていただく</li>
                <li>弁護士からの質問にいくつかお答えいただく</li>
                <li>着手金をお支払いいただく（カード可）</li>
              </ol>
              <p className="split-foot">以上です。あとはお待ちいただくだけです。</p>
            </div>

            <div className="split-col split-us">
              <h3><span className="split-tag">弁護士がすること</span></h3>
              <ul className="do-list">
                <li>書類の内容と回答期限の確認</li>
                <li>相手方の請求根拠の精査</li>
                <li>相手方・相手方法律事務所との連絡窓口</li>
                <li>回答書の作成・提出</li>
                <li>示談交渉・減額交渉</li>
                <li>和解書の内容確認と締結</li>
                <li>追加で別会社から請求が来た場合の対応</li>
              </ul>
              <p className="split-foot">進捗のご報告も、弁護士本人がLINEで直接お伝えします。</p>
            </div>
          </div>

          {/* LINE相談のイメージ */}
          <div className="talk-demo">
            <p className="talk-demo-title">ご相談は、こんなやり取りから始まります</p>
            <div className="talk">
              <div className="talk-row talk-you">
                <div className="talk-avatar" aria-hidden="true">弁</div>
                <div className="bubble bubble-you">
                  はじめまして。弁護士の加藤信と申します。<br />
                  突然、意見照会書や内容証明郵便が届き、大変不安な思いをされていることと思います。<br />
                  「どうしたらいいのか」「これからどうなるのか」という不安なお気持ち、よく分かります。<br />
                  まずは深呼吸をして、一人で抱え込まないでください。<br />
                  これから一緒に、適切な解決方法を見つけていきましょう。
                </div>
              </div>
              <div className="talk-row talk-you">
                <div className="talk-avatar" aria-hidden="true">弁</div>
                <div className="bubble bubble-you">
                  <span className="bubble-head">状況を把握させてください</span>
                  届いた書類の表紙から最終ページまで、すべてを写真に撮って、こちらのトークにアップロードしてください。
                  確認でき次第、弁護士からご連絡させていただきます。
                </div>
              </div>
              <div className="talk-row talk-me">
                <div className="bubble bubble-me">
                  今回開示請求が届きまして、どうすればよいか分からないため、ご相談させていただきたく。<br />
                  撮った写真をアップロードします
                </div>
              </div>
              <div className="talk-row talk-me">
                <div className="bubble bubble-photos" aria-label="届いた書類の写真">
                  <span className="doc" aria-hidden="true"></span>
                  <span className="doc" aria-hidden="true"></span>
                  <span className="doc" aria-hidden="true"></span>
                  <span className="doc" aria-hidden="true"></span>
                  <span className="doc" aria-hidden="true"></span>
                  <span className="doc" aria-hidden="true"></span>
                </div>
              </div>
              <div className="talk-row talk-you">
                <div className="talk-avatar" aria-hidden="true">弁</div>
                <div className="bubble bubble-you">
                  お写真ありがとうございます。書類を確認いたしました。<br />
                  プロバイダから届いた書類は、裁判所の開示命令に基づくもので、今後の対応が必要になります。<br />
                  ただ、きちんと対応すれば早期に解決できる問題ですので、まずは落ち着いていただければと思います。
                </div>
              </div>
            </div>
            <p className="talk-demo-note">※ 実際のご相談をもとに、ご本人が特定されないよう加工した再現イメージです。</p>
          </div>

          <div className="cta-band">
            <a className="btn btn-line btn-lg" href={LINE_URL} target="_blank" rel="noopener" data-line-cta="">
              <span className="ico-line" aria-hidden="true"></span>
              <span className="btn-main">LINEで書類の写真を送る</span>
              <span className="btn-sub">無料・24時間受付</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
           5. 料金
           ============================================================ */}
      <section className="sec sec-fee" id="fee">
        <div className="wrap">
          <div className="sec-head">
            <h2>費用は、<em>1社あたり33万円</em>だけ。</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <p className="sec-lead center">
            最初にこの着手金をお預かりするだけで、あとから費用が増えることはありません。
            成功報酬はいただきませんので、<strong>示談がまとまっても、金額が下がっても、追加のご負担は発生しません。</strong>
          </p>

          <div className="fee-main">
            <div className="fee-headline">
              <p className="fee-plan-name">標準対応プラン<span>（おすすめ）</span></p>
              <p className="fee-amount"><span className="fee-num">33</span><span className="fee-unit">万円</span><span className="fee-tax">（税込）</span></p>
              <p className="fee-amount-sub">＋ 成功報酬 <strong>0円</strong></p>
              <p className="fee-plan-note">1社（1つの権利者からの請求）あたりの着手金です。</p>
            </div>
            <ul className="fee-includes">
              <li>届いた書類の内容・回答期限の確認</li>
              <li>相手方の請求根拠の精査</li>
              <li>回答書の作成・送付</li>
              <li>相手方との窓口対応（電話・郵便すべて代理）</li>
              <li>示談交渉・減額交渉</li>
              <li>高額示談に応じるべきかの検討</li>
              <li>低額和解の可否、待機方針を採る場合のリスク説明</li>
              <li>和解の対象範囲・追加請求リスクの確認</li>
              <li>依頼後のLINE・メールでの弁護士直接対応</li>
            </ul>
          </div>

          <div className="fee-table-block">
            <h3 className="fee-table-title">複数社から請求が届いた場合も、半額でお受けします</h3>
            <p className="fee-table-lead">
              多くの方は1社からのご請求ですが、まれに別の作品・別の権利者から、
              追加で意見照会書や通知書が届くことがあります。その場合も
              <strong>2社目以降は半額</strong>でお受けし、6社目以降は追加の着手金をいただきません。
            </p>

            <table className="fee-table">
              <caption className="sr-only">請求社数ごとの着手金</caption>
              <thead>
                <tr><th scope="col">対応する社数</th><th scope="col">着手金（税込）</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">1社目</th><td>33万円</td></tr>
                <tr><th scope="row">2社目以降</th><td>半額の 16万5,000円</td></tr>
                <tr className="is-free"><th scope="row">6社目以降</th><td>追加着手金 <strong>なし</strong></td></tr>
              </tbody>
            </table>

            <div className="fee-notes">
              <p><strong>費用について、正直にお伝えしておきます。</strong></p>
              <ul>
                <li>相手方（権利者）へお支払いする<strong>示談金・和解金は、上記の弁護士費用とは別</strong>です。金額は事案により異なりますので、書類を確認したうえでお見込みをお伝えします。</li>
                <li>郵便代・振込手数料などの実費は別途申し受けます。</li>
                <li>裁判を起こされた場合の訴訟対応は、別途「訴訟対応プラン」の費用がかかります。</li>
                <li>6社目以降の無料対応は、示談交渉に関する着手金についてのものです。訴訟対応・刑事事件対応、受任後の新たな利用に基づく請求などは対象外です。</li>
                <li>追加着手金は5社目までのため、何社からご請求があっても着手金の合計は最大99万円（税込）までとなります。</li>
              </ul>
            </div>
          </div>

          <div className="pay-block">
            <h3>お支払い方法</h3>
            <div className="pay-grid">
              <div className="pay-item">
                <p className="pay-item-title">クレジットカード対応</p>
                <p className="pay-cards"><span>VISA</span><span>Mastercard</span><span>JCB</span><span>AMEX</span></p>
              </div>
              <div className="pay-item">
                <p className="pay-item-title">分割払いも可能</p>
                <p className="pay-item-text">
                  ご利用のカード会社の分割払いをご利用いただけます。
                  <span className="pay-item-note">（回数・手数料は各カード会社の規定によります）</span>
                </p>
              </div>
            </div>
            <p className="pay-lead">手元にまとまったお金がなくても、今日から対応を始められます。</p>
          </div>

          <details className="fee-other">
            <summary>他のプランもご用意しています（自分で対応したい方・裁判になった方）</summary>
            <div className="fee-other-body">
              <div className="fee-other-item">
                <p className="fo-name">回答書のみ作成プラン</p>
                <p className="fo-price">11万円（税込）</p>
                <p className="fo-desc">
                  意見照会書への回答書案の作成、法的アドバイス、書類の確認・修正を行うプランです。
                  相手方とのやり取りはご本人に行っていただきます。
                  <strong>すべてお任せになりたい方には、標準対応プランをおすすめします。</strong>
                </p>
              </div>
              <div className="fee-other-item">
                <p className="fo-name">訴訟対応プラン</p>
                <p className="fo-price">着手金 33万円（税込）＋ 成功報酬</p>
                <p className="fo-desc">
                  裁判を起こされた場合に、訴訟手続きの全面対応・裁判所への出廷代理・和解交渉までを行うプランです。
                  標準対応プランからの継続の場合、追加着手金は11万円（税込）となります。
                  成功報酬は減額できた金額の20%です。
                </p>
              </div>
            </div>
          </details>

          <div className="cta-band">
            <a className="btn btn-line btn-lg" href={LINE_URL} target="_blank" rel="noopener" data-line-cta="">
              <span className="ico-line" aria-hidden="true"></span>
              <span className="btn-main">費用のお見込みをLINEで聞く</span>
              <span className="btn-sub">無料・書類の写真を送るだけ</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
           6. 解決実績
           ============================================================ */}
      <section className="sec sec-results">
        <div className="wrap">
          <div className="sec-head">
            <h2>これまでの解決事例</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <p className="sec-lead center">
            インターネットトラブル事案の解決実績は100件以上。
            <strong>すべての案件が0円になるわけではありません。</strong>
            事案の内容と請求の根拠を精査したうえで、適正な金額での解決を目指します。
          </p>

          <div className="result-grid">
            <article className="result-card is-primary">
              <p className="rc-tag">示談交渉</p>
              <h3 className="rc-title">トレントアップロードで88万円請求</h3>
              <p className="rc-figures">
                <span className="rc-from"><small>請求額</small>88万円</span>
                <span className="rc-arrow" aria-hidden="true">→</span>
                <span className="rc-to"><small>解決額</small>8万円</span>
              </p>
              <p className="rc-meta">和解／大幅減額</p>
              <p className="rc-desc">
                相手方の請求額の算定根拠を精査したうえで交渉し、
                大幅に減額した金額での和解を成立させた事案です。
              </p>
            </article>

            <article className="result-card">
              <p className="rc-tag">示談交渉</p>
              <h3 className="rc-title">人気漫画のトレントアップロード</h3>
              <p className="rc-figures">
                <span className="rc-from"><small>請求額</small>150万円</span>
                <span className="rc-arrow" aria-hidden="true">→</span>
                <span className="rc-to"><small>解決額</small>50万円</span>
              </p>
              <p className="rc-meta">解決まで 約1ヶ月／和解</p>
              <p className="rc-desc">
                支払い可能な範囲での和解を成立させた事案です。分割でのお支払いにも対応しました。
              </p>
            </article>

            <article className="result-card">
              <p className="rc-tag">示談交渉</p>
              <h3 className="rc-title">トレントで意見照会書が届いた</h3>
              <p className="rc-figures">
                <span className="rc-from"><small>請求額</small>80万円</span>
                <span className="rc-arrow" aria-hidden="true">→</span>
                <span className="rc-to"><small>解決額</small>0円</span>
              </p>
              <p className="rc-desc">
                請求の根拠に疑問があった事案です。裏付けを確認したうえで交渉し、支払いなしで終了しました。
              </p>
            </article>

            <article className="result-card">
              <p className="rc-tag">示談交渉</p>
              <h3 className="rc-title">トレントアップロードで55万円請求</h3>
              <p className="rc-figures">
                <span className="rc-from"><small>請求額</small>55万円</span>
                <span className="rc-arrow" aria-hidden="true">→</span>
                <span className="rc-to"><small>解決額</small>0円</span>
              </p>
              <p className="rc-desc">
                相手方の主張する損害額の算定根拠を争い、支払いなしで解決した事案です。
              </p>
            </article>
          </div>

          <p className="disclaimer">
            ※ 掲載内容は依頼者の同意を得て匿名加工したものです。個々の案件の結果を保証するものではありません。
            請求額が低額でも支払いが必要となる事案、逆に高額の請求が大幅に減額される事案など、結果は事案により異なります。
          </p>
        </div>
      </section>

      {/* ============================================================
           7. 解決までの流れ
           ============================================================ */}
      <section className="sec sec-flow" id="flow">
        <div className="wrap">
          <div className="sec-head">
            <h2>解決までの流れ</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <p className="sec-lead center">ご相談から解決まで、4つのステップで進みます。</p>

          <ol className="flow-list">
            <li className="flow-item">
              <span className="flow-num">1</span>
              <h3>LINEで書類の写真を送る</h3>
              <p>お名前と、届いた書類の写真を送ってください。無料・24時間受付です。弁護士本人が確認し、原則24時間以内にご返信します。</p>
            </li>
            <li className="flow-item">
              <span className="flow-num">2</span>
              <h3>弁護士本人と法律相談<br /><span className="fl-tag">初回無料</span></h3>
              <p>
                担当する弁護士が直接、書類の内容・取り得る対応・見込まれる解決額・費用の総額をご説明します。
                事務所へお越しいただくほか、<strong>遠方の方はGoogle Meetを使ったウェブ相談</strong>にも対応していますので、
                全国どこからでもご相談いただけます。
              </p>
            </li>
            <li className="flow-item">
              <span className="flow-num">3</span>
              <h3>ご依頼・着手金のお支払い</h3>
              <p>ご納得いただけた場合のみご依頼ください。着手金はクレジットカードでお支払いいただけます（分割払いも可能です）。</p>
            </li>
            <li className="flow-item">
              <span className="flow-num">4</span>
              <h3>あとは、すべてお任せ</h3>
              <p>相手方への連絡・回答書の提出・示談交渉まで、弁護士が代理します。進捗はLINEでご報告します。</p>
            </li>
          </ol>

          <div className="flow-note">
            <p><strong>土日祝も対応・原則24時間以内に弁護士本人が返信</strong></p>
            <p>回答期限が迫っている方もご安心ください。最速で当日のご面談も可能です。</p>
          </div>
        </div>
      </section>

      {/* ============================================================
           8. 弁護士紹介
           ============================================================ */}
      <section className="sec sec-lawyer">
        <div className="wrap">
          <div className="sec-head">
            <h2>担当する弁護士</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>

          <div className="lawyer">
            <div className="lawyer-photo">
              {/* 画像差し替え: 弁護士本人の写真 */}
              <img src="https://static.readdy.ai/image/5e182d52a94dfeeda6703180d188c585/23d653c5a2e092151eaee21a33c16434.png" alt="加藤信弁護士" width="400" height="500" loading="lazy" />
            </div>
            <div className="lawyer-body">
              <p className="lawyer-name">加藤 信 <span>弁護士</span></p>
              <p className="lawyer-affil">愛知県弁護士会所属／冨田・島岡法律事務所</p>

              <blockquote className="lawyer-message">
                <p>「怒られるのではないか」と身構えてご相談に来られる方が、とても多いです。</p>
                <p>
                  トレントの仕組みを十分に理解しないまま使ってしまい、書類が届いてはじめて事の重大さを知った——
                  そういう方がほとんどです。反省の気持ちを持ちながら、法的に妥当な解決を求めることは、
                  みなさまの正当な権利です。
                </p>
                <p>
                  私たちの役割は、あなたを責めることではなく、この件をきちんと終わらせて、
                  元の生活に戻っていただくことです。一人で悩まず、まずはご相談ください。
                </p>
              </blockquote>

              <div className="lawyer-cols">
                <div>
                  <h3 className="lawyer-sub">注力分野</h3>
                  <ul className="tick-list">
                    <li>発信者情報開示請求</li>
                    <li>著作権侵害対応</li>
                    <li>示談交渉</li>
                    <li>インターネット法務</li>
                  </ul>
                </div>
                <div>
                  <h3 className="lawyer-sub">経歴</h3>
                  <dl className="career">
                    <div><dt>2012年</dt><dd>愛知県立刈谷高校 卒業</dd></div>
                    <div><dt>2016年</dt><dd>名古屋大学法学部法律・政治学科 卒業</dd></div>
                    <div><dt>2018年</dt><dd>名古屋大学法科大学院 修了</dd></div>
                    <div><dt>2019年</dt><dd>最高裁判所司法研修所 入所（配属庁：大津地方裁判所）</dd></div>
                    <div><dt>2020年</dt><dd>愛知県弁護士会 登録</dd></div>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="callout-warm callout-slim">
            <h3>男性弁護士による、偏見のない対応</h3>
            <p>
              アダルト動画のアップロードに関するご相談も多くいただきます。当事務所では男性弁護士が偏見なく、
              プライバシーに配慮した聞き取りを行います。恥ずかしがらずに、まずはお気軽にご相談ください。
            </p>
          </div>

          <div className="office-grid">
            <div className="office-item">
              <h3>メディア掲載</h3>
              <p><strong>中日新聞掲載</strong>（2025年6月2日）<br />加害者側のインターネットトラブルを多く取り扱う弁護士としてコメント</p>
            </div>
            <div className="office-item">
              <h3>監修実績</h3>
              <p><strong>ITベンゴプロ 監修</strong><br />インターネットトラブル関連の法的知識について専門家として監修</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           9. アクセス
           ============================================================ */}
      <section className="sec sec-access" id="access">
        <div className="wrap">
          <div className="sec-head">
            <h2>アクセス</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>
          <p className="sec-lead center">
            ご来所は必須ではありません。遠方の方は<strong>Google Meetを使ったウェブ相談</strong>で全国どこからでもご相談いただけます。
          </p>

          <div className="access">
            <div className="access-info">
              <p className="ac-route">
                <span className="ac-route-ico" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>
                  </svg>
                </span>
                地下鉄「伏見駅」5番出口から徒歩7分
              </p>

              <dl className="ac-list">
                <div>
                  <dt>所在地</dt>
                  <dd>
                    <strong>冨田・島岡法律事務所</strong><br />
                    〒460-0008 愛知県名古屋市中区栄2-12-12<br />
                    アーク栄白川パークビル3階305号
                  </dd>
                </div>
                <div>
                  <dt>お電話</dt>
                  <dd>
                    <a href="tel:0522041885" data-tel-cta="">052-204-1885</a>（受付 10:00〜19:00）<br />
                    FAX 052-204-1886
                  </dd>
                </div>
                <div>
                  <dt>駐車場</dt>
                  <dd>専用の駐車場はございません。近隣にコインパーキングが多数ありますので、そちらをご利用ください。</dd>
                </div>
                <div>
                  <dt>ご相談方法</dt>
                  <dd>ご来所のほか、Google Meetによるウェブ相談・お電話での相談にも対応しています。</dd>
                </div>
              </dl>
            </div>

            <div className="access-map">
              <iframe
                src="https://maps.google.com/maps?q=%E6%84%9B%E7%9F%A5%E7%9C%8C%E5%90%8D%E5%8F%A4%E5%B1%8B%E5%B8%82%E4%B8%AD%E5%8C%BA%E6%A0%842-12-12%20%E3%82%A2%E3%83%BC%E3%82%AF%E6%A0%84%E7%99%BD%E5%B7%9D%E3%83%91%E3%83%BC%E3%82%AF%E3%83%93%E3%83%AB&amp;z=17&amp;hl=ja&amp;output=embed"
                title="冨田・島岡法律事務所の地図"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
           10. よくある質問
           ============================================================ */}
      <section className="sec sec-faq" id="faq">
        <div className="wrap narrow">
          <div className="sec-head">
            <h2>よくあるご質問</h2>
            <svg className="sec-rule" viewBox="0 0 400 16" aria-hidden="true"><path d="M0 1h182l18 13 18-13h182" fill="none" stroke="currentColor" strokeWidth="2" vectorEffect="non-scaling-stroke"/></svg>
          </div>

          <div className="faq-list">
            <details className="faq-item">
              <summary>家族や職場に知られませんか？</summary>
              <div className="faq-body">
                <p>
                  当事務所からご家族・勤務先へ連絡することは一切ありません。ご相談内容は弁護士の守秘義務により守られます。
                  ご郵送物についても、事務所名を出さない方法や、送付自体を控える対応が可能ですので、
                  ご相談の際にお申し付けください。
                </p>
                <p>
                  なお、ご自宅に届く相手方からの郵便物についても、弁護士が窓口になった後は
                  原則として当事務所宛てに送付されるようになります。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>放置したらどうなりますか？</summary>
              <div className="faq-body">
                <p>
                  事案によって異なります。対応しないまま回答期限を過ぎると、訴訟に進んだり、
                  遅延損害金が加算されたりすることがあります。
                </p>
                <p>
                  お手元の書類がどのような状況にあたるかは、<strong>相手方が誰で、どのような請求根拠を示しているか</strong>を
                  確認すればお伝えできます。まずは書類を拝見させてください。無料で確認し、率直にお伝えします。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>逮捕されたり、前科がついたりしますか？</summary>
              <div className="faq-body">
                <p>
                  著作権侵害は刑事罰の対象となる行為ですが、トレントの個人利用に関する事案の多くは、
                  権利者からの<strong>民事上の損害賠償請求（示談交渉）</strong>として進みます。
                </p>
                <p>
                  ただし、事案の内容や対応の仕方によってリスクは変わります。
                  必要以上に不安になる前に、まずは書類を確認させてください。
                  現時点で何が起きているのか、これから何が起こり得るのかを、順を追ってご説明します。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>すぐにまとまったお金が用意できません。</summary>
              <div className="faq-body">
                <p>
                  着手金はクレジットカードでお支払いいただけます（VISA / Mastercard / JCB / AMEX）。
                  各カード会社の分割払いをご利用いただけますので、手元にすぐに現金がなくても、
                  対応を始めることができます。
                </p>
                <p>
                  相手方へお支払いする示談金についても、分割での和解がまとまるケースがあります。
                  費用面が不安な方も、まずはご相談ください。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>弁護士費用のほかに、いくら払うことになりますか？</summary>
              <div className="faq-body">
                <p>
                  弁護士費用（着手金）とは別に、<strong>相手方へお支払いする示談金・和解金</strong>が発生する場合があります。
                  金額は、対象作品・請求してきた権利者・アップロードの態様などによって大きく異なります。
                </p>
                <p>
                  書類を拝見すれば、これまでの事案からおおよその見込みをお伝えできます。
                  「弁護士費用＋示談金で、総額いくらくらいになるか」を、ご依頼前にご説明します。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>もう自分で相手方に連絡してしまいました。手遅れですか？</summary>
              <div className="faq-body">
                <p>
                  手遅れではありません。すでに連絡してしまった、一部認めてしまった、という段階からのご相談も
                  多くお受けしています。何をどう伝えたかを教えていただければ、そこから取り得る対応をご説明します。
                </p>
                <p>
                  まだ和解書に署名していない段階であれば、条件を交渉できる余地が残っていることが多くあります。
                  <strong>署名・入金の前に、一度ご相談ください。</strong>
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>意見照会書に書かれている作品に、心当たりがありません。</summary>
              <div className="faq-body">
                <p>
                  トレントは、ダウンロードと同時に自動的にアップロード（送信可能化）が行われる仕組みです。
                  そのため「ダウンロードしただけのつもり」でも、記録上はアップロードした側として扱われていることがあります。
                </p>
                <p>
                  一方で、記載された作品にまったく心当たりがない場合、
                  回線の共有や特定の誤りといった可能性も検討します。
                  心当たりがないこと自体が不利になるわけではありませんので、そのままお伝えください。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>自分ではなく、家族が使っていた場合はどうなりますか？</summary>
              <div className="faq-body">
                <p>
                  意見照会書は、回線の契約者に対して送られます。実際に利用したのがご家族であっても、
                  まず契約者に届くのはそのためです。
                </p>
                <p>
                  誰がどのように利用していたかによって、取るべき対応が変わります。
                  ご家族に確認しづらいという事情も含めて、ご相談ください。
                </p>
              </div>
            </details>

            <details className="faq-item">
              <summary>遠方に住んでいますが、依頼できますか？</summary>
              <div className="faq-body">
                <p>
                  はい。LINEとオンライン面談で全国からご依頼いただけます。ご来所は必須ではありません。
                  契約書類も郵送・電子でのやり取りが可能です。
                </p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* ============================================================
           11. 最終CTA
           ============================================================ */}
      <section className="sec sec-final" id="contact">
        <div className="wrap narrow">
          <h2 className="final-title">ひとりで抱えず、<br />まずはご相談ください。</h2>
          <p className="final-lead">
            相談は無料です。費用のお見込みと対応方針をお伝えしたうえで、
            ご納得いただけた場合のみご依頼ください。無理におすすめすることはありません。
          </p>

          <a className="btn btn-line btn-lg btn-block" href={LINE_URL} target="_blank" rel="noopener" data-line-cta="">
            <span className="ico-line" aria-hidden="true"></span>
            <span className="btn-main">LINEで書類の写真を送る</span>
            <span className="btn-sub">無料・24時間受付／原則24時間以内に弁護士本人が返信</span>
          </a>

          <div className="final-alt" id="contact-alt">
            <p className="final-alt-title">LINEをお使いでない方は、こちらから</p>
            <div className="final-alt-btns">
              <a className="btn btn-ghost" href="/contact">
                <span className="btn-main">お問い合わせフォーム</span>
                <span className="btn-sub">24時間受付</span>
              </a>
              <a className="btn btn-ghost" href="tel:0522041885" data-tel-cta="">
                <span className="btn-main">052-204-1885</span>
                <span className="btn-sub">受付時間 10:00〜19:00</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      </main>

      {/* ============================================================
           フッター
           ============================================================ */}
      <footer className="site-footer">
        <div className="wrap">
          <p className="footer-brand">冨田・島岡法律事務所<span>Tomida Shimaoka Law Office</span></p>
          <p className="footer-info">
            冨田・島岡法律事務所｜加藤 信 弁護士（愛知県弁護士会）<br />
            〒460-0008 愛知県名古屋市中区栄2-12-12 アーク栄白川パークビル3階305号<br />
            TEL: 052-204-1885／FAX: 052-204-1886
          </p>
          <nav className="footer-nav" aria-label="フッターメニュー">
            <a href="#fee">料金</a>
            <a href="#flow">解決の流れ</a>
            <a href="#faq">よくある質問</a>
          </nav>
          <p className="footer-copy">&copy; 冨田・島岡法律事務所</p>
        </div>
      </footer>
    </>
  );
}
