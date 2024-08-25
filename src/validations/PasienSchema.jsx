import {z} from "zod";

export const pasienCreateSchema = z.object({
    noRekamMedis: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nomor Rekam Medis minimal 3 karakter"
        ),
    idPengguna: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Pengguna tidak boleh kosong"),
    idAdminPuskesmas: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Admin Puskesmas tidak boleh kosong"),
    tanggalDaftar: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Tanggal Periksa tidak boleh kosong"),
});

export const pasienUpdateSchema = z.object({
    noRekamMedis: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nomor Rekam Medis minimal 3 karakter"
        ),
    idPengguna: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Pengguna tidak boleh kosong"),
    currentAdminPuskesmas: z.boolean().optional(),
    idAdminPuskesmas: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Admin Puskesmas tidak boleh kosong"),
    tanggalDaftar: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Tanggal Periksa harus diisi"), // Adjust to Date or Timestamp as needed
});


export const pasienCreateSchemaAdminPuskesmas = z.object({
    noRekamMedis: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nomor Rekam Medis minimal 3 karakter"
        ),
    idPengguna: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Pengguna tidak boleh kosong"),
    tanggalDaftar: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Tanggal Periksa tidak boleh kosong"),
});

export const pasienUpdateSchemaAdminPuskesmas = z.object({
    noRekamMedis: z
        .string()
        .min(3)
        .max(50)
        .refine(
            (val) => val.trim().length >= 3,
            "Nomor Rekam Medis minimal 3 karakter"
        ),
    idPengguna: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Pengguna tidak boleh kosong"),
    currentAdminPuskesmas: z.boolean().optional(),
    tanggalDaftar: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Tanggal Periksa harus diisi"),
});
