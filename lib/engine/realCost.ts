// lib/engine/realCost.ts
import { realCosts } from "@/lib/data/realCosts";

export function getRealCostByProject(projectId: string) {
  return realCosts
    .filter((c) => c.projectId === projectId)
    .reduce((acc, c) => acc + c.amount, 0);
}
