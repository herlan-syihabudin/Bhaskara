// lib/data/deliveries.ts
import type { POStatus } from "./purchaseOrders";

export type DeliveryStatus =
  | "IN_TRANSIT"
  | "DELIVERED"
  | "RECEIVED"
  | "PARTIAL";

export type DeliveryItem = {
  id: string;
  name: string;
  qtyOrdered: number;
  qtyDelivered: number;
  unit: string;
};

export type Delivery = {
  id: string;
  poId: string;
  deliveryDate: string;
  receivedBy: string; // nama orang lapangan
  status: DeliveryStatus;
  items: DeliveryItem[];
  notes?: string;
};

export const deliveries: Delivery[] = [
  {
    id: "DEL-001",
    poId: "PO-001",
    deliveryDate: "2026-01-17",
    receivedBy: "Mandor Asep",
    status: "RECEIVED",
    items: [
      {
        id: "i1",
        name: "Gypsum 9mm",
        qtyOrdered: 10,
        qtyDelivered: 10,
        unit: "lembar",
      },
      {
        id: "i2",
        name: "Hollow 4x4",
        qtyOrdered: 8,
        qtyDelivered: 8,
        unit: "batang",
      },
    ],
    notes: "Barang diterima lengkap dan baik",
  },
];
