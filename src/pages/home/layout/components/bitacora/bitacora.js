import React, { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import {
  getProyectos,
  addBitacora,
  getBitacorasByMatricula,
} from "../../../../../services/api";
import "./bitacora.css";

const Bitacora = () => {
  //Add Bitacoras
  const [matricula, setMatricula] = useState("");
  const [proyecto, setProyecto] = useState(null);
  const [proyectos, setProyectos] = useState([]);
  const [profesor, setProfesor] = useState("");
  const [actividades, setActividades] = useState("");

  //GetBitacoras
  const [matriculaBusqueda, setMatriculaBusqueda] = useState("");
  const [bitacoras, setBitacoras] = useState([]);
  const toast = React.useRef(null);

  useEffect(() => {
    const fetchProyectos = async () => {
      try {
        const response = await getProyectos();
        if (response.success) {
          setProyectos(response.data);
        } else {
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudieron cargar los proyectos",
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Error al cargar los proyectos",
        });
      }
    };

    fetchProyectos();
  }, []);

  const handleKeyDown = (e) => {
    const isNumberKey = e.key >= "0" && e.key <= "9";
    const isControlKey = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "Delete",
    ].includes(e.key);

    if (!isNumberKey && !isControlKey) {
      e.preventDefault();
    }
  };

  const handleProyectoChange = (e) => {
    setProyecto(e.value);
    setProfesor(e.value.profesor_nombre);
  };

  const validateForm = () => {
    return (
      matricula.trim() !== "" && proyecto !== null && actividades.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Todos los campos son obligatorios",
      });
      return;
    }

    const bitacoraData = {
      matricula: matricula.trim(), // Asegúrate de que la matrícula esté limpia
      id_proyecto: proyecto.id, // ID del proyecto seleccionado
      actividades: actividades.trim(), // Asegúrate de que las actividades estén limpias
    };

    try {
      // Llamar a la API para agregar la bitácora
      const response = await addBitacora(
        bitacoraData.matricula,
        bitacoraData.id_proyecto,
        bitacoraData.actividades
      );

      if (response.success) {
        // Mostrar mensaje de éxito
        toast.current.show({
          severity: "success",
          summary: "Éxito",
          detail: "Bitácora registrada correctamente",
        });

        // Limpiar el formulario después de un registro exitoso
        setMatricula("");
        setProyecto(null);
        setProfesor("");
        setActividades("");
      } else {
        // Mostrar mensaje de error si la API no tuvo éxito
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.errorMessage || "Error al registrar la bitácora",
        });
      }
    } catch (error) {
      // Manejar errores de conexión o de la API
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al conectar con el servidor",
      });
    }
  };

  const buscarBitacorasPorMatricula = async () => {
    if (!matriculaBusqueda.trim()) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "La matrícula no puede estar vacía",
      });
      return;
    }

    try {
      const response = await getBitacorasByMatricula(matriculaBusqueda.trim());
      if (response.success) {
        setBitacoras(response.data); // Actualizar el estado con los datos obtenidos
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.errorMessage || "No se encontraron bitácoras",
        });
        setBitacoras([]); // Limpiar la tabla si no hay resultados
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.message || "Error al conectar con el servidor",
      });
      setBitacoras([]); // Limpiar la tabla en caso de error
    }
  };

  return (
    <div className="bitacora-container">
      <Toast ref={toast} className="bitacora-toast" />
      <Card title="Registrar Bitacora" className="bitacora-card">
        {/* Formulario de registro de bitácora (existente) */}
        <div className="bitacora-input-container">
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

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <FloatLabel style={{ width: "70%" }}>
              <Dropdown
                id="proyecto"
                value={proyecto}
                onChange={handleProyectoChange}
                options={proyectos}
                optionLabel="nombre"
                placeholder="Selecciona un proyecto"
                style={{ width: "100%" }}
              />
              <label htmlFor="proyecto">Proyecto</label>
            </FloatLabel>
            <FloatLabel style={{ width: "25%" }}>
              <InputText
                id="profesor"
                value={profesor}
                disabled
                placeholder="Profesor asignado"
              />
              <label htmlFor="profesor">Profesor</label>
            </FloatLabel>
          </div>

          <FloatLabel>
            <InputTextarea
              id="actividades"
              value={actividades}
              onChange={(e) => setActividades(e.target.value)}
              rows={5}
              placeholder="Describe las actividades realizadas"
            />
            <label htmlFor="actividades">Actividades</label>
          </FloatLabel>
        </div>
        <div className="bitacora-buttons">
          <Button
            label="Registrar Bitacora"
            className="p-button-success"
            onClick={handleSubmit}
            disabled={!validateForm()}
          />
        </div>
      </Card>

      {/* Nueva Card para buscar bitácoras por matrícula */}
      <Card title="Buscar Bitácoras por Matrícula" className="bitacora-card">
        <div className="bitacora-input-container">
          <FloatLabel>
            <InputText
              id="matriculaBusqueda"
              value={matriculaBusqueda}
              onChange={(e) => setMatriculaBusqueda(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="eg. 215951"
            />
            <label htmlFor="matriculaBusqueda">Matrícula</label>
          </FloatLabel>
          <Button
            label="Buscar"
            className="p-button-danger"
            onClick={buscarBitacorasPorMatricula}
          />
        </div>

        {/* DataTable para mostrar los resultados */}
        <div className="bitacora-table">
          <DataTable
            value={bitacoras}
            paginator
            rows={5}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} bitácoras"
            emptyMessage="No se encontraron bitácoras"
          >
            <Column field="fecha" header="Fecha" sortable />
            <Column field="proyecto_nombre" header="Proyecto" sortable />
            <Column field="actividades" header="Actividades" sortable />
          </DataTable>
        </div>
      </Card>
    </div>
  );
};

export default Bitacora;
