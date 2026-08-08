/**
 * 弁護士費用マスタの読み込み・検証・整形。
 *
 * ここが「料金の矛盾を人力チェックで防ぐ」のをやめ、
 * 「そもそも矛盾したデータでは公開できない」に置き換えるための中核。
 *
 * 検証は astro build の実行時に走り、1件でも違反があればビルドが失敗する。
 * = 不正な料金データが本番に出ることはない。
 */
// ?raw でYAMLの中身をビルド時に埋め込む。
// 実行時にファイルを読みに行かないので、出力先の構成に依存しない。
import source from '../data/fees.yaml?raw';
import { parse } from 'yaml';
import { z } from 'zod';

/* ------------------------------------------------------------------ */
/* スキーマ定義                                                        */
/* ------------------------------------------------------------------ */

const yen = z
  .number()
  .int('金額は円単位の整数で記入してください（小数は不可）')
  .nonnegative('金額に負の数は指定できません');

const rate = z
  .number()
  .positive('料率は0より大きい値で記入してください')
  .max(1, '料率は小数で記入してください（例: 8% → 0.08）。1を超える値は誤りです');

const chargeFree = z.object({ type: z.literal('free') });

const chargeFixed = z.object({
  type: z.literal('fixed'),
  amount: yen,
});

const chargeHourly = z.object({
  type: z.literal('hourly'),
  amount: yen,
});

const chargePercent = z.object({
  type: z.literal('percent'),
  rate,
  base: z.string().min(1, 'percent には base（何に対する割合か）が必要です'),
});

const chargeTiered = z.object({
  type: z.literal('tiered'),
  base: z.string().min(1, 'tiered には base（何に対する段階か）が必要です'),
  tiers: z
    .array(
      z.object({
        // この金額以下に適用。最終段は null（上限なし）。
        upTo: yen.nullable(),
        rate: rate.optional(),
        amount: yen.optional(),
      }).refine(
        (t) => (t.rate !== undefined) !== (t.amount !== undefined),
        { message: '各段には rate か amount のどちらか一方だけを指定してください' },
      ),
    )
    .min(1)
    .refine((tiers) => tiers[tiers.length - 1]!.upTo === null, {
      message: '最終段の upTo は null（上限なし）にしてください。上限を切ると、その額を超える案件の料金が表示できなくなります',
    })
    .refine(
      (tiers) => {
        // 最終段以外は昇順であること。順序が狂うと計算結果が不正になる。
        const bounded = tiers.slice(0, -1).map((t) => t.upTo!);
        return bounded.every((v, i) => i === 0 || v > bounded[i - 1]!);
      },
      { message: 'tiers の upTo は小さい順に並べてください' },
    ),
});

const charge = z.discriminatedUnion('type', [
  chargeFree,
  chargeFixed,
  chargeHourly,
  chargePercent,
  chargeTiered,
]);

export type Charge = z.infer<typeof charge>;

const slug = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'id は英小文字・数字・ハイフンのみで記入してください');

const feeItem = z.object({
  id: slug,
  name: z.string().min(1),
  consultation: charge.optional(),
  retainer: charge.optional(),     // 着手金
  successFee: charge.optional(),   // 報酬金
  handlingFee: charge.optional(),  // 手数料
  monthly: charge.optional(),      // 顧問料（月額）
  perDiem: charge.optional(),      // 日当
  notes: z.array(z.string()).default([]),
}).refine(
  (item) =>
    [item.consultation, item.retainer, item.successFee, item.handlingFee, item.monthly, item.perDiem]
      .some((c) => c !== undefined),
  { message: '料金項目が1つも設定されていません' },
);

export type FeeItem = z.infer<typeof feeItem>;

const feeCategory = z.object({
  id: slug,
  name: z.string().min(1),
  description: z.string().optional(),
  items: z.array(feeItem).min(1, 'カテゴリには最低1つの料金項目が必要です'),
});

export type FeeCategory = z.infer<typeof feeCategory>;

const feeSchema = z
  .object({
    taxRate: z.number().min(0).max(1),
    taxDisplay: z.enum(['included', 'excluded']),
    categories: z.array(feeCategory).min(1),
  })
  .superRefine((data, ctx) => {
    // id の重複はコピペ運用の典型的な事故。ビルドを止める。
    const seenItem = new Map<string, string>();
    const seenCategory = new Set<string>();

    for (const category of data.categories) {
      if (seenCategory.has(category.id)) {
        ctx.addIssue({
          code: 'custom',
          message: `カテゴリ id "${category.id}" が重複しています`,
          path: ['categories'],
        });
      }
      seenCategory.add(category.id);

      for (const item of category.items) {
        const previous = seenItem.get(item.id);
        if (previous) {
          ctx.addIssue({
            code: 'custom',
            message: `料金 id "${item.id}" が重複しています（${previous} と ${category.id}）。参照先が一意に定まらなくなります`,
            path: ['categories'],
          });
        }
        seenItem.set(item.id, category.id);
      }
    }
  });

/* ------------------------------------------------------------------ */
/* 読み込み                                                            */
/* ------------------------------------------------------------------ */

const parsed = feeSchema.safeParse(parse(source));

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(
    `src/data/fees.yaml の内容に問題があります。修正するまで公開できません。\n${details}`,
  );
}

export const fees = parsed.data;

/* ------------------------------------------------------------------ */
/* 参照ヘルパー                                                        */
/* ------------------------------------------------------------------ */

const itemIndex = new Map<string, FeeItem>(
  fees.categories.flatMap((c) => c.items.map((i) => [i.id, i] as const)),
);

/**
 * 料金項目を id で取得する。ページ側は必ずこれを通す。
 * 存在しない id を書いた時点でビルドが失敗するので、
 * 「消した料金プランへの参照がページに残る」事故が起きない。
 */
export function getFee(id: string): FeeItem {
  const item = itemIndex.get(id);
  if (!item) {
    const available = [...itemIndex.keys()].join(', ');
    throw new Error(
      `料金 id "${id}" は fees.yaml に存在しません。\n利用可能な id: ${available}`,
    );
  }
  return item;
}

export function getCategory(id: string): FeeCategory {
  const category = fees.categories.find((c) => c.id === id);
  if (!category) {
    const available = fees.categories.map((c) => c.id).join(', ');
    throw new Error(
      `料金カテゴリ id "${id}" は fees.yaml に存在しません。\n利用可能な id: ${available}`,
    );
  }
  return category;
}

/* ------------------------------------------------------------------ */
/* 表示整形                                                            */
/* ------------------------------------------------------------------ */

const jpy = new Intl.NumberFormat('ja-JP');

/** 税抜額から表示額を作る。税込・税抜の表記ゆれをここに集約する。 */
export function money(exclusive: number): string {
  if (fees.taxDisplay === 'excluded') {
    return `${jpy.format(exclusive)}円（税別）`;
  }
  const inclusive = Math.floor(exclusive * (1 + fees.taxRate));
  return `${jpy.format(inclusive)}円（税込）`;
}

/** charge を人が読める1行に整形する。 */
export function formatCharge(value: Charge | undefined): string {
  if (!value) return '—';

  switch (value.type) {
    case 'free':
      return '無料';
    case 'fixed':
      return money(value.amount);
    case 'hourly':
      return `${money(value.amount)} / 1時間`;
    case 'percent':
      return `${value.base}の ${formatRate(value.rate)}`;
    case 'tiered':
      return value.tiers
        .map((tier, index) => {
          const previous = index === 0 ? 0 : value.tiers[index - 1]!.upTo!;
          const scope =
            tier.upTo === null
              ? `${jpy.format(previous)}円超`
              : index === 0
                ? `${jpy.format(tier.upTo)}円以下`
                : `${jpy.format(previous)}円超 ${jpy.format(tier.upTo)}円以下`;
          const amount =
            tier.rate !== undefined ? formatRate(tier.rate) : money(tier.amount!);
          return `${scope}：${amount}`;
        })
        .join(' / ');
  }
}

/** 段階制・割合制の base（「経済的利益」等）を取り出す。 */
export function chargeBase(value: Charge | undefined): string | null {
  if (!value) return null;
  if (value.type === 'percent' || value.type === 'tiered') return value.base;
  return null;
}

function formatRate(value: number): string {
  const percent = value * 100;
  const rendered = Number.isInteger(percent) ? String(percent) : percent.toFixed(1);
  // 割合にも消費税がかかるため、税込率を併記して認識のずれを防ぐ。
  if (fees.taxDisplay === 'included') {
    const inclusive = percent * (1 + fees.taxRate);
    const renderedInclusive = Number.isInteger(inclusive)
      ? String(inclusive)
      : inclusive.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
    return `${renderedInclusive}%（税込）`;
  }
  return `${rendered}%（税別）`;
}
