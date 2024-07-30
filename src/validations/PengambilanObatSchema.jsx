import { z } from "zod";

export const pengambilanObatSchema = z.object({
  idObat: z
    .number({ message: "Obat tidak boleh kosong dan harus berupa angka" })
    .positive(),
  idPasien: z
    .number({ message: "pasien tidak boleh kosong dan  harus berupa angka" })
    .positive(),
  jumlah: z
    .number({ message: "Jumlah obat tidak boleh kosong harus berupa angka" })
    .positive(),
  tanggalPengambilan: z
    .number({
      message: "Tanggal kontrol tidak boleh kosong harus berupa angka",
    })
    .positive(),
});
