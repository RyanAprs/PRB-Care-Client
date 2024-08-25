import {z} from "zod";

export const pengambilanObatSchema = z.object({
    idObat: z
        .number({message: "Obat tidak boleh kosong dan harus berupa angka"})
        .positive(),
    idPasien: z
        .number({message: "pasien tidak boleh kosong dan  harus berupa angka"})
        .positive(),
    jumlah: z
        .number({message: "Jumlah obat tidak boleh kosong harus berupa angka"})
        .positive(),
    tanggalPengambilan: z
        .number({
            message: "Tanggal kontrol tidak boleh kosong harus berupa angka",
        })
        .positive(),
});

export const pengambilanObatCreateSchema = z.object({
    idPasien: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Pasien tidak boleh kosong"),
    idObat: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Obat tidak boleh kosong"),
    jumlah: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Jumlah obat harus lebih dari 0"),
    tanggalPengambilan: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Tanggal Pengambilan harus diisi"),
    idAdminPuskesmas: z.number().int().positive().optional(),
});

export const pengambilanObatUpdateSchema = z.object({
    idPasien: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Pasien tidak boleh kosong"),
    idObat: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Obat tidak boleh kosong"),
    jumlah: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Jumlah obat harus lebih dari 0"),
    tanggalPengambilan: z
        .number()
        .int()
        .positive()
        .refine((val) => val > 0, "Tanggal Pengambilan harus diisi"),
    idAdminPuskesmas: z.number().int().positive().optional(),
});
