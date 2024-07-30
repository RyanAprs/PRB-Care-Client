import { z } from "zod";

export const kontrolBalikSchema = z.object({
  idPasien: z.number({ message: "Id Pengguna harus berupa angka" }).positive(),
  idAdminPuskesmas: z
    .number({ message: "Id Admin Puskesmas harus berupa angka" })
    .positive(),
  tanggalKontrol: z
    .number({ message: "Tanggal kontrol harus berupa angka" })
    .positive(),
});
