import { useState, useEffect, useContext, useRef } from "react";
import { AddressContext } from "../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";

const ADDRESS_URI = import.meta.env.VITE_ADDRESS_API_URI;

const DynamicAddress = ({ reset, prevAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [currentWidth, setCurrentWidth] = useState();
  const ref = useRef();
  const { address, setAddress } = useContext(AddressContext);

  const [optLoading, setOptLoading] = useState(false);

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

  const fetchWithRetry = async (url) => {
    let retries = true;
    let result = null;
    while (retries) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        result = data;
        retries = false;
      } catch (error) {
        console.error("Error fetching data, retrying...", error);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }
    return result;
  };

  useEffect(() => {
    const fetchProvinces = async () => {
        setOptLoading(true);
        const data = await fetchWithRetry(`${ADDRESS_URI}/provinces.json`);
        setProvinces(data);
        setOptLoading(false);
    };
    fetchProvinces();
  }, []);

  const fetchRegencies = async (provinsiId) => {
      setOptLoading(true);
      const data = await fetchWithRetry(`${ADDRESS_URI}/regencies/${provinsiId}.json`);
      setRegencies(data);
      setOptLoading(false);
  };

  const fetchDistricts = async (kabupatenId) => {
      setOptLoading(true);
      const data = await fetchWithRetry(`${ADDRESS_URI}/districts/${kabupatenId}.json`);
      setDistricts(data);
      setOptLoading(false);
  };

  const fetchVillages = async (kecamatanId) => {
    setOptLoading(true);
    const data = await fetchWithRetry(`${ADDRESS_URI}/villages/${kecamatanId}.json`);
    setVillages(data);
    setOptLoading(false);
  };

  const handleProvinceChange = (e) => {
    const provinsiId = e.value;
    const province = provinces.find((prov) => prov.id === provinsiId);
    if (province) {
      setAddress((prev) => ({
        ...prev,
        provinsi: province.name,
        provinsiId,
        kabupaten: "",
        kabupatenId: null,
        kecamatan: "",
        kecamatanId: null,
        desa: "",
        desaId: null,
        detail: "",
      }));
      fetchRegencies(provinsiId);
    }
  };

  const handleRegencyChange = (e) => {
    const kabupatenId = e.value;
    const regency = regencies.find((reg) => reg.id === kabupatenId);
    if (regency) {
      setAddress((prev) => ({
        ...prev,
        kabupaten: regency.name,
        kabupatenId,
        kecamatan: "",
        kecamatanId: null,
        desa: "",
        desaId: null,
        detail: "",
      }));
      fetchDistricts(kabupatenId); 
    }
  };

  const handleDistrictChange = (e) => {
    const kecamatanId = e.value;
    const district = districts.find((dist) => dist.id === kecamatanId);
    if (district) {
      setAddress((prev) => ({
        ...prev,
        kecamatan: district.name,
        kecamatanId,
        desa: "",
        desaId: null,
        detail: "",
      }));
      fetchVillages(kecamatanId); 
    }
  };

  const handleVillageChange = (e) => {
    const desaId = e.value;
    const village = villages.find((village) => village.id === desaId);
    if (village) {
      setAddress((prev) => ({
        ...prev,
        desa: village.name,
        desaId,
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

  useEffect(() => {
    const element = ref.current.getElement();
    setCurrentWidth(element.clientWidth);
  }, [ref]);
  return (
    <div className="flex flex-col gap-2 items-center justify-center">
      <div className="h-auto w-full flex flex-col gap-4 items-center justify-center">
        <Dropdown
          value={address.provinsiId || ""}
          options={provinces.map((prov) => ({
            label: prov.name,
            value: prov.id,
          }))}
          onChange={handleProvinceChange}
          loading = {optLoading}
          placeholder={optLoading ? "Memuat Data..." : "Pilih Provinsi"}
          filter
          className="w-full p-2 text-sm"
          required
          ref={ref}
          pt={{
            panel: {
              style: {
                ...(currentWidth ? { width: currentWidth } : {}),
              },
            },
          }}
        />
        {address.provinsiId && (
          <Dropdown
            value={address.kabupatenId || ""}
            options={regencies.map((reg) => ({
              label: reg.name,
              value: reg.id,
            }))}
            onChange={handleRegencyChange}
            loading = {optLoading}
            placeholder={optLoading ? "Memuat Data..." : "Pilih Kabupaten"}
            filter
            className="w-full p-2 text-sm "
            required
            ref={ref}
            pt={{
              panel: {
                style: {
                  ...(currentWidth ? { width: currentWidth } : {}),
                },
              },
            }}
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
            loading = {optLoading}
            placeholder={optLoading ? "Memuat Data..." : "Pilih Kecamatan"}
            filter
            className="w-full p-2 text-sm"
            required
            ref={ref}
            pt={{
              panel: {
                style: {
                  ...(currentWidth ? { width: currentWidth } : {}),
                },
              },
            }}
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
            loading = {optLoading}
            placeholder={optLoading ? "Memuat Data..." : "Pilih Desa/Kelurahan"}
            filter
            className="w-full p-2 text-sm "
            required
            ref={ref}
            pt={{
              panel: {
                style: {
                  ...(currentWidth ? { width: currentWidth } : {}),
                },
              },
            }}
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