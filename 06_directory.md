# 📁 ディレクトリ構成図

---

# 0️⃣ 設計前提

| 項目           | 内容                                |
| -------------- | ----------------------------------- |
| リポジトリ構成 | Monorepo / Polyrepo                 |
| アーキテクチャ | Layered / Clean Architecture / DDD  |
| デプロイ単位   | 単一サービス / マイクロサービス     |
| 言語           | 任意（TypeScript / Go / Python 等） |
| MVP方針        | P0に必要なディレクトリのみ          |

---

# 1️⃣ 全体構成（Monorepo想定）

```id="o8d9si"
root/
├── apps/              # 実行可能アプリ
│   ├── web/
│   ├── api/
│   └── admin/
├── packages/          # 共有パッケージ
│   ├── ui/
│   ├── domain/
│   ├── config/
│   └── utils/
├── infra/             # IaC / Terraform / Docker
├── scripts/           # 補助スクリプト
├── docs/              # 設計書
└── README.md
```

---

# 2️⃣ フロントエンド構成テンプレ

```id="tq93md"
root/
├── apps/
│   ├── web/                     # フロントエンドアプリ（React + Hono想定）
│   └── api/                     # Backend API（Hono Server）
│
├── core/
│   ├── domain/                  # ドメインモデル（ビジネスルール）
│   ├── usecase/                 # アプリケーションユースケース
│   ├── repository/              # DB抽象層
│   └── service/                 # 共通業務ロジック
│
├── infrastructure/
│   ├── db/                      # DB接続
│   ├── auth/                    # 認証基盤
│   └── external/                # 外部API
│
├── presentation/
│   ├── components/              # Presentational Component
│   ├── containers/              # Container Component
│   ├── hooks/
│   ├── pages/
│   └── router/
│
├── features/                    # Feature-based module
│   ├── auth/
│   ├── cashier/
│   ├── product/
│   ├── session/
│   ├── sales/
│   └── dashboard/
│
├── shared/
│   ├── ui/
│   ├── constants/
│   ├── utils/
│   └── types/
│
├── migrations/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
└── docs/
    ├── 00_designdoc.md
    ├── 01_feature-list_md.md
    ├── 02_tech-stack.md
    ├── 03_screen-flow_md.md
    ├── 04_permission-design.md
    ├── 05_erd.md
    ├── 06_directory.md
    ├── 07_infrastructure.md
    ├── 08_logging.md
    └── 09_schedule_and_issues_md.md
```

---

## Featureベース構成（推奨）

```id="t6lm52"
├── features/                    # Feature-based module
│   ├── auth/
│   ├── cashier/
│   ├── product/
│   ├── session/
│   ├── sales/
│   └── dashboard/
```

---

# 3️⃣ バックエンド構成テンプレ（Clean Architecture）

```id="9wh13c"
apps/api/
├── cmd/                # エントリポイント
├── internal/
│   ├── domain/         # エンティティ・ビジネスルール
│   ├── usecase/        # アプリケーションロジック
│   ├── repository/     # DB抽象
│   ├── handler/        # HTTP層
│   ├── middleware/
│   └── config/
├── migrations/
└── tests/
```

---

# 6️⃣ インフラ構成

```id="v9k0mz"
 infrastructure/
├── db/                      # DB接続
├── auth/                    # 認証基盤
└── external/                # 外部API
```

---

# 7️⃣ ドキュメント構成

```id="az1k93"
docs/
├── 00_designdoc.md
├── 01_feature-list_md.md
├── 02_tech-stack.md
├── 03_screen-flow_md.md
├── 04_permission-design.md
├── 05_erd.md
├── 06_directory.md
├── 07_infrastructure.md
├── 08_logging.md
└── 09_schedule_and_issues_md.md
```

---

# 8️⃣ テスト構成テンプレ

```id="c32po1"
tests/
├── unit/
├── integration/
└── e2e/
```

---
