import {z} from "zod";

const isPhoneNumber = (str) => {
    const phoneRegex = /^\d{10,16}$/;
    return phoneRegex.test(str);
};

const isPasswordFormat = (str) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(str);
};

export const puskesmasCreateSchema = z.object({
    namaPuskesmas: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nama Puskesmas minimal 3 karakter"
        ),
    telepon: z
        .string()
        .min(10)
        .max(16)
        .refine(isPhoneNumber, "Nomor telepon tidak valid"),
    alamat: z
        .string()
        .min(3)
        .max(1000, "Alamat terlalu panjang")
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
    waktuOperasional: z
        .string()
        .min(3)
        .max(1000, "Waktu operasional terlalu panjang")
        .refine(
            (val) => val.trim().length >= 3,
            "Waktu Operasional tidak boleh kosong"
        ),
});

export const puskesmasUpdateSchema = z.object({
    namaPuskesmas: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nama Puskesmas minimal 3 karakter"
        ),
    telepon: z
        .string()
        .min(10)
        .max(16)
        .refine(isPhoneNumber, "Nomor telepon tidak valid"),
    alamat: z
        .string()
        .min(3)
        .max(1000, "Alamat terlalu panjang")
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
    waktuOperasional: z
        .string()
        .min(3)
        .max(1000, "Waktu operasional terlalu panjang")
        .refine(
            (val) => val.trim().length >= 3,
            "Waktu Operasional tidak boleh kosong"
        ),
});

export const puskesmasUpdateCurrentSchema = z.object({
    namaPuskesmas: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nama Puskesmas minimal 3 karakter"
        ),
    telepon: z
        .string()
        .min(10)
        .max(16)
        .refine(isPhoneNumber, "Nomor telepon tidak valid"),
    alamat: z
        .string()
        .min(3)
        .max(1000, "Alamat terlalu panjang")
        .refine((val) => val.trim().length >= 3, "Alamat minimal 3 karakter"),
    waktuOperasional: z
        .string()
        .min(3)
        .max(1000, "Waktu operasional terlalu panjang")
        .refine(
            (val) => val.trim().length >= 3,
            "Waktu Operasional tidak boleh kosong"
        ),
});

export const puskesmasChangePasswordSchema = z
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
