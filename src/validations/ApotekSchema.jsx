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

const isPhoneNumber = (str) => {
  const phoneRegex = /^\d{10,16}$/;
  return phoneRegex.test(str);
};

const isPasswordFormat = (str) => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(str);
};

export const apotekCreateSchema = z.object({
  namaApotek: z
    .string()
    .min(3)
    .max(50)
    .refine((val) => val.trim().length >= 3, "Nama Apotek minimal 3 karakter"),
  telepon: z
    .string()
    .min(10)
    .max(16)
    .refine(isPhoneNumber, "Nomor telepon tidak valid"),
  alamat: z
    .string()
    .min(3)
    .refine((val) => val.trim().length >= 3, "Alamat minimal 3 karakter"),
  username: z
    .string()
    .nonempty("Username tidak boleh kosong")
    .regex(/^\S*$/, "Username tidak boleh mengandung spasi")
    .min(6, "Username harus lebih dari 6 huruf")
    .max(50, "Username harus kurang dari 50 huruf"),
  password: z
    .string()
    .min(6)
    .max(255)
    .refine(
      isPasswordFormat,
      "Password tidak sesuai format (minimal 6 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial)"
    ),
});

export const apotekUpdateSchema = z.object({
  namaApotek: z
    .string()
    .min(3)
    .max(50)
    .refine((val) => val.trim().length >= 3, "Nama Apotek minimal 3 karakter"),
  telepon: z
    .string()
    .min(10)
    .max(16)
    .refine(isPhoneNumber, "Nomor telepon tidak valid"),
  alamat: z
    .string()
    .min(3)
    .refine((val) => val.trim().length >= 3, "Alamat minimal 3 karakter"),
  username: z
    .string()
    .nonempty("Username tidak boleh kosong")
    .regex(/^\S*$/, "Username tidak boleh mengandung spasi")
    .min(6, "Username harus lebih dari 6 huruf")
    .max(50, "Username harus kurang dari 50 huruf"),
  password: z
    .string()
    .optional()
    .refine(
      (val) => !val || isPasswordFormat(val),
      "Password tidak sesuai format (minimal 6 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial)"
    ),
});

export const apotekUpdateCurrentSchema = z.object({
  namaApotek: z
    .string()
    .min(3)
    .max(50)
    .refine(
      (val) => val.trim().length >= 3,
      "Nama Apotek minimal 3 karakter"
    ),
  telepon: z
    .string()
    .min(10)
    .max(16)
    .refine(isPhoneNumber, "Nomor telepon tidak valid"),
  alamat: z
    .string()
    .min(3)
    .refine((val) => val.trim().length >= 3, "Alamat minimal 3 karakter"),
});

export const apotekChangePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6)
      .max(255)
      .refine(
        isPasswordFormat,
        "Password tidak sesuai format (minimal 6 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial)"
      ),
    newPassword: z
      .string()
      .min(6)
      .max(255)
      .refine(
        isPasswordFormat,
        "Password baru tidak sesuai format (minimal 6 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial)"
      ),
    confirmPassword: z
      .string()
      .min(6)
      .max(255)
      .refine(
        isPasswordFormat,
        "Konfirmasi password tidak sesuai format (minimal 6 karakter, harus mengandung huruf besar, huruf kecil, angka, dan karakter spesial)"
      ),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password harus sama dengan password baru",
    path: ["confirmPassword"],
  });
