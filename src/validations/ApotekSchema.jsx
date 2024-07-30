import { z } from "zod";

export const apotekSchema = z.object({
  namaApotek: z
    .string()
    .min(3, "Nama Apotek harus lebih dari 3 huruf")
    .max(50, "Nama Apotek harus kurang dari 50 huruf"),
  username: z
    .string()
    .nonempty("Username tidak boleh kosong")
    .regex(/^\S*$/, "Username tidak boleh mengandung spasi")
    .min(6, "Username harus lebih dari 6 huruf")
    .max(50, "Username harus kurang dari 50 huruf"),
  password: z
    .string()
    .nonempty("Password tidak boleh kosong")
    .min(6, "Password harus lebih dari 6 huruf")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password harus mengandung huruf besar, kecil, angka, dan simbol"
    )
    .regex(/^\S*$/, "Password tidak boleh mengandung spasi"),
  telepon: z
    .string()
    .nonempty("Telepon tidak boleh kosong")
    .min(10, "Nomor telepon harus lebih dari 10 huruf")
    .max(16, "Nomor telepon harus kurang dari 16 huruf")
    .regex(/^\S*$/, "Nomor telepon tidak boleh mengandung spasi"),
  alamat: z.string().nonempty("Alamat tidak boleh kosong"),
});
