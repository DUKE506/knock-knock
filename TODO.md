# knock-knock 작업 체크리스트

> 관련 문서: [CLAUDE.md](CLAUDE.md) | [PLAN.md](PLAN.md)

## 체크박스 규칙

| 표시 | 의미 |
|------|------|
| `[ ]` | 개발 전 |
| `[△]` | 구현 완료, 미확인 또는 문제 있음 |
| `[x]` | 완료 (확인됨) |

---

## Phase 1: 간단한 수정

### Task 1-A: 설정 페이지 "발급 코드" → "라이센스 코드" 라벨 변경

- [x] `src/app/manager/settings/page.tsx` — 라벨 텍스트 변경 (L90)
- [x] `src/app/manager/settings/page.tsx` — 안내 문구 변경 (L106)
- [x] `src/app/manager/settings/page.tsx` — 수정 불가 안내 변경 (L163)

### Task 1-B: 카드 거부 시 DB 삭제 처리

- [x] `src/lib/api/cardRequest.ts` — `rejectCardRequest()` `.update()` → `.delete()` 로 변경, 파라미터 단순화
- [x] `src/lib/api/cardRequest.ts` — `fetchCardRequests()` 서버사이드 페이지네이션 지원 (버그 수정)
- [x] `src/types/manager/card/cardRequest.ts` — `CardRequestStatus`에서 `"rejected"` 제거
- [x] `src/types/manager/card/cardRequest.ts` — `CardRequest`에서 `rejectReason` 필드 제거
- [x] `src/store/useCardRequestStore.ts` — `deleteCardRequest(id)` 액션 추가 확인
- [x] `src/app/manager/card-requests/page.tsx` — `handleReject` 시그니처 수정 (reason 제거)
- [x] `src/app/manager/card-requests/page.tsx` — 거부 후 `updateCardRequest` → `deleteCardRequest` 로 변경
- [x] `src/app/manager/card-requests/page.tsx` — 통계/탭에서 `rejected` 항목 제거
- [x] `src/app/manager/card-requests/page.tsx` — `syncWithSupabase` → `useQueryParams` + `getCardRequests` 패턴으로 교체 (버그 수정)
- [x] `src/app/manager/card-requests/page.tsx` — `localStorage("user")` → `useAuthStore` 로 교체 (버그 수정)
- [x] `src/app/manager/card-requests/columns.tsx` — `onReject` 핸들러 시그니처 수정
- [x] `src/app/manager/card-requests/columns.tsx` — `prompt()` → `confirm()` 으로 변경
- [x] `src/app/manager/card-requests/columns.tsx` — `rejected` 상태 뱃지 및 분기 제거

---

## Phase 2: 크레딧 시스템 변경

### Task 2-A: 크레딧 API 수정

- [△] `src/lib/api/credit.ts` — `CreditHistory.type`에 `"charged"` 추가
- [△] `src/lib/api/credit.ts` — `chargeCreditsToWorkplace()` 함수 추가
  - [△] workplaces 테이블 `credit_remaining` / `credit_total` 업데이트
  - [△] credit_history에 `type: "charged"` 이력 삽입

### Task 2-B: 슈퍼관리자 크레딧 페이지 리팩토링

- [x] `src/components/admin/credits/CreateCreditModal.tsx` → `ChargeCreditModal.tsx` 신규 작성
  - [x] 고객사 드롭다운 (useWorkplaceStore 재사용, 커스텀 Select 컴포넌트)
  - [x] 수량 입력 폼
  - [x] `chargeCreditsToWorkplace()` 호출
- [x] `src/app/admin/credits/page.tsx` — 탭 시스템 제거
- [x] `src/app/admin/credits/page.tsx` — 요청 승인/거부 핸들러 제거
- [x] `src/app/admin/credits/page.tsx` — "코드 발급" → "크레딧 충전" 버튼으로 교체
- [x] `src/app/admin/credits/page.tsx` — `ChargeCreditModal` 연결
- [x] `src/app/admin/credits/page.tsx` — 이력 테이블만 남기기
- [x] `src/app/admin/credits/history-colums.tsx` — `code` / `email` 컬럼 제거
- [x] `src/app/admin/credits/history-colums.tsx` — `status` 로직 단순화
- [x] `src/app/admin/credits/request-colums.tsx` — 파일 삭제

### Task 2-C: 고객사 크레딧 페이지 리팩토링

- [x] `src/app/manager/credits/page.tsx` — 충전 요청 폼 제거
- [x] `src/app/manager/credits/page.tsx` — 충전 코드 입력 폼 제거
- [x] `src/app/manager/credits/page.tsx` — 안내 메시지 제거
- [x] `src/app/manager/credits/page.tsx` — 크레딧 현황 카드 실제 데이터 연동
- [x] `src/app/manager/credits/page.tsx` — 이력 테이블 추가 (workplaceId 필터)
- [x] `src/app/manager/credits/columns.tsx` — 이력 컬럼 신규 생성

---

## Phase 3: 카드 활성화 상태

### Task 3-A: 승인된 카드의 모바일 활성화 여부 구분

- [ ] `src/lib/api/cardRequest.ts` — `fetchCardRequests` 쿼리에 `cards` 테이블 조인
- [ ] `src/lib/api/cardRequest.ts` — `isActivated` 필드 매핑 추가
- [ ] `src/types/manager/card/cardRequest.ts` — `isActivated?: boolean` 필드 추가
- [ ] `src/app/manager/card-requests/columns.tsx` — 승인 상태에 활성화 서브 뱃지 추가
  - [ ] `isActivated === true` → "활성화됨" (green)
  - [ ] `isActivated === false` → "미활성화" (amber)
- [ ] `src/components/manager/cards/CardDetailModal.tsx` — `isActivated === false` 일 때만 활성화번호 표시
- [ ] `src/components/manager/cards/CardDetailModal.tsx` — `isActivated === true` 일 때 "모바일 활성화 완료" 메시지 표시

---

## Phase 4: 관리자 역할 위임

### Task 4-A: 주관리자/부관리자 기능

- [ ] `src/lib/api/user.ts` — `delegatePrimaryRole(currentId, targetId, workplaceId)` 함수 추가
  - [ ] 현재 주관리자 → `sub_admin` 변경
  - [ ] 대상 관리자 → `primary_admin` 변경
  - [ ] `workplaces.manager_email` 업데이트
- [ ] `src/app/manager/users/columns.tsx` — "역할" 컬럼 추가 (주관리자/부관리자 뱃지)
- [ ] `src/app/manager/users/columns.tsx` — "위임" 버튼 추가 (주관리자만 노출)
- [ ] `src/app/manager/users/page.tsx` — 위임 핸들러 추가
- [ ] `src/app/manager/users/page.tsx` — 위임 확인 다이얼로그 추가
- [ ] `src/store/useAuthStore.ts` — 위임 후 현재 사용자 `role` 즉시 업데이트

---

## Phase 5: API 정리

### Task 5-A: 백엔드 교체 대비 API 정리

- [ ] `src/lib/api/credit.ts` — 미사용 함수 정리 (`createCreditRequest`, `redeemCreditCode`, `approveCreditRequest`, `rejectCreditRequest`)
- [ ] `src/lib/api/cardRequest.ts` — 반환 타입 `{ data, error }` 패턴 통일 확인
- [ ] `src/lib/api/workplace.ts` — 반환 타입 통일 확인
- [ ] `src/lib/api/user.ts` — 반환 타입 통일 확인
- [ ] `src/lib/api/admin/admin.ts` — 반환 타입 통일 확인
- [ ] 전체 store/page에서 `supabase` 직접 import 여부 점검
