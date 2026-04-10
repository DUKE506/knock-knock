export type WorkplaceStatus = "active" | "pending" | "inactive";

export interface Workplace {
  id: string;
  name: string;
  issueCode: string;
  status: WorkplaceStatus;
  creditRemaining: number;
  creditTotal: number;
  // credit: {
  //   remaining: number;
  //   total: number;
  // };
  cardCount: number;
  createdAt: string;
  managerName?: string;
  managerEmail?: string;
}

export interface WorkplaceFormData {
  name: string;
  type: string;
  initialCredit: number;
  managerEmail: string;
  memo?: string;
}
