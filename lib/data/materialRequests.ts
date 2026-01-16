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

export const materialRequests: MaterialRequest[] = [];

/* =========================
   ACTIONS
========================= */
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

export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}

// 🔥 PURCHASING ACTIONS
export function updateItemHarga(
  mrId: string,
  index: number,
  harga: number
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (mr && mr.items[index]) {
    mr.items[index].estimasiHarga = harga;
  }
}

export function updateItemStatus(
  mrId: string,
  index: number,
  status: MRStatus
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (mr && mr.items[index]) {
    mr.items[index].status = status;
  }
}
