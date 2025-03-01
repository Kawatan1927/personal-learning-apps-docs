# 1.1 Next.js/TypeScript環境の構築

このセクションでは、Next.js と TypeScript を使ったプロジェクトの初期環境構築について、詳細な手順とポイント（Tips）を交えて解説します。初めての方でもスムーズに環境を整え、以降の開発ステップに進めるように、各ステップを具体的に説明します。

---

## 1.1.1 `create-next-app` を使ったプロジェクト初期化

### 手順

1. **Node.js のインストール確認**
    - **確認方法:** ターミナルを開き、以下のコマンドを実行してNode.jsのバージョンを確認します。
      ```bash
      node -v
      ```
    - **Tip:** 最新のLTS（Long Term Support）バージョンを利用することを推奨します。公式サイト（[nodejs.org](https://nodejs.org/)）から最新のLTS版をダウンロードしてください。

2. **`create-next-app` を利用してプロジェクトを生成**
    - **実行コマンド:**
      ```bash
      npx create-next-app@latest my-next-app --typescript
      ```
    - **説明:**
        - `npx create-next-app@latest` は常に最新バージョンのツールを利用するための方法です。
        - `my-next-app` はプロジェクトのディレクトリ名です。必要に応じて変更してください。
        - `--typescript` オプションを指定することで、初めから TypeScript 環境が設定された状態でプロジェクトが生成されます。
    - **Tip:** グローバルインストールを避け、npxを使うことで、常に最新のテンプレートを利用できます。

3. **プロジェクトディレクトリへの移動**
    - プロジェクトが生成されたら、以下のコマンドでディレクトリに移動します。
      ```bash
      cd my-next-app
      ```

4. **生成されたファイルとディレクトリの確認**
    - プロジェクトルートに以下の重要なファイルが存在するか確認してください:
        - `tsconfig.json`: TypeScriptのコンパイラ設定ファイル。
        - `package.json`: プロジェクトの依存関係やスクリプトが記載されています。
        - `pages/` ディレクトリ: Next.jsのルーティングに利用されるページ群。

---

## 1.1.2 必要な依存パッケージのインストール

### 手順

1. **依存パッケージの初期インストール確認**
    - 初期化プロジェクトには、Next.js、React、TypeScriptなどの基本パッケージが既に含まれています。
    - ターミナルで以下のコマンドを実行して、依存関係が正しくインストールされているか確認します。
      ```bash
      npm install
      ```
    - **Tip:** Yarn や pnpm を使用している場合は、対応するコマンド（`yarn` や `pnpm install`）を使用してください。

2. **追加パッケージの検討**
    - プロジェクトの規模が大きくなる前に、開発効率やコード品質を向上させるため、以下のパッケージを導入することを検討しましょう:
        - **ESLint:** コードの品質と一貫性を保つための静的解析ツール。
        - **Prettier:** コードフォーマットを自動で統一するツール。
    - **Tip:** これらのツールは、プロジェクト開始時に導入しておくと、後から導入するよりも統一感を保ちやすくなります。

---

## 1.1.3 ESLintおよびPrettierによるコードフォーマットの設定

### 手順

1. **ESLint の設定**
    - **設定ファイル確認:**  
      プロジェクトルートに `.eslintrc.json` または `.eslintrc.js` が生成されている場合が多いです。
    - **基本設定例:**
      ```json
      {
        "extends": [
          "next/core-web-vitals",
          "eslint:recommended",
          "plugin:@typescript-eslint/recommended"
        ],
        "plugins": ["@typescript-eslint"],
        "rules": {
          // 必要に応じてカスタムルールを追加
        }
      }
      ```
    - **Tip:**
        - VSCodeなどのエディタでESLintプラグインをインストールすると、コードの問題点をリアルタイムで指摘してくれるので非常に便利です。
        - プロジェクトのスタイルガイドに合わせて、ルールを調整しましょう。

2. **Prettier の設定**
    - **Prettier のインストール:**
      ```bash
      npm install --save-dev prettier
      ```
    - **設定ファイル作成:**  
      プロジェクトルートに `prettier.config.js` または `.prettierrc` を作成し、以下のように設定を記述します。
      ```js
      module.exports = {
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5'
      };
      ```
    - **Tip:**
        - ESLintとPrettierの競合を避けるため、`eslint-config-prettier` や `eslint-plugin-prettier` の導入を検討してください。
        - エディタの自動フォーマット機能を利用すると、保存時に自動でコードが整形され、作業効率が向上します。

3. **エディタの設定（VSCode の例）**
    - VSCode の `settings.json` に以下の設定を追加して、保存時に自動フォーマットを有効にします。
      ```json
      {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
      }
      ```
    - **Tip:**
        - エディタにESLintプラグインとPrettierプラグインをインストールすることで、コード品質のチェックとフォーマットがリアルタイムで行えます。

---

# まとめ

この「1.1 Next.js/TypeScript環境の構築」セクションでは、以下の点を詳しく解説しました：

- **1.1.1 `create-next-app` を使ったプロジェクト初期化:**  
  Node.jsの確認からプロジェクト作成、ディレクトリへの移動、生成ファイルの確認まで。

- **1.1.2 必要な依存パッケージのインストール:**  
  初期パッケージのインストール確認と、ESLintやPrettierなど追加パッケージの導入について。

- **1.1.3 ESLintおよびPrettierによるコードフォーマットの設定:**  
  ESLintとPrettierの基本設定、エディタとの連携方法について詳しく説明。

これらの手順を確実に実施することで、質の高い開発環境が整い、後続の学習ステップ（プロジェクトフォルダ構成、ページ作成、API実装など）にスムーズに進むことができます。次のセクションでは、プロジェクトフォルダ構成の理解について解説していきます。