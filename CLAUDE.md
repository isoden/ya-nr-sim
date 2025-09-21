# ya-nr-sim - Claude Code 開発ガイド

エルデンリング ナイトレインのビルドシミュレーター

## プロジェクト概要

エルデンリング ナイトレインのビルドシミュレーターアプリケーション。  
ユーザーは自身の所持遺物を登録し、 希望する効果を持ったビルドが構築可能か検索できます。

## 技術スタック

- **フロントエンド**: React 19.1.1 + TypeScript
- **ルーティング**: React Router v7 (file-based routing)
- **スタイリング**: Tailwind CSS v4
- **ビルドツール**: Vite
- **テスト**: Vitest + happy-dom + Testing Library
- **リンティング**: ESLint + typescript-eslint + better-tailwindcss
- **フォーマット**: Prettier
- **バリデーション**: Valibot + @conform-to
- **UI コンポーネント**: react-aria-components

## プロジェクト構造

```
app/
├── routes/                     # React Router v7 ファイルベースルーティング
│   ├── _app._index/           # メインページ（ビルドシミュレーター）
│   │   ├── components/       # ページ固有コンポーネント
│   │   ├── schema/          # ページ固有スキーマ（FormSchema, QuerySchema）
│   │   └── services/        # ページ固有サービス（simulator/）
│   └── _app.manage-relics/   # 遺物管理ページ
├── components/               # 共通コンポーネント
│   ├── forms/              # フォーム関連（Button, Checkbox）
│   ├── RelicInfo/          # 遺物情報表示
│   └── RelicEffectSelector/ # 遺物効果選択
├── data/                    # ゲームデータ定義
│   ├── characters.ts       # キャラクター定義
│   ├── vessels.ts          # 献器（装備枠）定義
│   ├── relicEffects.ts     # 遺物効果定義
│   └── relics.ts          # 遺物定義
├── services/               # 共通サービス
│   └── storage/           # ストレージ関連
├── schema/                 # 共通バリデーションスキーマ
├── hooks/                  # カスタムフック（usePersistedState）
├── app.css                # グローバルCSS + Tailwind
└── root.tsx              # アプリケーションルート
```

## パスエイリアス

- `~/` → `./app/` (例: `~/components/Button`)
- `~/test/` → `./test/`

## 開発ワークフロー

### 開発サーバー起動

```bash
npm run dev
```

### コード品質チェック

```bash
npm run lint          # ESLint 実行
npm run lint:fix      # ESLint 自動修正
npm run typecheck     # TypeScript 型チェック
```

### テスト実行

```bash
npm run test          # テスト watch モード
npm run test:run      # テスト単発実行
npm run coverage:run  # カバレッジレポート生成
```

### ビルド

```bash
npm run build         # プロダクションビルド
npm run build:ci      # CI用ビルド (lint + typecheck + test + build)
```

## コード規約

### TypeScript

- strict モードを使用
- ES2024 + bundler モジュール解決
- 未使用変数は `_` プレフィックスで無視可能

### React

- 関数コンポーネント + `React.FC` 型定義を使用
- JSDoc コメント必須（日本語OK）
- React 19 の新機能を活用

### スタイリング

- Tailwind CSS utilities を使用
- カスタム CSS は `app.css` の適切なレイヤーに追加
- `better-tailwindcss` プラグインでクラス検証

### フォーマット設定 (Prettier)

- セミコロンなし (`semi: false`)
- シングルクォート (`singleQuote: true`)
- 行幅 120文字 (`printWidth: 120`)
- インデント 2スペース (`tabWidth: 2`)

## テスト戦略

- **フレームワーク**: Vitest + happy-dom
- **ユーティリティ**: @testing-library/react + @testing-library/user-event
- **命名規約**: `.spec.ts` / `.spec.tsx` (例: `RelicEffectSelector.spec.tsx`)
- **場所**: `app/**/*.spec.{ts,tsx}`
- **スナップショット**: `__snapshots__/` ディレクトリ内に保存
- **セットアップ**: `setupTests.ts`
- **カバレッジ**: `app/**` ディレクトリが対象

## 重要なファイル

- `app/routes.ts` - React Router v7 ルート設定
- `app/root.tsx` - アプリケーションレイアウト・エラーバウンダリ
- `app/app.css` - グローバルスタイル + Tailwind カスタマイゼーション
- `eslint.config.ts` - ESLint 設定
- `vite.config.ts` - Vite + Vitest 設定
- `tsconfig.json` - TypeScript 設定

## 特記事項

### React Router v7

- **ファイルベースルーティング**: `app/routes/` 配下のファイル構造がURLに対応
- **命名規約**: アンダースコア区切り（`_app._index`, `_app.manage-relics`）
- **ファイル構造**: `route.tsx` がページコンポーネント、同階層に関連ファイル配置
- **型安全性**: 自動生成される Route 型を活用

### ドメインロジック

- **エルデンリング ナイトレイン**: ビルドシミュレーターアプリ
- **遺物（Relic）**: ゲーム内装備アイテム、効果とスロット色を持つ
- **献器（Vessel）**: キャラクターの装備枠構成
- **ビルドシミュレーション**: 条件に基づく最適な遺物組み合わせ計算

### Web Workers + Comlink

- **重い計算処理**: ビルドシミュレーションをワーカーで実行
- **Vite統合**: `?worker` サフィックスでワーカーとしてインポート
- **型安全通信**: Comlink + TypeScript で型安全なワーカー通信

### 国際化

- アプリケーションは日本語ベース (`lang="ja"`)
- コメント・UI テキストは日本語で記述

## よくあるタスク

### 新しいコンポーネントの作成

1. **共通コンポーネント**: `app/components/ComponentName/` でディレクトリ作成
2. **ページ固有**: `app/routes/_app.{route}/components/` に配置
3. **パターン**: TypeScript + React.FC + JSDoc（日本語）
4. **テスト**: 同階層に `.spec.tsx` ファイル作成

### 新しいページの追加

1. **ディレクトリ**: `app/routes/_app.{route-name}/` 作成
2. **メインファイル**: `route.tsx` でページコンポーネント定義
3. **関連ファイル**: `components/`, `schema/`, `services/` を同階層に配置
4. **型安全性**: loader/action で Route 型を活用

### ビルドシミュレーション機能の拡張

1. **計算ロジック**: `app/routes/_app._index/services/simulator/` 内で実装
2. **ワーカー処理**: 重い計算は `worker.ts` で実行
3. **型定義**: `types.ts` でインターフェース定義
4. **テスト**: `.spec.ts` で計算ロジックをテスト

### 遺物・ゲームデータの追加

1. **データ定義**: `app/data/` 配下の適切なファイルに追加
2. **型安全性**: TypeScript 型定義を更新
3. **テスト**: `.spec.ts` でデータ整合性をテスト

### スキーマ定義

1. **共通スキーマ**: `app/schema/` 配下に Valibot スキーマ作成
2. **ページ固有**: `app/routes/_app.{route}/schema/` に配置
3. **フォーム連携**: @conform-to/valibot でフォーム統合
4. **テスト**: `.spec.ts` でバリデーションテスト

## デバッグ・トラブルシューティング

- **型エラー**: `npm run typecheck` で詳細確認
- **リントエラー**: `npm run lint:fix` で自動修正試行
- **テスト失敗**: `npm run test` で詳細確認
- **ビルドエラー**: 依存関係とTypeScript設定を確認
