// lib/data/materialRequests.ts

/* =========================
   ENUM / TYPES
========================= */
export type MRStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "ORDERED"
  | "DELIVERED"
  | "CANCELLED";

export type RequestedBy = "PM" | "LOGISTIK";

/* =========================
   ITEM
========================= */
export type MRItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number; // estimasi (bukan harga final)
};

/* =========================
   MATERIAL REQUEST
========================= */
export type MaterialRequest = {
  id: string;
  projectId: string;
  requestedBy: RequestedBy;
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

/* =========================
   TEMP STORAGE (MOCK)
   ⚠️ nanti diganti DB / API
========================= */
export const materialRequests: MaterialRequest[] = [];
