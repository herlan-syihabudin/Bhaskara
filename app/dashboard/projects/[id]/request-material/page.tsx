"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addMaterialRequest } from "@/lib/data/materialRequests";

/* ======================
   TYPES
====================== */
type ItemInput = {
  name: string;
  qty: number;
  unit: string;
  estimasiHarga: number;
};

/* ======================
   PAGE
====================== */
export default function RequestMaterialPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const today = new Date().toLocaleDateString("id-ID");

  const [requester, setRequester] = useState("");
  const [items, setItems] = useState<ItemInput[]>([
    { name: "", qty: 1, unit: "pcs", estimasiHarga: 0 },
  ]);

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
      { name: "", qty: 1, unit: "pcs", estimasiHarga: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  const validItems = items.filter(
    (i) => i.name.trim() !== "" && i.qty > 0
  );

  const totalEstimasi = validItems.reduce(
    (acc, i) => acc + i.qty * i.estimasiHarga,
    0
  );

  function submitRequest() {
    if (!requester.trim()) {
      alert("Nama requester wajib diisi");
      return;
    }

    if (validItems.length === 0) {
      alert("Minimal 1 item material");
      return;
    }

    addMaterialRequest(params.id, validItems);

    alert("Material Request berhasil dikirim ke Purchasing");
    router.push(`/dashboard/projects/${params.id}`);
  }

  /* ======================
     UI
  ====================== */
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
      </div>

      {/* INFO */}
      <div className="card p-6 grid grid-cols-3 gap-6 text-sm">
        <div>
          <p className="text-gray-500">Nama Proyek</p>
          <p className="font-medium">{params.id}</p>
        </div>

        <div>
          <p className="text-gray-500">Tanggal</p>
          <p className="font-medium">{today}</p>
        </div>

        <div>
          <label className="text-gray-500">Nama Requester</label>
          <input
            className="input mt-1"
            placeholder="Nama petugas lapangan"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-6 space-y-4">
        {/* HEADER ROW */}
        <div className="grid grid-cols-12 gap-4 text-xs text-gray-500 border-b pb-2">
          <div className="col-span-1">No</div>
          <div className="col-span-3">Material</div>
          <div className="col-span-2">Qty</div>
          <div className="col-span-2">Unit</div>
          <div className="col-span-2">Harga / Unit</div>
          <div className="col-span-2">Total</div>
        </div>

        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 text-sm">{i + 1}</div>

            <div className="col-span-3">
              <input
                className="input"
                value={item.name}
                onChange={(e) =>
                  updateItem(i, "name", e.target.value)
                }
              />
            </div>

            <div className="col-span-2">
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
              <input
                className="input"
                value={item.unit}
                onChange={(e) =>
                  updateItem(i, "unit", e.target.value)
                }
              />
            </div>

            <div className="col-span-2">
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

            <div className="col-span-2 text-sm font-medium">
              Rp {(item.qty * item.estimasiHarga).toLocaleString("id-ID")}
            </div>
          </div>
        ))}

        <button onClick={addItem} className="text-sm text-blue-600">
          + Tambah Item
        </button>
      </div>

      {/* TOTAL */}
      <div className="text-right text-lg font-semibold">
        Total Estimasi:{" "}
        Rp {totalEstimasi.toLocaleString("id-ID")}
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
