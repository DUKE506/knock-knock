export interface Workplace {
  id: string;
  name: string;
  issueCode: string;
  creditRemaining: number;
  creditTotal: number;
  createdAt: string;
}

export interface WorkplaceFormData {
  name: string;
  type: string;
  initialCredit: number;
  managerEmail: string;
  memo?: string;
}
