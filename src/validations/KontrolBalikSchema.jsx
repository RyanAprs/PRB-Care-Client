import { z } from "zod";

export const kontrolBalikCreateSchema = z.object({
  idPasien: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Pasien tidak boleh kosong"),
  tanggalKontrol: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Tanggal Kontrol harus diisi"),
  idAdminPuskesmas: z.number().int().positive().optional(),
});

export const kontrolBalikUpdateSchema = z.object({
  idPasien: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Pasien tidak boleh kosong"),
  tanggalKontrol: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Tanggal Kontrol harus diisi"),
  idAdminPuskesmas: z.number().int().positive().optional(),
  beratBadan: z
    .number()
    .refine((val) => val >= 0, "Value harus bilangan bulat")
    .optional(),
  tinggiBadan: z
    .number()
    .refine((val) => val >= 0, "Value harus bilangan bulat")
    .optional(),
  tekananDarah: z.string().max(20).optional(),
  denyutNadi: z
    .number()
    .refine((val) => val >= 0, "Value harus bilangan bulat")
    .optional(),
  hasilLab: z.string().optional(),
  hasilEkg: z.string().optional(),
  hasilDiagnosa: z.string().optional(),
  keluhan: z.string().optional(),
});
