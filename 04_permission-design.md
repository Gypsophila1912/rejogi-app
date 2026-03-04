# 🔐 権限設計

---

# 0️⃣ 設計前提

| 項目           | 内容                         |
| -------------- | ---------------------------- |
| 権限モデル     | RBAC（基本）                 |
| マルチテナント | サークル単位管理             |
| 認証方式       | Google OAuth + Supabase Auth |
| スコープ単位   | Circle（サークル）           |
| MVP方針        | P0は最小ロールのみ           |

---

# 1️⃣ 用語定義

| 用語     | 意味                                 |
| -------- | ------------------------------------ |
| Subject  | 操作主体（ユーザー）                 |
| Resource | 操作対象（レジ・商品・セッション等） |
| Action   | 操作（create/read/update/delete）    |
| Role     | 権限グループ                         |
| Policy   | 条件付き許可ルール                   |

---

# 2️⃣ 権限レイヤー構造

````mermaid
flowchart TD
    Authentication
    RBAC
    ABAC
    Decision

    Authentication --> RBAC
    RBAC --> ABAC
    ABAC --> Decision
---

# 3️⃣ RBAC設計テンプレ

## 3-1. グローバルロール

| ロール名        | レベル | 説明     |
| ----------- | --- | ------ |
| ADMIN       | 80  | 管理操作可能 |
| MEMBER      | 50  | 一般利用   |

---

## 3-3. RBAC判定ロジック（抽象）

```pseudo
if user.role.level >= required_level:
    allow
else:
    deny
````

---

# 4️⃣ ABAC設計テンプレ

## 4-1. 条件モデル

```json
{
  "user.circle_id": "resource.circle_id",
  "event_period": "active",
  "price": "> 0"
}
```

---

## 4-2. ポリシーテーブル例

| ID  | 名前           | Action        | 条件            | Effect | Priority |
| --- | -------------- | ------------- | --------------- | ------ | -------- |
| 1   | DraftOnlyEdit  | entity:update | status=draft    | allow  | 10       |
| 2   | OwnerOverride  | \*            | role=OWNER      | allow  | 5        |
| 3   | TenantBoundary | \*            | tenant_mismatch | deny   | 1        |

---

## 4-3. 判定順序

```pseudo
1. 認証確認
2. テナント一致確認
3. RBAC判定
4. ABAC条件評価（priority順）
5. 最終Decision
```

---

# 5️⃣ ハイブリッド設計パターン

| レイヤー     | 用途                       |
| ------------ | -------------------------- |
| RBAC         | ロール単位大枠制御         |
| ABAC         | 期間・所有者・サークル制御 |
| Feature Flag | 将来拡張                   |

---

# 6️⃣ 代表的ルールテンプレ

### 6-1. セッション存在チェック

```pseudo
if session_not_exist:
    deny_order
```

---

### 6-2. 価格制約

```pseudo
if price <= 0:
    reject
```

---

### 6-3. イベント期間制御

```pseudo
if sold_at not in event_session.period:
    reject
```

---

### 6-4. 所属サークル制御

```pseudo
if user.circle_id != resource.circle_id:
    deny
```

---

# 7️⃣ データモデル連携テンプレ

| ルール       | 参照カラム       |
| ------------ | ---------------- |
| 所有者制御   | owner_id         |
| 状態制御     | status           |
| サークル制御 | circle_id        |
| 期間制御     | event_session_id |

---

# 8️⃣ ログ設計

## 8-1. ABAC評価ログ

| フィールド     | 内容       |
| -------------- | ---------- |
| user_id        |            |
| action         |            |
| resource_type  |            |
| resource_id    |            |
| matched_policy |            |
| result         | allow/deny |
| timestamp      |            |

---

## 8-2. 監査ログ

| フィールド | 内容      |
| ---------- | --------- |
| who        | user      |
| what       | action    |
| where      | resource  |
| result     | decision  |
| ip         | client_ip |

---

# 9️⃣ APIレイヤー統合

```typescript
function authorize(user, action, resource) {
  if (!isAuthenticated(user)) throw 401;
  if (!rbacAllow(user, action)) throw 403;
  if (!eventPeriodValid(resource)) throw 403;
}
```

---

# 🔟 フロントエンド制御

| パターン | 説明                   |
| -------- | ---------------------- |
| 非表示   | 権限なし機能を出さない |
| 無効化   | 操作禁止表示           |
| 警告     | UX補助                 |

※ フロントはUX制御のみ。最終判定は必ずサーバー側。
