@AGENTS.md

# knock-knock 프로젝트 규칙

## 프로젝트 개요
모바일 출입카드 발급/관리 웹시스템. 슈퍼관리자(백오피스)와 고객사 관리자(매니저) 이중 구조.

## 문서
- [@PLAN.md](PLAN.md) - 기능 명세 및 수정 계획
- [@TODO.md](TODO.md) - 작업 체크리스트
- [@docs/db-schema.md](docs/db-schema.md) - DB 스키마 (Supabase ↔ MariaDB 매핑)
- [@docs/design-system.md](docs/design-system.md) - UI 디자인 시스템 (색상, 컴포넌트, 패턴)

## 기술 스택
- Next.js 16 + React 19 + TypeScript
- Zustand 5 (상태관리, localStorage persist)
- TanStack React Table (테이블)
- Supabase (임시 DB, 추후 ASP.NET Core 교체 예정)
- Tailwind CSS 4, Zod, react-hook-form, jose (JWT)
- 개발 포트: 3003

## 프로젝트 구조
```
src/
├── app/admin/        # 슈퍼관리자 페이지 (clients, credits, users, dashboard)
├── app/manager/      # 고객사 관리자 페이지 (card-requests, credits, users, settings)
├── app/auth/         # 인증 (register, invite)
├── components/       # common(Button, Input, BaseTable, BaseModal) + admin/ + manager/
├── lib/api/          # API 함수 (Supabase 호출 격리)
├── lib/utils/        # 유틸리티 (JWT 검증, 코드 생성)
├── store/            # Zustand 스토어
├── types/            # TypeScript 타입 정의
└── hooks/            # 커스텀 훅 (useQueryParams)
```

## 코딩 컨벤션

### API 계층
- 모든 Supabase 호출은 `src/lib/api/` 내에만 존재해야 함
- snake_case(DB) ↔ camelCase(프론트엔드) 매핑은 API 함수 내에서 처리
- 반환 타입: `{ data, error }` 패턴 통일
- 스토어/페이지에서 supabase 직접 import 금지

### 컴포넌트
- 페이지는 `"use client"` 클라이언트 컴포넌트
- 테이블 컬럼 정의는 별도 `columns.tsx` 파일로 분리
- 모달은 `BaseModal` 기반으로 작성
- 폼 검증: Zod 스키마 + react-hook-form

### 상태관리
- Zustand store는 `create()(persist(...))` 패턴
- 서버사이드 페이지네이션은 `useQueryParams` 훅 + `BaseTable serverSide` prop 사용

### 스타일
- 액센트 컬러: green (#10B981)
- 상태 뱃지: amber(대기), green(승인/활성), red(거부/위험)
- 아이콘: lucide-react
- 토스트: sonner

## 작업 진행 규칙

- **Phase 단위 세션 분리**: 구현은 Phase 별로 세션을 나눠서 진행
- **화면 단위 세션 분리**: 실제 화면/UI 개발 단계부터는 각 화면(페이지)별로 세션을 분리
- **구현 시작 전 확인**: 세션 시작 시 해당 Phase/화면의 TODO 항목과 관련 문서를 먼저 확인
- **구현 금지 원칙**: 사용자가 명시적으로 "구현해"라고 하기 전까지 코드를 작성하지 않음
- **TODO 업데이트 금지 원칙**: 사용자가 명시적으로 지시하기 전까지 `TODO.md`를 수정하지 않음
- **세션 진행 의미**: "세션 X 진행해줘" = 관련 파일 파악 + 구현 계획 제시까지만. 파일 생성/수정/TODO 업데이트는 별도 지시 후에만
