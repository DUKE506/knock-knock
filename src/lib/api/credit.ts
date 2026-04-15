import { PagedRequest } from "@/types/pagination";
import { PagedData } from "@/types/response";
import { supabase } from "../supabase";
import { generateIssueCode } from "@/lib/utils/generateIssueCode";
import { apiClient } from "../apiClient";

// ============================================
// 크레딧 관련 API
// ============================================

export interface CreditHistory {
  id: string;
  type: "issued" | "requested" | "charged";
  amount: number;
  workplaceId: string;
  workplaceName: string;
  code?: string; // issued만
  email?: string; // issued만
  status?: "pending" | "approved" | "rejected"; // requested만
  rejectReason?: string;
  createdAt: string;
  createdBy: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

/**
 * 크레딧 코드 직접 발급 (슈퍼관리자)
 */
export async function issueCreditCode(data: {
  amount: number;
  email: string;
  workplaceId?: string;
  workplaceName?: string;
  createdBy: string;
}) {
  // 크레딧 코드 생성 (16자리)
  const code = generateIssueCode();

  const { data: creditHistory, error } = await supabase
    .from("credit_history")
    .insert({
      type: "issued",
      amount: data.amount,
      code,
      email: data.email,
      workplace_id: data.workplaceId || null,
      workplace_name: data.workplaceName || null,
      created_by: data.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("크레딧 코드 발급 실패:", error);
    return { creditHistory: null, code: null, error };
  }

  return { creditHistory, code, error: null };
}

/**
 * 크레딧 충전 요청 생성 (사업장)
 */
export async function createCreditRequest(data: {
  amount: number;
  workplaceId: string;
  workplaceName: string;
  createdBy: string;
}) {
  const { data: creditHistory, error } = await supabase
    .from("credit_history")
    .insert({
      type: "requested",
      amount: data.amount,
      workplace_id: data.workplaceId,
      workplace_name: data.workplaceName,
      status: "pending",
      created_by: data.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("크레딧 요청 생성 실패:", error);
    return { creditHistory: null, error };
  }

  return { creditHistory, error: null };
}

/**
 * 크레딧 이력 조회 (전체 또는 타입별)
 */
export async function fetchCreditHistory(
  params: PagedRequest,
  filters?: {
    type?: "issued" | "requested";
    status?: "pending" | "approved" | "rejected";
    workplaceId?: string;
  },
) {
  const from = (params.pageNumber - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase.from("credit_history").select("*");

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }

  if (filters?.workplaceId) {
    query = query.eq("workplace_id", filters.workplaceId);
  }

  query = query.order("created_at", { ascending: false });

  //검색어 필터
  if (params.search) {
    query = query.or(`workplace_name.like.%${params.search}%`);
  }
  //정렬(옵션)
  if (params.sortBy) {
    query = query.order(params.sortBy, {
      ascending: params.sortOrder === "asc",
    });
  }
  // 페이지네이션 적용
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("크레딧 이력 조회 실패:", error);
    return { creditHistory: [], error };
  }

  // Supabase 형식 → 프론트엔드 형식 변환
  const creditHistory: CreditHistory[] = data.map((row) => ({
    id: row.id,
    type: row.type,
    amount: row.amount,
    workplaceId: row.workplace_id,
    workplaceName: row.workplace_name,
    code: row.code,
    email: row.email,
    status: row.status,
    rejectReason: row.reject_reason,
    createdAt: new Date(row.created_at).toLocaleString("ko-KR"),
    createdBy: row.created_by,
    reviewedAt: row.reviewed_at
      ? new Date(row.reviewed_at).toLocaleString("ko-KR")
      : undefined,
    reviewedBy: row.reviewed_by,
  }));

  return {
    data: {
      meta: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / params.pageSize),
      },
      data: creditHistory || [],
    },
    error: null,
  };
}

/**
 * 크레딧 요청 승인
 */
export async function approveCreditRequest(id: string, reviewedBy: string) {
  // 1. 요청 정보 조회
  const { data: request, error: fetchError } = await supabase
    .from("credit_history")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !request) {
    console.error("크레딧 요청 조회 실패:", fetchError);
    return { creditHistory: null, code: null, error: fetchError };
  }

  // 2. 크레딧 코드 생성
  const code = generateIssueCode();

  // 3. 상태 업데이트 (승인)
  const { data: updatedHistory, error: updateError } = await supabase
    .from("credit_history")
    .update({
      status: "approved",
      code,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("크레딧 요청 승인 실패:", updateError);
    return { creditHistory: null, code: null, error: updateError };
  }

  return { creditHistory: updatedHistory, code, error: null };
}

/**
 * 크레딧 요청 거부
 */
export async function rejectCreditRequest(
  id: string,
  reviewedBy: string,
  rejectReason: string,
) {
  const { data: updatedHistory, error } = await supabase
    .from("credit_history")
    .update({
      status: "rejected",
      reject_reason: rejectReason,
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("크레딧 요청 거부 실패:", error);
    return { creditHistory: null, error };
  }

  return { creditHistory: updatedHistory, error: null };
}

/**
 * 크레딧 코드 검증 및 충전 (사업장)
 */
export async function redeemCreditCode(code: string, workplaceId: string) {
  // 1. 코드 조회
  const { data: creditHistory, error: fetchError } = await supabase
    .from("credit_history")
    .select("*")
    .eq("code", code)
    .eq("type", "issued")
    .single();

  if (fetchError || !creditHistory) {
    console.error("크레딧 코드 조회 실패:", fetchError);
    return { success: false, error: "유효하지 않은 코드입니다." };
  }

  // 2. 이미 사용된 코드인지 확인 (workplace_id가 있으면 사용됨)
  if (creditHistory.workplace_id) {
    return { success: false, error: "이미 사용된 코드입니다." };
  }

  // 3. 사업장 크레딧 업데이트
  const { data: workplace, error: workplaceError } = await supabase
    .from("workplaces")
    .select("credit_remaining")
    .eq("id", workplaceId)
    .single();

  if (workplaceError || !workplace) {
    console.error("사업장 조회 실패:", workplaceError);
    return { success: false, error: "사업장 정보를 찾을 수 없습니다." };
  }

  const newCredit = workplace.credit_remaining + creditHistory.amount;

  const { error: updateError } = await supabase
    .from("workplaces")
    .update({ credit_remaining: newCredit })
    .eq("id", workplaceId);

  if (updateError) {
    console.error("크레딧 충전 실패:", updateError);
    return { success: false, error: "크레딧 충전에 실패했습니다." };
  }

  // 4. 코드 사용 처리 (workplace_id 업데이트)
  await supabase
    .from("credit_history")
    .update({ workplace_id: workplaceId })
    .eq("code", code);

  return { success: true, amount: creditHistory.amount, error: null };
}

// ============================================
// 고객사 크레딧 이력 (백엔드 API)
// ============================================

export interface ManagerCreditHistoryItem {
  id: string;
  gubun: string; // "충전" | "사용"
  creditCount: number;
  producer: string;
  consumer: string | null;
  createDt: string;
}

interface BackendManagerCreditItem {
  creditSeq: string;
  creditCount: number;
  gubun: string;
  producer: string;
  consumer: string | null;
  createDt: string;
}

/**
 * 고객사 크레딧 이력 조회 (백엔드 API, 토큰 기반)
 */
export async function fetchManagerCreditHistory(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<BackendManagerCreditItem>>(
    `/manager-api/v1/MasterSite/W/sign/GetCreditHistory?${query.toString()}`,
  );

  if (error || !data) {
    return { data: null, error };
  }

  const items: ManagerCreditHistoryItem[] = data.data.map((item) => ({
    id: item.creditSeq,
    gubun: item.gubun,
    creditCount: item.creditCount,
    producer: item.producer,
    consumer: item.consumer,
    createDt: new Date(item.createDt).toLocaleString("ko-KR"),
  }));

  return {
    data: {
      meta: data.meta,
      data: items,
    },
    error: null,
  };
}

interface ChargeHistoryItem {
  creditSeq: string;
  siteKey: string;
  siteName: string;
  creditCount: number;
  producer: string;
  createDt: string;
}

/**
 * 크레딧 충전 이력 조회 (슈퍼관리자 전체, 백엔드 API)
 */
export async function fetchChargeHistory(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<ChargeHistoryItem>>(
    `/api/v1/SuperSite/W/sign/GetChargeHistory?${query.toString()}`,
  );

  if (error || !data) {
    return { data: null, error };
  }

  const creditHistory: CreditHistory[] = data.data.map((item) => ({
    id: item.creditSeq,
    type: "charged" as const,
    workplaceId: item.siteKey,
    workplaceName: item.siteName,
    amount: item.creditCount,
    createdBy: item.producer,
    createdAt: new Date(item.createDt).toLocaleString("ko-KR"),
  }));

  return {
    data: {
      meta: data.meta,
      data: creditHistory,
    },
    error: null,
  };
}

/**
 * 크레딧 직접 충전 (슈퍼관리자 → 사업장, 백엔드 API)
 */
export async function chargeCreditsToWorkplace(data: {
  siteKey: string;
  creditCount: number;
}) {
  const { error } = await apiClient.post<boolean>(
    "/api/v1/SuperSite/W/sign/AddCreditIssue",
    { siteKey: data.siteKey, creditCount: data.creditCount },
  );

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}
