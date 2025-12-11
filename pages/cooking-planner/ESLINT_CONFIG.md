# ESLint 設定ガイド

このドキュメントでは、本プロジェクトの `frontend/eslint.config.js` の設定内容について解説します。

## 概要

本プロジェクトでは、ESLint v9 の **Flat Config 形式**（`eslint.config.js`）を採用しています。従来の `.eslintrc.*` 形式とは異なる、新しい設定形式です。

## 設定ファイルの構造

### インポート

```javascript
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
```

- **`@eslint/js`**: ESLint の JavaScript 推奨設定
- **`globals`**: グローバル変数の定義集
- **`eslint-plugin-react-hooks`**: React Hooks のルールを提供
- **`eslint-plugin-react-refresh`**: Fast Refresh（HMR）に関する警告を提供
- **`typescript-eslint`**: TypeScript 用の ESLint プラグイン
- **`eslint/config`**: Flat Config 形式のヘルパー関数

### メイン設定

```javascript
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
])
```

## 各項目の解説

### 1. `globalIgnores(['dist'])`

- **目的**: Lint 対象から除外するディレクトリを指定
- **内容**: ビルド成果物が格納される `dist` ディレクトリを無視

### 2. `files: ['**/*.{ts,tsx}']`

- **目的**: この設定を適用するファイルパターンを指定
- **内容**: すべての `.ts` および `.tsx` ファイルに適用

### 3. `extends` 配列

設定のベースとなるルールセットを継承します：

#### `js.configs.recommended`
- JavaScript の基本的な推奨ルール
- 構文エラーや一般的なバグを検出

#### `tseslint.configs.recommended`
- TypeScript 用の推奨ルール
- 型安全性に関するチェック
- TypeScript 特有のベストプラクティス

#### `reactHooks.configs.flat.recommended`
- React Hooks の使用ルール
- `useEffect` の依存配列チェック
- Hooks の呼び出し順序の検証

#### `reactRefresh.configs.vite`
- Vite の Fast Refresh（HMR）との互換性チェック
- コンポーネントのエクスポート方法に関する警告
- 開発時のホットリロードを正しく動作させるためのルール

### 4. `languageOptions`

#### `ecmaVersion: 2020`
- 使用する ECMAScript のバージョンを指定
- ES2020 の構文機能（Optional Chaining、Nullish Coalescing など）をサポート

#### `globals: globals.browser`
- ブラウザ環境のグローバル変数を定義
- `window`, `document`, `console` などを認識
- これにより、これらの変数を未定義として警告しない

## Flat Config 形式の特徴

### 従来形式との違い

| 項目 | 従来形式 (`.eslintrc.*`) | Flat Config 形式 (`eslint.config.js`) |
|------|-------------------------|--------------------------------------|
| 設定ファイル | `.eslintrc.json` など | `eslint.config.js` |
| プラグイン指定 | 文字列で指定 | `import` でモジュールを直接インポート |
| extends | 文字列の配列 | オブジェクトの配列 |
| グローバル無視 | `.eslintignore` | `globalIgnores()` 関数 |
| エディタサポート | 良好 | TypeScript の型補完が利用可能 |

### メリット

1. **型安全性**: TypeScript を使って設定を記述できる
2. **明示性**: プラグインを直接インポートするため、依存関係が明確
3. **柔軟性**: JavaScript のロジックを使って動的に設定を構築可能
4. **統合性**: 複数の設定ファイルが不要（`.eslintignore` も不要）

## 実行方法

### コマンド

```bash
# Lint チェック
npm run lint

# Lint + 自動修正
npm run lint -- --fix
```

### IDE 統合

WebStorm や VS Code などのエディタは、この設定ファイルを自動的に認識し、リアルタイムで Lint エラーを表示します。

## カスタマイズ例

### ルールの追加・上書き

```javascript
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [/* ... */],
    languageOptions: {/* ... */},
    rules: {
      // カスタムルール
      'no-console': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
])
```

### 特定ファイルのみの設定

```javascript
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [/* ... */],
    // ...通常の設定
  },
  {
    // テストファイルには別ルールを適用
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      'no-console': 'off',
    },
  },
])
```

## 関連リソース

- [ESLint Flat Config 公式ドキュメント](https://eslint.org/docs/latest/use/configure/configuration-files-new)
- [typescript-eslint](https://typescript-eslint.io/)
- [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- [eslint-plugin-react-refresh](https://www.npmjs.com/package/eslint-plugin-react-refresh)
