"""Google Ads キャンペーンデータ取得スクリプト

使い方:
    1. pip install -r requirements.txt
    2. google-ads.yaml.example を google-ads.yaml にコピーし認証情報を入力
    3. python fetch_campaign.py --customer_id YOUR_CUSTOMER_ID --campaign_id CAMPAIGN_ID

キャンペーンIDが不明な場合は --list オプションで一覧を取得できます:
    python fetch_campaign.py --customer_id YOUR_CUSTOMER_ID --list
"""

import argparse
import csv
import os
import sys
from datetime import datetime, timedelta

from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException


def get_client():
    """google-ads.yaml から認証済みクライアントを生成"""
    yaml_path = os.path.join(os.path.dirname(__file__), "google-ads.yaml")
    if not os.path.exists(yaml_path):
        print("エラー: google-ads.yaml が見つかりません。")
        print("google-ads.yaml.example をコピーして認証情報を入力してください。")
        sys.exit(1)
    return GoogleAdsClient.load_from_storage(yaml_path, version="v18")


def list_campaigns(client, customer_id):
    """全キャンペーン一覧を表示"""
    ga_service = client.get_service("GoogleAdsService")
    query = """
        SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.advertising_channel_type,
            campaign.bidding_strategy_type,
            campaign.start_date,
            campaign.end_date,
            campaign_budget.amount_micros
        FROM campaign
        ORDER BY campaign.id
    """
    response = ga_service.search(customer_id=customer_id, query=query)
    campaigns = []
    for row in response:
        c = row.campaign
        b = row.campaign_budget
        campaigns.append({
            "id": c.id,
            "name": c.name,
            "status": c.status.name,
            "channel_type": c.advertising_channel_type.name,
            "bidding_strategy": c.bidding_strategy_type.name,
            "start_date": c.start_date,
            "end_date": c.end_date,
            "daily_budget": b.amount_micros / 1_000_000 if b.amount_micros else 0,
        })
    return campaigns


def fetch_campaign_detail(client, customer_id, campaign_id, days=30):
    """指定キャンペーンの詳細データを取得"""
    ga_service = client.get_service("GoogleAdsService")
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    date_from = start_date.strftime("%Y-%m-%d")
    date_to = end_date.strftime("%Y-%m-%d")

    # キャンペーン概要
    campaign_query = f"""
        SELECT
            campaign.id,
            campaign.name,
            campaign.status,
            campaign.advertising_channel_type,
            campaign.bidding_strategy_type,
            campaign.target_cpa.target_cpa_micros,
            campaign.target_roas.target_roas,
            campaign.start_date,
            campaign.end_date,
            campaign_budget.amount_micros,
            campaign_budget.delivery_method,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversions_value,
            metrics.ctr,
            metrics.average_cpc,
            metrics.average_cpm,
            metrics.cost_per_conversion
        FROM campaign
        WHERE campaign.id = {campaign_id}
            AND segments.date BETWEEN '{date_from}' AND '{date_to}'
    """

    # 広告グループ別パフォーマンス
    adgroup_query = f"""
        SELECT
            ad_group.id,
            ad_group.name,
            ad_group.status,
            ad_group.type,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_per_conversion
        FROM ad_group
        WHERE campaign.id = {campaign_id}
            AND segments.date BETWEEN '{date_from}' AND '{date_to}'
        ORDER BY metrics.cost_micros DESC
    """

    # キーワード別パフォーマンス
    keyword_query = f"""
        SELECT
            ad_group_criterion.keyword.text,
            ad_group_criterion.keyword.match_type,
            ad_group_criterion.quality_info.quality_score,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc,
            metrics.cost_per_conversion
        FROM keyword_view
        WHERE campaign.id = {campaign_id}
            AND segments.date BETWEEN '{date_from}' AND '{date_to}'
        ORDER BY metrics.cost_micros DESC
    """

    # 広告別パフォーマンス
    ad_query = f"""
        SELECT
            ad_group_ad.ad.id,
            ad_group_ad.ad.type,
            ad_group_ad.ad.responsive_search_ad.headlines,
            ad_group_ad.ad.responsive_search_ad.descriptions,
            ad_group_ad.status,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.ctr,
            metrics.average_cpc
        FROM ad_group_ad
        WHERE campaign.id = {campaign_id}
            AND segments.date BETWEEN '{date_from}' AND '{date_to}'
        ORDER BY metrics.impressions DESC
    """

    # 日別パフォーマンス
    daily_query = f"""
        SELECT
            segments.date,
            metrics.impressions,
            metrics.clicks,
            metrics.cost_micros,
            metrics.conversions,
            metrics.conversions_value,
            metrics.ctr,
            metrics.average_cpc
        FROM campaign
        WHERE campaign.id = {campaign_id}
            AND segments.date BETWEEN '{date_from}' AND '{date_to}'
        ORDER BY segments.date
    """

    data = {}

    # キャンペーン概要取得
    response = ga_service.search(customer_id=customer_id, query=campaign_query)
    for row in response:
        c = row.campaign
        m = row.metrics
        b = row.campaign_budget
        data["campaign"] = {
            "id": c.id,
            "name": c.name,
            "status": c.status.name,
            "channel_type": c.advertising_channel_type.name,
            "bidding_strategy": c.bidding_strategy_type.name,
            "daily_budget": b.amount_micros / 1_000_000 if b.amount_micros else 0,
            "impressions": m.impressions,
            "clicks": m.clicks,
            "cost": m.cost_micros / 1_000_000,
            "conversions": m.conversions,
            "conversion_value": m.conversions_value,
            "ctr": m.ctr,
            "avg_cpc": m.average_cpc / 1_000_000 if m.average_cpc else 0,
            "avg_cpm": m.average_cpm / 1_000_000 if m.average_cpm else 0,
            "cost_per_conversion": m.cost_per_conversion / 1_000_000 if m.cost_per_conversion else 0,
        }
        break

    # 広告グループ取得
    data["ad_groups"] = []
    response = ga_service.search(customer_id=customer_id, query=adgroup_query)
    for row in response:
        ag = row.ad_group
        m = row.metrics
        data["ad_groups"].append({
            "id": ag.id,
            "name": ag.name,
            "status": ag.status.name,
            "type": ag.type_.name,
            "impressions": m.impressions,
            "clicks": m.clicks,
            "cost": m.cost_micros / 1_000_000,
            "conversions": m.conversions,
            "ctr": m.ctr,
            "avg_cpc": m.average_cpc / 1_000_000 if m.average_cpc else 0,
            "cost_per_conversion": m.cost_per_conversion / 1_000_000 if m.cost_per_conversion else 0,
        })

    # キーワード取得
    data["keywords"] = []
    response = ga_service.search(customer_id=customer_id, query=keyword_query)
    for row in response:
        kw = row.ad_group_criterion
        m = row.metrics
        data["keywords"].append({
            "keyword": kw.keyword.text,
            "match_type": kw.keyword.match_type.name,
            "quality_score": kw.quality_info.quality_score if kw.quality_info.quality_score else None,
            "impressions": m.impressions,
            "clicks": m.clicks,
            "cost": m.cost_micros / 1_000_000,
            "conversions": m.conversions,
            "ctr": m.ctr,
            "avg_cpc": m.average_cpc / 1_000_000 if m.average_cpc else 0,
            "cost_per_conversion": m.cost_per_conversion / 1_000_000 if m.cost_per_conversion else 0,
        })

    # 広告取得
    data["ads"] = []
    response = ga_service.search(customer_id=customer_id, query=ad_query)
    for row in response:
        ad = row.ad_group_ad.ad
        m = row.metrics
        headlines = []
        descriptions = []
        if ad.responsive_search_ad:
            headlines = [h.text for h in ad.responsive_search_ad.headlines]
            descriptions = [d.text for d in ad.responsive_search_ad.descriptions]
        data["ads"].append({
            "id": ad.id,
            "type": ad.type_.name,
            "headlines": headlines,
            "descriptions": descriptions,
            "status": row.ad_group_ad.status.name,
            "impressions": m.impressions,
            "clicks": m.clicks,
            "cost": m.cost_micros / 1_000_000,
            "conversions": m.conversions,
            "ctr": m.ctr,
            "avg_cpc": m.average_cpc / 1_000_000 if m.average_cpc else 0,
        })

    # 日別データ取得
    data["daily"] = []
    response = ga_service.search(customer_id=customer_id, query=daily_query)
    for row in response:
        m = row.metrics
        data["daily"].append({
            "date": row.segments.date,
            "impressions": m.impressions,
            "clicks": m.clicks,
            "cost": m.cost_micros / 1_000_000,
            "conversions": m.conversions,
            "conversion_value": m.conversions_value,
            "ctr": m.ctr,
            "avg_cpc": m.average_cpc / 1_000_000 if m.average_cpc else 0,
        })

    return data


def save_to_csv(data, output_dir="output"):
    """取得データをCSVファイルに保存"""
    os.makedirs(output_dir, exist_ok=True)
    campaign_name = data.get("campaign", {}).get("name", "unknown")
    prefix = campaign_name.replace(" ", "_")

    # キャンペーン概要
    if "campaign" in data:
        path = os.path.join(output_dir, f"{prefix}_summary.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=data["campaign"].keys())
            writer.writeheader()
            writer.writerow(data["campaign"])
        print(f"  保存: {path}")

    # 広告グループ
    if data.get("ad_groups"):
        path = os.path.join(output_dir, f"{prefix}_ad_groups.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=data["ad_groups"][0].keys())
            writer.writeheader()
            writer.writerows(data["ad_groups"])
        print(f"  保存: {path}")

    # キーワード
    if data.get("keywords"):
        path = os.path.join(output_dir, f"{prefix}_keywords.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=data["keywords"][0].keys())
            writer.writeheader()
            writer.writerows(data["keywords"])
        print(f"  保存: {path}")

    # 広告
    if data.get("ads"):
        path = os.path.join(output_dir, f"{prefix}_ads.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            fieldnames = [k for k in data["ads"][0].keys() if k not in ("headlines", "descriptions")]
            fieldnames.extend(["headlines", "descriptions"])
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            for ad in data["ads"]:
                row = {**ad}
                row["headlines"] = " | ".join(ad.get("headlines", []))
                row["descriptions"] = " | ".join(ad.get("descriptions", []))
                writer.writerow(row)
        print(f"  保存: {path}")

    # 日別データ
    if data.get("daily"):
        path = os.path.join(output_dir, f"{prefix}_daily.csv")
        with open(path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=data["daily"][0].keys())
            writer.writeheader()
            writer.writerows(data["daily"])
        print(f"  保存: {path}")


def main():
    parser = argparse.ArgumentParser(description="Google Ads キャンペーンデータ取得")
    parser.add_argument("--customer_id", required=True, help="Google Ads 顧客ID (ハイフンなし 10桁)")
    parser.add_argument("--campaign_id", type=int, help="取得するキャンペーンID")
    parser.add_argument("--list", action="store_true", help="キャンペーン一覧を表示")
    parser.add_argument("--days", type=int, default=30, help="取得期間(日数, デフォルト30)")
    parser.add_argument("--output", default="output", help="出力ディレクトリ")
    args = parser.parse_args()

    customer_id = args.customer_id.replace("-", "")

    try:
        client = get_client()

        if args.list:
            print("\n=== キャンペーン一覧 ===")
            campaigns = list_campaigns(client, customer_id)
            if not campaigns:
                print("キャンペーンが見つかりません。")
                return
            for c in campaigns:
                print(f"  ID: {c['id']}  |  {c['name']}  |  {c['status']}  |  "
                      f"{c['channel_type']}  |  予算: ¥{c['daily_budget']:,.0f}/日")
            return

        if not args.campaign_id:
            print("エラー: --campaign_id を指定するか、--list で一覧を確認してください。")
            sys.exit(1)

        print(f"\nキャンペーン {args.campaign_id} のデータを取得中 (過去{args.days}日間)...")
        data = fetch_campaign_detail(client, customer_id, args.campaign_id, args.days)

        if "campaign" not in data:
            print("エラー: キャンペーンが見つかりません。IDを確認してください。")
            sys.exit(1)

        print(f"\n=== {data['campaign']['name']} ===")
        c = data["campaign"]
        print(f"  ステータス: {c['status']}")
        print(f"  チャネル: {c['channel_type']}")
        print(f"  入札戦略: {c['bidding_strategy']}")
        print(f"  日予算: ¥{c['daily_budget']:,.0f}")
        print(f"  表示回数: {c['impressions']:,}")
        print(f"  クリック数: {c['clicks']:,}")
        print(f"  費用: ¥{c['cost']:,.0f}")
        print(f"  CTR: {c['ctr']:.2%}")
        print(f"  平均CPC: ¥{c['avg_cpc']:,.0f}")
        print(f"  コンバージョン: {c['conversions']:.1f}")
        print(f"  CPA: ¥{c['cost_per_conversion']:,.0f}")

        print(f"\n広告グループ数: {len(data.get('ad_groups', []))}")
        print(f"キーワード数: {len(data.get('keywords', []))}")
        print(f"広告数: {len(data.get('ads', []))}")

        print(f"\nCSVファイルを保存中...")
        save_to_csv(data, args.output)
        print(f"\n完了! output/ ディレクトリのCSVを確認してください。")
        print("次のステップ: python review_campaign.py --input output/")

    except GoogleAdsException as ex:
        print(f"\nGoogle Ads API エラー:")
        for error in ex.failure.errors:
            print(f"  {error.error_code}: {error.message}")
        sys.exit(1)


if __name__ == "__main__":
    main()
