# 2.1 トップページの作成

このセクションでは、Next.js を用いてアプリケーションの「トップページ」（ホームページ）を作成する方法について詳しく解説します。トップページは、ユーザーが最初にアクセスするエントリーポイントとなり、全体のレイアウトや初期データの取得方法を理解する上で重要な役割を果たします。

---

## 2.1.1 コンポーネントの作成とレイアウト設計

### 説明
- **目的:**  
  トップページにおける基本的なレイアウトを設計し、必要な UI コンポーネント（ヘッダー、フッター、ナビゲーションバー、メインコンテンツ領域など）を作成します。
- **ポイント:**  
  コンポーネント分割の原則を守ることで、再利用性や保守性が向上します。Next.js の `pages/index.tsx` がホームページとして自動認識されるため、ここにトップページ用のコンポーネントを組み込みます。

### 手順

1. **プロジェクト内の `pages/index.tsx` を確認**
    - Next.js プロジェクト作成時に自動生成される `pages/index.tsx` が存在します。
    - このファイルがトップページとして機能するため、ここから開発を開始します。

2. **基本レイアウトの設計**
    - **ヘッダー:** ナビゲーションメニューやロゴを配置するコンポーネントを作成。
    - **メインコンテンツ:** イベント一覧や紹介コンテンツを表示する領域。
    - **フッター:** 連絡先情報や著作権情報など、共通情報を表示。
    - **Tip:** 各部分を個別のコンポーネントに分割することで、他のページでも再利用可能にし、コードの見通しが良くなります。

3. **コンポーネントの実装**
    - `components/Header.tsx`、`components/Footer.tsx` などのコンポーネントを作成し、`pages/index.tsx` でインポートして使用します。
    - 例:
      ```tsx
      // components/Header.tsx
      import React from 'react';
 
      const Header: React.FC = () => {
        return (
          <header>
            <h1>イベント管理アプリ</h1>
            <nav>
              <ul>
                <li><a href="/">ホーム</a></li>
                <li><a href="/about">アプリについて</a></li>
              </ul>
            </nav>
          </header>
        );
      };
 
      export default Header;
      ```
    - **Tip:** コンポーネントごとにスタイルを当てる際は、CSS Modules や styled-components などを利用すると、クラス名の衝突を避けることができます。

4. **レイアウトの組み立て**
    - `pages/index.tsx` に、作成したコンポーネントを組み込んで、全体のレイアウトを構築します。
      ```tsx
      // pages/index.tsx
      import type { NextPage } from 'next';
      import Header from '../components/Header';
      import Footer from '../components/Footer';
 
      const Home: NextPage = () => {
        return (
          <div>
            <Header />
            <main>
              <h2>最新のイベント情報</h2>
              {/* イベント一覧コンポーネントや紹介文をここに配置 */}
            </main>
            <Footer />
          </div>
        );
      };
 
      export default Home;
      ```
    - **Tip:** レスポンシブデザインを意識して、`<main>` 要素の中にグリッドレイアウトやフレックスボックスを利用することで、さまざまなデバイスでの表示最適化を図ります。

---

## 2.1.2 `getStaticProps`によるビルド時データ取得の実装

### 説明
- **目的:**  
  トップページをビルド時に静的生成（Static Generation）するため、`getStaticProps` を利用して外部またはローカルのデータを取得します。これにより、ページのパフォーマンス向上と SEO の最適化が期待できます。
- **ポイント:**  
  データ取得は非同期処理となるため、エラーハンドリングやデータの型定義（TypeScript）を正しく行うことが重要です。

### 手順

1. **`getStaticProps` の基本構造を理解**
    - `pages/index.tsx` に `getStaticProps` 関数を追加して、ビルド時に実行されるデータ取得処理を実装します。
    - 例:
      ```tsx
      // pages/index.tsx
      import type { NextPage, GetStaticProps } from 'next';
      import Header from '../components/Header';
      import Footer from '../components/Footer';
 
      type Event = {
        id: number;
        title: string;
        date: string;
      };
 
      type HomeProps = {
        events: Event[];
      };
 
      const Home: NextPage<HomeProps> = ({ events }) => {
        return (
          <div>
            <Header />
            <main>
              <h2>最新のイベント情報</h2>
              <ul>
                {events.map((event) => (
                  <li key={event.id}>
                    {event.title} - {event.date}
                  </li>
                ))}
              </ul>
            </main>
            <Footer />
          </div>
        );
      };
 
      export const getStaticProps: GetStaticProps = async () => {
        // ここではモックデータを使用。実際は外部APIやデータベースから取得可能。
        const events: Event[] = [
          { id: 1, title: 'セミナー: Next.js入門', date: '2025-03-15' },
          { id: 2, title: 'ワークショップ: TypeScript活用法', date: '2025-04-01' },
        ];
 
        return {
          props: {
            events,
          },
          // オプション: ページ再生成の周期を指定可能（ISR: Incremental Static Regeneration）
          revalidate: 60, // 60秒ごとに最新データで再生成
        };
      };
 
      export default Home;
      ```
    - **Tip:** 開発初期はモックデータで動作確認を行い、後で実際のデータソース（APIやCMSなど）に差し替えるとスムーズに進められます。

2. **型定義とエラーハンドリングの強化**
    - TypeScript を利用して、取得データの型を明確に定義します。これにより、データ構造の変更時にエディタが警告を発するため、開発中のバグを未然に防げます。
    - エラーハンドリングは、try/catch を用いるか、データが取得できなかった場合のフォールバック処理を実装するとよいでしょう。
    - **Tip:** APIから取得する場合は、フェッチ処理時のエラーやタイムアウトに対する対策も検討してください。

3. **ISR（Incremental Static Regeneration）の活用**
    - `revalidate` プロパティを設定することで、ページがバックグラウンドで定期的に再生成され、最新データを反映できます。
    - **Tip:** データ更新頻度に合わせた適切な `revalidate` の時間設定を行い、ユーザーに最新の情報を提供しつつ、ビルドパフォーマンスも維持しましょう。

---

# まとめ

このセクション「2.1 トップページの作成」では、以下の内容を詳しく解説しました：

- **コンポーネントの作成とレイアウト設計:**
    - トップページの基本レイアウト（ヘッダー、メイン、フッター）の設計方法
    - 再利用可能な UI コンポーネントの作成とその組み込み
    - レスポンシブデザインの考慮と各コンポーネントの役割

- **getStaticPropsによるビルド時データ取得:**
    - `getStaticProps` の基本構造と非同期データ取得の実装方法
    - TypeScript を利用した型定義の実践
    - ISR の設定でページの自動更新と最新データ反映の方法

これらの手順を通じて、静的生成のメリットを活かした高速でSEOに優れたトップページの作成が可能となります。次のステップでは、より具体的なイベント一覧の表示や詳細ページの作成に進んでいきましょう。