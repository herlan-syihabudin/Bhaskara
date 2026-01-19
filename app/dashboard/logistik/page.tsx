import KpiCard from "@/components/dashboard/KpiCard";
import { headers } from "next/headers";

async function getLogistikSummary() {
  const h = headers();
  const host = h.get("host");

  if (!host) throw new Error("Host not found");

  const protocol =
    process.env.NODE_ENV === "development"
      ? "http"
      : "https";

  const res = await fetch(
    `${protocol}://${host}/api/logistik`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Fetch failed");

  return res.json();
}

export default async function LogistikDashboardPage() {
  const data = await getLogistikSummary();

  return (
    <section className="space-y-10">
      <h1 className="text-2xl font-semibold">
        Logistik Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <KpiCard title="Total Proyek" value={data.length} type="text" />
        <KpiCard
          title="On Delivery"
          value={data.filter((d: any) => d.status === "ON DELIVERY").length}
          type="text"
        />
        <KpiCard
          title="Received"
          value={data.filter((d: any) => d.status === "RECEIVED").length}
          type="text"
        />
      </div>

      <pre className="text-xs bg-gray-100 p-4 rounded">
        {JSON.stringify(data, null, 2)}
      </pre>
    </section>
  );
}
