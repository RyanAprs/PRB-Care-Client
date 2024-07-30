export const convertUnixToHuman = (unixTimestamp) => {
  const date = new Date(unixTimestamp * 1000);

  const formattedDate = date.toLocaleString("en-CA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
    // second: "2-digit",
  });

  return formattedDate;
};

export const convertHumanToUnix = (dateString) => {
  const date = new Date(dateString);
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  return unixTimestamp;
};

export const dateLocaleId = {
  firstDayOfWeek: 0,
  dayNames: ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"],
  dayNamesShort: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  dayNamesMin: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
  monthNames: [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ],
  monthNamesShort: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ],
  today: "Hari ini",
  clear: "Bersihkan",
};