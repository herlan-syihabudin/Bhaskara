// lib/data/projects.ts
export type ProjectStatus = "ONGOING" | "DONE";

export type Project = {
  id: string;
  name: string;
  nilaiKontrak: number;
  status: ProjectStatus;
};
