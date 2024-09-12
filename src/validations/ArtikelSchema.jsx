import { z } from "zod";

export const artikelSchema = z.object({
  judul: z
    .string()
    .min(3)
    .refine(
      (val) => val.trim().length >= 3,
      "Judul artikel minimal 3 karakter"
    ),
  isi: z
    .string()
    .min(10)
    .refine(
      (val) => val.trim().length >= 10,
      "Isi artikel minimal 10 karakter"
    ),
  ringkasan: z
    .string()
    .min(10)
    .refine(
      (val) => val.trim().length >= 10,
      "Ringkasan artikel minimal 10 karakter"
    ),
});

export const artikelSchemaSuperAdmin = z.object({
  idAdminPuskesmas: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Admin Puskesmas tidak boleh kosong"),
  judul: z
    .string()
    .min(3)
    .refine(
      (val) => val.trim().length >= 3,
      "Judul artikel minimal 3 karakter"
    ),
  isi: z
    .string()
    .min(10)
    .refine(
      (val) => val.trim().length >= 10,
      "Isi artikel minimal 10 karakter"
    ),
  ringkasan: z
    .string()
    .min(10)
    .refine(
      (val) => val.trim().length >= 10,
      "Ringkasan artikel minimal 10 karakter"
    ),
});
