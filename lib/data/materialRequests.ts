// lib/data/materialRequests.ts

export type MRStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "CLOSED";

export type MRItem = {
  id: string;
  name: string;
  qty: number;
  unit: string;
  spec?: string;
};

export type MaterialRequest = {
  id: string;
  projectId: string;
  requestedBy: string;
  neededDate: string;
  status: MRStatus;
  items: MRItem[];
  notes?: string;
};

export const materialRequests: MaterialRequest[] = [
  {
    id: "MR-001",
    projectId: "p001",
    requestedBy: "Lapangan - Andi",
    neededDate: "2026-01-20",
    status: "SUBMITTED",
    notes: "Plafond kamar utama",
    items: [
      {
        id: "i1",
        name: "Gypsum 9mm",
        qty: 10,
        unit: "lembar",
      },
      {
        id: "i2",
        name: "Hollow 4x4",
        qty: 8,
        unit: "batang",
      },
      {
        id: "i3",
        name: "Sekrup gypsum",
        qty: 2,
        unit: "dus",
      },
    ],
  },
];
