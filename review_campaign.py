"""Google Ads キャンペーンレビュー分析スクリプト

fetch_campaign.py で出力したCSVを読み込み、自動レビューレポートを生成します。

使い方:
    python review_campaign.py --input output/
"""

import argparse
import csv
import glob
import os
import sys


def load_csv(path):
    """CSVファイルを辞書リストとして読み込む"""
    with open(path, "r", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def to_float(val, default=0.0):
    try:
        return float(val)
    except (ValueError, TypeError):
        return default


def review_campaign_summary(data):
    """キャンペーン概要のレビュー"""
    findings = []
    row = data[0]

    status = row.get("status", "")
    if status != "ENABLED":
        findings.append(f"⚠ キャンペーンステータスが {status} です。有効化を検討してください。")

    ctr = to_float(row.get("ctr"))
    if ctr < 0.02:
        findings.append(f"⚠ CTR が {ctr:.2%} と低い。広告文やキーワードの見直しを推奨します（業界平均: 2-5%）。")
    elif ctr > 0.05:
        findings.append(f"✓ CTR {ctr:.2%} は良好です。")

    conversions = to_float(row.get("conversions"))
    cost = to_float(row.get("cost"))
    cpa = to_float(row.get("cost_per_conversion"))

    if conversions == 0 and cost > 0:
        findings.append(f"⚠ 費用 ¥{cost:,.0f} を消化していますがコンバージョンが0件です。"
                        "ランディングページやコンバージョン設定の確認を推奨します。")
    elif cpa > 0:
        findings.append(f"  CPA: ¥{cpa:,.0f} — 目標CPAと比較して適切か確認してください。")

    clicks = to_float(row.get("clicks"))
    impressions = to_float(row.get("impressions"))
    if impressions > 0 and clicks > 0:
        conv_rate = conversions / clicks if clicks > 0 else 0
        if conv_rate < 0.01:
            findings.append(f"⚠ コンバージョン率 {conv_rate:.2%} が低い。LP改善を検討してください。")

    budget = to_float(row.get("daily_budget"))
    if budget > 0:
        findings.append(f"  日予算: ¥{budget:,.0f}")

    return findings


def review_ad_groups(data):
    """広告グループのレビュー"""
    findings = []

    if len(data) == 1:
        findings.append("⚠ 広告グループが1つしかありません。テーマごとに分割することでパフォーマンス改善が期待できます。")

    total_cost = sum(to_float(r.get("cost")) for r in data)
    for row in data:
        name = row.get("name", "不明")
        cost = to_float(row.get("cost"))
        conversions = to_float(row.get("conversions"))
        ctr = to_float(row.get("ctr"))
        status = row.get("status", "")

        if status != "ENABLED":
            continue

        cost_share = cost / total_cost if total_cost > 0 else 0

        if cost > 0 and conversions == 0 and cost_share > 0.2:
            findings.append(f"⚠ [{name}] 全体の {cost_share:.0%} の費用を消化しているがCV 0件。"
                            "一時停止または見直しを検討。")

        if ctr < 0.01:
            findings.append(f"⚠ [{name}] CTR {ctr:.2%} — 広告文・キーワードの関連性を改善してください。")

    return findings


def review_keywords(data):
    """キーワードのレビュー"""
    findings = []

    low_qs = [r for r in data if to_float(r.get("quality_score")) > 0 and to_float(r.get("quality_score")) < 5]
    if low_qs:
        findings.append(f"⚠ 品質スコア5未満のキーワードが {len(low_qs)} 件あります:")
        for kw in low_qs[:5]:
            findings.append(f"    - \"{kw['keyword']}\" (QS: {kw['quality_score']}, "
                            f"マッチ: {kw['match_type']})")

    high_cost_no_conv = [
        r for r in data
        if to_float(r.get("cost")) > 0 and to_float(r.get("conversions")) == 0
    ]
    high_cost_no_conv.sort(key=lambda r: to_float(r.get("cost")), reverse=True)
    if high_cost_no_conv:
        total_wasted = sum(to_float(r.get("cost")) for r in high_cost_no_conv)
        findings.append(f"⚠ CV 0件のキーワードに ¥{total_wasted:,.0f} を消化 ({len(high_cost_no_conv)}件):")
        for kw in high_cost_no_conv[:5]:
            findings.append(f"    - \"{kw['keyword']}\" ¥{to_float(kw['cost']):,.0f} "
                            f"({to_float(kw.get('clicks')):.0f}クリック)")

    broad_match = [r for r in data if r.get("match_type") == "BROAD"]
    if broad_match:
        broad_cost = sum(to_float(r.get("cost")) for r in broad_match)
        findings.append(f"  部分一致キーワード: {len(broad_match)}件 (費用: ¥{broad_cost:,.0f})")
        findings.append("  → 検索語句レポートを確認し、不要な語句を除外キーワードに追加することを推奨。")

    return findings


def review_ads(data):
    """広告のレビュー"""
    findings = []

    enabled_ads = [r for r in data if r.get("status") == "ENABLED"]
    if len(enabled_ads) < 2:
        findings.append("⚠ 有効な広告が2本未満です。A/Bテストのため、最低2-3本の広告を運用することを推奨。")

    for ad in data:
        headlines = ad.get("headlines", "")
        if headlines:
            headline_list = headlines.split(" | ")
            if len(headline_list) < 8:
                findings.append(f"⚠ 広告ID {ad.get('id')}: 見出しが {len(headline_list)} 本。"
                                "レスポンシブ検索広告は8-15本を推奨。")

        descriptions = ad.get("descriptions", "")
        if descriptions:
            desc_list = descriptions.split(" | ")
            if len(desc_list) < 3:
                findings.append(f"⚠ 広告ID {ad.get('id')}: 説明文が {len(desc_list)} 本。3-4本を推奨。")

    return findings


def review_daily_trends(data):
    """日別トレンドのレビュー"""
    findings = []

    if len(data) < 7:
        return findings

    costs = [to_float(r.get("cost")) for r in data]
    avg_cost = sum(costs) / len(costs) if costs else 0
    max_cost = max(costs) if costs else 0
    min_cost = min(costs) if costs else 0

    if avg_cost > 0 and (max_cost / avg_cost > 2):
        findings.append(f"⚠ 日別費用に大きなばらつき (平均: ¥{avg_cost:,.0f}, 最大: ¥{max_cost:,.0f})。"
                        "予算上限に達している日がある可能性があります。")

    zero_days = sum(1 for c in costs if c == 0)
    if zero_days > 0:
        findings.append(f"⚠ 費用が0円の日が {zero_days} 日あります。配信制限や予算枯渇の可能性。")

    return findings


def generate_report(input_dir):
    """CSVファイルを読み込んでレビューレポートを生成"""
    report_lines = ["=" * 60, "  Google Ads キャンペーン レビューレポート", "=" * 60, ""]

    # サマリーCSV検索
    summary_files = glob.glob(os.path.join(input_dir, "*_summary.csv"))
    if not summary_files:
        print(f"エラー: {input_dir} にサマリーCSVが見つかりません。")
        print("先に fetch_campaign.py を実行してデータを取得してください。")
        sys.exit(1)

    for summary_file in summary_files:
        prefix = os.path.basename(summary_file).replace("_summary.csv", "")

        summary_data = load_csv(summary_file)
        if summary_data:
            report_lines.append(f"■ キャンペーン: {summary_data[0].get('name', prefix)}")
            report_lines.append("-" * 40)
            report_lines.append("\n【1. キャンペーン概要】")
            report_lines.extend(review_campaign_summary(summary_data))

        # 広告グループ
        ag_file = os.path.join(input_dir, f"{prefix}_ad_groups.csv")
        if os.path.exists(ag_file):
            ag_data = load_csv(ag_file)
            if ag_data:
                report_lines.append(f"\n【2. 広告グループ ({len(ag_data)}件)】")
                report_lines.extend(review_ad_groups(ag_data))

        # キーワード
        kw_file = os.path.join(input_dir, f"{prefix}_keywords.csv")
        if os.path.exists(kw_file):
            kw_data = load_csv(kw_file)
            if kw_data:
                report_lines.append(f"\n【3. キーワード ({len(kw_data)}件)】")
                report_lines.extend(review_keywords(kw_data))

        # 広告
        ad_file = os.path.join(input_dir, f"{prefix}_ads.csv")
        if os.path.exists(ad_file):
            ad_data = load_csv(ad_file)
            if ad_data:
                report_lines.append(f"\n【4. 広告クリエイティブ ({len(ad_data)}件)】")
                report_lines.extend(review_ads(ad_data))

        # 日別トレンド
        daily_file = os.path.join(input_dir, f"{prefix}_daily.csv")
        if os.path.exists(daily_file):
            daily_data = load_csv(daily_file)
            if daily_data:
                report_lines.append(f"\n【5. 日別トレンド ({len(daily_data)}日間)】")
                report_lines.extend(review_daily_trends(daily_data))

        report_lines.append("")

    report_lines.extend([
        "",
        "=" * 60,
        "  レビュー完了",
        "=" * 60,
        "",
        "次のアクション:",
        "  1. ⚠ マークの項目を優先的に対応",
        "  2. 品質スコアの低いキーワードの改善",
        "  3. CV 0件のキーワードの除外 or 入札調整",
        "  4. 広告文のA/Bテスト実施",
        "  5. 検索語句レポートの定期チェック",
    ])

    return "\n".join(report_lines)


def main():
    parser = argparse.ArgumentParser(description="Google Ads キャンペーンレビュー分析")
    parser.add_argument("--input", default="output", help="CSVファイルのディレクトリ")
    parser.add_argument("--save", help="レポートをファイルに保存 (例: report.txt)")
    args = parser.parse_args()

    report = generate_report(args.input)
    print(report)

    if args.save:
        with open(args.save, "w", encoding="utf-8") as f:
            f.write(report)
        print(f"\nレポートを {args.save} に保存しました。")


if __name__ == "__main__":
    main()
