import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import Prestamos from "./layout/prestamos";
import Admin from "./layout/admin";
import Asistencia from "./layout/components/asistencias/asistencia";
import Bitacora from "./layout/components/bitacora/bitacora";

const Home = () => {
  const [activeIndex, setActiveIndex] = useState(0); // Estado para controlar el índice de la pestaña seleccionada
  // Función para actualizar el índice activo desde el NavBar
  const handleTabChange = (index) => {
    setActiveIndex(index);
  };

  // Renderizar el componente según el índice activo
  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <Asistencia />;
      case 1:
        return <Bitacora />;
      case 2:
        return <Prestamos />;
      case 3:
        return <Admin />;
      default:
        return <Asistencia />;
    }
  };

  return (
    <div style={{ height: "100%" }}>
      <NavBar activeIndex={activeIndex} onTabChange={handleTabChange} />
      <div style={{ paddingTop: "70px" }}>
        {renderContent()} {/* Renderiza el componente correspondiente */}
      </div>
    </div>
  );
};

export default Home;
