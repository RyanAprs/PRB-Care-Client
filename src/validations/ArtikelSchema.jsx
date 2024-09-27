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
  isi: z
      .string()
      .min(1, "Konten artikel tidak boleh kosong")
      .refine((value) => {
        const encoder = new TextEncoder();
        const sizeInMB = encoder.encode(value).length / (1024 * 1024);
        return sizeInMB <= 50;
      }, {
        message: "Konten artikel tidak boleh lebih dari 50MB hapus beberapa gambar baru",
      }),
    idAdminPuskesmas: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Admin Puskesmas tidak boleh kosong"),
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
  isi: z
      .string()
      .min(1, "Konten artikel tidak boleh kosong")
      .refine((value) => {
        const encoder = new TextEncoder();
        const sizeInMB = encoder.encode(value).length / (1024 * 1024);
        return sizeInMB <= 50;
      }, {
        message: "Konten artikel tidak boleh lebih dari 50MB hapus beberapa gambar baru",
      }),
});
