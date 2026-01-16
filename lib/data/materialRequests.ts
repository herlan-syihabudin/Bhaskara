// lib/data/materialRequests.ts

export type MRStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "ORDERED"
  | "DELIVERED";

export type MRItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number;
};

export type MaterialRequest = {
  id: string;
  projectId: string;
  requestedBy: string; // PM / Lapangan
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

/**
 * sementara mock data
 */
export const materialRequests: MaterialRequest[] = [];
