import React, { useState, useEffect, useContext } from "react";
import { z } from "zod";
import { AddressContext } from "../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const DynamicAddress = ({ reset }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [errors, setErrors] = useState({});

  const { address, setAddress } = useContext(AddressContext);

  
  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((response) => response.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (reset) {
      setAddress({
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        desa: "",
        detail: "",
      });
      setErrors({});
    }
  }, [reset]);

  const handleProvinceChange = (e) => {
    const provinsiId = e.value;
    const province = provinces.find((prov) => prov.id === provinsiId);
    if (province) {
      setAddress((prev) => ({
        ...prev,
        provinsi: province.name,
        provinsiId: provinsiId,
      }));
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${province.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setRegencies(data));
    }
  };

  const handleRegencyChange = (e) => {
    const kabupatenId = e.value;
    const regency = regencies.find((reg) => reg.id === kabupatenId);
    if (regency) {
      setAddress((prev) => ({
        ...prev,
        kabupaten: regency.name,
        kabupatenId: kabupatenId,
      }));
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regency.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setDistricts(data));
    }
  };

  const handleDistrictChange = (e) => {
    const kecamatanId = e.value;
    const district = districts.find((dist) => dist.id === kecamatanId);
    if (district) {
      setAddress((prev) => ({
        ...prev,
        kecamatan: district.name,
        kecamatanId: kecamatanId,
      }));
      fetch(
        `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${district.id}.json`
      )
        .then((response) => response.json())
        .then((data) => setVillages(data));
    }
  };

  const handleVillageChange = (e) => {
    const desaId = e.value;
    const village = villages.find((village) => village.id === desaId);
    if (village) {
      setAddress((prev) => ({
        ...prev,
        desa: village.name,
        desaId: desaId,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-auto w-full flex flex-col gap-4 items-center justify-center">
        <Dropdown
          value={address.provinsiId || ""}
          options={provinces.map((prov) => ({
            label: prov.name,
            value: prov.id,
          }))}
          onChange={handleProvinceChange}
          placeholder="Pilih Provinsi"
          filter
          className="w-full p-2 text-sm"
          required
        />
        {errors.provinsi && (
          <span className="text-red-500">{errors.provinsi}</span>
        )}

        {address.provinsiId && (
          <>
            <Dropdown
              value={address.kabupatenId || ""}
              options={regencies.map((reg) => ({
                label: reg.name,
                value: reg.id,
              }))}
              onChange={handleRegencyChange}
              placeholder="Pilih Kabupaten"
              filter
              className="w-full p-2 text-sm "
              required
            />
            {errors.kabupaten && (
              <span className="text-red-500">{errors.kabupaten}</span>
            )}
          </>
        )}

        {address.kabupatenId && (
          <>
            <Dropdown
              value={address.kecamatanId || ""}
              options={districts.map((dist) => ({
                label: dist.name,
                value: dist.id,
              }))}
              onChange={handleDistrictChange}
              placeholder="Pilih Kecamatan"
              filter
              className="w-full p-2 text-sm"
              required
            />
            {errors.kecamatan && (
              <span className="text-red-500">{errors.kecamatan}</span>
            )}
          </>
        )}

        {address.kecamatanId && (
          <>
            <Dropdown
              value={address.desaId || ""}
              options={villages.map((village) => ({
                label: village.name,
                value: village.id,
              }))}
              onChange={handleVillageChange}
              placeholder="Pilih Desa"
              filter
              className="w-full p-2 text-sm "
              required
            />
            {errors.desa && <span className="text-red-500">{errors.desa}</span>}
          </>
        )}

        {address.desaId && (
          <>
            <InputText
              type="text"
              value={address.detail || ""}
              placeholder="Detail Alamat"
              name="detail"
              onChange={handleInputChange}
              className="w-full p-3 text-slg "
              required
            />
            {errors.detail && (
              <span className="text-red-500">{errors.detail}</span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DynamicAddress;
