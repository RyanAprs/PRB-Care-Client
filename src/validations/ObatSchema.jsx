import { z } from "zod";

export const obatSchema = z.object({
  namaObat: z
    .string()
    .nonempty("Nama Obat tidak boleh kosong")
    .min(3, "Nama Obat harus lebih dari 3 huruf")
    .max(50, "Nama Obat harus kurang dari 50 huruf"),
  jumlah: z.number().nonnegative("Jumlah Beli Obat tidak boleh negatif"),
});
