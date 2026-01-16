// lib/engine/logistic.ts
import type { Delivery } from "@/lib/data/deliveries";

export function calcDeliveryStatus(
  items: Delivery["items"]
) {
  const totalOrdered = items.reduce(
    (a, i) => a + i.qtyOrdered,
    0
  );
  const totalDelivered = items.reduce(
    (a, i) => a + i.qtyDelivered,
    0
  );

  if (totalDelivered === 0) return "IN_TRANSIT";
  if (totalDelivered < totalOrdered) return "PARTIAL";
  return "RECEIVED";
}
