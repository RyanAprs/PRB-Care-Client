import {createContext, useEffect, useReducer} from "react";
import Cookies from "js-cookie";
import {ProgressSpinner} from "primereact/progressspinner";
import {jwtDecode} from "jwt-decode";

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            const {token} = action.payload;
            const decodedToken = jwtDecode(token);
            let role = decodedToken.role;

            if (role === 'super') {
                role = 'admin';
            } else if (role === 'puskesmas') {
                role = 'nakes';
            } else if (role === 'apotek') {
                role = 'apoteker';
            }

            Cookies.set("token", token);

            return {token, role, isLoading: false};
        case "LOGOUT":
            Cookies.remove("token");
            return {token: null, role: null, isLoading: false};
        default:
            return state;
    }
};

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        token: null,
        role: null,
        isLoading: true,
    });

    useEffect(() => {
        const token = Cookies.get("token");

        if (token) {
            const decodedToken = jwtDecode(token);
            let role = decodedToken.role;

            if (role === 'super') {
                role = 'admin';
            } else if (role === 'puskesmas') {
                role = 'nakes';
            } else if (role === 'apotek') {
                role = 'apoteker';
            }

            dispatch({type: "LOGIN", payload: {token, role}});
        } else {
            dispatch({type: "LOGOUT"});
        }
    }, []);

    return (
        <AuthContext.Provider value={{...state, dispatch}}>
            {state.isLoading ?
                <div className="h-screen flex justify-center items-center">
                    <ProgressSpinner/>
                </div> : children}
        </AuthContext.Provider>
    );
};
