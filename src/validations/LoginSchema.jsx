import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .nonempty("Username tidak boleh kosong")
    .regex(/^\S*$/, "Username tidak boleh mengandung spasi")
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
});
