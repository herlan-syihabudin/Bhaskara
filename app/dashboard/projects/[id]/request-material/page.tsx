"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { addMaterialRequest } from "@/lib/data/materialRequests";

type ItemInput = {
  material: string;
  qty: number | "";
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
    { material: "", qty: "", unit: "pcs", harga: 0 },
  ]);

  /* ======================
     REALTIME CLOCK
  ====================== */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTanggal(
        now.toLocaleString("id-ID", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

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
      { material: "", qty: "", unit: "pcs", harga: 0 },
    ]);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  const validItems = items.filter(
    (i) => i.material.trim() && i.qty !== "" && Number(i.qty) > 0
  );

  const totalEstimasi = validItems.reduce(
    (acc, i) => acc + Number(i.qty) * i.harga,
    0
  );

  function submitRequest() {
    if (!requester.trim()) {
      alert("Nama requester wajib diisi");
      return;
    }

    if (validItems.length === 0) {
      alert("Minimal 1 material & qty diisi");
      return;
    }

    const mappedItems = validItems.map((i) => ({
      name: i.material,
      qty: Number(i.qty),
      unit: i.unit,
      estimasiHarga: i.harga,
    }));

    addMaterialRequest(params.id, mappedItems);
    router.push(`/dashboard/projects/${params.id}`);
  }

  return (
    <section className="container-bbm py-12 space-y-8">
      <h1 className="text-2xl font-semibold">
        Request Material Proyek
      </h1>

      {/* HEADER INFO */}
      <div className="card p-6 grid grid-cols-3 gap-6">
        <div>
          <label className="text-xs text-gray-500">Nama Proyek</label>
          <div className="mt-1 font-medium">
            Proyek {params.id}
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-500">
            Tanggal & Jam
          </label>
          <div className="mt-1 font-medium">{tanggal}</div>
        </div>

        <div>
          <label className="text-xs text-gray-500">
            Nama Requester
          </label>
          <input
            className="input mt-1"
            value={requester}
            onChange={(e) => setRequester(e.target.value)}
            placeholder="Nama petugas lapangan"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="card p-6">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-500">
            <tr>
              <th>No</th>
              <th>Material</th>
              <th className="w-24">Qty</th>
              <th className="w-24">Unit</th>
              <th className="w-32">Harga</th>
              <th className="w-32">Total</th>
              <th></th>
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
                    className="input"
                    value={item.qty}
                    placeholder="0"
                    onChange={(e) =>
                      updateItem(
                        i,
                        "qty",
                        e.target.value === ""
                          ? ""
                          : Number(e.target.value)
                      )
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
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </td>

                {/* HARGA (READ ONLY DISPLAY) */}
                <td className="text-gray-400">
                  Rp {item.harga.toLocaleString("id-ID")}
                </td>

                <td className="font-medium">
                  Rp{" "}
                  {(Number(item.qty || 0) * item.harga).toLocaleString(
                    "id-ID"
                  )}
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
          className="text-sm text-blue-600 mt-3"
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
