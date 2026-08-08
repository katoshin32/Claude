# STUDIO からの移行手順（SEOを落とさないための順序）

ドメインは `tomida-shimaoka.com` のまま変更しない。
Google から見て「同じURLの中身が新しくなった」状態にできれば、順位は維持される。

---

## 現行サイトのURL（2026-08-08 時点）

`sitemap-static.xml` より取得。全11ページ。

| URL | 想定される内容 | 新サイトでの対応 | 備考 |
|---|---|---|---|
| `/` | トップ | `src/pages/index.astro` | |
| `/about` | 事務所紹介 | `src/pages/about.astro` | |
| `/service` | 取扱分野 | `src/pages/service.astro` | |
| `/service-1` | **要調査** | `src/pages/service-1.astro` | 下記「要調査」参照 |
| `/fee` | 弁護士費用 | `src/pages/fee.astro` | |
| `/FAQ` | よくある質問 | `src/pages/FAQ.astro` | **大文字。変更禁止** |
| `/news` | お知らせ一覧 | `src/pages/news/index.astro` | |
| `/contact` | お問い合わせ | `src/pages/contact.astro` | |
| `/thanks` | 送信完了 | `src/pages/thanks.astro` | noindex 化した |
| `/privacy_policy` | プライバシーポリシー | `src/pages/privacy_policy.astro` | アンダースコア。変更禁止 |
| `/password` | **要調査** | `src/pages/password.astro` | noindex 化した |

動的ページ（記事）は別サイトマップにあり、**まだ取得していない**。

- `/news/:slug` → `sitemap-dynamic/sitemap-dynamic-news-s--c-slug.xml`
- `/news/category/:slug` → `sitemap-dynamic/sitemap-dynamic-news-s-category-s--c-slug.xml`

この2つの中身を `scripts/legacy-urls.txt` に追記するまで、移行は完了できない。

---

## 要調査（公開前に必ず判断すること）

### 1. `/service` と `/service-1` の重複

末尾の `-1` は STUDIO でページを複製したときの自動採番。
`/service` の作りかけの複製である可能性が高い。放置すると
**重複コンテンツ**として両方の評価が薄まる。

Search Console で `/service-1` の検索流入を確認し、

- **流入がなく内容も重複** → `src/pages/service-1.astro` を削除し、
  `public/_redirects` の `/service-1 /service 301` を有効化
- **独自の内容があり流入もある** → ページとして残し、内容を移植

### 2. `/password` の用途

サイトマップに載っている＝検索対象になっている。STUDIO の
パスワード保護機能に付随するページと思われる。
現在使っていなければ削除してよい。

### 3. `/thanks` が検索対象になっている

送信完了ページが検索結果に出ても利用者の役に立たず、フォームを
経由しない直接流入がコンバージョンとして計測される原因になる。
新サイトでは noindex にした（軽微だが改善点）。

---

## 移行の手順

### 段階1: 現状の記録（作業前に必ず）

順位が下がったときに原因を特定するための比較対象を作る。これを飛ばすと後から追えない。

- [ ] Search Console → 検索パフォーマンスを16か月分エクスポート
- [ ] 流入上位ページ・上位クエリを確定（**これが守るべきページ**）
- [ ] 動的サイトマップ2本を取得し `scripts/legacy-urls.txt` に追記
- [ ] 全ページの `title` / `description` / 本文を保存
- [ ] `/service-1` と `/password` の流入有無を確認

### 段階2: 構築

- [ ] `src/data/firm.yaml` の `TODO` をすべて埋める
- [ ] `src/data/fees.yaml` を実際の料金表に差し替える（**サンプル値のまま公開しない**）
- [ ] 各ページの `TODO` に現行の本文を移植する
  - **本文を短くしないこと。** 検索順位はテキストの情報量に支えられている。
    見た目をすっきりさせたい場合は、削るのではなくアコーディオンで畳む
- [ ] 記事を `src/content/news/` に移植（**ファイル名＝現行スラッグ**）
- [ ] `npm run build && node scripts/check-urls.mjs` が通ることを確認

### 段階3: 検証（本番切替の前）

- [ ] Cloudflare Pages の仮ドメイン（`*.pages.dev`）にデプロイ
- [ ] **仮ドメインを noindex にする**（重複コンテンツ防止・必須）
- [ ] `node scripts/check-urls.mjs` で全URLの一致を確認
- [ ] 表示崩れ・リンク切れをスマートフォンで確認
- [ ] 料金表示が現行サイトと一致しているか確認

### 段階4: 切替

- [ ] DNS を Cloudflare Pages に向ける
- [ ] 仮ドメインの noindex を解除
- [ ] 主要URLを実際に開いて 200 が返ることを確認
- [ ] `/faq`（小文字）が `/FAQ` に転送されることを確認
- [ ] Search Console でサイトマップ（`/sitemap-index.xml`）を再送信

### 段階5: 経過観察

- [ ] Search Console のカバレッジで 404 の急増がないか毎日確認
- [ ] 1〜2週間は順位が揺れる。**ここで慌てて戻さない**
- [ ] **STUDIO の契約は最低3か月維持する**（切り戻し用）
- [ ] 3〜4週間経っても主要クエリが戻らなければ、記録した旧ページと
      新ページを突き合わせ、消えたテキストがないか確認

---

## 移行後に検討したいこと（順位を上げる施策）

現行URLの維持とは別に、純粋な追加として効果が見込めるもの。
既存ページを触らないので、SEO上のリスクなく実施できる。

- **分野別ページの新設** — 現在は `/service` 1ページに全分野がまとまって
  いる。士業サイトでは分野ごとに独立したページを持つ方が圧倒的に強い。
  `/service` は残したまま `/service/souzoku` のように追加する
- **弁護士個人のプロフィールページ** — 法務は Google が YMYL（人生に重大な
  影響を与える領域）として扱う。経歴・登録番号・所属弁護士会の明示は
  信頼性の評価に効く。`firm.yaml` に土台を用意済み
- **記事への署名** — 各記事の `author` に弁護士の id を書くと、
  署名と構造化データが自動で入る
