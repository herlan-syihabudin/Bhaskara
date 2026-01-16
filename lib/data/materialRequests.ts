// lib/data/materialRequest.ts

export type MRStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ORDERED"
  | "DELIVERED";

export type MaterialItem = {
  name: string;
  qty: number;
  unit: string;
};

export type MaterialRequest = {
  id: string;
  projectId: string;
  requestedBy: string;
  date: string;
  status: MRStatus;
  items: MaterialItem[];
};
