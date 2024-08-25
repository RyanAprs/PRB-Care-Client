import {z} from "zod";

const isPasswordFormat = (str) => {
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return passwordRegex.test(str);
};

export const superAdminChangePasswordSchema = z
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
