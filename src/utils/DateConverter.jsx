export const timeStampToHuman = (timestamp) => {
  // Periksa apakah timestamp dalam detik (jika lebih besar dari 1000000000) atau milidetik
  const isInSeconds = timestamp.toString().length <= 10;

  // Konversi timestamp sesuai unitnya
  const date = new Date(isInSeconds ? timestamp * 1000 : timestamp);

  // Format tanggal sesuai dengan format yang diinginkan
  const options = { day: "numeric", month: "long", year: "numeric" };
  return date.toLocaleDateString("id-ID", options);
};
