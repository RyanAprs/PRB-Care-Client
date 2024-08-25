import {createContext, useState, useContext} from "react";

const ModalUpdateContext = createContext();

export const ModalUpdateProvider = ({children}) => {
    const [isUpdated, setIsUpdated] = useState(false);

    return (
        <ModalUpdateContext.Provider value={{isUpdated, setIsUpdated}}>
            {children}
        </ModalUpdateContext.Provider>
    );
};

export const useModalUpdate = () => useContext(ModalUpdateContext);
