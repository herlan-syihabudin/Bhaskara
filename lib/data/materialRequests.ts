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
};

export type MaterialRequest = {
  id: string;
  projectId: string;
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

/* =========================
   IN-MEMORY STORE
========================= */
export const materialRequests: MaterialRequest[] = [];

/* =========================
   ACTIONS
========================= */
export function addMaterialRequest(
  projectId: string,
  items: MRItem[]
) {
  materialRequests.push({
    id: crypto.randomUUID(),
    projectId,
    status: "SUBMITTED",
    items,
    createdAt: new Date().toISOString(),
  });
}

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

export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}
