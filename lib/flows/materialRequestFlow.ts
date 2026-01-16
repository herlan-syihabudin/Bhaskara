import type { MaterialRequest } from "@/lib/data/materialRequest";

export function submitMR(mr: MaterialRequest): MaterialRequest {
  if (mr.items.length === 0) {
    throw new Error("Material request kosong");
  }

  return {
    ...mr,
    status: "SUBMITTED",
  };
}
