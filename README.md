# ダイナミックフロー・ワークスペース

Claude Code を業務（ドキュメント作成 / 運用・自動化）で活用するための設定・フロー集です。
**CLI からでも Web/モバイル（claude.ai/code）からでも同じフローが動く**よう、すべて
プロジェクト配下にコミットしています。

## 何ができるか

| コマンド | 内容 |
|----------|------|
| `/weekly-report` | カレンダー・メール・GitHub・Asana から週次活動を集計し Notion へ保存 |
| `/meeting-notes` | 生メモ／文字起こしを構造化された議事録にして Notion へ |
| `/doc-review`    | ドキュメントを5観点で品質レビュー（修正提案のみ） |
| `/inbox-triage`  | 受信メールを分類・ラベル付けし、要対応分は返信下書きを作成（送信しない） |

使い方: ターミナルまたは Web セッションで上記コマンドを実行するだけ。引数の例は各コマンドの
`argument-hint` を参照してください（例: `/weekly-report 先週`）。

## 構成

```
CLAUDE.md                      … 常に読まれる前提・規約
README.md                      … この説明
docs/dynamic-flow-design.md    … 設計・活用方針（まずここを読む）
.claude/
  commands/                    … スラッシュコマンド（定型フロー）
  agents/doc-reviewer.md       … ドキュメント品質レビュー専門エージェント
  settings.json                … 権限設定
```

## はじめに読む

設計の全体像と段階的な導入手順は **[docs/dynamic-flow-design.md](docs/dynamic-flow-design.md)** にあります。

## 前提

- Notion / Gmail / Google Drive / Google Calendar / GitHub / Asana の各 MCP 連携が有効であること。
- 外向き・不可逆な操作（メール送信・タスク作成・予定削除など）は、各フローとも
  既定で「下書き・提案まで」とし、実行は人間の承認後に行います。
