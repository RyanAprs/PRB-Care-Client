import { createContext, useEffect, useReducer } from "react";
import Cookies from "js-cookie";
import { ProgressSpinner } from "primereact/progressspinner";
export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      const { token, role } = action.payload;
      Cookies.set("token", token);
      Cookies.set("role", role);
      return { token, role, isLoading: false };
    case "LOGOUT":
      Cookies.remove("token");
      Cookies.remove("role");
      return { token: null, role: null, isLoading: false };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: null,
    role: null,
    isLoading: true,
  });

  useEffect(() => {
    const token = Cookies.get("token");
    const role = Cookies.get("role");

    if (token && role) {
      dispatch({ type: "LOGIN", payload: { token, role } });
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {state.isLoading ? 
      <div className="h-screen flex justify-center items-center">
        <ProgressSpinner />
      </div> : children}
    </AuthContext.Provider>
  );
};
