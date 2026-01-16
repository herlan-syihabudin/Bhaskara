// lib/data/projects.ts

export type ProjectStatus = "ONGOING" | "DONE";

export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;

  // ⬇️ WAJIB ADA
  biayaReal: number;

  status: ProjectStatus;
};
