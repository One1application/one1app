import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthenticationProvider } from "./Context/AuthenticationContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename="/user">
      <AuthenticationProvider>
        <App />
      </AuthenticationProvider>
    </BrowserRouter>
  </StrictMode>
);
