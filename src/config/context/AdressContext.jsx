import {createContext, useState} from "react";

export const AddressContext = createContext();

export const AddressProvider = ({children}) => {
    const [address, setAddress] = useState({
        provinsi: "",
        kabupaten: "",
        kecamatan: "",
        desa: "",
        detail: "",
    });

    return (
        <AddressContext.Provider value={{address, setAddress}}>
            {children}
        </AddressContext.Provider>
    );
};
