# 디자인 시스템

> 관련 문서: [CLAUDE.md](../CLAUDE.md) | [PLAN.md](../PLAN.md)

---

## 1. 색상 토큰 (CSS Custom Properties)

`src/app/globals.css` 에 정의됨. 모든 컬러는 Tailwind 유틸리티 클래스로 사용.

### 배경
| 토큰 | 값 | 클래스 | 용도 |
|------|-----|--------|------|
| `--color-bg` | `#f8fafb` | `bg-bg` | 페이지 배경 |
| `--color-surface` | `#ffffff` | `bg-surface` | 카드, 모달, 테이블 |
| `--color-surface-2` | `#d1fae5` | `bg-surface-2` | 호버 배경 |

### 텍스트
| 토큰 | 값 | 클래스 | 용도 |
|------|-----|--------|------|
| `--color-text` | `#064e3b` | `text-text` | 주요 텍스트 |
| `--color-text-2` | `#475569` | `text-text-2` | 보조 텍스트 |
| `--color-text-3` | `#94a3b8` | `text-text-3` | 힌트, 라벨 |

### 테두리
| 토큰 | 값 | 클래스 | 용도 |
|------|-----|--------|------|
| `--color-border` | `#e5e7eb` | `border-border` | 기본 테두리 |
| `--color-border-2` | `#d1d5db` | `border-border-2` | 강조 테두리 |

### 액센트 (주 색상 — Emerald Green)
| 토큰 | 값 | 클래스 | 용도 |
|------|-----|--------|------|
| `--color-accent` | `#10b981` | `text-accent`, `bg-accent`, `border-accent` | CTA, 활성 상태 |
| `--color-accent-dim` | `rgba(16,185,129,0.1)` | `bg-accent-dim` | 액센트 배경 딤 |

### 상태 색상
| 이름 | 값 | 클래스 | 딤 클래스 | 용도 |
|------|-----|--------|----------|------|
| green | `#14b8a6` | `text-green`, `bg-green` | `bg-green-dim` | 승인, 활성 |
| amber | `#f59e0b` | `text-amber`, `bg-amber` | `bg-amber-dim` | 대기, 경고 |
| red | `#ef4444` | `text-red`, `bg-red` | `bg-red-dim` | 거부, 오류, 위험 |

### 그림자
```
--shadow-sm:  0 1px 2px 0 rgba(0,0,0,0.05)
--shadow-md:  0 4px 6px -1px rgba(0,0,0,0.1)
--shadow-lg:  0 10px 15px -3px rgba(0,0,0,0.1)
--shadow-xl:  0 20px 25px -5px rgba(0,0,0,0.1)
```

### 모서리 반경
```
--radius-sm:   4px   → rounded-sm
--radius-md:   6px   → rounded-md
--radius-lg:   10px  → rounded-lg
--radius-xl:   12px  → rounded-xl
--radius-full: 9999px → rounded-full
```

---

## 2. 타이포그래피

### 계층 구조
| 레벨 | 클래스 | 사용처 |
|------|--------|-------|
| 페이지 제목 | `text-2xl font-semibold text-text` | 각 페이지 h1 |
| 섹션 제목 | `text-lg font-semibold text-text` | 모달 제목, 섹션 헤더 |
| 소제목 | `text-sm font-semibold text-text` | 모달 내 그룹 헤더 |
| 본문 | `text-sm text-text-2` | 일반 내용 |
| 보조 텍스트 | `text-xs text-text-3` | 힌트, 라벨, 날짜 |
| 모노스페이스 | `font-mono` | 코드, ID, 날짜, 전화번호 |
| 테이블 헤더 | `text-[11px] font-mono tracking-wide uppercase text-white` | BaseTable 헤더 |
| 테이블 셀 | `text-[13px] text-text` | BaseTable 데이터 |

### 라벨 텍스트
```
text-sm font-medium text-text
```

---

## 3. Button 컴포넌트

**파일**: `src/components/common/Button.tsx`

```typescript
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  variant?: ButtonVariant;  // default: "primary"
  size?: ButtonSize;        // default: "md"
  icon?: LucideIcon;
  iconPosition?: "left" | "right";  // default: "left"
  isLoading?: boolean;
  title: string;            // 필수
}
```

### Variant 스타일
| variant | 배경 | 텍스트 | 테두리 | hover |
|---------|------|--------|--------|-------|
| `primary` | `bg-accent` | `text-white` | `border-accent` | `bg-[#059669]` |
| `secondary` | `bg-transparent` | `text-text-2` | `border-border-2` | `bg-accent-dim border-accent text-text` |
| `danger` | `bg-red` | `text-white` | `border-red` | `bg-[#DC2626]` |
| `ghost` | `bg-transparent` | `text-text-2` | `border-transparent` | `bg-surface-2 text-text` |

### Size 스타일
| size | padding | 폰트 | gap | 아이콘 |
|------|---------|------|-----|--------|
| `sm` | `px-3 py-1.5` | `text-xs` | `gap-1` | `w-3.5 h-3.5` |
| `md` | `px-3.5 py-2` | `text-[13px]` | `gap-1.5` | `w-4 h-4` |
| `lg` | `px-4 py-2.5` | `text-sm` | `gap-2` | `w-4 h-4` |

### 공통 클래스
```
inline-flex items-center justify-center font-medium rounded-md border
transition-all duration-150
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## 4. Input 컴포넌트

**파일**: `src/components/common/Input.tsx`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
```

### 상태별 스타일

```
기본:   border-border focus:border-accent
오류:   border-red focus:border-red
비활성: bg-bg cursor-not-allowed opacity-60
```

### 구조
```
label:      block text-sm font-medium text-text mb-2
input:      w-full px-3 py-2 text-sm border rounded-sm outline-none transition-colors
error:      text-xs text-red mt-1
helperText: text-xs text-text-3 mt-1
required:   <span className="text-red ml-1">*</span>
```

---

## 5. BaseModal 컴포넌트

**파일**: `src/components/common/modal/BaseModal.tsx`

```typescript
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitText?: string;      // default: "확인"
  cancelText?: string;      // default: "취소"
  size?: "sm" | "md" | "lg" | "xl";
  showFooter?: boolean;     // default: true
  isLoading?: boolean;
  submitDisabled?: boolean;
}
```

### 사이즈
| size | max-width |
|------|-----------|
| `sm` | `max-w-md` (448px) |
| `md` | `max-w-lg` (512px) |
| `lg` | `max-w-2xl` (672px) |
| `xl` | `max-w-4xl` (896px) |

### 구조 클래스
```
backdrop:   fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn
container:  bg-surface rounded-lg shadow-xl w-full animate-scaleIn
header:     flex items-center justify-between px-6 py-4 border-b border-border
content:    px-6 py-5 max-h-[calc(100vh-200px)] overflow-y-auto
footer:     flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-bg/50
```

### 동작
- `ESC` 키 → 닫기 (로딩 중 비활성)
- 백드롭 클릭 → 닫기 (로딩 중 비활성)
- 열릴 때 body 스크롤 비활성화
- 애니메이션: `animate-fadeIn` (0.15s) + `animate-scaleIn` (0.15s)

---

## 6. BaseTable 컴포넌트

**파일**: `src/components/common/table/BaseTable.tsx`

```typescript
interface BaseTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  enableSorting?: boolean;
  enableFiltering?: boolean;
  enablePagination?: boolean;
  pageSize?: number;           // default: 10
  searchPlaceholder?: string;
  emptyMessage?: string;
  serverSide?: {
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
    currentSearch?: string;
    onPageChange: (page: number) => void;
    onSearch?: (query: string) => void;
  };
}
```

### 구조 클래스
```
container:    bg-surface border border-border rounded-md overflow-hidden
thead:        bg-accent
th:           px-4 py-3 text-left text-[11px] text-white font-mono tracking-wide uppercase
tr(hover):    hover:bg-accent-dim transition-colors
td:           px-4 py-3.5 text-[13px] text-text
empty/load:   px-4 py-8 text-center text-sm text-text-3
search:       w-full max-w-sm px-3 py-2 bg-surface text-sm border border-border-2 rounded-md
              outline-none focus:border-accent transition-colors
page-btn:     p-2 border border-border-2 rounded-md hover:bg-accent-dim hover:border-accent
              disabled:opacity-50 disabled:cursor-not-allowed
current-page: px-3 py-1 bg-accent text-white rounded-md font-medium
```

---

## 7. 상태 뱃지 패턴

### 카드 요청 상태
```tsx
// 클래스 패턴
"inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium {color}"

pending:  "bg-amber-dim text-amber"  + Clock 아이콘
approved: "bg-green-dim text-green"  + CheckCircle 아이콘
rejected: "bg-red-dim text-red"      + XCircle 아이콘
```

### 사업장 상태 (dot 스타일)
```tsx
// 클래스 패턴
"inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded {bg} {text} text-[11px] font-medium font-mono"
// 내부에 dot: "w-1.5 h-1.5 rounded-full {dotColor}"

active:   bg-green-dim / text-green  / bg-green
pending:  bg-amber-dim / text-amber  / bg-amber
inactive: bg-gray-200  / text-text-3 / bg-text-3
```

---

## 8. 레이아웃 시스템

### 사이드바
```
width:    w-[220px]
position: fixed top-0 left-0 bottom-0
layout:   flex flex-col min-h-screen

로고 영역:   px-5 pt-6 pb-5 border-b border-border
네비게이션:  py-3 flex-1 overflow-y-auto
로그아웃:    px-5 py-4 border-t border-border
```

### 네비게이션 아이템
```
공통:     flex items-center gap-2.5 px-5 py-2.5 text-[13px] border-l-2 transition-all duration-150
활성:     text-accent bg-accent-dim border-l-accent
비활성:   text-text-2 border-l-transparent hover:text-text hover:bg-accent-dim
아이콘:   w-4 h-4
뱃지:     ml-auto bg-red text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono
```

### TopNav
```
Admin:   h-14 sticky top-0 z-10 flex items-center px-7 gap-4
Manager: h-16 flex items-center justify-between px-7
제목:    text-[15px] font-semibold text-text
부제:    text-xs text-text-3 mt-0.5
시간:    text-xs text-text-3 font-mono
아바타:  w-9 h-9 rounded-full bg-accent-dim (initial: text-accent font-semibold text-sm)
```

### 메인 콘텐츠 영역
```
margin-left: ml-[220px]  (사이드바 너비)
padding:     px-7 또는 p-7
```

---

## 9. 페이지 레이아웃 패턴

```tsx
export default function Page() {
  return (
    <>
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-2xl font-semibold text-text">제목</h1>
          <p className="text-sm text-text-3 mt-1">설명 또는 통계</p>
        </div>
        <Button variant="primary" size="md" title="액션" icon={Plus} />
      </div>

      {/* 필터 탭 (선택) */}
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg p-1 mb-4">
        <button className="flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors
                           [active]: bg-accent text-white
                           [inactive]: text-text-2 hover:text-text hover:bg-bg">
          탭명
        </button>
      </div>

      {/* 테이블 */}
      <BaseTable {...props} />

      {/* 모달 */}
      <SomeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
```

---

## 10. 폼 패턴 (Zod + react-hook-form)

```typescript
// 스키마 정의
const schema = z.object({
  name: z.string().min(2, "2자 이상 입력하세요").max(30, "30자 이하"),
  amount: z.number().min(1, "1 이상 입력하세요"),
  email: z.email("이메일 형식을 확인하세요"),
});
type FormData = z.infer<typeof schema>;

// 훅 사용
const {
  register,
  handleSubmit,
  formState: { errors, isValid, isSubmitting },
  reset,
} = useForm<FormData>({ resolver: zodResolver(schema) });

// 모달 연결
<BaseModal
  onSubmit={handleSubmit(onSubmit)}
  isLoading={isSubmitting}
  submitDisabled={!isValid}
>
  <div className="space-y-5">
    <Input
      label="이름"
      required
      {...register("name")}
      error={errors.name?.message}
    />
    <Input
      label="수량"
      type="number"
      {...register("amount", { valueAsNumber: true })}
      error={errors.amount?.message}
      helperText="1 크레딧 = 카드 1개"
    />
  </div>
</BaseModal>
```

---

## 11. 크레딧 바 패턴

```tsx
// 색상 기준
const barColor =
  percentage > 50 ? "bg-accent" :
  percentage > 20 ? "bg-amber" : "bg-red";

<div className="flex items-center gap-2">
  <div className="flex-1 max-w-[80px] h-1 bg-border rounded-sm overflow-hidden">
    <div
      className={`h-full rounded-sm transition-all duration-300 ${barColor}`}
      style={{ width: `${percentage}%` }}
    />
  </div>
  <span className="font-mono text-xs text-text-2 min-w-[48px]">
    {remaining}<span className="text-text-3">/{total}</span>
  </span>
</div>
```

---

## 12. 정보 박스 패턴

```tsx
// 액센트 정보 박스
<div className="bg-accent-dim border border-accent/20 rounded-md px-4 py-3">
  <p className="text-xs text-accent leading-relaxed">
    💡 안내 메시지
  </p>
</div>
```

---

## 13. 액션 버튼 (테이블 내 아이콘 버튼)

```tsx
<button
  className="w-7 h-7 rounded-md border border-border-2 bg-transparent
             text-text-3 hover:text-text hover:border-accent hover:bg-accent-dim
             transition-all duration-150 flex items-center justify-center"
  title="상세"
>
  <Eye className="w-3.5 h-3.5" />
</button>
```

---

## 14. 아이콘 사용 규칙

**라이브러리**: `lucide-react`

### 사이즈
| 컨텍스트 | 사이즈 |
|---------|--------|
| 버튼 (sm) | `w-3.5 h-3.5` |
| 버튼 (md/lg) / 네비게이션 | `w-4 h-4` |
| 뱃지 내부 | `w-3.5 h-3.5` |
| 섹션 헤더 | `w-4 h-4` |
| 장식용 (모달 우측 등) | `w-8 h-8 opacity-20` |

### 주요 아이콘
| 용도 | 아이콘 |
|------|--------|
| 생성/추가 | `Plus` |
| 승인 | `CheckCircle` |
| 거부 | `XCircle` |
| 대기 | `Clock` |
| 상세보기 | `Eye` |
| 수정 | `Pencil` |
| 로그아웃 | `LogOut` |
| 사업장 | `Building2` |
| 사용자 | `User`, `Users` |
| 메일 | `Mail` |
| 전화 | `Phone` |
| 날짜 | `Calendar` |
| 코드/키 | `Code`, `Key` |
| 크레딧 | `Coins`, `Zap` |
| 발송 | `Send`, `ArrowRight` |

---

## 15. 토스트 알림

**라이브러리**: `sonner`

```typescript
import { toast } from "sonner";

toast.success("저장되었습니다.");
toast.error("처리에 실패했습니다.");
toast.warning("완료되었지만 일부 오류가 발생했습니다.", {
  description: "상세 내용",
});
```

---

## 16. 애니메이션

```css
animate-fadeIn:  opacity 0→1, 0.15s ease-out
animate-scaleIn: scale 0.95→1 + opacity 0→1, 0.15s ease-out
animate-spin:    rotate 0→360deg, 1s linear infinite (로딩 스피너)

transition-colors:    색상 전환
transition-all:       모든 속성 전환
duration-150:         150ms (인터랙션)
duration-300:         300ms (바 너비 등)
```

---

## 17. 파일 위치 참조

| 컴포넌트 | 경로 |
|---------|------|
| Button | `src/components/common/Button.tsx` |
| Input | `src/components/common/Input.tsx` |
| BaseModal | `src/components/common/modal/BaseModal.tsx` |
| BaseTable | `src/components/common/table/BaseTable.tsx` |
| Admin Sidebar | `src/components/layout/admin/Sidebar.tsx` |
| Admin TopNav | `src/components/layout/admin/TopNav.tsx` |
| Manager Sidebar | `src/components/layout/manager/Sidebar.tsx` |
| Manager TopNav | `src/components/layout/manager/Topnav.tsx` |
| CSS 변수 | `src/app/globals.css` |
