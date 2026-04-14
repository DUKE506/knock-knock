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

- [△] `src/lib/api/cardRequest.ts` — `fetchCardRequests` 쿼리에 `cards` 테이블 조인
- [△] `src/lib/api/cardRequest.ts` — `isActivated` 필드 매핑 추가
- [△] `src/types/manager/card/cardRequest.ts` — `isActivated?: boolean` 필드 추가
- [△] `src/app/manager/card-requests/columns.tsx` — 승인 상태에 활성화 서브 뱃지 추가
  - [△] `isActivated === true` → "활성화됨" (green)
  - [△] `isActivated === false` → "미활성화" (amber)
- [△] `src/components/manager/cards/CardDetailModal.tsx` — `isActivated === false` 일 때만 활성화번호 표시
- [△] `src/components/manager/cards/CardDetailModal.tsx` — `isActivated === true` 일 때 "모바일 활성화 완료" 메시지 표시

---

## Phase 4: 슈퍼관리자 백엔드 API 교체

> 참고 문서: [docs/super-admin-api.json](docs/super-admin-api.json)
> 각 Task는 순서대로 진행 (4-B 완료 후 4-C 시작 — siteKey 의존성)

### Task 4-A: API 클라이언트 기반 구축 + 로그인 교체

- [x] `.env.local` — `NEXT_PUBLIC_API_URL` 추가
- [x] `next.config.ts` — `/api/v1/**` rewrites 프록시 추가 (CORS 해결)
- [x] `src/lib/apiClient.ts` — fetch 싱글톤 신규 생성
  - [x] `useAuthStore`에서 `accessToken` 읽어 `Authorization: Bearer {token}` 자동 첨부
  - [x] `get()`, `post()`, `patch()`, `delete()` 메서드
- [x] `src/store/useAuthStore.ts` — `accessToken`, `refreshToken` 필드 추가
- [x] `src/store/useAuthStore.ts` — `setTokens()` 액션 추가
- [x] `src/store/useAuthStore.ts` — `AuthUser`에 `deptName`, `job` 추가, `phone` nullable 처리
- [x] `src/lib/api/admin/admin.ts` — `loginAdmin()` → `POST /api/v1/SuperLogin/W/Login` 교체
- [x] `src/lib/api/admin/admin.ts` — `fetchAdminProfile()` 추가 (`GET /api/v1/SuperLogin/W/sign/MyProfile`)
- [x] `src/app/login/page.tsx` — 로그인 성공 후 `setTokens()` 호출로 토큰 저장
- [x] `src/app/login/page.tsx` — 로그인 성공 후 `fetchAdminProfile()` 호출로 사용자 정보 바인딩

### Task 4-B: 고객사 관리 API 교체 (`/admin/clients`)

- [x] `src/lib/api/workplace.ts` — `fetchWorkplaces()` → `GET /api/v1/SuperSite/W/sign/GetSiteList` 교체 + 응답 매핑
- [x] `src/lib/api/workplace.ts` — `createWorkplace()` → `POST /api/v1/SuperSite/W/sign/AddSite` 교체
  - [x] UI 입력(`name`, `creditCount`, `sendEmail`)만 사용, 나머지 `AddSiteDto` 필드는 기본값으로 처리
  - [x] 로컬 `generateIssueCode()` 호출 제거
- [x] `src/components/admin/workplaces/CreateWorkplaceModal.tsx` — 서버 응답 기반 onSubmit 수정 (issueCode 로컬 생성 로직 제거)
- [x] `src/types/workplace.ts` — `status`, `cardCount`, `managerEmail` 제거 (백엔드 미제공 필드)
- [x] `src/app/admin/clients/columns.tsx` — `status`, `cardCount` 컬럼 제거

### Task 4-C: 크레딧 관리 API 교체 (`/admin/credits`)

- [x] `src/lib/api/credit.ts` — `fetchChargeHistory()` 신규 추가 → `GET /api/v1/SuperSite/W/sign/GetChargeHistory` + 응답 매핑 (`fetchCreditHistory`는 manager용으로 유지)
- [x] `src/lib/api/credit.ts` — `chargeCreditsToWorkplace()` → `POST /api/v1/SuperSite/W/sign/AddCreditIssue` 교체
  - [x] 기존 workplaces + credit_history 직접 업데이트 로직 제거
  - [x] `{ siteKey, creditCount }` 만 전송하는 방식으로 단순화
- [x] `src/components/admin/credits/ChargeCreditModal.tsx` — `siteKey` 기반으로 변경, 충전 후 `onSuccess` 콜백으로 목록 갱신
- [x] `src/components/common/Select.tsx` — 드롭다운 Portal 렌더링으로 교체 (모달 내 overflow 클리핑 문제 해결)

### Task 4-D: 슈퍼관리자 관리 API 교체 (`/admin/users`)

- [x] `src/lib/api/admin/admin.ts` — `fetchAdmins()` → `GET /api/v1/SuperRegister/W/sign/GetSuperMasterList` 교체 + 응답 매핑
- [x] `src/lib/api/admin/admin.ts` — `sendInviteMail()` → `POST /api/v1/SuperRegister/W/sign/InviteSuperMaster` 교체
  - [x] 로컬 JWT 토큰 생성 로직 제거, `{ receiver }` 만 전송
- [x] `src/lib/api/admin/admin.ts` — `createAdmin()` → `POST /api/v1/SuperRegister/W/AddSuperMaster` 교체
- [x] `src/app/auth/invite/page.tsx` — Zod 스키마에 `loginId`, `deptName`, `job` 필드 추가
- [x] `src/app/auth/invite/page.tsx` — 폼에 `loginId`(아이디), `deptName`(부서), `job`(직책) 입력 필드 추가
- [x] `src/components/admin/users/InviteUserModal.tsx` — 초대 발송 후 모달 닫기 + 성공/실패 toast
- [x] `src/app/admin/users/page.tsx` — "관리자 추가" → "관리자 초대" 버튼 명칭 변경
- [x] `src/app/admin/users/colums.tsx` — `Admin` 인터페이스 및 컬럼 교체 (`email`, `phone` → `loginId`, `deptName`, `job`)

### Task 4-E: 고객사 관리자 회원가입 페이지 (`/auth/register`)

- [x] `src/lib/actions/verifyInviteToken.ts` — Server Action 신규 생성 (JWT 검증, `jose` + 서버사이드 시크릿 키)
- [x] `src/app/auth/register/page.tsx` — 인증코드 입력 step 제거, `?access={토큰}` 파라미터로 즉시 폼 진입
- [x] `src/app/auth/register/page.tsx` — 토큰에서 `userId`(이메일/loginId), `licenseKey`, `siteName` 추출 + 고객사명 표시
- [x] `src/app/auth/register/page.tsx` — Zod + react-hook-form 적용 (기존 수동 검증 제거)
- [x] `src/app/auth/register/page.tsx` — 폼 필드 변경: `phone` 제거 / `deptName`, `job`, `company`(선택) 추가
- [x] `src/lib/api/workplace.ts` — `addMainMaster()` 추가 → `POST /api/v1/SuperSite/W/AddMainMaster`
- [x] `src/app/auth/register/page.tsx` — `createUser()` → `addMainMaster()` 교체 (`role: 0` 고정, `loginId`는 토큰 이메일 사용)
- [x] `src/components/admin/users/InviteUserModal.tsx` — 이메일 도메인 검증 (`@s-tec.co.kr` 한정)

### Task 4-F: 슈퍼관리자 회원가입 페이지 수정 (`/auth/invite`)

**`verifyInviteToken` 범용화 (공통)**
- [x] `src/lib/actions/verifyInviteToken.ts` — `InviteTokenPayload` 인터페이스 제거, 반환 타입을 `Record<string, any>`로 변경
- [x] `src/app/auth/register/page.tsx` — `InviteTokenPayload` import 제거, `{ userId, licenseKey, role, siteName }` 로컬 캐스팅으로 교체

**`/auth/invite` 버그 수정 + 정리**
- [x] `src/app/auth/invite/page.tsx` — `result.payload` → `result.data` 로 수정 (반환 인터페이스 불일치 버그)
- [x] `src/app/auth/invite/page.tsx` — `SuperAdminTokenPayload` 로컬 타입 정의 후 캐스팅 (`userId`, `role`)
- [x] `src/app/auth/invite/page.tsx` — `payload.email` → `data.userId` 로 수정 (필드 불일치 버그)
- [x] `src/app/auth/invite/page.tsx` — 불필요한 `verifyToken`, `JWTPayload`, `TokenPayload` 제거
- [x] `src/app/auth/invite/page.tsx` — `loginId` 입력 필드 제거, 토큰 이메일(`userId`)을 `loginId`로 사용

---

## Phase 5: 고객사 백엔드 API 교체

> 참고 문서: [docs/site-admin-api.json](docs/site-admin-api.json)
> 각 Task는 순서대로 진행 (5-A 완료 후 5-B 시작 — 토큰 의존성)

### Task 5-A: API 클라이언트 기반 + 매니저 로그인 교체 (`/login`)

- [x] `.env.local` — `NEXT_PUBLIC_MANAGER_API_URL` 추가 (포트 5208 별도 서버)
- [x] `next.config.ts` — `/manager-api/v1/:path*` rewrite 추가 (포트 5208)
- [x] `src/lib/api/manager/auth.ts` — `loginManager()` 신규 → `POST /manager-api/v1/MasterLogin/W/Login`
- [x] `src/lib/api/manager/auth.ts` — `fetchManagerProfile()` 신규 → `GET /manager-api/v1/MasterSite/W/sign/GetMyProfile`
- [x] `src/store/useAuthStore.ts` — `workplaceId`(siteKey), `workplaceName`(siteName) 기존 필드로 커버 확인
- [x] `src/app/login/page.tsx` — `loginType === "client"` 분기 → `loginManager()` 교체
- [x] `src/app/login/page.tsx` — 로그인 성공 후 `fetchManagerProfile()` 호출로 사용자 정보 바인딩
- [x] `src/components/layout/manager/Topnav.tsx` — 시간 제거, 고객사명 표시, 직책(`job`) 노출

### Task 5-B: 카드 발급 관리 API 교체 (`/manager/card-requests`)

- [△] `src/lib/api/cardRequest.ts` — `fetchCardRequests()` → `GET /manager-api/v1/MasterSite/W/sign/GetMobileUserList` 교체 + 응답 매핑
  - [△] `status` 매핑: IssueStatus 0→"pending", 1/2→"approved"
  - [△] `isActivated` 매핑: IssueStatus == 2
  - [△] `id` → `userSeq` (백엔드 식별자) 매핑
- [△] `src/lib/api/cardRequest.ts` — `approveCardRequest()` → `POST /manager-api/v1/MasterSite/W/sign/ApproveOrRejectUser` (isApprove: true) 교체
  - [△] `createCard()`, `sendCardActivationEmail()` 호출 제거 (백엔드가 처리)
- [△] `src/lib/api/cardRequest.ts` — `rejectCardRequest()` → `POST /manager-api/v1/MasterSite/W/sign/ApproveOrRejectUser` (isApprove: false) 교체
- [△] `src/types/manager/card/cardRequest.ts` — `id` 필드를 `userSeq` 기반으로 수정
- [△] `src/lib/api/card.ts` — `createCard()` 의존성 제거 확인 (cardRequest에서만 호출됨)

### Task 5-C: 관리자 관리 API 교체 (`/manager/users`)

- [ ] `src/lib/api/user.ts` — `fetchClientUsers()` → `GET /api/v1/MasterSite/W/sign/GetMasterList` 교체 + 응답 매핑
  - [ ] 필드: `adminSeq`, `loginId`, `name`, `deptName`, `job`, `role`(0=주관리자, 1=부관리자)
- [ ] `src/lib/api/user.ts` — `sendInviteClient()` → `POST /api/v1/SubRegister/W/InviteSubMaster` 교체
  - [ ] 로컬 JWT 생성 로직 제거, `{ licenseKey, receiver }` 전송
  - [ ] `licenseKey`는 `useAuthStore`에서 가져오기
- [ ] `src/lib/api/user.ts` — `addSubMaster()` 신규 → `POST /api/v1/SubRegister/W/AddSubMaster`
- [ ] `src/components/manager/users/InviteUserModal.tsx` — `sendInviteClient()` → 새 초대 API 교체
- [ ] `src/app/manager/users/columns.tsx` — `User` 타입 교체 (`loginId`, `deptName`, `job`, `role` 기반)
- [ ] `src/app/manager/users/columns.tsx` — `role` 뱃지 컬럼 추가 (주관리자/부관리자)
- [ ] `src/store/useClientStore.ts` — `User` 타입 및 `getUsers` 연결 수정
- [ ] `src/app/auth/sub-register/page.tsx` (신규) — 서브마스터 회원가입 페이지
  - [ ] 초대 이메일 링크 토큰 검증 (`verifyInviteToken` 재사용)
  - [ ] 폼: `loginId`, `loginPw`, `name`, `deptName`, `job`, `company`(선택)
  - [ ] `addSubMaster()` 호출 (role: 1 고정, licenseKey: 토큰에서 추출)

### Task 5-D: 크레딧/설정 API 교체 (`/manager/credits`, `/manager/settings`)

- [ ] `src/lib/api/manager/site.ts` (신규) — `fetchSiteDetail()` → `GET /api/v1/MasterSite/W/sign/GetSiteDetail`
  - [ ] 응답 매핑: `siteName`, `licenseKey`, `creditCount`, `creditUsed`, `createDt`
- [ ] `src/lib/api/credit.ts` — `fetchManagerCreditHistory()` 신규 → `GET /api/v1/MasterSite/W/sign/GetCreditHistory` + 응답 매핑
  - [ ] `gubun` 필터: 1=충전, 2=사용 (기존 `fetchCreditHistory` Supabase용은 유지)
- [ ] `src/app/manager/credits/page.tsx` — `fetchWorkplaceById()` → `fetchSiteDetail()` 교체 (크레딧 현황 카드)
- [ ] `src/app/manager/credits/page.tsx` — `fetchCreditHistory()` → `fetchManagerCreditHistory()` 교체
- [ ] `src/app/manager/settings/page.tsx` — 더미 데이터 → `fetchSiteDetail()` 실제 API 연동

---

## Phase 6: 관리자 역할 위임 (보류)

### Task 6-A: 주관리자/부관리자 기능

- [ ] `src/lib/api/user.ts` — `delegatePrimaryRole(currentId, targetId, workplaceId)` 함수 추가
  - [ ] `PUT /api/v1/MasterSite/W/sign/ChangeMainMaster` 호출 (`{ adminSeq }`)
- [ ] `src/app/manager/users/columns.tsx` — "위임" 버튼 추가 (주관리자만 노출)
- [ ] `src/app/manager/users/page.tsx` — 위임 핸들러 추가
- [ ] `src/app/manager/users/page.tsx` — 위임 확인 다이얼로그 추가
- [ ] `src/store/useAuthStore.ts` — 위임 후 현재 사용자 `role` 즉시 업데이트

---

## Phase 7: API 정리 (보류)

### Task 7-A: 백엔드 교체 대비 API 정리

- [ ] `src/lib/api/credit.ts` — 미사용 함수 정리 (`createCreditRequest`, `redeemCreditCode`, `approveCreditRequest`, `rejectCreditRequest`)
- [ ] `src/lib/api/cardRequest.ts` — 반환 타입 `{ data, error }` 패턴 통일 확인
- [ ] `src/lib/api/workplace.ts` — 반환 타입 통일 확인
- [ ] `src/lib/api/user.ts` — 반환 타입 통일 확인
- [ ] `src/lib/api/admin/admin.ts` — 반환 타입 통일 확인
- [ ] 전체 store/page에서 `supabase` 직접 import 여부 점검
