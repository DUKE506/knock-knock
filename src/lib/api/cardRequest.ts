import { supabase } from "../supabase";
import { CardRequest } from "@/types/manager/card/cardRequest";
import { PagedRequest } from "@/types/pagination";
import { createCard } from "./card";
import { sendCardActivationEmail } from "./mail";

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
 * 카드 요청 목록 조회 (workplace 기준, 서버사이드 페이지네이션)
 */
export async function fetchCardRequests(
  workplaceId: string,
  params: PagedRequest,
) {
  const from = (params.pageNumber - 1) * params.pageSize;
  const to = from + params.pageSize - 1;

  let query = supabase
    .from("card_requests")
    .select("*", { count: "exact" })
    .eq("workplace_id", workplaceId)
    .order("requested_at", { ascending: false });

  if (params.search) {
    query = query.or(
      `user_name.like.%${params.search}%,user_email.like.%${params.search}%,user_phone.like.%${params.search}%`,
    );
  }

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("카드 요청 목록 조회 실패:", error);
    return { data: null, error };
  }

  // Supabase 형식 → 프론트엔드 형식 변환
  const cardRequests: CardRequest[] = (data ?? []).map((row) => ({
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
    status: row.status as "pending" | "approved",
    reviewedAt: row.reviewed_at
      ? new Date(row.reviewed_at).toLocaleString("ko-KR")
      : undefined,
    reviewedBy: row.reviewed_by,
  }));

  return {
    data: {
      data: cardRequests,
      meta: {
        pageNumber: params.pageNumber,
        pageSize: params.pageSize,
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / params.pageSize),
      },
    },
    error: null,
  };
}

/**
 * 카드 요청 승인
 */
export async function approveCardRequest(id: string, reviewedBy: string) {
  // 1. 카드 요청 정보 조회
  const { data: cardRequest, error: fetchError } = await supabase
    .from("card_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError || !cardRequest) {
    console.error("카드 요청 조회 실패:", fetchError);
    return { cardRequest: null, error: fetchError };
  }

  // 2. 카드 요청 상태 업데이트 (approved)
  const { data: updatedRequest, error: updateError } = await supabase
    .from("card_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: reviewedBy,
    })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    console.error("카드 요청 승인 실패:", updateError);
    return { cardRequest: null, error: updateError };
  }

  // 3. 카드 자동 생성
  const { card, error: cardError } = await createCard({
    cardRequestId: id,
    userName: cardRequest.user_name,
    userEmail: cardRequest.user_email,
    userPhone: cardRequest.user_phone,
    workplaceId: cardRequest.workplace_id,
    createdBy: reviewedBy,
  });

  if (cardError || !card) {
    console.error("카드 생성 실패:", cardError);
    // 카드 생성 실패 시 요청 상태 롤백
    await supabase
      .from("card_requests")
      .update({ status: "pending" })
      .eq("id", id);
    return { cardRequest: null, error: "카드 생성에 실패했습니다." };
  }

  // 4. 활성화번호 이메일 발송
  try {
    await sendCardActivationEmail({
      to: cardRequest.user_email,
      userName: cardRequest.user_name,
      cardNumber: card.card_number,
      activationCode: card.activation_code,
    });
    console.log("활성화번호 이메일 발송 완료:", cardRequest.user_email);
  } catch (emailError) {
    console.error("이메일 발송 실패:", emailError);
    // 이메일 실패는 치명적이지 않으므로 계속 진행
  }

  return { cardRequest: updatedRequest, error: null };
}

/**
 * 카드 요청 거부 (DB에서 삭제)
 */
export async function rejectCardRequest(id: string) {
  const { error } = await supabase.from("card_requests").delete().eq("id", id);

  if (error) {
    console.error("카드 요청 거부(삭제) 실패:", error);
    return { error };
  }

  return { error: null };
}
