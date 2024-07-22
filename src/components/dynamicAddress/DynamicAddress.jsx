import React, { useState, useEffect, useContext } from "react";
import { Input, Select, SelectItem } from "@nextui-org/react";
import { z } from "zod";
import { AddressContext } from "../../config/context/AdressContext";

const DynamicAddress = () => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [errors, setErrors] = useState({});

  const { address, setAddress } = useContext(AddressContext);

  const addressSchema = z.object({
    provinsi: z.string().min(1, "Provinsi wajib diisi"),
    kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    desa: z.string().min(1, "Desa wajib diisi"),
    detail: z.string().min(1, "Detail alamat wajib diisi"),
  });

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
        provinsi: province.name,
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
        kabupaten: regency.name,
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
        kecamatan: district.name,
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
        desa: village.name,
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

  const validateAddress = () => {
    const result = addressSchema.safeParse(address);
    if (!result.success) {
      const errorMessages = {};
      result.error.errors.forEach((err) => {
        errorMessages[err.path[0]] = err.message;
      });
      setErrors(errorMessages);
      return false;
    }
    setErrors({});
    return true;
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="h-auto w-full flex flex-col gap-4 items-center justify-center">
        <Select
          className="w-full"
          onChange={handleProvinceChange}
          value={address.provinsi || ""}
          label="Pilih Provinsi"
          variant="bordered"
          required
        >
          {provinces.map((prov) => (
            <SelectItem key={prov.id} value={prov.id}>
              {prov.name}
            </SelectItem>
          ))}
        </Select>
        {errors.provinsi && (
          <span className="text-red-500">{errors.provinsi}</span>
        )}

        <Select
          onChange={handleRegencyChange}
          value={address.kabupaten || ""}
          label="Pilih Kabupaten"
          variant="bordered"
          required
        >
          {regencies.map((reg) => (
            <SelectItem key={reg.id} value={reg.id}>
              {reg.name}
            </SelectItem>
          ))}
        </Select>
        {errors.kabupaten && (
          <span className="text-red-500">{errors.kabupaten}</span>
        )}

        <Select
          onChange={handleDistrictChange}
          value={address.kecamatan || ""}
          label="Pilih Kecamatan"
          variant="bordered"
          required
        >
          {districts.map((dist) => (
            <SelectItem key={dist.id} value={dist.id}>
              {dist.name}
            </SelectItem>
          ))}
        </Select>
        {errors.kecamatan && (
          <span className="text-red-500">{errors.kecamatan}</span>
        )}

        <Select
          onChange={handleVillageChange}
          value={address.desa || ""}
          label="Pilih Desa"
          variant="bordered"
          required
        >
          {villages.map((village) => (
            <SelectItem key={village.id} value={village.id}>
              {village.name}
            </SelectItem>
          ))}
        </Select>
        {errors.desa && <span className="text-red-500">{errors.desa}</span>}

        <Input
          type="text"
          variant="bordered"
          label="Detail Alamat"
          value={address.detail || ""}
          name="detail"
          onChange={handleInputChange}
          required
        />
        {errors.detail && <span className="text-red-500">{errors.detail}</span>}
      </div>
    </div>
  );
};

export const validateAddress = (address) => {
  const addressSchema = z.object({
    provinsi: z.string().min(1, "Provinsi wajib diisi"),
    kabupaten: z.string().min(1, "Kabupaten wajib diisi"),
    kecamatan: z.string().min(1, "Kecamatan wajib diisi"),
    desa: z.string().min(1, "Desa wajib diisi"),
    detail: z.string().min(1, "Detail alamat wajib diisi"),
  });

  const result = addressSchema.safeParse(address);
  return result.success;
};

export default DynamicAddress;
