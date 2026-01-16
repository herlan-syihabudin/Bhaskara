// lib/data/purchaseOrders.ts
import type { MRItem } from "./materialRequests";

export type POStatus =
  | "DRAFT"
  | "ORDERED"
  | "DELIVERED"
  | "CLOSED";

export type PurchaseOrder = {
  id: string;
  mrId: string;
  supplier: string;
  orderDate: string;
  status: POStatus;
  items: (MRItem & {
    price: number;
    total: number;
  })[];
  totalAmount: number;
};

export const purchaseOrders: PurchaseOrder[] = [
  {
    id: "PO-001",
    mrId: "MR-001",
    supplier: "CV Sumber Bangunan",
    orderDate: "2026-01-16",
    status: "ORDERED",
    items: [
      {
        id: "i1",
        name: "Gypsum 9mm",
        qty: 10,
        unit: "lembar",
        price: 75000,
        total: 750000,
      },
      {
        id: "i2",
        name: "Hollow 4x4",
        qty: 8,
        unit: "batang",
        price: 85000,
        total: 680000,
      },
    ],
    totalAmount: 1430000,
  },
];
