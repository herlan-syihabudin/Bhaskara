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
  requestedBy: string;
  status: MRStatus;
  items: MRItem[];
  createdAt: string;
};

export const materialRequests: MaterialRequest[] = [];

export function addMaterialRequest(
  projectId: string,
  items: MRItem[]
) {
  materialRequests.push({
    id: crypto.randomUUID(),
    projectId,
    requestedBy: "PM Lapangan",
    status: "SUBMITTED",
    items,
    createdAt: new Date().toISOString(),
  });
}

export function getMRByProject(projectId: string) {
  return materialRequests.filter(
    (mr) => mr.projectId === projectId
  );
}
