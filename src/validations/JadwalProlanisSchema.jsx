import { z } from "zod";

export const jadwalProlanisCreateSchemaSuperAdmin = z.object({
  deskripsi: z
    .string()
    .min(1, "Deskripsi Kegiatan tidak boleh kosong")
    .max(1000, "Deskripsi Kegiatan maksimal 1000 karakter")
    .refine(
      (val) => val.trim().length > 0,
      "Deskripsi Kegiatan tidak boleh kosong"
    ),
  idAdminPuskesmas: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Admin Puskesmas tidak boleh kosong"),
  waktuMulai: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Waktu mulai tidak boleh kosong"),
  waktuSelesai: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Waktu selesai tidak boleh kosong"),
});

export const jadwalProlanisCreateSchema = z.object({
  deskripsi: z
    .string()
    .min(1, "Deskripsi Kegiatan tidak boleh kosong")
    .max(1000, "Deskripsi Kegiatan maksimal 1000 karakter")
    .refine(
      (val) => val.trim().length > 0,
      "Deskripsi Kegiatan tidak boleh kosong"
    ),
  waktuMulai: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Waktu mulai tidak boleh kosong"),
  waktuSelesai: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Waktu selesai tidak boleh kosong"),
});
