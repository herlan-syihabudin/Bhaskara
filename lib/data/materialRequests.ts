// lib/data/materialRequests.ts

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
   (sementara, sebelum pakai DB)
========================= */

export const materialRequests: MaterialRequest[] = [];

/* =========================
   INTERNAL HELPER
========================= */

function recalcMRStatus(mr: MaterialRequest) {
  // Kalau sudah REJECTED, jangan diubah otomatis
  if (mr.status === "REJECTED") return;

  const statuses = mr.items.map((i) => i.status);

  if (statuses.length === 0) {
    mr.status = "SUBMITTED";
    return;
  }

  // Semua sudah dikirim ke site
  if (statuses.every((s) => s === "DELIVERED")) {
    mr.status = "DELIVERED";
    return;
  }

  // Minimal ada 1 yang sudah di-order
  if (statuses.some((s) => s === "ORDERED")) {
    mr.status = "ORDERED";
    return;
  }

  // Default: masih submitted semua
  mr.status = "SUBMITTED";
}

/* =========================
   ACTIONS: PROJECT / LAPANGAN
========================= */

export function addMaterialRequest(
  projectId: string,
  payload: {
    requester: string;
    catatan?: string;
    items: Omit<MRItem, "status">[]; // name, qty, unit, estimasiHarga
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

export function getMRById(id: string) {
  return materialRequests.find((mr) => mr.id === id);
}

/* =========================
   ACTIONS: PURCHASING
========================= */

// Update harga item — hanya boleh kalau masih SUBMITTED
export function updateItemHarga(
  mrId: string,
  index: number,
  harga: number
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  const item = mr.items[index];
  if (!item) return;

  // Harga hanya bisa diisi saat status item masih SUBMITTED
  if (item.status !== "SUBMITTED") return;

  item.estimasiHarga = harga;
}

// Update status per-item (SUBMITTED → ORDERED → DELIVERED)
export function updateItemStatus(
  mrId: string,
  index: number,
  status: MRItemStatus
) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  const item = mr.items[index];
  if (!item) return;

  const order: MRItemStatus[] = ["SUBMITTED", "ORDERED", "DELIVERED"];

  const currentIdx = order.indexOf(item.status);
  const targetIdx = order.indexOf(status);

  // Tidak boleh mundur status (misal dari ORDERED balik ke SUBMITTED)
  if (targetIdx < currentIdx) return;

  item.status = status;

  // Auto update status MR
  recalcMRStatus(mr);
}

/* =========================
   ACTIONS: MANAGEMENT
========================= */

export function rejectMR(mrId: string) {
  const mr = materialRequests.find((m) => m.id === mrId);
  if (!mr) return;

  mr.status = "REJECTED";
}
