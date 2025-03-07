import React, { useState } from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Card } from "primereact/card";
import { TabMenu } from "primereact/tabmenu";

import HistorialPrestamos from "./components/prestamos/historialPrestamos";
import DevolucionesPendientes from "./components/devoluciones/devolucionesPendientes";
import UsuariosCrud from "./components/usuarios/usuariosCrud";
import ProyectosCrud from "./components/proyectos/proyectosCrud";

import "./admin.css";

const Admin = () => {
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || "Invitado";
  // Estado para manejar el tab activo
  const [activeIndex, setActiveIndex] = useState(1);

  const items = [
    {
      label: "Historial Prestamos",
      icon: "pi pi-box",
    },
    {
      label: "Devoluciones Pendientes",
      icon: "pi pi-refresh",
    },
    {
      label: "Proyectos",
      icon: "pi pi-briefcase",
    },
    {
      label: "Usuarios",
      icon: "pi pi-users",
    },
  ];

  // Determinar qué componente mostrar basado en el tab seleccionado
  const renderContent = () => {
    switch (activeIndex) {
      case 0:
        return <HistorialPrestamos />;
      case 1:
        return <DevolucionesPendientes />;
      case 2:
        return <ProyectosCrud />;
      case 3:
        return <UsuariosCrud />;
      default:
        return <DevolucionesPendientes />;
    }
  };

  return (
    <div className="admin-container">
      <SignedOut>
        <div className="signin">
          <Card title="Porfavor iniciar Sesion para acceder">
            <SignInButton />
          </Card>
        </div>
      </SignedOut>
      <SignedIn>
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h1>Bienvenido {userEmail}</h1>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "50px",
                      height: "50px", // Ajusta el tamaño del avatar
                    },
                  },
                }}
              />
            </div>
          </Card>
          <Card>
            {" "}
            <TabMenu
              model={items}
              activeIndex={activeIndex}
              onTabChange={(e) => setActiveIndex(e.index)} // Cambia el estado del tab
            />
            {/* Contenido dinámico */}
            <div style={{ marginTop: "1rem" }}>{renderContent()}</div>
          </Card>
        </div>
      </SignedIn>
    </div>
  );
};
export default Admin;
