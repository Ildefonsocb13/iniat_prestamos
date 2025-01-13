import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel"; // Asegúrate de que el estilo para FloatLabel esté bien configurado
import { Toast } from "primereact/toast"; // Importar Toast
import "./prestamo.css";

import { crearPrestamo } from "../../../../../services/api";

const Prestamo = () => {
  const [matricula, setMatricula] = useState("");
  const [objeto, setObjeto] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState(null);
  const toast = React.useRef(null); // Referencia para mostrar el Toast

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ("0" + (d.getMonth() + 1)).slice(-2); // Mes de dos dígitos
    const day = ("0" + d.getDate()).slice(-2); // Día de dos dígitos
    const hours = ("0" + d.getHours()).slice(-2); // Hora de dos dígitos
    const minutes = ("0" + d.getMinutes()).slice(-2); // Minutos de dos dígitos
    const seconds = ("0" + d.getSeconds()).slice(-2); // Segundos de dos dígitos
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar si todos los campos están completos
    if (!matricula || !objeto || !fechaDevolucion) {
      toast.current.show({
        severity: "error",
        summary: "Formulario incompleto",
        detail: "Por favor, complete todos los campos antes de enviar.",
        life: 3000,
      });
      return;
    }
    const fecha_max_devolucion = formatDate(fechaDevolucion);

    // Simulación de la llamada a la API con axios
    try {
      // Convierte la fecha antes de enviarla

      const API_RESPONSE = await crearPrestamo(
        matricula,
        objeto,
        fecha_max_devolucion
      );

      if (API_RESPONSE.success === true) {
        toast.current.show({
          severity: "success",
          summary: "Solicitud exitosa",
          detail: API_RESPONSE.message,
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error en la solicitud",
          detail: API_RESPONSE.message,
          life: 3000,
        });
      }

      // Limpiar formulario después de la solicitud
      setMatricula("");
      setObjeto("");
      setFechaDevolucion(null);
    } catch (error) {
      // Manejar errores de la petición (si la API no está disponible, por ejemplo)
      toast.current.show({
        severity: "error",
        summary: "Error en la conexión",
        detail:
          "No se pudo realizar la solicitud. Intente nuevamente más tarde.",
        life: 3000,
      });
    }
  };

  return (
    <div className="prestamo-container" style={{ padding: "2rem" }}>
      <Toast ref={toast} />
      <Card title="Solicitud de préstamo">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            {/* Matricula */}
            <FloatLabel>
              <InputText
                value={matricula}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setMatricula(value);
                  }
                }}
                placeholder="eg. 215951"
                autoFocus
              />
              <label>Matricula</label>
            </FloatLabel>

            {/* Objeto */}
            <FloatLabel>
              <InputText
                value={objeto}
                onChange={(e) => setObjeto(e.target.value)}
                placeholder="eg. Laptop, Proyector"
              />
              <label>Objeto</label>
            </FloatLabel>

            {/* Calendario de devolución */}
            <FloatLabel>
              <Calendar
                value={fechaDevolucion}
                onChange={(e) => setFechaDevolucion(e.value)}
                showIcon
                placeholder="Seleccionar fecha"
              />
              <label>Devolucion MM/DD/AAAA</label>
            </FloatLabel>

            {/* Botón Solicitar */}
            <Button
              label="Solicitar"
              icon="pi pi-check"
              style={{ marginTop: "1rem" }}
              type="submit"
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Prestamo;
