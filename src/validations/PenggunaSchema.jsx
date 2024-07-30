import { z } from "zod";

export const userSchema = z.object({
  namaLengkap: z
    .string()
    .nonempty("Nama Pengguna tidak boleh kosong")
    .min(3, "Nama Pengguna harus lebih dari 3 huruf")
    .max(50, "Nama Pengguna harus kurang dari 50 huruf"),
  username: z
    .string()
    .nonempty("Username tidak boleh kosong")
    .regex(/^\S*$/, "Username tidak boleh mengandung spasi")
    .min(6, "Username harus lebih dari 6 huruf")
    .max(50, "Username harus kurang dari 50 huruf"),
  password: z
    .string()
    .min(6, "Password harus lebih dari 6 huruf")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password harus mengandung huruf besar, kecil, angka, dan simbol"
    )
    .regex(/^\S*$/, "Password tidak boleh mengandung spasi"),
  telepon: z
    .string()
    .nonempty("Nomor Telepon tidak boleh kosong")
    .min(10, "Nomor telepon harus lebih dari 10 huruf")
    .max(16, "Nomor telepon harus kurang dari 16 huruf")
    .regex(/^\S*$/, "Nomor telepon tidak boleh mengandung spasi"),
  teleponKeluarga: z
    .string()
    .nonempty("Nomor Telepon keluarga tidak  boleh kosong")
    .nonempty("Nomor Telepon keluarga tidak boleh kosong")
    .min(10, "Nomor telepon keluarga harus lebih dari 10 huruf")
    .max(16, "Nomor telepon keluarga harus kurang dari 16 huruf")
    .regex(/^\S*$/, "Nomor telepon keluarga tidak boleh mengandung spasi"),
  alamat: z.string().nonempty("Alamat tidak boleh kosong"),
});
