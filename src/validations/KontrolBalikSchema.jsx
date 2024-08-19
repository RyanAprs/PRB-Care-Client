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
  noAntrean: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Nomor antrean tidak boleh kosong"),
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
    .int()
    .positive()
    .refine((val) => val > 0, "Berat Badan harus lebih dari 0"),
  tinggiBadan: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Tinggi Badan harus lebih dari 0"),
  tekananDarah: z
    .string()
    .min(3)
    .max(20)
    .refine(
      (val) => val.trim().length >= 3,
      "Tekanan Darah minimal 3 karakter"
    ),
  denyutNadi: z
    .number()
    .int()
    .positive()
    .refine((val) => val > 0, "Denyut Nadi harus lebih dari 0"),
  hasilLab: z.string().optional(),
  hasilEkg: z.string().optional(),
  hasilDiagnosa: z.string().optional(),
  keluhan: z.string().optional(),
});
