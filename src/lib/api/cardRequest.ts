import { CardRequest } from "@/types/manager/card/Cardruquest";
import { supabase } from "../supabase";

// ============================================
// 카드 요청 관련 API
// ============================================

/**
 * 카드 발급 요청 생성 (외부 API에서 호출)
 */
export async function createCardRequest(data: {
  issueCode: string;
  userName: string;
  userPhone: string;
  userEmail: string;
}) {
  // 1. 발급코드로 사업장 찾기
  const { data: workplace, error: workplaceError } = await supabase
    .from("workplaces")
    .select("id")
    .eq("issue_code", data.issueCode)
    .single();

  if (workplaceError || !workplace) {
    console.error("사업장 조회 실패:", workplaceError);
    return { cardRequest: null, error: "유효하지 않은 발급코드입니다." };
  }

  // 2. 카드 요청 생성
  const { data: cardRequest, error } = await supabase
    .from("card_requests")
    .insert({
      issue_code: data.issueCode,
      user_name: data.userName,
      user_phone: data.userPhone,
      user_email: data.userEmail,
      workplace_id: workplace.id,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("카드 요청 생성 실패:", error);
    return { cardRequest: null, error };
  }

  return { cardRequest, error: null };
}

/**
 * 카드 요청 목록 조회 (workplace 기준)
 */
export async function fetchCardRequests(workplaceId: string) {
  const { data, error } = await supabase
    .from("card_requests")
    .select("*")
    .eq("workplace_id", workplaceId)
    .order("requested_at", { ascending: false });

  if (error) {
    console.error("카드 요청 목록 조회 실패:", error);
    return { cardRequests: [], error };
  }

  // Supabase 형식 → 프론트엔드 형식 변환
  const cardRequests: CardRequest[] = data.map((row) => ({
    id: row.id,
    userName: row.user_name,
    userEmail: row.user_email,
    userPhone: row.user_phone,
    requestedAt: new Date(row.requested_at)
      .toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\. /g, ".")
      .replace(/\.$/, ""),
    status: row.status as "pending" | "approved" | "rejected",
    reviewedAt: row.reviewed_at
      ? new Date(row.reviewed_at).toLocaleString("ko-KR")
      : undefined,
    reviewedBy: row.reviewed_by,
    rejectReason: row.reject_reason,
  }));

  return { cardRequests, error: null };
}

/**
 * 카드 요청 승인
 */
export async function approveCardRequest(id: string, reviewedBy: string) {
  const { data, error } = await supabase
    .from("card_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("카드 요청 승인 실패:", error);
    return { cardRequest: null, error };
  }

  return { cardRequest: data, error: null };
}

/**
 * 카드 요청 거부
 */
export async function rejectCardRequest(
  id: string,
  reviewedBy: string,
  rejectReason: string,
) {
  const { data, error } = await supabase
    .from("card_requests")
    .update({
      status: "rejected",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
      reject_reason: rejectReason,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("카드 요청 거부 실패:", error);
    return { cardRequest: null, error };
  }

  return { cardRequest: data, error: null };
}
