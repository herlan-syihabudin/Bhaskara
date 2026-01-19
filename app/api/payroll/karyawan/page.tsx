"use client";

import { useState } from "react";

export default function KaryawanPage() {
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/karyawan", {
      method: "POST",
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (res.ok) {
      alert("Karyawan berhasil ditambahkan");
      e.currentTarget.reset();
    } else {
      alert("Gagal menambah karyawan");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      <input name="nama" placeholder="Nama Karyawan" required />
      <input name="role" placeholder="Tukang / Mandor / Staff" />
      <select name="tipe_gaji">
        <option value="HARIAN">Harian</option>
        <option value="BULANAN">Bulanan</option>
      </select>
      <input name="rate" type="number" placeholder="Gaji / Hari" />
      <select name="status">
        <option value="AKTIF">Aktif</option>
        <option value="NONAKTIF">Non Aktif</option>
      </select>
      <input name="join_date" type="date" />

      <button disabled={loading}>
        {loading ? "Menyimpan..." : "Tambah Karyawan"}
      </button>
    </form>
  );
}
