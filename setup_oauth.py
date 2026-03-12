"""Google Ads API OAuth2 リフレッシュトークン取得ヘルパー

事前準備:
    1. Google Cloud Console で OAuth2 クライアントID を作成済み
    2. client_id と client_secret を取得済み

使い方:
    pip install google-auth google-auth-oauthlib
    python setup_oauth.py --client_id YOUR_CLIENT_ID --client_secret YOUR_CLIENT_SECRET
"""

import argparse
import sys

try:
    from google_auth_oauthlib.flow import InstalledAppFlow
except ImportError:
    print("必要なパッケージをインストールしてください:")
    print("  pip install google-auth google-auth-oauthlib")
    sys.exit(1)


SCOPES = ["https://www.googleapis.com/auth/adwords"]


def main():
    parser = argparse.ArgumentParser(description="Google Ads OAuth2 リフレッシュトークン取得")
    parser.add_argument("--client_id", required=True, help="OAuth2 クライアントID")
    parser.add_argument("--client_secret", required=True, help="OAuth2 クライアントシークレット")
    args = parser.parse_args()

    client_config = {
        "installed": {
            "client_id": args.client_id,
            "client_secret": args.client_secret,
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "redirect_uris": ["http://localhost"],
        }
    }

    flow = InstalledAppFlow.from_client_config(client_config, scopes=SCOPES)

    print("\nブラウザが開きます。Google アカウントでログインし、アクセスを許可してください。")
    print("(ブラウザが開かない場合は、表示されるURLをコピーしてブラウザで開いてください)\n")

    credentials = flow.run_local_server(port=8080)

    print("\n" + "=" * 50)
    print("  OAuth2 認証成功!")
    print("=" * 50)
    print(f"\nrefresh_token: {credentials.refresh_token}")
    print("\nこの値を google-ads.yaml の refresh_token に設定してください。")
    print("=" * 50)


if __name__ == "__main__":
    main()
