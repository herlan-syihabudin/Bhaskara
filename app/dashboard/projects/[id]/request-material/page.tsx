"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addMaterialRequest } from "@/lib/data/materialRequests";

/* ======================
   TYPES
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
  const [catatan, setCatatan] = useState("");
  const [now, setNow] = useState(new Date());

  const [items, setItems] = useState<ItemInput[]>([
    { material: "", qty: 0, unit: "pcs", harga: 0 },
  ]);

  /* ======================
     REALTIME CLOCK
  ====================== */
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
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
      { material: "", qty: 0, unit: "pcs", harga: 0 },
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

    addMaterialRequest(params.id, {
      requester,
      catatan,
      items: mappedItems,
    });

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
          <label className="text-xs text-gray-500">Nama Proyek</label>
          <input
            className="input bg-gray-100"
            value={`Proyek ${params.id}`}
            disabled
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Tanggal & Jam</label>
          <input
            className="input bg-gray-100"
            value={now.toLocaleString("id-ID")}
            disabled
          />
        </div>

        <div>
          <label className="text-xs text-gray-500">Nama Requester</label>
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
        <table className="w-full text-sm table-fixed">
          <thead className="border-b text-gray-500">
            <tr>
              <th className="w-12">No</th>
              <th className="w-[40%]">Material</th>
              <th className="w-24">Qty</th>
              <th className="w-24">Unit</th>
              <th className="w-28">Harga</th>
              <th className="w-28">Total</th>
              <th className="w-16 text-center">Aksi</th>
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

                <td>
                  <input
                    type="number"
                    className="input w-20"
                    min={0}
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(i, "qty", Number(e.target.value))
                    }
                  />
                </td>

                <td>
                  <select
                    className="input w-24"
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

                <td>
                  <input
                    className="input bg-gray-100 text-gray-500"
                    value="Rp 0"
                    disabled
                  />
                </td>

                <td className="font-medium">
                  Rp {(item.qty * item.harga).toLocaleString("id-ID")}
                </td>

                <td className="text-center">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(i)}
                      className="text-xs text-red-500 hover:underline"
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

      {/* CATATAN */}
      <div className="card p-6">
        <label className="text-sm font-medium">
          Catatan / Keterangan
        </label>
        <textarea
          className="input mt-2 h-24"
          placeholder="Contoh: untuk pekerjaan lantai area gudang, urgent hari ini"
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />
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
