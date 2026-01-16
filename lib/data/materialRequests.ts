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
  requestedBy: string; // PM / Site
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

/**
 * SEMENTARA KOSONG
 * nanti diisi saat submit MR
 */
export const materialRequests: MaterialRequest[] = [];

/**
 * Helper AMAN (READ ONLY)
 */
export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}
