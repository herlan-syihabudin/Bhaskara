// lib/data/realCosts.ts
export type RealCostItem = {
  id: string;
  projectId: string;
  source: "PO_DELIVERY";
  refId: string; // deliveryId
  amount: number;
  date: string;
};

export const realCosts: RealCostItem[] = [
  {
    id: "RC-001",
    projectId: "cikarang",
    source: "PO_DELIVERY",
    refId: "DEL-001",
    amount: 4_200_000,
    date: "2026-01-17",
  },
];
