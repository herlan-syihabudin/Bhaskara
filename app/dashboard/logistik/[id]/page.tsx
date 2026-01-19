"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogistikPage() {
  const { id } = useParams<{ id: string }>();
  const [mrList, setMrList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/logistik?project_id=${id}`);
      const json = await res.json();
      setMrList(json);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) return <p>Loading...</p>;

  return (
    <section className="container-bbm py-10 space-y-8">
      <h1 className="text-2xl font-semibold">
        Logistik – Proyek {id}
      </h1>

      {mrList.length === 0 && (
        <p className="text-gray-500">
          Belum ada pengiriman
        </p>
      )}

      {mrList.map((mr) => (
        <div key={mr.mr_id} className="card p-6 space-y-4">
          <p className="font-medium">
            MR: {mr.mr_id}
          </p>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th>Material</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mr.items.map((item: any, i: number) => (
                <tr key={i} className="border-b">
                  <td>{item.name}</td>
                  <td>{item.qty}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.status === "ORDERED" && (
                      <button
                        onClick={async () => {
                          await fetch("/api/logistik", {
                            method: "POST",
                            body: JSON.stringify({
                              mr_id: mr.mr_id,
                              index: i,
                            }),
                          });
                          location.reload();
                        }}
                        className="text-xs bg-black text-white px-2 py-1 rounded"
                      >
                        Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </section>
  );
}
