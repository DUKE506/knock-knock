import { supabase } from "../supabase";
import { apiClient } from "@/lib/apiClient";
import { CardRequest } from "@/types/manager/card/cardRequest";
import { PagedRequest } from "@/types/pagination";
import { PagedData } from "@/types/response";

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

interface MobileUserItem {
  userSeq: string;
  deviceId?: string;
  name: string;
  dept?: string;
  job?: string;
  email: string;
  company?: string;
  sabun?: string;
  phoneNumber: string;
  cardStartDt?: string;
  cardEndDt?: string;
  createDt: string;
  issueStatus?: number; // 0=승인대기, 1=활성화대기, 2=활성화
  issueStatusName: string;
}

/**
 * 카드 요청 목록 조회 (서버사이드 페이지네이션)
 */
export async function fetchCardRequests(params: PagedRequest) {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    pageSize: String(params.pageSize),
  });
  if (params.search) query.set("searchKey", params.search);

  const { data, error } = await apiClient.get<PagedData<MobileUserItem>>(
    `/manager-api/v1/MasterSite/W/sign/GetMobileUserList?${query.toString()}`,
  );

  if (error || !data) {
    console.error("카드 요청 목록 조회 실패:", error);
    return { data: null, error };
  }

  const cardRequests: CardRequest[] = data.data.map((item) => {
    const issueStatus = item.issueStatus ?? -1;
    const status = issueStatus === 0 ? "pending" : "approved";
    const isActivated = issueStatus === 2;

    return {
      id: item.userSeq,
      userName: item.name,
      userEmail: item.email,
      userPhone: item.phoneNumber,
      requestedAt: item.createDt
        ? new Date(item.createDt)
            .toLocaleString("ko-KR", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            .replace(/\. /g, ".")
            .replace(/\.$/, "")
        : "",
      status,
      isActivated,
    };
  });

  return { data: { meta: data.meta, data: cardRequests }, error: null };
}

/**
 * 카드 요청 승인 (백엔드가 카드 생성 및 이메일 발송 처리)
 */
export async function approveCardRequest(id: string) {
  const { error } = await apiClient.post(
    "/manager-api/v1/MasterSite/W/sign/ApproveOrRejectUser",
    { userSeq: id, isApprove: true },
  );

  if (error) {
    console.error("카드 요청 승인 실패:", error);
    return { error };
  }

  return { error: null };
}

/**
 * 카드 요청 거부 (백엔드에서 row 삭제 처리)
 */
export async function rejectCardRequest(id: string) {
  const { error } = await apiClient.post(
    "/manager-api/v1/MasterSite/W/sign/ApproveOrRejectUser",
    { userSeq: id, isApprove: false },
  );

  if (error) {
    console.error("카드 요청 거부 실패:", error);
    return { error };
  }

  return { error: null };
}
