import {z} from "zod";

export const loginSchema = z.object({
    username: z
        .string()
        .nonempty("Format username tidak sesuai")
        .regex(/^\S*$/, "Format username tidak sesuai")
        .min(6, "Format username tidak sesuai")
        .max(50, "Format username tidak sesuai"),
    password: z
        .string()
        .nonempty("Format password tidak sesuai")
        .min(6, "Format password tidak sesuai")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Format password tidak sesuai"
        )
        .regex(/^\S*$/, "Format password tidak sesuai"),
    tokenCaptcha: z
        .string()
        .min(1, "Selesaikan captcha terlebih dahulu"),
});
export const loginAdminSchema = z.object({
    username: z
        .string()
        .nonempty("Format username tidak sesuai")
        .regex(/^\S*$/, "Format username tidak sesuai")
        .min(6, "Format username tidak sesuai")
        .max(50, "Format username tidak sesuai"),
    password: z
        .string()
        .nonempty("Format password tidak sesuai")
        .min(6, "Format password tidak sesuai")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            "Format password tidak sesuai"
        )
        .regex(/^\S*$/, "Format password tidak sesuai"),
    selectedRole: z.string().
    refine((val) => ["admin", "puskesmas", "apotek"].includes(val),"Pilih role admin yang sesuai"),
    tokenCaptcha: z
        .string()
        .min(1, "Selesaikan captcha terlebih dahulu"),
});