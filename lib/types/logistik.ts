export type LogistikSummary = {
  project_id: string;
  totalItem: number;
  status: "READY" | "ON DELIVERY" | "PARTIAL" | "RECEIVED";
  lastUpdate?: string;
};
