export type CardRequestStatus = "pending" | "approved" | "rejected";

export interface CardRequest {
  id: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  requestedAt: string;
  status: CardRequestStatus;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectReason?: string;
}
