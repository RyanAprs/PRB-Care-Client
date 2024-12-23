import { useState, useEffect, useContext, useRef } from "react";
import { AddressContext } from "../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";

const ADDRESS_URI = import.meta.env.VITE_ADDRESS_API_URI;

const DynamicAddress = ({ reset, prevAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [currentWidth, setCurrentWidth] = useState();
  const [isConnectionError, setisConnectionError] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const fetchProvinces = async () => {
    setisConnectionError(false);
    try {
      setLoading(true);
      const response = await fetch(`${ADDRESS_URI}/provinces.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProvinces(data);
      setLoading(false);
    } catch (error) {
      setisConnectionError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchRegencies = async () => {
    setisConnectionError(false);
    if (address.provinsiId) {
      try {
        setLoading(true);
        const response = await fetch(
          `${ADDRESS_URI}/regencies/${address.provinsiId}.json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRegencies(data);
        setLoading(false);
      } catch (error) {
        setisConnectionError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchRegencies();
  }, [address.provinsiId]);

  const fetchDistricts = async () => {
    setisConnectionError(false);
    if (address.kabupatenId) {
      try {
        setLoading(true);
        const response = await fetch(
          `${ADDRESS_URI}/districts/${address.kabupatenId}.json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDistricts(data);
        setLoading(false);
      } catch (error) {
        setisConnectionError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDistricts();
  }, [address.kabupatenId]);

  const fetchVillages = async () => {
    setisConnectionError(false);
    if (address.kecamatanId) {
      try {
        setLoading(true);
        const response = await fetch(
          `${ADDRESS_URI}/villages/${address.kecamatanId}.json`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVillages(data);
        setLoading(false);
      } catch (error) {
        setisConnectionError(true);
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchVillages();
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
      {isConnectionError ? (
        <Button
          label="Coba Lagi"
          icon="pi pi-refresh"
          className="bg-extraLightGreen"
          onClick={() => {
            setProvinces([]);
            fetchProvinces();
          }}
        />
      ) : (
        <div className="h-auto w-full flex flex-col gap-4 items-center justify-center">
          {loading ? (
            <ProgressSpinner
              style={{ width: "24px", height: "24px" }}
              strokeWidth="8"
              animationDuration="1s"
              color="white"
            />
          ) : (
            <>
              <Dropdown
                value={address.provinsiId || ""}
                options={provinces.map((prov) => ({
                  label: prov.name,
                  value: prov.id,
                }))}
                disabled={isConnectionError || loading}
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
                  disabled={isConnectionError || loading}
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
                  disabled={isConnectionError || loading}
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
                  disabled={isConnectionError || loading}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DynamicAddress;
