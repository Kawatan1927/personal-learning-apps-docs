# Vite + React 概要ガイド

このドキュメントでは、本プロジェクトで採用している **Vite** と **React** の組み合わせについて解説します。

## 目次

1. [Vite とは](#vite-とは)
2. [React とは](#react-とは)
3. [なぜ Vite + React なのか](#なぜ-vite--react-なのか)
4. [従来のツール（Create React App）との違い](#従来のツールcreate-react-appとの違い)
5. [開発体験の向上ポイント](#開発体験の向上ポイント)
6. [プロジェクト構成](#プロジェクト構成)

---

## Vite とは

**Vite**（ヴィート、フランス語で「速い」の意）は、次世代のフロントエンド開発ツールです。

### 主な特徴

#### 1. **爆速な開発サーバー**
- ネイティブ ES Modules を活用
- バンドル不要でブラウザが直接モジュールを読み込む
- 起動時間がほぼゼロ（数百ミリ秒）

#### 2. **高速な HMR（Hot Module Replacement）**
- ファイル変更時、変更部分だけを即座に反映
- ページ全体のリロード不要
- 状態を保持したまま更新

#### 3. **最適化されたビルド**
- 本番ビルドには Rollup を使用
- コード分割、Tree-shaking、圧縮が自動で最適化
- モダンブラウザ向けの効率的なバンドル生成

#### 4. **プラグインエコシステム**
- Rollup 互換のプラグインシステム
- React、Vue、Svelte などに対応
- 公式・コミュニティプラグインが豊富

### 技術的な仕組み

```
開発時：
ブラウザ → Vite Dev Server → 個別のソースファイル（.ts, .tsx）
         ↑ esbuild による高速トランスパイル
         ↑ ネイティブ ES Modules で配信

本番時：
ソースコード → Rollup → 最適化されたバンドル → dist/
```

---

## React とは

**React** は、Facebook（現 Meta）が開発した、UI 構築のための JavaScript ライブラリです。

### 主な特徴

#### 1. **コンポーネントベース**
- UI を再利用可能なコンポーネントに分割
- 各コンポーネントは独立した状態とロジックを持つ

```tsx
function RecipeCard({ recipe }) {
  return (
    <div className="card">
      <h3>{recipe.name}</h3>
      <p>{recipe.description}</p>
    </div>
  )
}
```

#### 2. **宣言的な UI**
- 「どうやって」ではなく「何を」表示するかを記述
- 状態が変わると自動的に UI が更新される

```tsx
function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <div>
      <p>カウント: {count}</p>
      <button onClick={() => setCount(count + 1)}>増やす</button>
    </div>
  )
}
```

#### 3. **仮想 DOM**
- メモリ上に仮想的な DOM ツリーを保持
- 差分だけを効率的に実際の DOM に反映
- パフォーマンスの最適化が自動化

#### 4. **豊富なエコシステム**
- React Router: ルーティング
- React Query: サーバー状態管理
- Zustand/Redux: クライアント状態管理
- 多数のコンポーネントライブラリ

### React 19 の新機能（本プロジェクトで使用）

本プロジェクトでは **React 19** を採用しています：

- **React Compiler**: 自動的な最適化（将来的）
- **Server Components**: サーバーサイドレンダリングの改善
- **Actions**: フォーム送信の簡素化
- **use API**: Promise や Context の新しい利用方法
- **useOptimistic**: 楽観的 UI 更新のためのフック

---

## なぜ Vite + React なのか

### 1. **開発速度の圧倒的な向上**

| ツール | 起動時間 | HMR速度 |
|--------|---------|---------|
| **Vite** | ~100ms | ~50ms |
| Webpack (CRA) | ~30s | ~2s |

**実感できる違い:**
- サーバー起動がほぼ瞬時
- コード変更がリアルタイムに反映
- 開発のストレスが大幅に軽減

### 2. **モダンな開発体験**

- **TypeScript ファーストサポート**: `.ts` / `.tsx` をそのまま使用可能
- **ES Modules ネイティブ**: インポート/エクスポートが直感的
- **環境変数**: `import.meta.env` で簡単にアクセス
- **CSS Modules / PostCSS**: スタイリングも最適化

### 3. **シンプルな設定**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // これだけで React + TypeScript が動く！
})
```

従来の Webpack 設定と比べて圧倒的にシンプルです。

### 4. **最適化された本番ビルド**

- **自動コード分割**: ルートごとに自動でチャンク生成
- **Tree-shaking**: 未使用コードを自動削除
- **圧縮**: 最小サイズのバンドル生成
- **キャッシュ最適化**: ファイル名にハッシュを付与

---

## 従来のツール（Create React App）との違い

### Create React App (CRA)

```bash
# プロジェクト作成
npx create-react-app my-app
cd my-app
npm start  # 起動に 20〜30 秒
```

**問題点:**
- ❌ 起動が遅い（Webpack のビルドに時間がかかる）
- ❌ HMR が遅い（変更の反映に数秒）
- ❌ カスタマイズが困難（`eject` が必要）
- ❌ メンテナンスが停滞気味

### Vite + React

```bash
# プロジェクト作成
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev  # 起動が瞬時（100ms）
```

**メリット:**
- ✅ 起動が爆速（ほぼ待ち時間なし）
- ✅ HMR が高速（変更が即座に反映）
- ✅ 設定がシンプルで柔軟
- ✅ 活発に開発が進んでいる

### 移行のしやすさ

CRA から Vite への移行は比較的簡単です：

1. `package.json` の scripts を変更
2. `vite.config.ts` を作成
3. `index.html` を `public/` から root に移動
4. 環境変数を `REACT_APP_*` から `VITE_*` に変更

---

## 開発体験の向上ポイント

### 1. **即座のフィードバック**

```
コード編集 → 保存 → 即座に反映（50ms以内）
         ↓
    ストレスフリーな開発
```

### 2. **型安全性**

TypeScript + React の組み合わせで：
- Props の型チェック
- イベントハンドラの型推論
- API レスポンスの型定義

### 3. **開発ツール**

- **React DevTools**: コンポーネント階層とステートの可視化
- **Vite DevTools**: HMR の動作状況を確認
- **TypeScript Language Service**: エディタでの補完・エラー表示

### 4. **デバッグのしやすさ**

- ソースマップが自動生成
- ブラウザのデバッガで元のコードをそのまま見られる
- エラーメッセージが分かりやすい

---

## プロジェクト構成

### 基本構造

```
frontend/
├── index.html              # エントリーポイント（Vite の特徴）
├── vite.config.ts          # Vite 設定
├── tsconfig.json           # TypeScript 設定（ルート）
├── tsconfig.app.json       # アプリ用 TypeScript 設定
├── package.json            # 依存関係
├── src/
│   ├── main.tsx           # React アプリのエントリー
│   ├── App.tsx            # ルートコンポーネント
│   ├── features/          # 機能別モジュール
│   ├── components/        # 共通コンポーネント
│   ├── lib/               # ユーティリティ
│   └── router/            # ルーティング
└── public/                # 静的ファイル
```

### エントリーポイント

#### `index.html`

```html
<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Cooking Planner</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**ポイント:**
- ルートディレクトリに配置（CRA とは異なる）
- `<script type="module">` で TypeScript ファイルを直接読み込み

#### `src/main.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## 開発コマンド

### 開発サーバー起動

```bash
npm run dev
```

- **アクセス**: `http://localhost:5173`
- **特徴**: ファイル変更を監視し、HMR で即座に反映

### 本番ビルド

```bash
npm run build
```

- **出力先**: `dist/` ディレクトリ
- **内容**: 最適化された HTML/CSS/JS

### ビルド結果のプレビュー

```bash
npm run preview
```

- 本番ビルドをローカルで確認
- 実際のデプロイ前の最終チェックに使用

### Lint / フォーマット

```bash
npm run lint           # ESLint チェック
npm run format         # Prettier で整形
npm run format:check   # フォーマットチェックのみ
```

---

## まとめ

### Vite の特徴

- ⚡ 爆速な開発サーバー（起動 ~100ms）
- 🔥 高速な HMR（変更反映 ~50ms）
- 📦 最適化された本番ビルド
- 🔧 シンプルな設定

### React の特徴

- 🧩 コンポーネントベースの設計
- 📝 宣言的な UI 記述
- 🚀 豊富なエコシステム
- 🎯 React 19 の最新機能

### Vite + React の組み合わせ

開発速度、開発体験、ビルドの最適化、すべてにおいて現代的なフロントエンド開発を実現します。

---

## 参考リンク

### 公式ドキュメント
- [Vite 公式ドキュメント](https://vitejs.dev/)
- [React 公式ドキュメント](https://react.dev/)
- [React 19 リリースノート](https://react.dev/blog/2024/04/25/react-19)

### チュートリアル
- [Vite で始める React](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)
- [React チュートリアル](https://react.dev/learn)

### ツール
- [Vite プラグイン一覧](https://vitejs.dev/plugins/)
- [React DevTools](https://react.dev/learn/react-developer-tools)
