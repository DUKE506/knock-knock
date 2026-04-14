// ============================================
// 고객사 관리자 인증 관련 API
// ============================================

import { apiClient } from "@/lib/apiClient";

/**
 * 고객사 관리자 로그인
 */
export async function loginManager(data: {
  loginId: string;
  password: string;
}): Promise<{
  data: { accessToken: string; refreshToken: string } | null;
  error: unknown;
}> {
  const { data: tokens, error } = await apiClient.post<{
    accessToken: string;
    refreshToken: string;
  }>("/manager-api/v1/MasterLogin/W/Login", {
    loginId: data.loginId,
    loginPw: data.password,
  });

  if (error || !tokens) {
    console.error("고객사 관리자 로그인 실패:", error);
    return { data: null, error };
  }

  return { data: tokens, error: null };
}

/**
 * 고객사 관리자 프로필 조회
 */
export interface ManagerProfile {
  loginId: string;
  name: string;
  company: string | null;
  deptName: string;
  job: string;
  role: string;
  siteKey: string;
  siteName: string;
}

export async function fetchManagerProfile(): Promise<{
  data: ManagerProfile | null;
  error: unknown;
}> {
  const { data, error } = await apiClient.get<ManagerProfile>(
    "/manager-api/v1/MasterSite/W/sign/GetMyProfile",
  );

  if (error || !data) {
    console.error("고객사 관리자 프로필 조회 실패:", error);
    return { data: null, error };
  }

  return { data, error: null };
}
