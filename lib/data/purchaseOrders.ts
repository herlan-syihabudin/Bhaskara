// lib/data/purchaseOrders.ts
import type { MRItem } from "./materialRequests";

export type POStatus =
  | "DRAFT"
  | "SENT"
  | "CONFIRMED"
  | "DELIVERED"
  | "CLOSED";

export type PurchaseOrder = {
  id: string;
  mrId: string;
  supplier: string;
  status: POStatus;
  items: MRItem[];
  createdAt: string;
};

export const purchaseOrders: PurchaseOrder[] = [];
