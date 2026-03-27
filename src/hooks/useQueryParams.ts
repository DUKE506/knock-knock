import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface UseQueryParamsOptions {
  initialPage?: number;
  initialSearch?: string;
}

export function useQueryParams(options: UseQueryParamsOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 쿼리스트링에서 초기값 가져오기
  const initialPage = parseInt(
    searchParams.get("page") || `${options.initialPage || 1}`,
    10,
  );
  const initialSearch =
    searchParams.get("search") || options.initialSearch || "";

  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);

  // 쿼리스트링 업데이트
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set("page", page.toString());
    if (search) params.set("search", search);

    const queryString = params.toString();
    router.replace(queryString ? `?${queryString}` : window.location.pathname, {
      scroll: false,
    });
  }, [page, search, router]);

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 검색 핸들러
  const handleSearch = (query: string) => {
    setSearch(query);
    setPage(1); // 검색 시 첫 페이지로
  };

  return {
    page,
    search,
    setPage: handlePageChange,
    setSearch: handleSearch,
  };
}
