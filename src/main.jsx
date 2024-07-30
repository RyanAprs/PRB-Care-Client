import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AddressProvider } from "./config/context/AdressContext.jsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <main className="font-poppins">
      <AddressProvider>
        <App />
      </AddressProvider>
    </main>
  </PrimeReactProvider>
);
