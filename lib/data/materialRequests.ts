/* =========================
   TYPES
========================= */

export type MRStatus =
  | "SUBMITTED"
  | "ORDERED"
  | "DELIVERED"
  | "REJECTED";

export type MRItemStatus =
  | "SUBMITTED"
  | "ORDERED"
  | "DELIVERED";

export type MRItem = {
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number;
  status: MRItemStatus;
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
   IN-MEMORY STORE
========================= */

export const materialRequests: MaterialRequest[] = [];

/* =========================
   INTERNAL HELPER
========================= */

function recalcMRStatus(mr: MaterialRequest) {
  if (mr.status === "REJECTED") return;

  const statuses = mr.items.map((i) => i.status);

  if (statuses.every((s) => s === "DELIVERED")) {
    mr.status = "DELIVERED";
    return;
  }

  if (statuses.some((s) => s === "ORDERED")) {
    mr.status = "ORDERED";
    return;
  }

  mr.status = "SUBMITTED";
}

/* =========================
   PROJECT / LAPANGAN
========================= */

export function addMaterialRequest(
  projectId: string,
  payload: {
    requester: string;
    catatan?: string;
    items: Omit<MRItem, "status">[];
  }
) {
  materialRequests.push({
    id: crypto.randomUUID(),
    projectId,
    requester: payload.requester,
    catatan: payload.catatan,
    status: "SUBMITTED",
    items: payload.items.map((i) => ({
      ...i,
      status: "SUBMITTED",
    })),
    createdAt: new Date().toISOString(),
  });
}

export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}

/* =========================
   PURCHASING
========================= */

export function updateItemHarga(
  mrId: string,
  index: number,
  harga: number
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  const item = mr.items[index];
  if (!item) return;

  if (item.status !== "SUBMITTED") return;

  item.estimasiHarga = harga;
}

export function updateItemStatus(
  mrId: string,
  index: number,
  status: MRItemStatus
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  const item = mr.items[index];
  if (!item) return;

  item.status = status;
  recalcMRStatus(mr);
}

/* =========================
   LOGISTIK (INI YANG KURANG!)
========================= */

export function markItemDelivered(
  mrId: string,
  index: number
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  const item = mr.items[index];
  if (!item) return;

  // Logistik hanya boleh kirim item yang SUDAH ORDERED
  if (item.status !== "ORDERED") return;

  item.status = "DELIVERED";
  recalcMRStatus(mr);
}

/* =========================
   MANAGEMENT
========================= */

export function rejectMR(mrId: string) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  mr.status = "REJECTED";
}
