import { ApiListResponse } from "@/types/response";
import { supabase } from "../supabase";
import { Workplace } from "@/types/workplace";
import { PagedRequest } from "@/types/pagination";

// ============================================
// 사업장 관련 API
// ============================================

/**
 * 사업장 전체 조회
 */
export async function fetchWorkplaces(params: PagedRequest) {
  const from = (params.pageNumber - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("workplaces")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  //검색어 필터
  if (params.search) {
    query = query.or(`name.like.%${params.search}`);
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
    console.error("사업장 조회 실패:", error);
    return { workplaces: [], error };
  }

  // Supabase 형식 → 프론트엔드 형식 변환
  const workplaces: Workplace[] = data.map((row) => ({
    id: row.id,
    name: row.name,
    issueCode: row.issue_code,
    status: row.status as "active" | "pending" | "inactive",
    creditRemaining: row.credit_remaining,
    creditTotal: row.credit_total,
    cardCount: row.card_count,
    createdAt: new Date(row.created_at)
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "."),
    managerEmail: row.manager_email,
  }));

  return {
    data: {
      meta: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / params.pageSize),
      },
      data: workplaces || [],
    },
    error: null,
  };
}

/**
 * 사업장 생성
 */
export async function createWorkplace(data: {
  name: string;
  issueCode: string;
  creditTotal: number;
  managerEmail?: string;
}) {
  const { data: workplace, error } = await supabase
    .from("workplaces")
    .insert({
      name: data.name,
      issue_code: data.issueCode,
      status: "pending",
      credit_remaining: data.creditTotal,
      credit_total: data.creditTotal,
      card_count: 0,
      manager_email: data.managerEmail,
    })
    .select()
    .single();

  if (error) {
    console.error("사업장 생성 실패:", error);
    return { workplace: null, error };
  }

  return { workplace, error: null };
}

/**
 * 발급코드로 사업장 조회 (검증용)
 */
export async function verifyIssueCode(issueCode: string) {
  const { data: workplace, error } = await supabase
    .from("workplaces")
    .select("*")
    .eq("issue_code", issueCode)
    .single();

  if (error) {
    console.error("발급코드 검증 실패:", error);
    return { workplace: null, error };
  }

  return { workplace, error: null };
}

/**
 * 사업장 업데이트
 */
export async function updateWorkplace(
  id: string,
  updates: {
    status?: "active" | "pending" | "inactive";
    creditRemaining?: number;
    cardCount?: number;
  },
) {
  const updateData: any = {};
  if (updates.status) updateData.status = updates.status;
  if (updates.creditRemaining !== undefined)
    updateData.credit_remaining = updates.creditRemaining;
  if (updates.cardCount !== undefined)
    updateData.card_count = updates.cardCount;

  const { data: workplace, error } = await supabase
    .from("workplaces")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("사업장 업데이트 실패:", error);
    return { workplace: null, error };
  }

  return { workplace, error: null };
}

/**
 * 단일 사업장 조회
 */
export async function fetchWorkplaceById(id: string) {
  const { data, error } = await supabase
    .from("workplaces")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("사업장 조회 실패:", error);
    return { workplace: null, error };
  }

  const workplace: Workplace = {
    id: data.id,
    name: data.name,
    issueCode: data.issue_code,
    status: data.status as "active" | "pending" | "inactive",
    creditRemaining: data.credit_remaining,
    creditTotal: data.credit_total,
    cardCount: data.card_count,
    createdAt: new Date(data.created_at)
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "."),
    managerEmail: data.manager_email,
  };

  return { workplace, error: null };
}

/**
 * 사업장 삭제
 */
export async function deleteWorkplace(id: string) {
  const { error } = await supabase.from("workplaces").delete().eq("id", id);

  if (error) {
    console.error("사업장 삭제 실패:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
}
