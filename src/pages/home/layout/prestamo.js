import React, { useState } from "react";
import axios from "axios"; // Importar axios
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { FloatLabel } from "primereact/floatlabel"; // Asegúrate de que el estilo para FloatLabel esté bien configurado
import { Toast } from "primereact/toast"; // Importar Toast
import "./prestamo.css";

const Prestamo = () => {
  const [matricula, setMatricula] = useState("");
  const [objeto, setObjeto] = useState("");
  const [fechaDevolucion, setFechaDevolucion] = useState(null);
  const toast = React.useRef(null); // Referencia para mostrar el Toast

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

    // Simulación de la llamada a la API con axios
    try {
      // Aquí harías la llamada real a tu API
      const response = await axios.post("https://api.example.com/solicitar", {
        matricula,
        objeto,
        fechaDevolucion,
      });

      // Suponiendo que la respuesta tiene una propiedad `status` que indica éxito
      const API_RESPONSE = {
        status: "success", // Puedes probar con "error" también
        message: "Solicitud realizada con éxito",
      };

      if (API_RESPONSE.status === "success") {
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
          detail:
            "Hubo un problema al procesar la solicitud. Intente nuevamente.",
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
      <Card title="Formulario de Préstamo">
        <form onSubmit={handleSubmit}>
          <div className="p-fluid">
            {/* Matricula */}
            <FloatLabel>
              <InputText
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
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
