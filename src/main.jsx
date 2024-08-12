import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AddressProvider } from "./config/context/AdressContext.jsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";
import { ModalUpdateProvider } from "./config/context/ModalUpdateContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider>
    <link id="theme-link" rel="stylesheet" href="" />
    <main className="font-poppins">
      <AddressProvider>
        <ModalUpdateProvider>
          <App />
        </ModalUpdateProvider>
      </AddressProvider>
    </main>
  </PrimeReactProvider>
);
