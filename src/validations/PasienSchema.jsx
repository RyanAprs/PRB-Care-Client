import { z } from "zod";

export const pasienschema = z.object({
  noRekamMedis: z
    .string()
    .min(3, { message: "No Rekam Medis harus memiliki minimal 3 karakter" })
    .max(50, { message: "No Rekam Medis tidak boleh lebih dari 50 karakter" })
    .transform((val) => val.replace(/\s+/g, " ").trim()),
  idPengguna: z
    .number({ message: "Id Pengguna harus berupa angka" })
    .positive(),
  idAdminPuskesmas: z
    .number({ message: "Id Admin Puskesmas harus berupa angka" })
    .positive(),
  beratBadan: z
    .number({ message: "Berat Badan harus berupa angka" })
    .positive(),
  tinggiBadan: z
    .number({ message: "Tinggi Badan harus berupa angka" })
    .positive(),
  tekananDarah: z
    .string()
    .min(3, { message: "Tekanan Darah harus memiliki minimal 3 karakter" })
    .max(20, { message: "Tekanan Darah tidak boleh lebih dari 20 karakter" })
    .transform((val) => val.replace(/\s+/g, " ").trim()),
  denyutNadi: z
    .number({ message: "Denyut Nadi harus berupa angka" })
    .positive(),
  hasilLab: z
    .string()
    .optional()
    .transform((val) => val?.replace(/\s+/g, " ").trim() || ""),
  hasilEkg: z
    .string()
    .optional()
    .transform((val) => val?.replace(/\s+/g, " ").trim() || ""),
  tanggalPeriksa: z
    .number({ message: "Tanggal Periksa harus berupa angka" })
    .positive(),
});
