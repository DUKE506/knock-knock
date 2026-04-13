import { PagedData } from "@/types/response";
import { apiClient } from "../apiClient";
import { Workplace } from "@/types/workplace";
import { PagedRequest } from "@/types/pagination";

interface SiteListItem {
  siteKey: string;
  siteName: string;
  creditCount: number;
  creditUsed: number;
  licenseKey: string;
  createDt: string;
}

// ============================================
// 사업장 관련 API
// ============================================

/**
 * 사업장 전체 조회
 */
export async function fetchWorkplaces(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<SiteListItem>>(
    `/api/v1/SuperSite/W/sign/GetSiteList?${query.toString()}`,
  );

  if (error || !data) {
    return { data: null, error };
  }

  const workplaces: Workplace[] = data.data.map((item) => ({
    id: item.siteKey,
    name: item.siteName,
    issueCode: item.licenseKey,
    creditTotal: item.creditCount,
    creditRemaining: item.creditCount - item.creditUsed,
    createdAt: item.createDt.split("T")[0].replace(/-/g, "."),
  }));

  return {
    data: {
      meta: data.meta,
      data: workplaces,
    },
    error: null,
  };
}

/**
 * 사업장 생성
 */
export async function createWorkplace(data: {
  name: string;
  creditCount: number;
  sendEmail?: string;
}) {
  const { data: result, error } = await apiClient.post<boolean>(
    "/api/v1/SuperSite/W/sign/AddSite",
    {
      name: data.name,
      creditCount: data.creditCount,
      sendEmail: data.sendEmail ?? null,
      autoIssue: false,
      viewNameYn: false,
      viewDeptYn: false,
      viewJobYn: false,
      viewCompanyYn: false,
      viewSabunYn: false,
      viewEndYn: false,
      qrTimeOut: 0,
    },
  );

  if (error) {
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * 고객사 주관리자 회원가입
 */
export async function addMainMaster(data: {
  loginId: string;
  loginPw: string;
  name: string;
  deptName: string;
  job: string;
  company?: string | null;
  role: number;
  licenseKey: string;
}) {
  const { error } = await apiClient.post(
    "/api/v1/SuperSite/W/AddMainMaster",
    data,
  );

  if (error) {
    console.error("주관리자 가입 실패:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * 메인관리자 아이디 중복 검사
 */
export async function checkMainMasterExists(loginId: string) {
  const { data, error } = await apiClient.post<{ exists: boolean }>(
    "/api/v1/SuperSite/W/ExistsMainMaster",
    { loginId },
  );

  if (error) {
    console.error("관리자 아이디 중복 검사 실패:", error);
    return { exists: false, error };
  }

  return { exists: data?.exists ?? false, error: null };
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
    creditRemaining: data.credit_remaining,
    creditTotal: data.credit_total,
    createdAt: new Date(data.created_at)
      .toISOString()
      .split("T")[0]
      .replace(/-/g, "."),
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
