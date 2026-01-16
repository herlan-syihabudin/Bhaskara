"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type ItemInput = {
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number;
};

export default function RequestMaterialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [items, setItems] = useState<ItemInput[]>([
    { name: "", qty: 1, unit: "pcs", estimasiHarga: 0 },
  ]);

  function updateItem(index: number, field: keyof ItemInput, value: any) {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  }

  function addItem() {
    setItems([
      ...items,
      { name: "", qty: 1, unit: "pcs", estimasiHarga: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function submitRequest() {
    if (items.length === 0) {
      alert("Minimal 1 item material");
      return;
    }

    console.log("MR SUBMITTED:", {
      projectId: params.id,
      items,
    });

    alert("Material Request berhasil dikirim ke Purchasing");
    router.push(`/dashboard/projects/${params.id}`);
  }

  return (
    <section className="container-bbm py-12 space-y-8">
      {/* HEADER */}
      <div>
        <p className="text-xs tracking-[0.3em] text-gray-400 uppercase">
          MATERIAL REQUEST
        </p>
        <h1 className="text-2xl font-semibold mt-1">
          Request Material Proyek
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Isi kebutuhan material lapangan
        </p>
      </div>

      {/* FORM */}
      <div className="card p-6 space-y-6">
        {items.map((item, i) => (
          <div
            key={i}
            className="grid grid-cols-12 gap-4 items-end border-b pb-4"
          >
            <div className="col-span-4">
              <label className="text-xs text-gray-500">Nama Material</label>
              <input
                className="input"
                value={item.name}
                onChange={(e) =>
                  updateItem(i, "name", e.target.value)
                }
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-gray-500">Qty</label>
              <input
                type="number"
                className="input"
                value={item.qty}
                onChange={(e) =>
                  updateItem(i, "qty", Number(e.target.value))
                }
              />
            </div>

            <div className="col-span-2">
              <label className="text-xs text-gray-500">Unit</label>
              <input
                className="input"
                value={item.unit}
                onChange={(e) =>
                  updateItem(i, "unit", e.target.value)
                }
              />
            </div>

            <div className="col-span-3">
              <label className="text-xs text-gray-500">
                Estimasi Harga / Unit
              </label>
              <input
                type="number"
                className="input"
                value={item.estimasiHarga}
                onChange={(e) =>
                  updateItem(
                    i,
                    "estimasiHarga",
                    Number(e.target.value)
                  )
                }
              />
            </div>

            <div className="col-span-1">
              {items.length > 1 && (
                <button
                  onClick={() => removeItem(i)}
                  className="text-xs text-red-500"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          onClick={addItem}
          className="text-sm text-blue-600"
        >
          + Tambah Item
        </button>
      </div>

      {/* ACTION */}
      <div className="flex gap-4">
        <button
          onClick={submitRequest}
          className="px-6 py-3 rounded-lg bg-black text-white text-sm"
        >
          Kirim ke Purchasing
        </button>

        <Link
          href={`/dashboard/projects/${params.id}`}
          className="px-6 py-3 rounded-lg border text-sm"
        >
          Batal
        </Link>
      </div>
    </section>
  );
}
