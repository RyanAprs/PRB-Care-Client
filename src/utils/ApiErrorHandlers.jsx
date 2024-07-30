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
          detail:
            "Username atau nomor telepon yang Anda masukkan sudah terdaftar. Mohon gunakan yang lain.",
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
      detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
      life: 3000,
    });
  }
};

export const handleDeleteError = (error, toast, title) => {
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
          detail: `Data ${title}  ini masih terkait dengan data lain. Mohon periksa kembali.`,
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
      detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
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
          detail:
            "Pasien ini masih harus melakukan pengambilan obat atau kontrol balik, mohon periksa kembali.",
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
      detail: "Terjadi kesalahan. Mohon coba lagi nanti.",
      life: 3000,
    });
  }
};
