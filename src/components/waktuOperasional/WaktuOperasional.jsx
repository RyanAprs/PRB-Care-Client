import { useState, useEffect } from "react";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { Minus, Plus } from "lucide-react";

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
    <div className="flex flex-col gap-4 w-full">
      <h3>Atur Waktu Operasional</h3>
      {inputs.map((input, index) => (
        <div key={index} className="flex justify-between items-center">
          <div>
            <Dropdown
              id={`day-${index}`}
              value={input.selectedDay}
              options={days}
              onChange={(e) => handleInputChange(index, "selectedDay", e.value)}
              placeholder="Pilih Hari"
            />
          </div>
          <div>
            <Calendar
              id={`waktuBuka-${index}`}
              value={input.waktuBuka}
              onChange={(e) => handleInputChange(index, "waktuBuka", e.value)}
              timeOnly
              showTime
            />
          </div>
          <div>
            <Calendar
              id={`waktuTutup-${index}`}
              value={input.waktuTutup}
              onChange={(e) => handleInputChange(index, "waktuTutup", e.value)}
              timeOnly
              showTime
            />
          </div>
          <Button
            label={<Plus />}
            onClick={() => handleAddOperational(index)}
            disabled={
              !input.waktuBuka || !input.waktuTutup || !input.selectedDay
            }
          />
          <Button
            label={<Minus />}
            onClick={() => handleRemoveOperational(index)}
            disabled={inputs.length <= 1}
          />
        </div>
      ))}
    </div>
  );
};

export default WaktuOperasional;
