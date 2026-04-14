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

## 목록 API 구현 패턴 (서버사이드 페이지네이션)

백엔드 API 교체 후 모든 목록 화면은 아래 패턴을 따른다. 슈퍼관리자 고객사 목록(`/admin/clients`)이 기준 구현체.

### 백엔드 응답 구조

```
// 공통 응답 envelope (ApiResponse<T> — src/types/response.ts)
{ message: string, data: T, code: number }

// 목록 응답 (ApiListResponse<T> = ApiResponse<PagedData<T>>)
{
  message: "요청이 정상 처리되었습니다.",
  data: {
    meta: { pageNumber, pageSize, totalCount, totalPages },  // PaginationMeta
    data: [...]                                              // T[]
  },
  code: 200
}
```

### 타입 파일

| 파일 | 내용 |
|------|------|
| `src/types/response.ts` | `ApiResponse<T>`, `PaginationMeta`, `PagedData<T>`, `ApiListResponse<T>`, `ApiDetailResponse<T>` |
| `src/types/pagination.ts` | `PagedRequest` (pageNumber, pageSize, search?, sortBy?, sortOrder?) |

### API 함수 패턴 (`src/lib/api/xxx.ts`)

```typescript
// 백엔드 응답 필드용 로컬 인터페이스
interface BackendItem { fieldA: string; fieldB: number; ... }

export async function fetchXxxList(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<BackendItem>>(
    `/manager-api/v1/.../GetXxxList?${query.toString()}`,
  );
  if (error || !data) return { data: null, error };

  const items: FrontendType[] = data.data.map((item) => ({
    id: item.xxxSeq,        // 백엔드 식별자 → id로 매핑
    name: item.xxxName,
    // ...camelCase 변환
  }));

  return { data: { meta: data.meta, data: items }, error: null };
}
```

> `apiClient`는 응답 envelope(`{ message, data, code }`)을 자동 unwrap하여 `data` 필드만 반환.  
> 따라서 `apiClient.get<PagedData<T>>`로 제네릭을 지정하면 바로 `{ meta, data }` 구조로 접근 가능.

### Zustand Store 패턴 (`src/store/useXxxStore.ts`)

```typescript
interface XxxStore {
  items: FrontendType[];
  meta: PaginationMeta;
  isLoading: boolean;
  error: string | null;
  // Actions: setItems, addItem, updateItem, deleteItem, setLoading, setError
  fetchItems: (params: PagedRequest) => Promise<void>;  // workplaceId 불필요 (토큰 기반)
}

// fetchItems 구현
fetchItems: async (params) => {
  set({ isLoading: true, error: null });
  try {
    const result = await fetchXxxList(params);
    if (result.error || !result.data) {
      set({ error: "로딩 실패", isLoading: false });
    } else {
      set({ items: result.data.data, meta: result.data.meta, isLoading: false });
    }
  } catch {
    set({ error: "데이터 동기화 실패", isLoading: false });
  }
},
```

### 페이지 컴포넌트 패턴 (`src/app/.../page.tsx`)

```typescript
"use client";

export default function XxxPage() {
  const { items, meta, fetchItems } = useXxxStore();
  const { page, search, params, setPage, setSearch } = useQueryParams();

  useEffect(() => {
    fetchItems(params);          // workplaceId 인수 없음 (토큰 기반)
  }, [page, search]);

  return (
    <>
      <BaseTable
        data={items}
        columns={columns}
        serverSide={{
          totalCount: meta.totalCount,
          totalPages: meta.totalPages,
          currentPage: meta.pageNumber,
          pageSize: meta.pageSize,
          currentSearch: search,
          onPageChange: setPage,
          onSearch: setSearch,
        }}
      />
    </>
  );
}
```

### 핵심 규칙 요약
- 백엔드 API는 토큰 기반이므로 `workplaceId`를 별도 인수로 전달하지 않음
- 백엔드 필드명(camelCase/PascalCase 혼재)은 API 함수 내에서 프론트엔드 camelCase로 변환
- 백엔드 식별자(`userSeq`, `adminSeq` 등)는 프론트엔드 `id` 필드로 통일 매핑

---

## 작업 진행 규칙

- **Phase 단위 세션 분리**: 구현은 Phase 별로 세션을 나눠서 진행
- **화면 단위 세션 분리**: 실제 화면/UI 개발 단계부터는 각 화면(페이지)별로 세션을 분리
- **구현 시작 전 확인**: 세션 시작 시 해당 Phase/화면의 TODO 항목과 관련 문서를 먼저 확인
- **구현 금지 원칙**: 사용자가 명시적으로 "구현해"라고 하기 전까지 코드를 작성하지 않음
- **TODO 업데이트 금지 원칙**: 사용자가 명시적으로 지시하기 전까지 `TODO.md`를 수정하지 않음
- **세션 진행 의미**: "세션 X 진행해줘" = 관련 파일 파악 + 구현 계획 제시까지만. 파일 생성/수정/TODO 업데이트는 별도 지시 후에만
