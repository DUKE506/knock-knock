# DB 스키마 정의

> 관련 문서: [CLAUDE.md](../CLAUDE.md) | [PLAN.md](../PLAN.md)

## 개요

현재는 **Supabase(PostgreSQL)** 기반으로 개발 중이며, 추후 **MariaDB(ASP.NET Core 백엔드)** 로 교체 예정.  
API 계층(`src/lib/api/`)만 교체하면 되도록 설계. 프론트엔드 타입/컴포넌트는 변경 없음.

---

## 현재: Supabase (PostgreSQL)

### `workplaces` — 고객사(사업장)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 사업장 고유 ID |
| `name` | text | 사업장명 |
| `issue_code` | text UNIQUE | 라이센스 코드 (회원가입 검증용) |
| `invite_code` | text | 관리자 초대 코드 |
| `status` | text | `pending` / `active` / `inactive` |
| `credit_remaining` | integer | 잔여 크레딧 |
| `credit_total` | integer | 총 크레딧 |
| `card_count` | integer | 발급된 카드 수 |
| `manager_email` | text | 주관리자 이메일 |
| `created_at` | timestamp | 생성일시 |

> **백엔드 매핑**: `SiteInfo` 테이블  
> `issue_code` → `LicenseKey`, `credit_remaining` → `CreditCount - CreditUsed`, `credit_total` → `CreditCount`

---

### `users` — 사용자 (고객사 관리자 포함)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 사용자 고유 ID |
| `email` | text UNIQUE | 이메일 (로그인 ID) |
| `name` | text | 이름 |
| `password` | text | 비밀번호 (현재 평문, 추후 암호화 필요) |
| `phone` | text | 전화번호 |
| `workplace_id` | uuid FK | 소속 사업장 |
| `role` | text | `user` / `manager` / `primary_admin` / `sub_admin` |
| `is_admin` | boolean | 슈퍼관리자 여부 |
| `created_at` | timestamp | 생성일시 |

> **백엔드 매핑**: `SiteAdmin` 테이블  
> `role` → `Role` (0: 마스터/주관리자, 1: 서브마스터/부관리자)  
> 슈퍼관리자(백오피스)는 별도 `AdminInfo` 테이블로 분리됨

---

### `card_requests` — 카드 발급 요청

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 요청 고유 ID |
| `workplace_id` | uuid FK | 소속 사업장 |
| `issue_code` | text | 요청 시 사용된 초대 코드 |
| `user_name` | text | 카드 발급 대상자 이름 |
| `user_email` | text | 카드 발급 대상자 이메일 |
| `user_phone` | text | 카드 발급 대상자 전화번호 |
| `status` | text | `pending` / `approved` (거부 시 row 삭제) |
| `requested_at` | timestamp | 요청일시 |
| `reviewed_at` | timestamp | 승인일시 |
| `reviewed_by` | text | 승인자 이름 |
| `reject_reason` | text | (레거시, 현재 미사용 — 거부 시 삭제 처리) |

> **백엔드 매핑**: `SiteUserInfo` 테이블  
> `status` → `IssueStatus` (0: 승인대기, 1: 활성화대기, 2: 활성화)  
> **거부 시 row 삭제** (백엔드 동일: `승인거절 (row - delete)`)

---

### `cards` — 발급된 카드

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 카드 고유 ID |
| `card_request_id` | uuid FK | 연결된 발급 요청 ID |
| `workplace_id` | uuid FK | 소속 사업장 |
| `card_number` | text UNIQUE | 카드 번호 (16자리) |
| `activation_code` | text | 활성화번호 (6자리, 모바일 미등록 시에만 표시) |
| `is_activated` | boolean | 모바일 등록(활성화) 여부 |
| `activated_at` | timestamp | 활성화 일시 |
| `status` | text | `active` / `suspended` / `expired` |
| `expires_at` | timestamp | 유효기간 |
| `user_name` | text | 카드 소유자 이름 |
| `user_email` | text | 카드 소유자 이메일 |
| `user_phone` | text | 카드 소유자 전화번호 |
| `created_by` | text | 승인자 이름 |
| `issued_at` | timestamp | 발급일시 |
| `updated_at` | timestamp | 수정일시 |

> **백엔드 매핑**: `SiteUserInfo` 테이블  
> `activation_code` → `MobileActivationKey`  
> `is_activated` → `IssueStatus == 2`  
> `card_number` → `MobileKey`

---

### `credit_history` — 크레딧 이력

| 컬럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid PK | 이력 고유 ID |
| `type` | text | `issued` / `requested` / **`charged`** (추가 예정) |
| `workplace_id` | uuid FK | 사업장 |
| `workplace_name` | text | 사업장명 (비정규화) |
| `amount` | integer | 크레딧 수량 |
| `code` | text UNIQUE | 발급 코드 (레거시, 직접 충전 방식 전환 후 미사용) |
| `email` | text | 이메일 (레거시) |
| `status` | text | `pending` / `approved` / `rejected` (레거시) |
| `reject_reason` | text | 거부 사유 (레거시) |
| `created_by` | text | 생성자 |
| `reviewed_by` | text | 처리자 |
| `created_at` | timestamp | 생성일시 |
| `reviewed_at` | timestamp | 처리일시 |

> **백엔드 매핑**: `CreditHistory` 테이블  
> `Gubun` (1: 충전 / 2: 사용) → `type: "charged"` / `type: "used"`  
> 요청/코드 방식 제거 후 직접 충전만 남음

> ⚠️ **DB 변경 필요**: `credit_history.type` CHECK 제약조건에 `'charged'` 추가 필요  
> `CHECK (type = ANY (ARRAY['issued'::text, 'requested'::text, 'charged'::text]))`

---

## 교체 예정: MariaDB (ASP.NET Core 백엔드)

### 테이블 매핑 요약

| Supabase | MariaDB (sportal) | 비고 |
|----------|-------------------|------|
| `workplaces` | `SiteInfo` | `issue_code` → `LicenseKey` |
| `users` (고객사 관리자) | `SiteAdmin` | `role` → `Role` (0=마스터, 1=서브) |
| `users` (슈퍼관리자) | `AdminInfo` | `is_admin = true` 에 해당 |
| `card_requests` + `cards` | `SiteUserInfo` | `IssueStatus`로 상태 통합 |
| `credit_history` | `CreditHistory` | `Gubun` (1=충전, 2=사용) |

### 주요 차이점 및 주의사항

#### 1. 카드 발급 상태 (`IssueStatus`)
백엔드에서는 카드 요청과 카드 발급을 `SiteUserInfo` 단일 테이블로 관리.  
현재 Supabase의 `card_requests` + `cards` 2개 테이블 → 백엔드에서 1개 테이블.

```
IssueStatus:
  0 = 승인대기  (Supabase: card_requests.status = 'pending')
  1 = 활성화대기 (Supabase: cards.is_activated = false)
  2 = 활성화    (Supabase: cards.is_activated = true)
  거부 = row 삭제 (Supabase 동일)
```

#### 2. 관리자 역할 (`Role`)
```
SiteAdmin.Role:
  0 = 마스터(주관리자)  → users.role = 'primary_admin'
  1 = 서브마스터(부관리자) → users.role = 'sub_admin'
```

#### 3. 크레딧
```
CreditHistory.Gubun:
  1 = 충전 → type = 'charged'
  2 = 사용 → (카드 발급 시 차감, 별도 기록)
```

#### 4. 라이센스 코드
`SiteInfo.LicenseKey` = 사업장 키를 인코딩한 값.  
현재 Supabase의 `issue_code`(랜덤 생성)와 생성 방식이 다름 — API 교체 시 생성 로직 변경 필요.

#### 5. 사용자 식별
백엔드는 Snowflake ID(`BIGINT`) 사용. Supabase는 UUID 사용.  
API 교체 시 타입 변환 처리 필요.

#### 6. 이미지
`SiteUserInfo.Image` (LONGBLOB) — 현재 Supabase에는 없음. 추후 추가 고려.

#### 7. 추가 기능 (백엔드에만 존재)
- `AutoIssue`: 자동 승인 여부 (현재 미구현)
- `ViewNameYN` 등 카드 표시 옵션 (현재 미구현)
- `AuthGubun`: 인증 방식 카카오/이메일 (현재 미구현)
- `QRTimeOut`: QR 유효시간 (현재 미구현)
- `SiteHistory`: 사업장 변경 이력 로그 (현재 미구현)
- `MailSendHistory`: 메일 발송 이력 (현재 미구현)
