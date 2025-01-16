import React, { useEffect, useRef, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";

import {
  getProyectos,
  saveProyecto,
  deleteProyecto,
  getProfesores,
} from "../../../../../services/api"; // Importamos las funciones de la API

import "./proyectosCrud.css";

const ProyectosCrud = () => {
  const [proyectos, setProyectos] = useState([]); // Lista de proyectos
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false); // Estado del dialogo de creación y edición
  const [profesores, setProfesores] = useState([]); // Lista de profesores

  const [proyecto, setProyecto] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    id_profesor: null, // El ID del profesor se pasa como un string por defecto
  });

  const toast = useRef(null);

  const fetchProyectosData = async () => {
    setLoading(true);
    try {
      const response = await getProyectos(); // Llamamos a la API
      if (response.success && Array.isArray(response.data)) {
        setProyectos(response.data); // Ahora accedemos a `data` que contiene los proyectos
      } else {
        console.error("No se recibieron proyectos válidos", response);
      }
    } catch (error) {
      console.error("Error al obtener los proyectos:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfesoresData = async () => {
    try {
      const response = await getProfesores();
      if (response.success && Array.isArray(response.data)) {
        setProfesores(
          response.data.map((profesor) => ({
            label: profesor.nombre,
            value: profesor.id,
          }))
        );
      } else {
        console.error("No se recibieron profesores válidos", response);
      }
    } catch (error) {
      console.error("Error al obtener los profesores:", error);
    }
  };

  useEffect(() => {
    fetchProyectosData();
    fetchProfesoresData();
  }, []);

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const deleteProyecto = (proyecto) => {
    confirmDialog({
      header: "Confirmar Eliminación",
      message: `¿Estás seguro de eliminar el proyecto ${proyecto.nombre}?`,
      accept: () => handleDelete(proyecto),
      reject: () =>
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "Eliminación cancelada",
          life: 3000,
        }),
    });
  };

  const handleDelete = async (proyecto) => {
    try {
      await deleteProyecto(proyecto.id); // Usamos la API para eliminar
      toast.current.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Proyecto eliminado exitosamente.",
        life: 3000,
      });
      setProyectos(proyectos.filter((p) => p.id !== proyecto.id)); // Eliminamos el proyecto de la lista local
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el proyecto.",
        life: 3000,
      });
    }
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="acciones-buttons">
        <Button
          icon="pi pi-pencil"
          className="p-button-warning"
          onClick={() => editProyecto(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => deleteProyecto(rowData)}
        />
      </div>
    );
  };

  const editProyecto = (proyecto) => {
    setProyecto(proyecto);
    setDialogVisible(true); // Si hay ID, es edición
  };

  const addProyecto = () => {
    setProyecto({
      id: null,
      nombre: "",
      descripcion: "",
      id_profesor: "", // El ID del profesor puede ser seleccionado por el usuario
    });
    setDialogVisible(true); // Si no hay ID, es creación
  };

  const handleDialogSubmit = async () => {
    try {
      let response;
      response = await saveProyecto(proyecto); // Usamos la API para crear o actualizar el proyecto

      if (response && response.success) {
        toast.current.show({
          severity: "success",
          summary: "Guardado",
          detail: "Proyecto guardado exitosamente.",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "No se pudo guardar el proyecto.",
          life: 3000,
        });
      }

      fetchProyectosData(); // Recargar la lista de proyectos
      setDialogVisible(false); // Cerrar el diálogo
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el proyecto.",
        life: 3000,
      });
      console.error("Error al guardar el proyecto:", error);
    }
  };

  return (
    <div className="proyectos-crud-container">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Card>
        <div className="header">
          <Button
            label="Agregar Proyecto"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={addProyecto}
          />
          <InputText
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Buscar en tabla"
          />
        </div>
        <DataTable
          value={proyectos}
          loading={loading}
          paginator
          rows={10}
          removableSort
          globalFilter={globalFilter}
          emptyMessage="No hay proyectos registrados."
          dataKey="id"
        >
          <Column
            field="nombre"
            header="Nombre"
            sortable
            style={{ width: "20%" }}
          />
          <Column field="descripcion" header="Descripción" sortable />
          <Column
            field="profesor_nombre"
            header="Profesor"
            sortable
            style={{ width: "15%" }}
          />
          <Column
            body={actionBodyTemplate}
            header="Acciones"
            style={{ width: "15%" }}
          />
        </DataTable>
      </Card>

      {/* Dialog de creación y edición de proyecto */}
      <Dialog
        header={proyecto.id ? "Editar Proyecto" : "Agregar Proyecto"}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        style={{ width: "60vw", height: "auto" }} // Ancho del 60% de la ventana y altura automática
      >
        <div
          className="p-fluid"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            paddingTop: "2rem",
          }}
        >
          {/* Div contenedor de Nombre y Profesor */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <FloatLabel style={{ flex: "1" }}>
              <label htmlFor="nombre">Nombre</label>
              <InputText
                id="nombre"
                value={proyecto.nombre}
                onChange={(e) =>
                  setProyecto({ ...proyecto, nombre: e.target.value })
                }
                required
                placeholder="eg. Proyecto de Investigación"
              />
            </FloatLabel>
            <FloatLabel style={{ flex: "1" }}>
              <Dropdown
                id="id_profesor"
                value={proyecto.id_profesor}
                options={profesores}
                onChange={(e) =>
                  setProyecto({ ...proyecto, id_profesor: e.value })
                }
                placeholder="Seleccione un profesor"
                className="w-full"
              />
              <label htmlFor="id_profesor">Profesor</label>
            </FloatLabel>
          </div>

          {/* Campo de descripción más grande */}
          <FloatLabel>
            <label htmlFor="descripcion">Descripción</label>
            <InputTextarea
              id="descripcion"
              value={proyecto.descripcion}
              onChange={(e) =>
                setProyecto({ ...proyecto, descripcion: e.target.value })
              }
              rows={6} // Ajusta la altura del textarea
              cols={30}
              autoResize
              placeholder="Escribe una descripción detallada del proyecto..."
            />
          </FloatLabel>

          {/* Botón de guardar */}
          <Button
            label="Guardar"
            icon="pi pi-check"
            onClick={handleDialogSubmit}
            className="p-button-success"
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ProyectosCrud;
