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
    fetch(`${ADDRESS_URI}/provinces.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setProvinces(data))
      .catch((error) => {
        console.error("Error fetching provinces:", error);
      });
  }, []);

  useEffect(() => {
    if (address.provinsiId) {
      fetch(`${ADDRESS_URI}/regencies/${address.provinsiId}.json`)
        .then((response) => response.json())
        .then((data) => setRegencies(data));
    }
  }, [address.provinsiId]);

  useEffect(() => {
    if (address.kabupatenId) {
      fetch(`${ADDRESS_URI}/districts/${address.kabupatenId}.json`)
        .then((response) => response.json())
        .then((data) => setDistricts(data));
    }
  }, [address.kabupatenId]);

  useEffect(() => {
    if (address.kecamatanId) {
      fetch(`${ADDRESS_URI}/villages/${address.kecamatanId}.json`)
        .then((response) => response.json())
        .then((data) => setVillages(data));
    }
  }, [address.kecamatanId]);

  const handleProvinceChange = (e) => {
    const provinsiId = e.value;
    const province = provinces.find((prov) => prov.id === provinsiId);
    if (province) {
      setAddress((prev) => ({
        ...prev,
        provinsi: province.name,
        provinsiId: provinsiId,
      }));
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
          placeholder="Pilih Provinsi"
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
            placeholder="Pilih Kabupaten"
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
            placeholder="Pilih Kecamatan"
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
            placeholder="Pilih Desa"
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
