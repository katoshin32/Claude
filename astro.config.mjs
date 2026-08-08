// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://tomida-shimaoka.com',

  // 現行サイト（STUDIO）のURLは末尾スラッシュなし（例: /fee, /about）。
  // SEO評価を引き継ぐため、出力URLを完全に一致させる。
  // format: 'file' → dist/fee.html を出力し /fee で配信される。
  // format: 'directory'（既定）だと /fee/ になり、現行URLと不一致になるので
  // 変更しないこと。
  trailingSlash: 'never',
  build: {
    format: 'file',
  },

  integrations: [
    sitemap({
      // 検索結果に出さないページはサイトマップからも除外する。
      filter: (page) => {
        const path = new URL(page).pathname;
        return !['/thanks', '/password'].includes(path);
      },
    }),
  ],
});
