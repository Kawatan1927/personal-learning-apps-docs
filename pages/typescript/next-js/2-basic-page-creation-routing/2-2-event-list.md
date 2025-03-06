# 2.2 イベント一覧ページの作成

このセクションでは、アプリケーション内でイベントの一覧を表示するページを作成する方法について詳細に解説します。イベント一覧ページは、ユーザーが参加可能なイベントを一目で確認できる重要な画面です。ここでは、再利用性の高いイベントカードコンポーネントの設計と実装、そしてクライアントサイドレンダリング（CSR）の基本について具体的な手順とTipsを交えて説明します。

---

## 2.2.1 イベントカードコンポーネントの設計と実装

### 説明
- **目的:**  
  各イベントの情報（タイトル、日付、概要など）をわかりやすく表示するためのカード型コンポーネントを作成します。
- **ポイント:**  
  再利用性の高いコンポーネント設計により、一覧表示以外の場所でも同じコンポーネントを活用できます。また、TypeScriptによる型定義で、データ構造の一貫性を保ちます。

### 手順

1. **イベントデータの型定義**
    - TypeScriptを活用して、イベントデータの構造を明確に定義します。
    - 例:
      ```tsx
      // types/Event.ts
      export type Event = {
        id: number;
        title: string;
        date: string;
        description?: string; // オプション項目として詳細説明
      };
      ```
    - **Tip:** 型定義を別ファイルに切り出すことで、複数のコンポーネント間で同じ型を再利用でき、保守性が向上します。

2. **イベントカードコンポーネントの作成**
    - 新規ファイル `components/EventCard.tsx` を作成し、イベントデータを受け取って表示するコンポーネントを実装します。
    - 例:
      ```tsx
      // components/EventCard.tsx
      import React from 'react';
      import { Event } from '../types/Event';
      import styles from './EventCard.module.css'; // CSS Modules を利用する例
 
      type EventCardProps = {
        event: Event;
      };
 
      const EventCard: React.FC<EventCardProps> = ({ event }) => {
        return (
          <div className={styles.card}>
            <h3 className={styles.title}>{event.title}</h3>
            <p className={styles.date}>{event.date}</p>
            {event.description && <p className={styles.description}>{event.description}</p>}
          </div>
        );
      };
 
      export default EventCard;
      ```
    - **Tip:** CSS Modules を利用することで、クラス名の衝突を防ぎつつ、コンポーネントごとにスタイルを独立して管理できます。

3. **スタイルの設定**
    - イベントカードの見た目を整えるため、`components/EventCard.module.css` を作成し、スタイルを定義します。
    - 例:
      ```css
      /* components/EventCard.module.css */
      .card {
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 16px;
        margin: 8px;
        transition: box-shadow 0.3s ease;
      }
      
      .card:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      }
      
      .title {
        font-size: 1.2rem;
        margin-bottom: 8px;
      }
      
      .date {
        color: #666;
        margin-bottom: 8px;
      }
      
      .description {
        font-size: 0.9rem;
        color: #333;
      }
      ```
    - **Tip:** シンプルなスタイルから始め、後でデザインの調整やレスポンシブ対応を追加していくとスムーズです。

---

## 2.2.2 クライアントサイドレンダリング（CSR）の基礎

### 説明
- **目的:**  
  イベント一覧ページで、ユーザーの操作に応じてリアルタイムにデータを更新・表示するために、クライアントサイドレンダリング（CSR）の基本概念を学びます。
- **ポイント:**  
  CSRは、ユーザーの操作に対して即時のフィードバックを行うために利用されます。Next.jsでは、`getStaticProps` や `getServerSideProps` と組み合わせて初期データを取得した後、クライアント側でデータ更新やフィルタリングなどの動的処理を実装します。

### 手順

1. **初期データの取得**
    - 前セクション（2.1）で実装した `getStaticProps` により、トップページでのイベントデータ取得と静的生成の仕組みを再利用します。
    - **Tip:** 初期表示は静的に生成し、その後のユーザー操作による更新はCSRで行うと、パフォーマンスとSEOの両方のメリットが得られます。

2. **イベント一覧ページでのCSR実装**
    - 取得したイベントデータを利用し、ユーザー操作（例：フィルタリング、ソート）に対応するためのロジックを実装します。
    - 例として、イベントの検索フィールドを追加し、入力に応じて一覧をフィルタリングする処理を実装します。
      ```tsx
      // pages/events.tsx
      import { NextPage, GetStaticProps } from 'next';
      import React, { useState } from 'react';
      import EventCard from '../components/EventCard';
      import { Event } from '../types/Event';
 
      type EventsPageProps = {
        events: Event[];
      };
 
      const EventsPage: NextPage<EventsPageProps> = ({ events }) => {
        const [searchTerm, setSearchTerm] = useState('');
 
        // 検索条件に合致するイベントのみをフィルタリング
        const filteredEvents = events.filter(event =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
 
        return (
          <div>
            <h2>イベント一覧</h2>
            <input
              type="text"
              placeholder="イベントを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: '16px', padding: '8px', width: '100%' }}
            />
            <div>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))
              ) : (
                <p>該当するイベントが見つかりませんでした。</p>
              )}
            </div>
          </div>
        );
      };
 
      export const getStaticProps: GetStaticProps = async () => {
        // モックデータまたは実際のAPIからイベント情報を取得
        const events: Event[] = [
          { id: 1, title: 'セミナー: Next.js入門', date: '2025-03-15' },
          { id: 2, title: 'ワークショップ: TypeScript活用法', date: '2025-04-01' },
          { id: 3, title: 'ミートアップ: 開発者交流会', date: '2025-05-10' },
        ];
 
        return {
          props: {
            events,
          },
          revalidate: 60,
        };
      };
 
      export default EventsPage;
      ```
    - **Tip:** フィルタリングやソート機能は、必要に応じて外部ライブラリ（例：Lodash）を利用することで、より効率的に実装することができます。

3. **パフォーマンスの最適化**
    - クライアントサイドでの処理が重くならないよう、レンダリング最適化を意識します。
    - **Tip:** React の `useMemo` や `useCallback` を活用して、不要な再レンダリングを防ぎ、パフォーマンス向上に努めましょう。

---

# まとめ

このセクション「2.2 イベント一覧ページの作成」では、以下の点を詳細に解説しました：

- **イベントカードコンポーネントの設計と実装:**
    - イベントデータの型定義と再利用性の高いコンポーネントの作成方法
    - CSS Modules を使ったスタイル管理のポイント

- **クライアントサイドレンダリング（CSR）の基礎:**
    - 初期データ取得後のユーザー操作（例：検索、フィルタリング）に対応する方法
    - 効率的なフィルタリング処理とパフォーマンス最適化のTips

これらの手順を実践することで、ユーザーが直感的にイベント情報を確認・検索できる一覧ページを実装できるようになります。次のステップでは、各イベントの詳細ページ作成や動的ルーティングの実装について進めていきましょう。