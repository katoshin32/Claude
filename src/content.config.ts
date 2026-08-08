import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * お知らせ・コラム（現行サイトの /news 配下）。
 *
 * ファイル名がそのままURLになる:
 *   src/content/news/foo.md  →  /news/foo
 *
 * ★重要★
 * 既存記事を移す際は、STUDIO 側のスラッグとファイル名を必ず一致させること。
 * ここがずれると、その記事が積み上げた検索評価が失われる。
 */
const news = defineCollection({
  loader: glob({ base: './src/content/news', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    // 検索結果に出る説明文。空欄を作らせないため必須にしている。
    description: z.string().min(1),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    // カテゴリのスラッグ。現行の /news/category/:slug をそのまま維持する。
    category: z.string().regex(/^[a-z0-9-]+$/),
    categoryName: z.string().min(1),
    // 執筆・監修者（firm.yaml の lawyers.id）。
    // 法務はYMYL領域で、書き手の明示が評価に効く。
    author: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { news };
