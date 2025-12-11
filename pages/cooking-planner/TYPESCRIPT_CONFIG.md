# TypeScript 設定ガイド

このドキュメントでは、本プロジェクトの TypeScript 設定ファイル群の内容について解説します。

## 設定ファイルの構成

本プロジェクトでは、**Project References** を使用して TypeScript 設定を分割しています：

```
frontend/
├── tsconfig.json           # ルート設定（参照のみ）
├── tsconfig.app.json       # アプリケーションコード用
└── tsconfig.node.json      # Vite設定ファイル用
```

## tsconfig.json（ルート設定）

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

### 解説

- **`files: []`**: このファイル自体では何もコンパイルしない
- **`references`**: 複数の TypeScript プロジェクトを参照
  - `tsconfig.app.json`: アプリケーションのソースコード用
  - `tsconfig.node.json`: Vite の設定ファイル用

### Project References のメリット

1. **ビルドの高速化**: 変更のあったプロジェクトのみ再コンパイル
2. **明確な分離**: アプリコードとビルドツール設定を分離
3. **型チェックの効率化**: 異なる環境（Browser / Node.js）の型定義を分離

---

## tsconfig.app.json（アプリケーション用）

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "types": ["vite/client"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"],
      "@lib/*": ["src/lib/*"],
      "@components/*": ["src/components/*"]
    },

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

### 各オプションの解説

#### 基本設定

| オプション | 値 | 説明 |
|-----------|-----|------|
| `tsBuildInfoFile` | `./node_modules/.tmp/tsconfig.app.tsbuildinfo` | インクリメンタルビルドの情報を保存する場所 |
| `target` | `ES2022` | コンパイル後の JavaScript バージョン |
| `useDefineForClassFields` | `true` | クラスフィールドを ECMAScript 標準に準拠した方法で定義 |
| `lib` | `["ES2022", "DOM", "DOM.Iterable"]` | 使用可能な組み込み型定義 |
| `module` | `ESNext` | モジュールシステム（最新の ES Modules） |
| `types` | `["vite/client"]` | Vite の環境変数（`import.meta.env`）の型定義を含める |
| `skipLibCheck` | `true` | `.d.ts` ファイルの型チェックをスキップ（ビルド高速化） |

#### Bundler mode（バンドラーモード）

Vite のようなモダンなバンドラーを使用する際の最適化設定：

| オプション | 値 | 説明 |
|-----------|-----|------|
| `moduleResolution` | `bundler` | バンドラー用の最新のモジュール解決アルゴリズム |
| `allowImportingTsExtensions` | `true` | `.ts` / `.tsx` 拡張子付きでインポート可能 |
| `verbatimModuleSyntax` | `true` | `import type` と `import` を厳密に区別 |
| `moduleDetection` | `force` | すべてのファイルをモジュールとして扱う |
| `noEmit` | `true` | TypeScript は型チェックのみ、実際のビルドは Vite が行う |
| `jsx` | `react-jsx` | 新しい JSX トランスフォーム（`React.createElement` 不要） |

#### Path aliases（パスエイリアス）

```json
"baseUrl": ".",
"paths": {
  "@/*": ["src/*"],
  "@features/*": ["src/features/*"],
  "@lib/*": ["src/lib/*"],
  "@components/*": ["src/components/*"]
}
```

**使用例:**

```typescript
// 相対パスの代わりに
import { apiClient } from '../../../lib/apiClient'

// エイリアスを使用
import { apiClient } from '@lib/apiClient'
```

**メリット:**
- コードの可読性向上
- ファイル移動時のインポートパス修正が不要
- ディレクトリ構造の変更に強い

**注意:** `vite.config.ts` でも同じエイリアスを設定する必要があります。

#### Linting（厳格な型チェック）

| オプション | 説明 |
|-----------|------|
| `strict` | すべての厳格な型チェックオプションを有効化 |
| `noUnusedLocals` | 使用されていないローカル変数を検出 |
| `noUnusedParameters` | 使用されていない関数パラメータを検出 |
| `erasableSyntaxOnly` | 型としてのみ使える構文を強制（実行時に影響を与えない） |
| `noFallthroughCasesInSwitch` | `switch` 文の fall-through を検出 |
| `noUncheckedSideEffectImports` | 副作用のみのインポートを明示的に記述するよう強制 |

#### include

```json
"include": ["src"]
```

- `src` ディレクトリ配下のすべてのファイルを TypeScript の対象とする

---

## tsconfig.node.json（Vite設定ファイル用）

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "types": ["node"],
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "erasableSyntaxOnly": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

### tsconfig.app.json との主な違い

| 項目 | tsconfig.app.json | tsconfig.node.json |
|------|-------------------|-------------------|
| **target** | `ES2022` | `ES2023` |
| **lib** | `["ES2022", "DOM", "DOM.Iterable"]` | `["ES2023"]` |
| **types** | `["vite/client"]` | `["node"]` |
| **jsx** | `"react-jsx"` | （なし） |
| **paths** | エイリアス設定あり | （なし） |
| **include** | `["src"]` | `["vite.config.ts"]` |

### なぜ分離するのか？

1. **環境の違い**
   - `tsconfig.app.json`: ブラウザ環境（DOM API を使用）
   - `tsconfig.node.json`: Node.js 環境（Node.js API を使用）

2. **型定義の衝突回避**
   - ブラウザの `setTimeout` と Node.js の `setTimeout` は型が異なる
   - 分離することで正しい型を参照できる

3. **ビルド最適化**
   - `vite.config.ts` は開発時のみ使用され、アプリコードとは独立
   - 変更頻度が異なるため、分離することでビルドが効率化

---

## よくある質問

### Q1: `strict: true` とは何ですか？

以下のオプションをすべて有効化します：

- `noImplicitAny`: 暗黙の `any` 型を禁止
- `strictNullChecks`: `null` / `undefined` を厳密にチェック
- `strictFunctionTypes`: 関数の型の厳密なチェック
- `strictBindCallApply`: `bind`, `call`, `apply` の型チェック
- など

**推奨:** 新規プロジェクトでは常に有効化すべきです。

### Q2: `noEmit: true` なのにビルドできるのはなぜ？

TypeScript は型チェックのみを行い、実際の JavaScript へのトランスパイルは Vite（esbuild）が行うためです。これにより：

- TypeScript は型安全性のみに集中
- Vite が高速にビルド
- 両者の役割が明確に分離

### Q3: パスエイリアスが認識されない場合は？

以下を確認してください：

1. **tsconfig.app.json** に `paths` が設定されている
2. **vite.config.ts** に同じエイリアスが設定されている
3. エディタを再起動

### Q4: `moduleResolution: "bundler"` とは？

TypeScript 5.0 で追加された新しいモジュール解決方法です：

- **従来**: `"node"` または `"node16"`
- **bundler**: Vite、webpack、Rollup などのバンドラー用に最適化
- **特徴**: 拡張子なしインポート、条件付きエクスポートなどに対応

---

## ビルドコマンド

### 型チェックのみ

```bash
# Project References を使って型チェック
tsc -b
```

### ビルド（型チェック + Vite ビルド）

```bash
npm run build
# 内部で `tsc -b && vite build` を実行
```

---

## まとめ

- **3つの設定ファイル** でプロジェクトを構造化
- **tsconfig.app.json**: アプリケーションの型チェック（ブラウザ環境）
- **tsconfig.node.json**: Vite 設定の型チェック（Node.js 環境）
- **厳格な型チェック** でバグを早期発見
- **パスエイリアス** でコードの可読性を向上
- **Bundler mode** で Vite との連携を最適化

---

## 関連リソース

- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)
- [Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [TSConfig Reference](https://www.typescriptlang.org/tsconfig)
- [Vite + TypeScript](https://vitejs.dev/guide/features.html#typescript)
