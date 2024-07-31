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
});
