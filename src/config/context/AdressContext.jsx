import React, { createContext, useState } from "react";

export const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [address, setAddress] = useState({
    provinsi: "",
    kabupaten: "",
    kecamatan: "",
    desa: "",
  });

  return (
    <AddressContext.Provider value={{ address, setAddress }}>
      {children}
    </AddressContext.Provider>
  );
};
