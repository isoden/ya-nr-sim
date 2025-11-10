# ya-nr-sim - Claude Code 開発ガイド

エルデンリング ナイトレインのビルドシミュレーター

## プロジェクト概要

エルデンリング ナイトレインのビルドシミュレーターアプリケーション。  
ユーザーは自身の所持遺物を登録し、 希望する効果を持ったビルドが構築可能か検索できます。

## 技術スタック

- **フロントエンド**: React 19.1.1 + TypeScript
- **ルーティング**: React Router v7.9.1 (file-based routing)
- **スタイリング**: Tailwind CSS v4.1.13
- **ビルドツール**: Vite
- **テスト**: Vitest + happy-dom + Testing Library
- **リンティング**: ESLint + typescript-eslint + better-tailwindcss
- **バリデーション**: Valibot + @conform-to
- **UI コンポーネント**: react-aria-components
- **最適化計算**: yalps (整数線形計画ライブラリ)
- **Web Worker通信**: Comlink
- **ユーティリティ**: es-toolkit
- **アイコン**: lucide-react

## プロジェクト構造

```
app/
├── routes/                     # React Router v7 ファイルベースルーティング
│   ├── _app/                  # レイアウトルート（ナビゲーション、遺物数表示）
│   ├── _app._index/           # メインページ（ビルドシミュレーター）
│   │   ├── components/       # ページ固有コンポーネント
│   │   │   ├── BuildList.tsx       # 検索結果表示（Suspense/Await活用）
│   │   │   └── SearchForm.tsx      # 検索条件フォーム
│   │   ├── schema/          # ページ固有スキーマ
│   │   │   ├── FormSchema.ts       # フォーム入力スキーマ
│   │   │   └── QuerySchema.ts      # URL検索パラメータスキーマ
│   │   └── services/        # ページ固有サービス
│   │       └── simulator/         # ビルドシミュレーション
│   │           ├── constraints.ts     # yalps制約条件定義
│   │           ├── variables.ts       # 整数線形計画変数
│   │           ├── scoring.ts         # ビルドスコアリング
│   │           ├── createBuild.ts     # ビルドオブジェクト生成
│   │           ├── simulator.ts       # メインシミュレーター
│   │           ├── worker.ts          # Web Worker実装
│   │           └── types.ts           # 型定義
│   └── _app.manage-relics/   # 遺物管理ページ（JSONエディタ）
├── components/               # 共通コンポーネント
│   ├── forms/              # フォーム関連コンポーネント
│   │   ├── Button.tsx            # 汎用ボタン
│   │   └── Checkbox.tsx          # チェックボックス
│   ├── BuildCriteria/      # ビルド条件選択コンポーネント
│   ├── RelicInfo/          # 遺物情報表示コンポーネント
│   └── Toggle.tsx          # Context API汎用トグルコンポーネント
├── data/                    # ゲームデータ定義
│   ├── generated/          # 自動生成データ（generate-relic-data.ts）
│   │   ├── relicCategories.ts    # 遺物カテゴリ定義
│   │   └── relicEffectGroups.ts  # 遺物効果グループ定義
│   ├── characters.ts       # キャラクター定義
│   ├── vessels.ts          # 献器（装備枠）定義
│   ├── relicEffects.ts     # 遺物効果定義（stacksWith設定）
│   └── relics.ts          # 遺物定義
├── services/               # 共通サービス
│   └── storage/           # ユーザーデータストレージ
│       ├── UserDataStorageService.ts    # インターフェース定義
│       ├── LocalStorageUserDataService.ts # localStorage実装
│       └── index.ts                     # ファクトリー関数
├── schema/                 # 共通バリデーションスキーマ
│   └── StringifiedRelicsSchema.ts # localStorage用遺物スキーマ
├── hooks/                  # カスタムフック
│   └── usePersistedState.ts      # 永続化状態フック
├── app.css                # グローバルCSS + Tailwindカスタマイゼーション
└── root.tsx              # アプリケーションルート + エラーバウンダリ
test/                       # テストファイル
scripts/                   # 開発・ビルドスクリプト
└── generate-relic-data.ts # 遺物データ自動生成スクリプト
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

### ベンチマーク実行

```bash
npm run bench         # ベンチマーク watch モード
npm run bench:run     # ベンチマーク単発実行
```

### ビルド

```bash
npm run build         # プロダクションビルド
npm run build:ci      # CI用ビルド (lint + typecheck + test + build)
```

### データ生成

```bash
npm run generate:relic-data  # 遺物データの自動生成（relicCategories, relicEffectGroups）
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

## テスト戦略

- **フレームワーク**: Vitest + happy-dom
- **ユーティリティ**: @testing-library/react + @testing-library/user-event
- **命名規約**: `.spec.ts` / `.spec.tsx` (例: `RelicEffectSelector.spec.tsx`)
- **場所**: `app/**/*.spec.{ts,tsx}`
- **スナップショット**: `__snapshots__/` ディレクトリ内に保存
- **セットアップ**: `setupTests.ts`
- **カバレッジ**: `app/**` ディレクトリが対象

### テスト記述規約

- **AAAパターン**: すべてのテストは Arrange-Act-Assert パターンに則って記述

```ts
test('テスト名', async () => {
  // arrange: テストの準備
  const { user } = setup()

  // act: 実行するアクション
  await user.click(button)

  // assert: 期待される結果の検証
  expect(result).toBe(expected)
})
```

- **ファイルルートの`describe`は不要**: ファイル自体がコンポーネント/モジュールのスコープを表すため、ルートレベルの`describe`ブロックは原則不要
  - ❌ 不要: `describe('BuildCriteria', () => { test(...) })`
  - ✅ 推奨: `test('機能の説明', () => { ... })`
- **ネストした`describe`**: 複数の関連するテストをグループ化する場合のみ使用
- **コメントの明確化**: 各セクション（arrange/act/assert）にコメントを追加
  - コードで自明な場合は `// act` のみでOK
  - 複雑な処理の場合は日本語で補足説明を追加（例: `// act: 検索ボックスに入力`）

## 重要なファイル

- `vite.config.ts` - Vite設定（Worker対応、TailwindCSS、Vitest）
- `tsconfig.json` - TypeScript設定（strict mode、React Router型サポート）
- `eslint.config.ts` - ESLint設定（better-tailwindcss、React、TypeScript）
- `app/root.tsx` - アプリケーションルート + エラーバウンダリ
- `app/app.css` - グローバルスタイル + Tailwindカスタマイゼーション（ダークテーマ）
- `setupTests.ts` - テスト環境設定（jest-dom、cleanup）

## 特記事項

### React Router v7

- **ファイルベースルーティング**: `app/routes/` 配下のファイル構造がURLに対応
- **型安全性**: 自動生成される Route 型を活用
- **新機能**: `clientLoader`、`Suspense` + `Await`、`HydrateFallback`

### ドメインロジック

- **エルデンリング ナイトレイン**: ビルドシミュレーターアプリ
- **遺物（Relic）**: ゲーム内装備アイテム、効果とスロット色を持つ
  - 通常遺物と深層遺物の区別
  - 効果の重複可能性（`stacksWithSelf`, `stacksAcrossLevels`）
  - デメリット効果の有無
- **献器（Vessel）**: キャラクターの装備枠構成
  - 各色のスロット数とFreeスロットを定義
  - キャラクター毎に異なる献器を使用可能
- **ビルドシミュレーション**: 条件に基づく最適な遺物組み合わせ計算
  - 整数線形計画（yalps）による最適化
  - 複数の制約条件を同時に満たすソリューション
  - 重複ビルドの排除機能
  - スコアベースの優先順位付け
- **遺物効果グループ**: 関連する効果をグループ化
  - 効果の統合処理により効率的なシミュレーション
  - 重複不可効果の適切な処理

### Web Workers + Comlink

- **重い計算処理**: ビルドシミュレーションをワーカーで実行
- **Vite統合**: `?worker` サフィックスでワーカーとしてインポート
- **型安全通信**: Comlink + TypeScript で型安全なワーカー通信
- **パフォーマンス**: メインスレッドをブロックせずに整数線形計画を実行

### UI・スタイリング

- **ダークテーマ**: Zinc-800ベースのダークUI
- **Tailwind CSS v4** + **react-aria-components**
- **Grid レイアウト**: 2カラム構成

## 開発環境

### セットアップ

```bash
# Node.js 24.x（mise推奨）
mise install
npm ci
```

### エラーハンドリング

- **ErrorBoundary**: `app/root.tsx` でアプリケーション全体をカバー
- **非同期エラー**: `Suspense` + `Await` の `errorElement` で処理

### パフォーマンス

- **Web Workers**: 重いシミュレーション計算をメインスレッド外で実行
- **ベンチマーク**: `npm run bench` でパフォーマンス測定

## よくあるタスク

### 新しいコンポーネントの作成

1. **場所**: 共通は `app/components/`、ページ固有は `app/routes/_app.{route}/components/`
2. **パターン**: TypeScript + React.FC + JSDoc（日本語）
3. **テスト**: 同階層に `.spec.tsx` ファイル作成

### 新しいページの追加

1. **ディレクトリ**: `app/routes/_app.{route-name}/` 作成
2. **メインファイル**: `route.tsx` でページコンポーネント定義
3. **ナビゲーション**: `app/routes/_app/route.tsx` にリンク追加

### 遺物データの管理

1. **編集**: `/manage-relics` ページでJSON形式で編集
2. **ストレージ**: localStorage に保存（`StringifiedRelicsSchema`）

### ビルドシミュレーション機能の拡張


詳細な仕様・アルゴリズムは @app/routes/_app._index/services/simulator/README.md を参照してください。

### 遺物・ゲームデータの追加

1. **データ定義**: `app/data/relicEffects.ts` または `app/data/relics.ts` に追加
2. **自動生成**: `npm run generate:relic-data` でカテゴリ・グループデータを再生成

## デバッグ・トラブルシューティング

```bash
npm run typecheck  # TypeScript型チェック
npm run lint:fix   # ESLint自動修正
npm run test       # テスト実行
npm run build      # プロダクションビルド
```

### よくある問題

- **React Router型エラー**: `.react-router/types/` の自動生成型を確認
- **Web Worker**: Vite設定の `worker.plugins` を確認
- **localStorage**: `StringifiedRelicsSchema` でのパース失敗
