// src/App.js
import React from "react";
import AppRoutes from "./routes";

// Importar los estilos de PrimeReact y PrimeIcons
import "primereact/resources/themes/lara-light-pink/theme.css"; // Tema de PrimeReact
import "primereact/resources/primereact.min.css"; // Estilos principales de PrimeReact
import "primeicons/primeicons.css"; // Íconos de PrimeReact (opcional, si usas iconos)

const App = () => {
  return (
    <div>
      <AppRoutes />
    </div>
  );
};

export default App;
