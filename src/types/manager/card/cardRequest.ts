export type CardRequestStatus = "pending" | "approved";

export interface CardRequest {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  requestedAt: string;
  status: CardRequestStatus;
  reviewedAt?: string;
  reviewedBy?: string;
}
