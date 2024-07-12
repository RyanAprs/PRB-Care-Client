import React, { useState, useEffect } from "react";

const DynamicAddress = () => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedRegency, setSelectedRegency] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((data) => setProvinces(data));
  }, []);

  const handleProvinceChange = (e) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    console.log(provinceId);
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`
    )
      .then((response) => response.json())
      .then((data) => setRegencies(data));
  };

  const handleRegencyChange = (e) => {
    const regencyId = e.target.value;
    setSelectedRegency(regencyId);
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`
    )
      .then((response) => response.json())
      .then((data) => setDistricts(data));
  };

  const handleDistrictChange = (e) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    fetch(
      `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`
    )
      .then((response) => response.json())
      .then((data) => setVillages(data));
  };

  return (
    <div>
      <label>Provinsi:</label>
      <select onChange={handleProvinceChange} value={selectedProvince}>
        <option value="">Pilih Provinsi</option>
        {provinces.map((prov) => (
          <option key={prov.id} value={prov.id}>
            {prov.name}
          </option>
        ))}
      </select>

      <label>Kabupaten/Kota:</label>
      <select onChange={handleRegencyChange} value={selectedRegency}>
        <option value="">Pilih Kabupaten/Kota</option>
        {regencies.map((reg) => (
          <option key={reg.id} value={reg.id}>
            {reg.name}
          </option>
        ))}
      </select>

      <label>Kecamatan:</label>
      <select onChange={handleDistrictChange} value={selectedDistrict}>
        <option value="">Pilih Kecamatan</option>
        {districts.map((dist) => (
          <option key={dist.id} value={dist.id}>
            {dist.name}
          </option>
        ))}
      </select>

      <label>Desa/Kelurahan:</label>
      <select>
        <option value="">Pilih Desa/Kelurahan</option>
        {villages.map((village) => (
          <option key={village.id} value={village.id}>
            {village.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicAddress;
