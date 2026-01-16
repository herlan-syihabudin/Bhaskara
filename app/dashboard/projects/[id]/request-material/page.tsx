"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addMaterialRequest } from "@/lib/data/materialRequests";

/* ======================
   TYPES (FORM ONLY)
====================== */
type ItemInput = {
  material: string;
  qty: number;
  unit: string;
  harga: number;
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
  const [tanggal, setTanggal] = useState("");

  const [items, setItems] = useState<ItemInput[]>([
    { material: "", qty: 1, unit: "pcs", harga: 0 },
  ]);

  /* ======================
     REALTIME CLOCK
  ====================== */
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setTanggal(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
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
    setItems([
      ...items,
      { material: "", qty: 1, unit: "pcs", harga: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  const validItems = items.filter(
    (i) => i.material.trim() !== "" && i.qty > 0
  );

  const totalEstimasi = validItems.reduce(
    (acc, i) => acc + i.qty * i.harga,
    0
  );

  /* ======================
     SUBMIT
  ====================== */
  function submitRequest() {
    if (!requester.trim()) {
      alert("Nama requester wajib diisi");
      return;
    }

    if (validItems.length === 0) {
      alert("Minimal 1 material valid");
      return;
    }

    const mappedItems = validItems.map((i) => ({
      name: i.material,
      qty: i.qty,
      unit: i.unit,
      estimasiHarga: i.harga,
    }));

    addMaterialRequest(params.id, mappedItems);

    alert("Material Request dikirim ke Purchasing");
    router.push(`/dashboard/projects/${params.id}`);
  }

  /* ======================
     UI
  ====================== */
  return (
    <section className="container-bbm py-12 space-y-8">
      <h1 className="text-2xl font-semibold">
        Request Material Proyek
      </h1>

      {/* META */}
      <div className="card p-6 grid grid-cols-3 gap-6">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Nama Proyek
          </label>
          <input
            className="input bg-gray-100 text-gray-700"
            value={`Proyek ${params.id}`}
            disabled
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Tanggal & Jam
          </label>
          <input
            className="input bg-gray-100 text-gray-700"
            value={tanggal}
            disabled
          />
        </div>

        <div>
          <label className="text-xs text-gray-500 mb-1 block">
            Nama Requester
          </label>
          <input
            className="input"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder="Nama petugas lapangan"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-6 space-y-4">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="py-2">No</th>
              <th>Material</th>
              <th className="w-24">Qty</th>
              <th className="w-28">Unit</th>
              <th className="w-40">Harga / Unit</th>
              <th className="w-32">Total</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b">
                <td className="py-2">{i + 1}</td>

                <td>
                  <input
                    className="input"
                    value={item.material}
                    onChange={(e) =>
                      updateItem(i, "material", e.target.value)
                    }
                  />
                </td>

                <td>
                  <input
                    type="number"
                    min={1}
                    className="input"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(i, "qty", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <select
                    className="input"
                    value={item.unit}
                    onChange={(e) =>
                      updateItem(i, "unit", e.target.value)
                    }
                  >
                    {UNIT_OPTIONS.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </td>

                <td>
                  <input
                    type="number"
                    className="input bg-gray-100 text-gray-500 cursor-not-allowed"
                    value={item.harga}
                    disabled
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Diisi oleh Purchasing
                  </p>
                </td>

                <td className="font-medium">
                  Rp{" "}
                  {(item.qty * item.harga).toLocaleString("id-ID")}
                </td>

                <td>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(i)}
                      className="text-xs text-red-500"
                    >
                      Hapus
                    </button>
                  )}
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

      {/* FOOTER */}
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          Total Estimasi: Rp{" "}
          {totalEstimasi.toLocaleString("id-ID")}
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
