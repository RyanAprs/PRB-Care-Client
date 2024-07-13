import { Button, Select, SelectItem } from "@nextui-org/react";
import React, { useState, useEffect, useContext } from "react";
import { AddressContext } from "../../config/context/AdressContext";

const DynamicAddress = () => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const { address, setAddress } = useContext(AddressContext);

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((data) => setProvinces(data));
  }, []);

  const handleProvinceChange = (e) => {
    const provinsiId = e.target.value;
    const province = provinces.find((prov) => prov.id === provinsiId);
    if (province) {
      setAddress((prev) => ({
        ...prev,
        province: province.name,
      }));
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setRegencies(data));
    }
  };

  const handleRegencyChange = (e) => {
    const kabupatenId = e.target.value;
    const regency = regencies.find((reg) => reg.id === kabupatenId);
    if (regency) {
      setAddress((prev) => ({
        ...prev,
        regency: regency.name,
      }));
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setDistricts(data));
    }
  };

  const handleDistrictChange = (e) => {
    const kecamatanId = e.target.value;
    const district = districts.find((dist) => dist.id === kecamatanId);
    if (district) {
      setAddress((prev) => ({
        ...prev,
        district: district.name,
      }));
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setVillages(data));
    }
  };

  const handleVillageChange = (e) => {
    const desaId = e.target.value;
    const village = villages.find((village) => village.id === desaId);
    if (village) {
      setAddress((prev) => ({
        ...prev,
        village: village.name,
      }));
    }
  };

  return (
    <div className="h-auto w-full flex flex-wrap md:flex-nowrap p-8 gap-4 items-center justify-center">
      <Select
        className="w-full"
        onChange={handleProvinceChange}
        value={address.province?.id || ""}
        label="Pilih Provinsi"
      >
        {provinces.map((prov) => (
          <SelectItem key={prov.id} value={prov.id}>
            {prov.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        onChange={handleRegencyChange}
        value={address.regency?.id || ""}
        label="Pilih Kabupaten"
      >
        {regencies.map((reg) => (
          <SelectItem key={reg.id} value={reg.id}>
            {reg.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        onChange={handleDistrictChange}
        value={address.district?.id || ""}
        label="Pilih Kecamatan"
      >
        {districts.map((dist) => (
          <SelectItem key={dist.id} value={dist.id}>
            {dist.name}
          </SelectItem>
        ))}
      </Select>

      <Select
        onChange={handleVillageChange}
        value={address.village?.id || ""}
        label="Pilih Desa"
      >
        {villages.map((village) => (
          <SelectItem key={village.id} value={village.id}>
            {village.name}
          </SelectItem>
        ))}
      </Select>
      <Button onClick={() => console.log(address)} variant="bordered">
        Submit
      </Button>
    </div>
  );
};

export default DynamicAddress;
