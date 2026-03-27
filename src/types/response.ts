// ============================================
// 공통 API 응답 구조
// ============================================

/**
 * 기본 API 응답 래퍼
 */
export interface ApiResponse<T> {
  message: string;
  data: T;
  code: number;
}

/**
 * 페이지네이션 메타 정보
 */
export interface PaginationMeta {
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

/**
 * 페이지네이션된 데이터 (배열)
 */
export interface PagedData<T> {
  meta: PaginationMeta;
  data: T[];
}

/**
 * 목록 API 응답 타입
 *
 */
export type ApiListResponse<T> = ApiResponse<PagedData<T>>;

/**
 * 상세 API 응답 타입
 * 단일 객체 T형태
 */
export type ApiDetailResponse<T> = ApiResponse<T>;
