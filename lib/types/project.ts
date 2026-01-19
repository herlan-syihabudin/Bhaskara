export type BudgetStatus = "AMAN" | "WARNING" | "BAHAYA";

export type ProjectSummary = {
  project_id: string;
  project_name: string;
  nilaiKontrak: number;
  biayaReal: number;
  sisaBudget: number;
  statusBudget: BudgetStatus;
};
