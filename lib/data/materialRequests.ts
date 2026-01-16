export type MRStatus =
  | "SUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "ORDERED"
  | "DELIVERED";

export type MRItem = {
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number;
  status: MRStatus;
};

export type MaterialRequest = {
  id: string;
  projectId: string;
  requester: string;
  catatan?: string;
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

/* =========================
   IN MEMORY STORE
========================= */
export const materialRequests: MaterialRequest[] = [];

/* =========================
   ACTIONS
========================= */

// dipakai halaman Request Material
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

// ✅ INI YANG HILANG → DIPAKAI DI PROJECT DETAIL
export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}

// optional (future)
export function updateMRStatus(
  id: string,
  status: MRStatus
) {
  const mr = materialRequests.find((m) => m.id === id);
  if (mr) mr.status = status;
}
