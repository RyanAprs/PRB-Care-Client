import { useState, useEffect, useContext } from "react";
import { AddressContext } from "../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import province from "../../address/provinces.json";

const DynamicAddress = ({ reset, prevAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const { address, setAddress } = useContext(AddressContext);

  useEffect(() => {
    if (reset) {
      setAddress({
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        desa: "",
        detail: "",
      });
    } else if (prevAddress) {
      setAddress(prevAddress);
    }
  }, [reset, prevAddress, setAddress]);

  useEffect(() => {
    setProvinces(province);
  }, []);

  const handleProvinceChange = async (e) => {
    const provinsiId = e.value;
    const selectedProvince = provinces.find((prov) => prov.id === provinsiId);
    if (selectedProvince) {
      setAddress((prev) => ({
        ...prev,
        provinsi: selectedProvince.name,
        provinsiId: provinsiId,
      }));

      try {
        const regencyData = await import(
          `../../address/regencies/${provinsiId}.json`
        );
        setRegencies(regencyData.default);
      } catch (error) {
        console.error("Error loading regencies:", error);
        setRegencies([]);
      }
    }
  };

  const handleRegencyChange = async (e) => {
    const kabupatenId = e.value;
    const selectedRegency = regencies.find((reg) => reg.id === kabupatenId);
    if (selectedRegency) {
      setAddress((prev) => ({
        ...prev,
        kabupaten: selectedRegency.name,
        kabupatenId: kabupatenId,
      }));

      try {
        const districtData = await import(
          `../../address/districts/${kabupatenId}.json`
        );
        setDistricts(districtData.default);
      } catch (error) {
        console.error("Error loading districts:", error);
        setDistricts([]);
      }
    }
  };

  const handleDistrictChange = async (e) => {
    const kecamatanId = e.value;
    const selectedDistrict = districts.find((dist) => dist.id === kecamatanId);
    if (selectedDistrict) {
      setAddress((prev) => ({
        ...prev,
        kecamatan: selectedDistrict.name,
        kecamatanId: kecamatanId,
      }));

      try {
        const villageData = await import(
          `../../address/villages/${kecamatanId}.json`
        );
        setVillages(villageData.default);
      } catch (error) {
        console.error("Error loading villages:", error);
        setVillages([]);
      }
    }
  };

  const handleVillageChange = (e) => {
    const desaId = e.value;
    const selectedVillage = villages.find((village) => village.id === desaId);
    if (selectedVillage) {
      setAddress((prev) => ({
        ...prev,
        desa: selectedVillage.name,
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

        {address.provinsiId && (
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
        )}

        {address.kabupatenId && (
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
        )}

        {address.kecamatanId && (
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
        )}

        {address.desaId && (
          <InputText
            type="text"
            value={address.detail || ""}
            placeholder="Detail Alamat"
            name="detail"
            onChange={handleInputChange}
            className="w-full p-3 text-slg "
            required
          />
        )}
      </div>
    </div>
  );
};

export default DynamicAddress;
