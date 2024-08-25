import {z} from "zod";

export const createObatSchema = z.object({
    namaObat: z
        .string()
        .min(3)
        .max(50)
        .refine((val) => val.length >= 3, "Nama obat minimal 3 karakter"),
    jumlah: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Jumlah obat harus lebih dari 0"),
    idAdminApotek: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "ID admin apotek harus lebih dari 0"),
});

export const updateObatSchema = z.object({
    namaObat: z
        .string()
        .min(3)
        .max(50)
        .refine((val) => val.length >= 3, "Nama obat minimal 3 karakter"),
    jumlah: z
        .number()
        .int()
        .nonnegative()
        .refine((val) => val >= 0, "Jumlah obat tidak boleh negatif"),
    idAdminApotek: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "ID admin apotek harus lebih dari 0"),
});

export const createObatSchemaAdminApotek = z.object({
    namaObat: z
        .string()
        .min(3)
        .max(50)
        .refine((val) => val.length >= 3, "Nama obat minimal 3 karakter"),
    jumlah: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Jumlah obat harus lebih dari 0"),
});

export const updateObatSchemaAdminApotek = z.object({
    namaObat: z
        .string()
        .min(3)
        .max(50)
        .refine((val) => val.length >= 3, "Nama obat minimal 3 karakter"),
    jumlah: z
        .number()
        .int()
        .nonnegative()
        .refine((val) => val >= 0, "Jumlah obat tidak boleh negatif"),
});
