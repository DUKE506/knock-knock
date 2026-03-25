import { supabase } from "../supabase";
import {
  generateActivationCode,
  generateCardNumber,
} from "@/lib/utils/generateCardInfo";

// ============================================
// 카드 관련 API
// ============================================

export interface Card {
  id: string;
  cardNumber: string;
  activationCode: string;
  isActivated: boolean;
  activatedAt?: string;
  cardRequestId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  workplaceId: string;
  issuedAt: string;
  expiresAt: string;
  status: "active" | "suspended" | "expired";
  createdBy: string;
  updatedAt: string;
}

/**
 * 카드 생성 (승인 시 자동 호출)
 */
export async function createCard(data: {
  cardRequestId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  workplaceId: string;
  createdBy: string;
}) {
  // 카드 정보 자동 생성
  const cardNumber = generateCardNumber();
  const activationCode = generateActivationCode();

  // 유효기간: 발급일로부터 1년 후
  const expiresAt = new Date();
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  const { data: card, error } = await supabase
    .from("cards")
    .insert({
      card_number: cardNumber,
      activation_code: activationCode,
      is_activated: false,
      card_request_id: data.cardRequestId,
      user_name: data.userName,
      user_email: data.userEmail,
      user_phone: data.userPhone,
      workplace_id: data.workplaceId,
      expires_at: expiresAt.toISOString(),
      status: "active",
      created_by: data.createdBy,
    })
    .select()
    .single();

  if (error) {
    console.error("카드 생성 실패:", error);
    return { card: null, error };
  }

  return { card, error: null };
}

/**
 * 카드 정보 조회 (card_request_id로)
 */
export async function getCardByRequestId(cardRequestId: string) {
  const { data: card, error } = await supabase
    .from("cards")
    .select("*")
    .eq("card_request_id", cardRequestId)
    .single();

  if (error) {
    console.error("카드 조회 실패:", error);
    return { card: null, error };
  }

  // Supabase 형식 → 프론트엔드 형식 변환
  const formattedCard: Card = {
    id: card.id,
    cardNumber: card.card_number,
    activationCode: card.activation_code,
    isActivated: card.is_activated,
    activatedAt: card.activated_at,
    cardRequestId: card.card_request_id,
    userName: card.user_name,
    userEmail: card.user_email,
    userPhone: card.user_phone,
    workplaceId: card.workplace_id,
    issuedAt: card.issued_at,
    expiresAt: card.expires_at,
    status: card.status,
    createdBy: card.created_by,
    updatedAt: card.updated_at,
  };

  return { card: formattedCard, error: null };
}

/**
 * 카드 정보 업데이트
 */
export async function updateCard(
  cardId: string,
  updates: {
    cardNumber?: string;
    expiresAt?: string;
    status?: "active" | "suspended" | "expired";
  },
) {
  const updateData: any = {
    updated_at: new Date().toISOString(),
  };

  if (updates.cardNumber) updateData.card_number = updates.cardNumber;
  if (updates.expiresAt) updateData.expires_at = updates.expiresAt;
  if (updates.status) updateData.status = updates.status;

  const { data: card, error } = await supabase
    .from("cards")
    .update(updateData)
    .eq("id", cardId)
    .select()
    .single();

  if (error) {
    console.error("카드 업데이트 실패:", error);
    return { card: null, error };
  }

  return { card, error: null };
}
