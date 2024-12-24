import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { CopyMinus, CopyPlus } from "lucide-react";

const WaktuOperasional = ({ setWaktuOperasionalList }) => {
  const [inputs, setInputs] = useState([
    { waktuBuka: null, waktuTutup: null, selectedDay: null },
  ]);

  const days = [
    { label: "Senin", value: "Senin" },
    { label: "Selasa", value: "Selasa" },
    { label: "Rabu", value: "Rabu" },
    { label: "Kamis", value: "Kamis" },
    { label: "Jumat", value: "Jumat" },
    { label: "Sabtu", value: "Sabtu" },
    { label: "Minggu", value: "Minggu" },
  ];

  const formatTime = (time) => {
    if (!time) return "";
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleAddOperational = (index) => {
    const { waktuBuka, waktuTutup, selectedDay } = inputs[index];
    if (waktuBuka && waktuTutup && selectedDay) {
      const formattedWaktuBuka = formatTime(waktuBuka);
      const formattedWaktuTutup = formatTime(waktuTutup);
      const operasionalDay = `${selectedDay} - ${formattedWaktuBuka} - ${formattedWaktuTutup}`;

      setWaktuOperasionalList((prev) => [...prev, operasionalDay]);

      setInputs((prev) => [
        ...prev,
        { waktuBuka: null, waktuTutup: null, selectedDay: null },
      ]);
    }
  };

  const handleRemoveOperational = (index) => {
    setInputs((prev) => prev.filter((_, i) => i !== index));
  };

  const handleInputChange = (index, field, value) => {
    const updatedInputs = [...inputs];
    updatedInputs[index][field] = value;
    setInputs(updatedInputs);
  };

  useEffect(() => {
    const formattedList = inputs
      .filter(
        (input) => input.waktuBuka && input.waktuTutup && input.selectedDay
      )
      .map((input) => {
        const { waktuBuka, waktuTutup, selectedDay } = input;
        const formattedWaktuBuka = formatTime(waktuBuka);
        const formattedWaktuTutup = formatTime(waktuTutup);
        return `${selectedDay} - ${formattedWaktuBuka} - ${formattedWaktuTutup}`;
      });
    setWaktuOperasionalList(formattedList);
  }, [inputs, setWaktuOperasionalList]);

  return (
    <div className="flex flex-col w-full">
      <h3>Waktu Operasional</h3>
      <div className="flex flex-col gap-2">
      {inputs.map((input, index) => (
        <div
          key={index}
          className="flex md:flex-row flex-col justify-between items-center gap-2"
        >
          <div className="w-full">
            <Dropdown
              id={`day-${index}`}
              className=" w-full"
              value={input.selectedDay}
              options={days}
              onChange={(e) => handleInputChange(index, "selectedDay", e.value)}
              placeholder="Pilih Hari"
            />
          </div>
          <div className="w-full">
            <Calendar
              className=" w-full"
              id={`waktuBuka-${index}`}
              value={input.waktuBuka}
              onChange={(e) => handleInputChange(index, "waktuBuka", e.value)}
              timeOnly
              placeholder="Pilih Waktu Buka"
              showTime
            />
          </div>
          <div className="w-full">
            <Calendar
              className=" w-full"
              id={`waktuTutup-${index}`}
              value={input.waktuTutup}
              onChange={(e) => handleInputChange(index, "waktuTutup", e.value)}
              timeOnly
              placeholder="Pilih Waktu Tutup"
              showTime
            />
          </div>
          <div className="flex gap-2 w-full">
            <Button
              className="block py-3 w-full rounded-xl bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen"
              label={<CopyPlus className="mx-auto" />}
              onClick={() => handleAddOperational(index)}
              disabled={
                !input.waktuBuka ||
                !input.waktuTutup ||
                !input.selectedDay ||
                index !== inputs.length - 1
              }
            />
            <Button
              className="block w-full py-3 rounded-xl "
              severity="danger"
              label={<CopyMinus className="mx-auto" />}
              onClick={() => handleRemoveOperational(index)}
              disabled={inputs.length <= 1}
            />
          </div>
        </div>
      ))}
      </div>
      
    </div>
  );
};

export default WaktuOperasional;
