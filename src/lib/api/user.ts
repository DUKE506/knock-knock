import { apiClient } from "../apiClient";
import { PagedRequest } from "@/types/pagination";
import { PagedData } from "@/types/response";

// ============================================
// 사용자 관련 API
// ============================================

export interface User {
  id: string;      // adminSeq
  loginId: string;
  name: string;
  deptName: string;
  job: string;
  role: number;    // 0=주관리자, 1=부관리자
}

interface BackendMasterUser {
  adminSeq: string;
  loginId: string;
  name: string;
  deptName: string;
  job: string;
  role: number;
}

/**
 * 고객사 관리자 목록 조회
 */
export async function fetchClientUsers(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<BackendMasterUser>>(
    `/manager-api/v1/MasterSite/W/sign/GetMasterList?${query.toString()}`,
  );

  if (error || !data) return { data: null, error };

  const users: User[] = data.data.map((item) => ({
    id: item.adminSeq,
    loginId: item.loginId,
    name: item.name,
    deptName: item.deptName,
    job: item.job,
    role: item.role,
  }));

  return { data: { meta: data.meta, data: users }, error: null };
}

/**
 * 부관리자 초대 메일 발송
 */
export async function sendInviteClient(data: {
  email: string;
  siteKey: string;
}) {
  const { error } = await apiClient.post(
    "/manager-api/v1/SubRegister/W/InviteSubMaster",
    { siteKey: data.siteKey, receiver: data.email },
  );

  if (error) return { success: false, error };
  return { success: true, error: null };
}

/**
 * 부관리자 회원가입
 */
export async function addSubMaster(data: {
  loginId: string;
  loginPw: string;
  name: string;
  deptName: string;
  job: string;
  company?: string | null;
  licenseKey: string;
}) {
  const { error } = await apiClient.post(
    "/manager-api/v1/SubRegister/W/AddSubMaster",
    { ...data, role: 1 },
  );

  if (error) return { success: false, error };
  return { success: true, error: null };
}
