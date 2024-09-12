import { z } from "zod";

export const artikelSchema = z.object({
  judul: z
    .string()
    .min(3)
    .max(50)
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
