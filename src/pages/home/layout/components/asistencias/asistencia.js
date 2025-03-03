import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "./asistencia.css";
import { FloatLabel } from "primereact/floatlabel";

import { registrarAsistencia } from "../../../../../services/api";

const Asistencia = () => {
  const [matricula, setMatricula] = useState("");
  const toast = React.useRef(null);

  const handleRegistro = async (tipo) => {
    if (!matricula.trim()) {
      toast.current.show({
        severity: "warn",
        summary: "Error",
        detail: "Por favor ingresa tu matrícula.",
      });
      return;
    }

    try {
      const response = await registrarAsistencia(matricula, tipo);

      if (response.success) {
        toast.current.show({
          severity: "success",
          summary: "Registro Exitoso",
          detail: response.message,
        });
        setMatricula(""); // Limpiar campo
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail:
            response.errorMessage ||
            "Ocurrió un error al registrar la asistencia.",
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error de Conexión",
        detail: error.message || "No se pudo conectar con el servidor.",
      });
    }
  };

  const handleKeyDown = (e) => {
    const isNumberKey = e.key >= "0" && e.key <= "9";
    const isControlKey = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ].includes(e.key);

    // Permitir solo números y teclas de control
    if (!isNumberKey && !isControlKey) {
      e.preventDefault();
    }
  };

  return (
    <div className="asistencia-container">
      <Toast ref={toast} className="asistencia-toast" />
      <Card title="Registro de Asistencia" className="asistencia-card">
        <div className="asistencia-input-container">
          <FloatLabel>
            <InputText
              id="matricula"
              value={matricula}
              onChange={(e) => setMatricula(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="eg. 215951"
            />
            <label htmlFor="matricula">Matrícula</label>
          </FloatLabel>
        </div>
        <div className="asistencia-buttons">
          <Button
            label="Registrar Entrada"
            className="p-button-success"
            onClick={() => handleRegistro("entrada")}
          />
          <Button
            label="Registrar Salida"
            className="p-button-danger"
            onClick={() => handleRegistro("salida")}
          />
        </div>
      </Card>
    </div>
  );
};

export default Asistencia;
