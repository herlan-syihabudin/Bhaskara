"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

/* ======================
   TYPES
====================== */
type ItemInput = {
  material: string;
  qty: number;
  unit: string;
};

const UNIT_OPTIONS = [
  "pcs",
  "unit",
  "bh",
  "m",
  "m2",
  "m3",
  "kg",
  "liter",
];

export default function RequestMaterialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [requester, setRequester] = useState("");
  const [catatan, setCatatan] = useState("");
  const [now, setNow] = useState(new Date());

  const [items, setItems] = useState<ItemInput[]>([
    { material: "", qty: 0, unit: "pcs" },
  ]);

  /* ======================
     REALTIME CLOCK
  ====================== */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ======================
     HELPERS
  ====================== */
  function updateItem<K extends keyof ItemInput>(
    index: number,
    field: K,
    value: ItemInput[K]
  ) {
    const copy = [...items];
    copy[index] = { ...copy[index], [field]: value };
    setItems(copy);
  }

  function addItem() {
    setItems([...items, { material: "", qty: 0, unit: "pcs" }]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  const validItems = items.filter(
    (i) => i.material.trim() && i.qty > 0
  );

  const totalEstimasi = 0; // harga diisi Purchasing

  /* ======================
     SUBMIT (API CONNECTED)
  ====================== */
  async function submitRequest() {
    if (!requester.trim()) {
      alert("Nama requester wajib diisi");
      return;
    }

    if (validItems.length === 0) {
      alert("Minimal 1 material valid");
      return;
    }

    try {
      for (const item of validItems) {
        const res = await fetch("/api/material-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            project_id: params.id,
            project_name: `Proyek ${params.id}`,
            material: item.material,
            qty: item.qty,
            unit: item.unit,
            requester,
            note: catatan,
          }),
        });

        if (!res.ok) {
          throw new Error("Gagal mengirim material request");
        }
      }

      alert("Material Request berhasil dikirim ke Purchasing");
      router.push(`/dashboard/projects/${params.id}`);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim request");
    }
  }

  /* ======================
     UI
  ====================== */
  return (
    <section className="container-bbm py-12 space-y-8">
      <h1 className="text-2xl font-semibold">
        Request Material Proyek
      </h1>

      {/* HEADER */}
      <div className="card p-6 grid grid-cols-3 gap-6">
        <div>
          <p className="text-xs text-gray-500">Nama Proyek</p>
          <p className="font-medium">Proyek {params.id}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Tanggal & Jam</p>
          <p className="font-medium">
            {now.toLocaleString("id-ID")}
          </p>
        </div>

        <div>
          <p className="text-xs text-gray-500">Nama Requester</p>
          <input
            className="input mt-1"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder="Nama petugas lapangan"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-6 space-y-4">
        <table className="w-full text-sm table-fixed">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="w-10">No</th>
              <th className="w-[40%]">Material</th>
              <th className="w-20 text-center">Qty</th>
              <th className="w-20">Unit</th>
              <th className="w-24">Harga</th>
              <th className="w-24">Total</th>
              <th className="w-28">Status</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b">
                <td>{i + 1}</td>

                <td>
                  <input
                    className="input"
                    value={item.material}
                    onChange={(e) =>
                      updateItem(i, "material", e.target.value)
                    }
                  />
                </td>

                <td className="text-center">
                  <input
                    type="number"
                    min={0}
                    className="input w-16 text-center"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(i, "qty", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <select
                    className="input w-20"
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(i, "unit", e.target.value)
                    }
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </td>

                <td className="text-gray-400">Rp 0</td>
                <td className="font-medium">Rp 0</td>

                <td>
                  <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                    SUBMITTED
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="text-sm text-blue-600"
        >
          + Tambah Item
        </button>
      </div>

      {/* CATATAN */}
      <div className="card p-6">
        <p className="text-sm font-medium">Catatan / Keterangan</p>
        <textarea
          className="input mt-2 h-24"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
          placeholder="Contoh: pekerjaan lantai gudang, urgent"
        />
      </div>

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          Total Estimasi: Rp {totalEstimasi.toLocaleString("id-ID")}
        </p>

        <div className="flex gap-3">
          <button
            onClick={submitRequest}
            className="px-6 py-3 bg-black text-white rounded-lg"
          >
            Kirim ke Purchasing
          </button>

          <Link
            href={`/dashboard/projects/${params.id}`}
            className="px-6 py-3 border rounded-lg"
          >
            Batal
          </Link>
        </div>
      </div>
    </section>
  );
}
