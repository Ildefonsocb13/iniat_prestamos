import React from "react";
import { TabMenu } from "primereact/tabmenu";
import "./NavBar.css";

const NavBar = ({ activeIndex, onTabChange }) => {
  const items = [
    {
      label: "Asistencias",
      icon: "pi pi-check",
    },
    {
      label: "Prestamos",
      icon: "pi pi-box",
    },
    {
      label: "Admin",
      icon: "pi pi-user",
    },
  ];

  return (
    <div className="Navbar">
      <img
        src="/images/logo.png"
        alt="Logo"
        style={{ height: "40px", marginRight: "1rem" }} // Ajusta el tamaño y el margen
      />
      <TabMenu
        model={items}
        activeIndex={activeIndex} // El índice activo es controlado por el componente padre
        onTabChange={(e) => onTabChange(e.index)} // Llama al callback cuando cambia el índice
      />
    </div>
  );
};

export default NavBar;
