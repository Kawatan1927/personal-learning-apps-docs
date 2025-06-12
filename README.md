# Personal Learning Apps Docs

このリポジトリは、Next.js と Nextra を用いて作成された学習用ドキュメントサイトです。現時点では TypeScript と Next.js に焦点を当てていますが、今後は Java (Spring Boot)、Python (Django や Flask)、Go など、さまざまな言語・フレームワークを使ったアプリ開発カリキュラムも順次追加していく予定です。

## コンテンツ構成

各言語・フレームワークごとにディレクトリを分け、ステップ形式のチュートリアルを提供します。現在は以下のセクションが用意されています。

- `typescript/` … Next.js など TypeScript 向けカリキュラム
- `python/` … Django や Flask などの Web フレームワーク（準備中）
- `java/` … Spring Boot などの Java フレームワーク（準備中）
- `go/` … 将来的に Go 言語のカリキュラムを追加予定

## ローカル環境での実行方法

1. Node.js をインストールします。
2. 依存関係をインストールします。
   ```bash
   npm install
   ```
3. 開発サーバーを起動します。
   ```bash
   npm run dev
   ```
4. ブラウザで `http://localhost:3000` を開くとドキュメントサイトを確認できます。

ビルド済みの静的ファイルを利用する場合は次のコマンドを使用します。

```bash
npm run build
npm start
```

## コードフォーマット

Markdown ファイルやコードの整形には Prettier を使用しています。変更を加えた際は次のコマンドでフォーマットを実行できます。

```bash
npm run format
```
