import { z } from "zod";

export const artikelCreateSchemaSuperAdmin = z.object({
  judul: z
    .string()
    .min(1, "Judul artikel tidak boleh kosong")
    .max(255, "Judul artikel maksimal 255 karakter")
    .refine((val) => val.trim().length > 0, "Judul artikel tidak boleh kosong"),
  ringkasan: z
    .string()
    .min(1, "Ringkasan artikel tidak boleh kosong")
    .max(1000, "Ringkasan artikel maksimal 1000 karakter")
    .refine(
      (val) => val.trim().length > 0,
      "Ringkasan artikel tidak boleh kosong"
    ),
  isi: z.string().min(1, "Konten artikel tidak boleh kosong"),
  idAdminPuskesmas: z
    .number()
    .int()
    .positive("Admin Puskesmas tidak boleh kosong"),
});

export const artikelCreateSchema = z.object({
  judul: z
    .string()
    .min(1, "Judul artikel tidak boleh kosong")
    .max(255, "Judul artikel maksimal 255 karakter")
    .refine((val) => val.trim().length > 0, "Judul artikel tidak boleh kosong"),
  ringkasan: z
    .string()
    .min(1, "Ringkasan artikel tidak boleh kosong")
    .max(1000, "Ringkasan artikel maksimal 1000 karakter")
    .refine(
      (val) => val.trim().length > 0,
      "Ringkasan artikel tidak boleh kosong"
    ),
  isi: z.string().min(1, "Konten artikel tidak boleh kosong"),
});
