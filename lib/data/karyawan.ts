export async function getKaryawan() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  const res = await fetch(`${baseUrl}/api/karyawan`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch karyawan");
  }

  return res.json();
}
