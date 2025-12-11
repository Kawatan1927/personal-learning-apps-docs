# Vite + React 設定詳細ガイド

このドキュメントでは、本プロジェクトで設定されている **Vite** と **React** の具体的な設定内容とコードについて解説します。

## 目次

1. [プロジェクト構成](#プロジェクト構成)
2. [Vite 設定（vite.config.ts）](#vite-設定viteconfigts)
3. [package.json の解説](#packagejson-の解説)
4. [React の設定](#react-の設定)
5. [エントリーポイント](#エントリーポイント)
6. [パスエイリアス](#パスエイリアス)
7. [環境変数](#環境変数)
8. [プラグインとミドルウェア](#プラグインとミドルウェア)

---

## プロジェクト構成

```
frontend/
├── index.html                 # HTML エントリーポイント
├── vite.config.ts            # Vite 設定ファイル
├── tsconfig.json             # TypeScript ルート設定
├── tsconfig.app.json         # アプリ用 TypeScript 設定
├── tsconfig.node.json        # Vite 設定用 TypeScript 設定
├── eslint.config.js          # ESLint 設定
├── package.json              # 依存関係とスクリプト
├── src/
│   ├── main.tsx             # React アプリのエントリー
│   ├── App.tsx              # ルートコンポーネント
│   ├── App.css              # ルートコンポーネントのスタイル
│   ├── index.css            # グローバルスタイル
│   ├── features/            # 機能別モジュール
│   │   ├── auth/           # 認証機能
│   │   ├── recipes/        # レシピ機能
│   │   ├── menus/          # 献立機能
│   │   └── shoppingList/   # 買い物リスト機能
│   ├── components/          # 共通コンポーネント
│   ├── lib/                 # ユーティリティ・共通ロジック
│   └── router/              # ルーティング定義
├── public/                   # 静的ファイル（そのままコピーされる）
│   └── vite.svg
└── dist/                     # ビルド成果物（自動生成）
```

---

## Vite 設定（vite.config.ts）

### 完全なコード

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
})
```

### 各項目の解説

#### 1. `defineConfig`

```typescript
import { defineConfig } from 'vite'
```

- TypeScript で型補完を有効にするヘルパー関数
- エディタで設定項目の候補が表示される
- 設定ミスを防ぐ

#### 2. `plugins: [react()]`

```typescript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**`@vitejs/plugin-react` の機能:**

- **Fast Refresh（HMR）**: コンポーネントの変更を即座に反映
- **JSX トランスフォーム**: `.tsx` ファイルを JavaScript に変換
- **自動 import**: `React` を自動的にインポート（React 17+）
- **開発時の最適化**: ビルド時間の短縮

**内部で使用している技術:**
- 開発時: **esbuild**（超高速）
- 本番時: **Babel**（互換性重視）

#### 3. `resolve.alias`（パスエイリアス）

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@features': path.resolve(__dirname, './src/features'),
    '@lib': path.resolve(__dirname, './src/lib'),
    '@components': path.resolve(__dirname, './src/components'),
  },
}
```

**目的:**
- 相対パスの複雑さを解消
- コードの可読性向上
- ディレクトリ構造の変更に強い

**使用例:**

```typescript
// ❌ 相対パスは複雑
import { apiClient } from '../../../lib/apiClient'
import { RecipeCard } from '../../../components/RecipeCard'

// ✅ エイリアスで明確
import { apiClient } from '@lib/apiClient'
import { RecipeCard } from '@components/RecipeCard'
```

**注意点:**
- TypeScript の `tsconfig.app.json` でも同じエイリアスを定義する必要がある
- 両方が一致していないと、ビルドは通るが型チェックでエラーになる

---

## package.json の解説

### 完全なコード

```json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\""
  },
  "dependencies": {
    "@tanstack/react-query": "^5.90.12",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.10.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/node": "^24.10.3",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "prettier": "^3.7.4",
    "typescript": "~5.9.3",
    "typescript-eslint": "^8.46.4",
    "vite": "^7.2.4"
  }
}
```

### 基本情報

| フィールド | 値 | 説明 |
|-----------|-----|------|
| `name` | `"frontend"` | パッケージ名 |
| `private` | `true` | npm に公開しない（社内プロジェクト用） |
| `version` | `"0.0.0"` | バージョン（MVP段階） |
| `type` | `"module"` | ES Modules を使用 |

### スクリプト

#### `dev`: 開発サーバー起動

```bash
npm run dev
```

- `vite` コマンドを実行
- デフォルトで `http://localhost:5173` で起動
- ホットリロード（HMR）が有効

#### `build`: 本番ビルド

```bash
npm run build
```

**処理の流れ:**
1. `tsc -b`: TypeScript の型チェック
2. `vite build`: Vite でビルド（JavaScript へのトランスパイル + 最適化）

**出力:**
- `dist/` ディレクトリに最適化されたファイル
- HTML, CSS, JS が圧縮・最適化される
- ファイル名にハッシュが付与される（キャッシュ対策）

#### `lint`: コードチェック

```bash
npm run lint
```

- ESLint でコード品質をチェック
- 自動修正するには `npm run lint -- --fix`

#### `preview`: ビルド結果のプレビュー

```bash
npm run preview
```

- `dist/` の内容をローカルサーバーで確認
- 本番環境に近い状態でテスト

#### `format`: コード整形

```bash
npm run format         # 自動整形
npm run format:check   # チェックのみ
```

- Prettier でコードを整形
- インデント、改行、クォートなどを統一

### 依存関係

#### 本番依存（dependencies）

| パッケージ | バージョン | 用途 |
|-----------|-----------|------|
| `react` | `^19.2.0` | React コアライブラリ |
| `react-dom` | `^19.2.0` | React の DOM レンダリング |
| `react-router-dom` | `^7.10.1` | クライアントサイドルーティング |
| `@tanstack/react-query` | `^5.90.12` | サーバー状態管理 |

**React 19 の特徴:**
- 最新の React 機能（Actions, use API など）
- パフォーマンスの改善
- 新しい Hooks

**React Query (TanStack Query):**
- サーバーからのデータ取得・キャッシュ
- 自動的な再取得・バックグラウンド更新
- ローディング・エラーステートの管理

**React Router v7:**
- Data APIs（Loader / Action）
- Nested Routes
- Type-safe なルーティング

#### 開発依存（devDependencies）

| パッケージ | 用途 |
|-----------|------|
| `vite` | ビルドツール |
| `@vitejs/plugin-react` | React サポートプラグイン |
| `typescript` | TypeScript コンパイラ |
| `@types/react` | React の型定義 |
| `@types/react-dom` | React DOM の型定義 |
| `@types/node` | Node.js の型定義（`path` などで使用） |
| `eslint` | コード品質チェック |
| `typescript-eslint` | TypeScript 用 ESLint |
| `eslint-plugin-react-hooks` | React Hooks のルール |
| `eslint-plugin-react-refresh` | Fast Refresh のルール |
| `prettier` | コードフォーマッター |

---

## React の設定

### エントリーポイント（index.html）

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cooking Planner</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**重要なポイント:**

1. **ルートディレクトリに配置**
   - Vite の特徴（CRA は `public/` 配下）
   - `index.html` が開発の起点

2. **`<script type="module">`**
   - ES Modules として読み込み
   - TypeScript ファイル（`.tsx`）を直接指定可能

3. **`<div id="root">`**
   - React アプリのマウントポイント

### React アプリのエントリー（main.tsx）

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

**各部の解説:**

#### 1. インポート

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
```

- `React`: React ライブラリのコア
- `ReactDOM`: ブラウザの DOM に React をレンダリング

#### 2. `ReactDOM.createRoot`

```typescript
ReactDOM.createRoot(document.getElementById('root')!)
```

- React 18+ の新しい API（Concurrent Mode 対応）
- `!` は TypeScript の Non-null assertion（`root` 要素は必ず存在）

#### 3. `<React.StrictMode>`

```typescript
<React.StrictMode>
  <App />
</React.StrictMode>
```

**目的:**
- 開発時の潜在的な問題を検出
- 非推奨 API の使用を警告
- 副作用の二重実行でバグを発見

**注意:**
- 本番ビルドでは自動的に無効化される
- レンダリングが2回実行される（意図的）

#### 4. グローバルスタイルのインポート

```typescript
import './index.css'
```

- アプリ全体に適用されるスタイル
- リセットCSS やグローバルな変数を定義

### ルートコンポーネント（App.tsx）

```typescript
import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>Cooking Planner</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
    </>
  )
}

export default App
```

**特徴:**
- 関数コンポーネント（クラスコンポーネントは非推奨）
- Hooks（`useState`）で状態管理
- JSX で UI を記述

---

## パスエイリアス

### 設定の二重定義

パスエイリアスは **2箇所** で定義する必要があります：

#### 1. `vite.config.ts`（ビルド時）

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@features': path.resolve(__dirname, './src/features'),
    '@lib': path.resolve(__dirname, './src/lib'),
    '@components': path.resolve(__dirname, './src/components'),
  },
}
```

#### 2. `tsconfig.app.json`（型チェック時）

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@lib/*": ["src/lib/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

### 使用例

```typescript
// 機能モジュールからのインポート
import { useRecipes } from '@features/recipes/hooks/useRecipes'
import { RecipeList } from '@features/recipes/components/RecipeList'

// ユーティリティからのインポート
import { apiClient } from '@lib/apiClient'
import { formatDate } from '@lib/utils/date'

// 共通コンポーネントからのインポート
import { Button } from '@components/Button'
import { Layout } from '@components/Layout'

// ルート（src/）からのインポート
import { App } from '@/App'
```

---

## 環境変数

### 定義方法

プロジェクトルートに `.env` ファイルを作成：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Cooking Planner
VITE_ENABLE_MOCK=false
```

**命名規則:**
- 必ず `VITE_` プレフィックスを付ける
- プレフィックスなしの変数はバンドルに含まれない（セキュリティ）

### コード内での使用

```typescript
// 環境変数にアクセス
const apiUrl = import.meta.env.VITE_API_BASE_URL
const appName = import.meta.env.VITE_APP_NAME

// 開発 / 本番の判定
if (import.meta.env.DEV) {
  console.log('開発モード')
}

if (import.meta.env.PROD) {
  console.log('本番モード')
}
```

### 型定義（型安全な環境変数）

`src/vite-env.d.ts` を作成：

```typescript
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_ENABLE_MOCK: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

これにより、エディタで補完が効き、型チェックも行われます。

---

## プラグインとミドルウェア

### 現在使用しているプラグイン

#### `@vitejs/plugin-react`

```typescript
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

**提供する機能:**
- Fast Refresh（HMR）
- JSX のトランスフォーム
- React の自動インポート

### 追加可能なプラグイン例

#### 1. PWA サポート

```bash
npm install -D vite-plugin-pwa
```

```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cooking Planner',
        short_name: 'CookingPlan',
        theme_color: '#ffffff',
      },
    }),
  ],
})
```

#### 2. SVG コンポーネント化

```bash
npm install -D vite-plugin-svgr
```

```typescript
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
})
```

使用例：
```typescript
import Logo from './logo.svg?react'

function App() {
  return <Logo />
}
```

---

## 開発ワークフロー

### 1. 開発サーバーの起動

```bash
cd frontend
npm install  # 初回のみ
npm run dev
```

**確認:**
- ブラウザで `http://localhost:5173` を開く
- ファイルを編集すると自動的に反映される

### 2. コード品質チェック

```bash
# Lint チェック
npm run lint

# 型チェック
npx tsc -b

# コードフォーマット
npm run format
```

### 3. 本番ビルド

```bash
npm run build
```

**生成されるファイル:**
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # メインバンドル
│   ├── vendor-[hash].js   # ライブラリ（React等）
│   └── index-[hash].css   # スタイル
└── vite.svg
```

### 4. ビルド結果の確認

```bash
npm run preview
```

`http://localhost:4173` でプレビュー

---

## まとめ

### Vite 設定のポイント

- **最小限の設定**: React プラグインとパスエイリアスのみ
- **型安全**: TypeScript で設定を記述
- **拡張性**: プラグインで機能追加が容易

### React 設定のポイント

- **React 19**: 最新機能を活用
- **Strict Mode**: 開発時の問題を早期発見
- **ES Modules**: モダンな JavaScript

### 開発体験

- ⚡ 爆速な開発サーバー
- 🔥 即座の HMR
- 🎯 型安全な開発
- 📦 最適化されたビルド

---

## トラブルシューティング

### Q1: `Cannot find module '@/...'`

**原因:**
- パスエイリアスが正しく設定されていない

**解決策:**
1. `vite.config.ts` と `tsconfig.app.json` の両方に定義
2. エディタを再起動

### Q2: HMR が動作しない

**原因:**
- ファイル変更が検知されていない
- コンポーネントの export が不正

**解決策:**
1. 開発サーバーを再起動
2. コンポーネントを `export default` で export

### Q3: ビルドが遅い

**原因:**
- 大きな依存関係
- ソースマップの生成

**解決策:**
- `vite.config.ts` で最適化設定を追加

```typescript
export default defineConfig({
  build: {
    sourcemap: false,  // 本番ではソースマップ不要
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
})
```

---

## 関連ドキュメント

- [ESLINT_CONFIG.md](./ESLINT_CONFIG.md) - ESLint 設定の詳細
- [TYPESCRIPT_CONFIG.md](./TYPESCRIPT_CONFIG.md) - TypeScript 設定の詳細
- [VITE_REACT_OVERVIEW.md](./VITE_REACT_OVERVIEW.md) - Vite + React の概要
