import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AddressProvider } from "./config/context/AdressContext.jsx";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/saga-green/theme.css";
import "primereact/resources/primereact.min.css";
import { ModalUpdateProvider } from "./config/context/ModalUpdateContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <PrimeReactProvider value={{  
    ripple: true, 
    pt: {
      button: {
        root: { className: 'outline-none border-0 focus:border-0 focus:outline-none focus:ring-0 box-shadow-none', },
      },
      }
    }

    }>
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
