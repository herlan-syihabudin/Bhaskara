export type MRStatus =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "ORDERED"
  | "DELIVERED";

/* ======================
   ITEM
====================== */
export type MRItem = {
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number;
};

/* ======================
   MATERIAL REQUEST
====================== */
export type MaterialRequest = {
  id: string;
  projectId: string;
  requester: string;
  catatan?: string;
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

/* ======================
   IN-MEMORY DATA STORE
====================== */
export const materialRequests: MaterialRequest[] = [];

/* ======================
   ACTIONS
====================== */

// dipanggil dari halaman Request Material (PM / Lapangan)
export function addMaterialRequest(
  projectId: string,
  payload: {
    requester: string;
    catatan?: string;
    items: MRItem[];
  }
) {
  materialRequests.push({
    id: crypto.randomUUID(),
    projectId,
    requester: payload.requester,
    catatan: payload.catatan,
    status: "SUBMITTED",
    items: payload.items,
    createdAt: new Date().toISOString(),
  });
}

// dipakai Purchasing
export function approveMR(id: string) {
  const mr = materialRequests.find((m) => m.id === id);
  if (mr) mr.status = "APPROVED";
}

export function rejectMR(id: string) {
  const mr = materialRequests.find((m) => m.id === id);
  if (mr) mr.status = "REJECTED";
}

export function orderMR(id: string) {
  const mr = materialRequests.find((m) => m.id === id);
  if (mr) mr.status = "ORDERED";
}

// dipakai Project / Logistik
export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}
