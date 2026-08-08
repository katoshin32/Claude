/**
 * 事務所基本情報の読み込み・検証。
 * ヘッダー/フッター/構造化データはすべてここを参照する。
 */
import source from '../data/firm.yaml?raw';
import { parse } from 'yaml';
import { z } from 'zod';

const lawyer = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  nameKana: z.string().default(''),
  title: z.string().default('弁護士'),
  registrationNumber: z.string().default(''),
  barAssociation: z.string().default(''),
  admittedYear: z.number().int().nullable().default(null),
  practiceAreas: z.array(z.string()).default([]),
  bio: z.string().default(''),
});

const firmSchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().default(''),
  url: z.url(),
  address: z.object({
    postalCode: z.string(),
    region: z.string(),
    locality: z.string(),
    street: z.string(),
  }),
  tel: z.string(),
  fax: z.string().default(''),
  email: z.string(),
  barAssociation: z.string().default(''),
  businessHours: z.object({
    weekdays: z.string(),
    note: z.string().default(''),
  }),
  lawyers: z.array(lawyer).min(1),
});

const parsed = firmSchema.safeParse(parse(source));

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    .join('\n');
  throw new Error(`src/data/firm.yaml の内容に問題があります。\n${details}`);
}

export const firm = parsed.data;

/** 住所を1行に整形する。表記を1箇所に固定し、ページ間のゆれを防ぐ。 */
export const addressLine = [
  firm.address.postalCode ? `〒${firm.address.postalCode}` : '',
  firm.address.region,
  firm.address.locality,
  firm.address.street,
]
  .filter((part) => part && part !== 'TODO')
  .join(' ');

/** 未入力（TODO）の項目を洗い出す。ビルド時に警告するために使う。 */
export function pendingFirmFields(): string[] {
  const pending: string[] = [];
  const walk = (value: unknown, path: string) => {
    if (typeof value === 'string') {
      if (value === 'TODO') pending.push(path);
      return;
    }
    if (value === null) {
      pending.push(path);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, `${path}[${index}]`));
      return;
    }
    if (typeof value === 'object') {
      for (const [key, entry] of Object.entries(value as Record<string, unknown>)) {
        walk(entry, path ? `${path}.${key}` : key);
      }
    }
  };
  walk(firm, '');
  return pending;
}
