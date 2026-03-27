/**
 * 서버로 보내는 페이지네이션 요청 파라미터
 *
 */
export interface PagedRequest {
  pageNumber: number;
  pageSize: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
