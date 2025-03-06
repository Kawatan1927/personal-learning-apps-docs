# 2.3 動的ルーティングと詳細ページの作成

このセクションでは、Next.js の動的ルーティングを利用して、各イベントの詳細ページを生成する方法について詳細に解説します。動的ルーティングは、ユーザーが特定のイベントを選択した際に、そのイベントに対応する詳細情報を表示するための重要な仕組みです。以下の手順を通じて、動的ルートの作成からデータ取得までの流れを具体的に学んでいきましょう。

---

## 2.3.1 動的ルート用ファイルの作成

### 説明
- **目的:**  
  動的ルーティングを実現するために、イベントのIDなどをパラメータとして受け取り、対応する詳細ページを生成します。
- **ポイント:**  
  Next.js では、`pages` ディレクトリ内に角括弧を用いたファイル名（例: `[id].tsx`）を作成することで、動的なURLパラメータを扱うページを簡単に実装できます。

### 手順

1. **動的ルートファイルの作成**
    - プロジェクトの `pages` ディレクトリ内に `events` フォルダを作成し、その中に `[id].tsx` というファイルを作成します。
    - **Tip:** ファイル名の角括弧は、URLパラメータを示す Next.js 独自のシンタックスです。`[id].tsx` で作成した場合、`/events/1`、`/events/2` といったURLに自動で対応します。

2. **基本的なコンポーネントの作成**
    - 作成した `[id].tsx` ファイルに、以下のような基本のReactコンポーネントを実装します。
      ```tsx
      // pages/events/[id].tsx
      import { NextPage } from 'next';
      import { useRouter } from 'next/router';
 
      const EventDetail: NextPage = () => {
        const router = useRouter();
        const { id } = router.query;  // URLパラメータとして取得
 
        return (
          <div>
            <h1>イベント詳細ページ</h1>
            <p>選択されたイベントのID: {id}</p>
            {/* ここに詳細情報の表示コンポーネントを追加 */}
          </div>
        );
      };
 
      export default EventDetail;
      ```
    - **Tip:** 初期段階では、`useRouter` を使ってURLパラメータを確認するだけでも十分です。後ほど、取得したIDに基づいたデータフェッチを行います。

---

## 2.3.2 getStaticPaths と getStaticProps を用いた動的ページ生成

### 説明
- **目的:**  
  ビルド時に存在するイベントデータから、各詳細ページを静的生成するために `getStaticPaths` と `getStaticProps` を組み合わせます。
- **ポイント:**
    - **getStaticPaths:** どのパスを事前生成するかを指定します。
    - **getStaticProps:** 各ページで必要なデータを取得し、コンポーネントに渡します。

### 手順

1. **getStaticPaths の実装**
    - まず、ビルド時に生成するパス（例：イベントIDの一覧）を指定します。以下は、モックデータを利用した例です。
      ```tsx
      // pages/events/[id].tsx
      import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
      import { useRouter } from 'next/router';
      import { Event } from '../../types/Event';
 
      type EventDetailProps = {
        event: Event;
      };
 
      const EventDetail: NextPage<EventDetailProps> = ({ event }) => {
        const router = useRouter();
 
        // ページがまだ生成中の場合の表示
        if (router.isFallback) {
          return <div>読み込み中...</div>;
        }
 
        return (
          <div>
            <h1>{event.title}</h1>
            <p>日付: {event.date}</p>
            {event.description && <p>{event.description}</p>}
          </div>
        );
      };
 
      export const getStaticPaths: GetStaticPaths = async () => {
        // ここではモックデータを利用しています。実際はAPIやデータベースから取得します。
        const events: Event[] = [
          { id: 1, title: 'セミナー: Next.js入門', date: '2025-03-15', description: 'Next.jsの基本を学ぶセミナーです。' },
          { id: 2, title: 'ワークショップ: TypeScript活用法', date: '2025-04-01', description: 'TypeScriptの実践的な使い方を学びます。' },
        ];
 
        const paths = events.map((event) => ({
          params: { id: event.id.toString() },
        }));
 
        return {
          paths,
          fallback: true,  // fallbackをtrueにすると、未生成のページもリクエスト時に生成可能に
        };
      };
      ```
    - **Tip:** `fallback` オプションの設定により、事前に生成していないパスへのアクセス時の挙動を制御できます。`fallback: true` に設定すると、初回アクセス時にページが生成され、その後キャッシュされます。

2. **getStaticProps の実装**
    - 各動的ページに必要なデータを取得するために、`getStaticProps` を実装します。URLパラメータからイベントIDを取得し、そのIDに対応するデータを返します。
      ```tsx
      export const getStaticProps: GetStaticProps = async (context) => {
        const { id } = context.params!;
        // ここではモックデータから該当するイベントを取得しています。
        // 実際にはAPIやデータベースから取得することが一般的です。
        const events: Event[] = [
          { id: 1, title: 'セミナー: Next.js入門', date: '2025-03-15', description: 'Next.jsの基本を学ぶセミナーです。' },
          { id: 2, title: 'ワークショップ: TypeScript活用法', date: '2025-04-01', description: 'TypeScriptの実践的な使い方を学びます。' },
        ];
 
        const event = events.find((e) => e.id.toString() === id);
 
        if (!event) {
          return { notFound: true };  // イベントが見つからない場合、404ページを返す
        }
 
        return {
          props: {
            event,
          },
          revalidate: 60,  // ISRを活用し、60秒ごとに最新データで再生成
        };
      };
      ```
    - **Tip:** 型安全を維持するために、`context.params` の型キャストや、型定義ファイル（例: `types/Event.ts`）を活用してください。また、データが存在しない場合は `notFound: true` を返すことで、404ページを自動生成する仕組みを利用できます。

---

# まとめ

このセクション「2.3 動的ルーティングと詳細ページの作成」では、以下の内容を詳しく解説しました：

- **動的ルートファイルの作成:**
    - `pages/events/[id].tsx` の作成方法と、そのファイル名によりURLパラメータが自動的に扱われる仕組みを理解しました。

- **getStaticPaths と getStaticProps の連携:**
    - `getStaticPaths` を用いて、どのパスをビルド時に生成するかを指定する方法
    - `getStaticProps` で、URLパラメータに基づいて該当するイベントデータを取得し、コンポーネントに渡す方法
    - fallback オプションや ISR（Incremental Static Regeneration）を活用した最新データの反映方法

これらの手順により、ユーザーが特定のイベントを選択した際に、その詳細情報を表示する動的なページを効率的に生成できるようになります。次のステップでは、詳細ページにさらにインタラクティブな機能（例えば、コメント機能や関連イベントの表示など）を追加する方法について学んでいきましょう。