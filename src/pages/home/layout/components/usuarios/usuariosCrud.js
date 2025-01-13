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

import {
  getUsuarios,
  saveUsuario,
  deleteUsuario,
  getAsistenciasPorMatricula,
  getTiempoAsistido,
} from "../../../../../services/api"; // Importamos las funciones de la API

import "./usuariosCrud.css";

const UsuariosCrud = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false); // Controla la visibilidad del diálogo
  const [usuario, setUsuario] = useState({
    id: null,
    nombre: "",
    apellido: "",
    matricula: "",
    tipo: "alumno", // Tipo por defecto
  });

  //Variables para el detallado por usuario
  const [expandedRows, setExpandedRows] = useState(null);
  const [asistencias, setAsistencias] = useState([]);
  const [tiempoAsistido, setTiempoAsistido] = useState({ dias: 0, horas: 0 });

  const toast = useRef(null);

  const tiposPerfil = [
    { label: "Alumno", value: "alumno" },
    { label: "Admin", value: "admin" },
  ];

  const fetchUsuariosData = async () => {
    setLoading(true);
    try {
      const response = await getUsuarios(); // Llamamos a la API
      if (response.success && Array.isArray(response.data)) {
        setUsuarios(response.data); // Ahora accedemos a `data` que contiene los usuarios
      } else {
        console.error("No se recibieron usuarios válidos", response);
      }
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuariosData();
  }, []);

  const onGlobalFilterChange = (e) => {
    setGlobalFilter(e.target.value);
  };

  const deleteUser = (usuario) => {
    confirmDialog({
      header: "Confirmar Eliminación",
      message: `¿Estás seguro de eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`,
      accept: () => handleDelete(usuario),
      reject: () =>
        toast.current.show({
          severity: "info",
          summary: "Cancelado",
          detail: "Eliminación cancelada",
          life: 3000,
        }),
    });
  };

  const handleDelete = async (usuario) => {
    try {
      await deleteUsuario(usuario.id); // Usamos la API para eliminar
      toast.current.show({
        severity: "success",
        summary: "Eliminado",
        detail: "Usuario eliminado exitosamente.",
        life: 3000,
      });
      setUsuarios(usuarios.filter((u) => u.id !== usuario.id)); // Eliminamos el usuario de la lista local
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el usuario.",
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
          onClick={() => editUser(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => deleteUser(rowData)}
        />
      </div>
    );
  };

  const editUser = (usuario) => {
    setUsuario(usuario);
    setDialogVisible(true); // Si hay ID, es edición
  };

  const addUser = () => {
    setUsuario({
      id: null,
      nombre: "",
      apellido: "",
      matricula: "",
      tipo: "alumno",
    });
    setDialogVisible(true); // Si no hay ID, es creación
  };

  const handleDialogSubmit = async () => {
    try {
      let response;
      response = await saveUsuario(usuario); // Usamos la API para crear

      if (response && response.success) {
        toast.current.show({
          severity: "success",
          summary: "Guardado",
          detail: "Usuario guardado exitosamente.",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: response.message || "No se pudo guardar el usuario.",
          life: 3000,
        });
      }

      fetchUsuariosData(); // Recargar la lista de usuarios
      setDialogVisible(false); // Cerrar el diálogo
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el usuario.",
        life: 3000,
      });
      console.error("Error al guardar el usuario:", error);
    }
  };

  // Plantilla para la expansión de filas
  // Mostrara dias asistidos asi como horas totales
  // Un DataTable con la lista de asistencias para ese usuario.
  const rowExpansionTemplate = (data) => {
    return (
      <div className="p-3">
        <h5>
          Detalles de {data.nombre} {data.apellido}
        </h5>
        <p>
          <strong>ID:</strong> {data.id}
        </p>
        <p>
          <strong>Matrícula:</strong> {data.matricula}
        </p>
        <p>
          <strong>Tipo:</strong> {data.tipo}
        </p>
      </div>
    );
  };

  // Funciones para obtener el tiempo asistido y las asistencias de un usuario
  const fetchTiempoAsistido = async (matricula) => {
    try {
      const response = await getTiempoAsistido(matricula);
      if (response.success && response.data) {
        setTiempoAsistido({
          dias: response.data.diasAsistidos || 0,
          horas: response.data.horasAsistidas || 0,
        });
      } else {
        console.error(
          "No se recibieron datos válidos de tiempo asistido",
          response
        );
      }
    } catch (error) {
      console.error("Error al obtener el tiempo asistido:", error);
    }
  };

  // Lista de asistencias por matrícula
  const fetchAsistencias = async (matricula) => {
    try {
      const response = await getAsistenciasPorMatricula(matricula);
      if (response.success && Array.isArray(response.data)) {
        setAsistencias(response.data);
      } else {
        console.error("No se recibieron asistencias válidas", response);
        setAsistencias([]);
      }
    } catch (error) {
      console.error("Error al obtener las asistencias:", error);
      setAsistencias([]);
    }
  };

  return (
    <div className="usuarios-crud-container">
      <Toast ref={toast} />
      <ConfirmDialog />
      <Card>
        <div className="header">
          <Button
            label="Agregar Usuario"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={addUser}
          />
          <InputText
            value={globalFilter}
            onChange={onGlobalFilterChange}
            placeholder="Buscar en tabla"
          />
        </div>
        <DataTable
          value={usuarios}
          loading={loading}
          paginator
          rows={10}
          removableSort
          globalFilter={globalFilter}
          emptyMessage="No hay usuarios registrados."
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={rowExpansionTemplate}
          dataKey="id"
        >
          <Column expander style={{ width: "3rem" }} />
          <Column field="id" header="ID" sortable />
          <Column field="nombre" header="Nombre" sortable />
          <Column field="apellido" header="Apellido" sortable />
          <Column field="matricula" header="Matrícula" sortable />
          <Column field="tipo" header="Tipo" sortable />
          <Column body={actionBodyTemplate} header="Acciones" />
        </DataTable>
      </Card>

      {/* Dialog de creación y edición de usuario */}
      <Dialog
        header={usuario.id ? "Editar Usuario" : "Agregar Usuario"}
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
      >
        <div
          className="p-fluid"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            paddingTop: "1.5rem",
          }}
        >
          <FloatLabel>
            <label htmlFor="nombre">Nombre</label>
            <InputText
              id="nombre"
              value={usuario.nombre}
              onChange={(e) =>
                setUsuario({ ...usuario, nombre: e.target.value })
              }
              required
              placeholder="eg. Ildefonso"
            />
          </FloatLabel>
          <FloatLabel>
            <label htmlFor="apellido">Apellido</label>
            <InputText
              id="apellido"
              value={usuario.apellido}
              onChange={(e) =>
                setUsuario({ ...usuario, apellido: e.target.value })
              }
              required
              placeholder="eg. Castro Bouquet"
            />
          </FloatLabel>
          <FloatLabel>
            <label htmlFor="matricula">Matrícula</label>
            <InputText
              id="matricula"
              value={usuario.matricula}
              onChange={(e) =>
                setUsuario({ ...usuario, matricula: e.target.value })
              }
              required
              placeholder="eg. 215951"
            />
          </FloatLabel>
          <FloatLabel>
            <label htmlFor="tipo">Tipo de Perfil</label>
            <Dropdown
              id="tipo"
              value={usuario.tipo} // Aseguramos que tipo tenga un valor definido
              options={tiposPerfil}
              onChange={(e) => setUsuario({ ...usuario, tipo: e.value })}
              placeholder="Seleccione un tipo"
              required
            />
          </FloatLabel>
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

export default UsuariosCrud;
