// ============================================
// 슈퍼관리자 관련 API
// ============================================

import { PagedRequest } from "@/types/pagination";
import { Admin } from "@/app/admin/users/colums";
import { apiClient } from "@/lib/apiClient";
import { PagedData } from "@/types/response";

export interface User {}

interface SuperMasterListItem {
  adminSeq: string;
  loginId: string;
  name: string;
  deptName: string;
  job: string;
  createDt: string;
}

/**
 * 슈퍼관리자 초대링크 전송
 */
export async function sendInviteMail(data: { email: string }) {
  const { error } = await apiClient.post(
    "/api/v1/SuperRegister/W/sign/InviteSuperMaster",
    { receiver: data.email },
  );

  if (error) {
    console.error("초대 메일 발송 실패:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
}

/**
 * 슈퍼관리자 회원가입 요청
 */
export async function createAdmin(data: {
  loginId: string;
  name: string;
  password: string;
  deptName: string;
  job: string;
}) {
  const { error } = await apiClient.post(
    "/api/v1/SuperRegister/W/AddSuperMaster",
    {
      loginId: data.loginId,
      loginPw: data.password,
      name: data.name,
      deptName: data.deptName,
      job: data.job,
    },
  );

  if (error) {
    console.error("슈퍼관리자 생성 실패:", error);
    return { data: null, error };
  }

  return { data: true, error: null };
}

/**
 * 슈퍼관리자 조회
 */
export async function fetchAdmins(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<SuperMasterListItem>>(
    `/api/v1/SuperRegister/W/sign/GetSuperMasterList?${query.toString()}`,
  );

  if (error || !data) {
    console.error("슈퍼관리자 조회 실패:", error);
    return { data: null, error };
  }

  const admins: Admin[] = data.data.map((item) => ({
    id: item.adminSeq,
    loginId: item.loginId,
    name: item.name,
    deptName: item.deptName,
    job: item.job,
    role: "슈퍼관리자",
    createdAt: item.createDt.split("T")[0].replace(/-/g, "."),
  }));

  return {
    data: {
      meta: data.meta,
      data: admins,
    },
    error: null,
  };
}

/**
 * 슈퍼관리자 로그인
 */
export async function loginAdmin(data: {
  email: string;
  password: string;
}): Promise<{
  data: { accessToken: string; refreshToken: string } | null;
  error: unknown;
}> {
  const { data: tokens, error } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>("/api/v1/SuperLogin/W/Login", {
    loginId: data.email,
    loginPw: data.password,
  });

  if (error || !tokens) {
    console.error("슈퍼관리자 로그인 실패:", error);
    return { data: null, error };
  }

  return { data: tokens, error: null };
}

/**
 * 슈퍼관리자 프로필 조회
 */
export interface AdminProfile {
  adminSeq: string;
  loginId: string;
  name: string;
  deptName: string;
  job: string;
}

export async function fetchAdminProfile(): Promise<{
  data: AdminProfile | null;
  error: unknown;
}> {
  const { data, error } = await apiClient.get<AdminProfile>(
    "/api/v1/SuperLogin/W/sign/MyProfile",
  );

  if (error || !data) {
    console.error("슈퍼관리자 프로필 조회 실패:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
