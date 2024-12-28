import { useState, useEffect, useContext, useRef } from "react";
import { AddressContext } from "../../config/context/AdressContext";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import {
  RotateCcw
} from "lucide-react";
import { Button } from "primereact/button";

const ADDRESS_URI = import.meta.env.VITE_ADDRESS_API_URI;

const DynamicAddress = ({ reset, prevAddress }) => {
  const [provinces, setProvinces] = useState([]);
  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [currentWidth, setCurrentWidth] = useState();
  const ref = useRef();
  const { address, setAddress } = useContext(AddressContext);
  const [desaUnlocked, setDesaUnlocked] = useState(false);

  const [provLoading, setProvLoading] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [distLoading, setDistLoading] = useState(false);
  const [villLoading, setVillLoading] = useState(false);

  const [provErr, setProvErr] = useState(false);
  const [regErr, setRegErr] = useState(false);
  const [distErr, setDistErr] = useState(false);
  const [villErr, setVillErr] = useState(false);

  const [buttonLoading, setButtonLoading] = useState(false);

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

  const fetchWithResult = async (url,setErrState) => {
    setButtonLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setErrState(false);
      return result;
    } catch (error) {
      console.error("Error fetching data: ", error);
      setErrState(true);
      return [];
    }finally{
      setButtonLoading(false);
    }
  };

  const fetchProvinces = async () => {
      setProvErr(false);
      setProvLoading(true);
      const data = await fetchWithResult(`${ADDRESS_URI}/provinces.json`,setProvErr);
      setProvinces(data);
      setProvLoading(false);
  };

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchRegencies = async (provinsiId) => {
      setRegErr(false);
      setRegLoading(true);
      const data = await fetchWithResult(`${ADDRESS_URI}/regencies/${provinsiId}.json`,setRegErr);
      setRegencies(data);
      setRegLoading(false);
  };

  const fetchDistricts = async (kabupatenId) => {
      setDistErr(false);
      setDistLoading(true);
      const data = await fetchWithResult(`${ADDRESS_URI}/districts/${kabupatenId}.json`, setDistErr);
      setDistricts(data);
      setDistLoading(false);
  };

  const fetchVillages = async (kecamatanId) => {
    setVillErr(false);
    setVillLoading(true);
    const data = await fetchWithResult(`${ADDRESS_URI}/villages/${kecamatanId}.json` ,setVillErr);
    setVillages(data);
    setDesaUnlocked(true);
    setVillLoading(false);
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
        <div className="p-inputgroup">
            <Dropdown
              value={address.provinsiId || ""}
              options={provinces.map((prov) => ({
                label: prov.name,
                value: prov.id,
              }))}
              onChange={handleProvinceChange}
              loading = {provLoading}
              placeholder={provLoading 
                ? "Memuat Data..." 
                : provErr 
                    ? "Gagal Memuat Data" 
                    : "Pilih Kabupaten"}
              disabled = {provErr}
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
            <Button onClick={fetchProvinces} disabled={buttonLoading} icon={<RotateCcw/>} className={`${provErr?"":"hidden"} w-16 bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen`} />
        </div>
        
        
        
        {address.provinsiId && (
          <div className="p-inputgroup">
            <Dropdown
              value={address.kabupatenId || ""}
              options={regencies.map((reg) => ({
                label: reg.name,
                value: reg.id,
              }))}
              onChange={handleRegencyChange}
              loading = {regLoading}
              placeholder={regLoading 
                ? "Memuat Data..." 
                : regErr 
                    ? "Gagal Memuat Data" 
                    : "Pilih Kabupaten"}
              disabled = {regErr}
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
            <Button onClick={
              () => fetchRegencies(address.provinsiId)
            } disabled={buttonLoading}  icon={<RotateCcw/>} className={`${regErr?"":"hidden"} w-16 bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen`} />
        </div>
        )}
        {address.kabupatenId && (
          <div className="p-inputgroup">
            <Dropdown
              value={address.kecamatanId || ""}
              options={districts.map((dist) => ({
                label: dist.name,
                value: dist.id,
              }))}
              onChange={handleDistrictChange}
              loading = {distLoading}
              placeholder={distLoading 
                ? "Memuat Data..." 
                : distErr 
                    ? "Gagal Memuat Data" 
                    : "Pilih Kecamatan"}
              disabled = {distErr}
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
            <Button onClick={
              () => fetchDistricts(address.kabupatenId)
            } disabled={buttonLoading} icon={<RotateCcw/>} className={`${distErr?"":"hidden"} w-16 bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen`} />
        </div>
        )}
        {address.kecamatanId && (
          <div className="p-inputgroup">
            <Dropdown
              value={address.desaId || ""}
              options={villages.map((vill) => ({
                label: vill.name,
                value: vill.id,
              }))}
              onChange={handleVillageChange}
              loading = {villLoading}
              placeholder={villLoading 
                ? "Memuat Data..." 
                : villErr 
                    ? "Gagal Memuat Data" 
                    : "Pilih Desa"}
              disabled = {villErr}
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
            <Button onClick={
              () => fetchVillages(address.kecamatanId)
            } disabled={buttonLoading}  icon={<RotateCcw/>} className={`${villErr?"":"hidden"} w-16 bg-mainGreen text-white dark:bg-extraLightGreen dark:text-black hover:bg-mainDarkGreen dark:hover:bg-lightGreen`} />
        </div>
        )}
        {desaUnlocked && (
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