export const handleApiError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data yang Anda masukkan tidak valid. Mohon periksa kembali.",
                    life: 3000,
                });
                break;
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Token yang Anda gunakan tidak valid. Silakan login kembali.",
                    life: 3000,
                });
                break;
            case 404:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data tidak ditemukan.",
                    life: 3000,
                });
                break;
            case 409:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};

export const handleDeleteError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Token yang Anda gunakan tidak valid. Silakan login kembali.",
                    life: 3000,
                });
                break;
            case 404:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data tidak ditemukan.",
                    life: 3000,
                });
                break;
            case 409:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};

export const handleDoneError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Token yang Anda gunakan tidak valid. Silakan login kembali.",
                    life: 3000,
                });
                break;
            case 404:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data tidak ditemukan.",
                    life: 3000,
                });
                break;
            case 409:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};

export const handleChangePasswordError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Password lama yang anda masukkan salah.",
                    life: 3000,
                });
                break;
            case 404:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data tidak ditemukan.",
                    life: 3000,
                });
                break;
            case 409:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};

export const handleLoginError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data yang Anda masukkan tidak valid. Mohon periksa kembali.",
                    life: 3000,
                });
                break;
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};

export const handleCreatePengambilanObatError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data yang Anda masukkan tidak valid. Mohon periksa kembali.",
                    life: 3000,
                });
                break;
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Token yang Anda gunakan tidak valid. Silakan login kembali.",
                    life: 3000,
                });
                break;
            case 404:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data tidak ditemukan.",
                    life: 3000,
                });
                break;
            case 409:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};

export const handleKontrolBalikError = (error, toast) => {
    if (error.response) {
        switch (error.response.status) {
            case 400:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data yang Anda masukkan tidak valid. Mohon periksa kembali.",
                    life: 3000,
                });
                break;
            case 401:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Token yang Anda gunakan tidak valid. Silakan login kembali.",
                    life: 3000,
                });
                break;
            case 404:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Data tidak ditemukan.",
                    life: 3000,
                });
                break;
            case 409:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: error.response.data.error,
                    life: 3000,
                });
                break;
            case 500:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan server. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
            default:
                toast.current.show({
                    severity: "error",
                    summary: "Gagal",
                    detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
                    life: 3000,
                });
                break;
        }
    } else {
        toast.current.show({
            severity: "error",
            summary: "Gagal",
            detail: "Terjadi kesalahan, Periksa kembali koneksi internet anda.",
            life: 3000,
        });
    }
};
